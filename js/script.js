const $agregarOtro = $('#agregarOtro');
const $siguiente = $('#siguiente');
const $producto = $('#producto');
const $codigo = $('#codigo');
const $cantidad = $('#cantidad');
const $chances = $('#chances');
const $form = $('form');

var datos = {};
const productos = [];
const seleccionados = [];

function siguiente() {
  const nombre = $producto.val();
  const codigo = $codigo.val();
  const cantidad = $cantidad.val();
  agregar();
  if (seleccionados.length) {
    $('a[href="#step2"]').tab('show');
  }
}

function agregarSeleccionados(nombre, codigo, cantidad) {
  if ((nombre) && (codigo) && (cantidad)) {
    seleccionados.push({
      nombre: nombre,
      codigo: codigo,
      cantidad: cantidad,
    });
    $producto.val('');
    $codigo.val('');
    $cantidad.val('');
    return true;
  } else {
    return false;
  }
}

function borrarSleccionado(e) {
  const $seleccion = $(e.target.parentElement);
  const codigo = $seleccion.find('.producto-codigo').html();
  const cantidad = $seleccion.find('.producto-cantidad').html();
  seleccionados.forEach(function (seleccionado, index) {
    if ((seleccionado.codigo === codigo) && (seleccionado.cantidad === cantidad)) {
      seleccionados.splice(index, 1);
      return;
    }
  });

  $seleccion.remove();
  calcularChances();
}

function agregar() {
  const nombre = $producto.val();
  const codigo = $codigo.val();
  const cantidad = $cantidad.val();
  if (agregarSeleccionados(nombre, codigo, cantidad)) {
    $('.agregados').append(
      $('<div>', { class: 'seleccion' }).append(
        $('<hr>'),
        $('<span>', { class: 'close', text: 'X', onclick: 'borrarSleccionado(event)' })
      ).append(
        $('<div>', { class: 'form-group' }).append(
          $('<label>', { class: 'col-xs-12', text: 'Producto comprado' }),
          $('<div>', { class: 'col-xs-12' }).append(
            $('<span>', { class: 'producto-nombre', text: nombre })
          )
        ),
        $('<div>', { class: 'form-group' }).append(
          $('<label>', { class: 'col-xs-6', text: 'Código producto' }),
          $('<label>', { class: 'col-xs-6', text: 'Cantidad comprada' }),
        ),
        $('<div>', { class: 'form-group' }).append(
          $('<div>', { class: 'col-xs-6' }).append(
            $('<span>', { class: 'producto-codigo', text: codigo })
          ),
          $('<div>', { class: 'col-xs-6' }).append(
            $('<span>', { class: 'producto-cantidad', text: cantidad })
          )
        )
      )
    );
  }
}

// TODO: REFACTOR
function calcularChances() {
  const nombre = $producto.val();
  const codigo = $codigo.val();
  const cantidad = $cantidad.val();
  var chances = 0;
  if ((nombre) && (codigo) && (cantidad)) {
    datos.forEach(function (dato) {
      if (dato.codigo === codigo) {
        chances = dato.chances * cantidad;
        return;
      }
    });
  }

  $chances.html(chances);
}

function filtrarRepetidos() {
  datos.forEach(function (dato) {
    if (productos.indexOf(dato.nombre) === -1) {
      productos.push(dato.nombre);
    }
  });
}

function mostrarProductos() {
  productos.forEach(function (producto) {
    $producto.append(
      $('<option value="' + producto + '">' + producto + '</option>')
    );
  });
}

function mostrarCodigos(e) {
  const nombre = e.target.value;
  $codigo.html('<option disabled hidden selected value></option>');
  $cantidad.val('');
  datos.forEach(function (dato) {
    if (dato.nombre === nombre) {
      $codigo.append(
        $('<option value="' + dato.codigo + '">' + dato.codigo + '</option>')
      );
    }
  });
}

// TODO: ESCRIBIR FUNCIÓN
function validarForm() {
  return true;
}

function submit(e) {
  e.preventDefault();
  const nombre = $producto.val();
  const codigo = $codigo.val();
  const cantidad = $cantidad.val();

  agregarSeleccionados(nombre, codigo, cantidad);

  if ((seleccionados.length) && (validarForm())) {
    const datos = {
      lugar: $('#lugar').val(),
      numero: $('#numero').val(),
      nombre: $('#nombre').val(),
      ci: $('#ci').val(),
      celular: $('#celular').val(),
      email: $('#email').val(),
      productos: seleccionados,
    };
    $.ajax({
      type: 'post',
      url: 'php/logica.php',
      dataType: 'json',
      data: {
        accion: 'envioFormulario',
        form: datos,
      },
      success: function (res) {
        alert('exito');
        console.log(res);
      },

      error: function (error) {
        console.log(error);
      },
    });
  }
}

$agregarOtro.on('click', function () {
  agregar();
});

$siguiente.on('click', function () {
  siguiente();
});

$codigo.on('change input', function () {
  calcularChances();
});

$cantidad.on('change input', function () {
  calcularChances();
});

$producto.on('change input', function (event) {
  mostrarCodigos(event);
  calcularChances();
});

$form.on('submit', function (event) {
  submit(event);
});

$(window).on('load', function () {
  $.ajax({
    type: 'post',
    url: 'php/logica.php',
    dataType: 'json',
    data: {
      accion: 'listadoProductos',
    },
    success: function (data) {
      datos = data;
      filtrarRepetidos();
      mostrarProductos();
    },

    error: function (error) {
      console.log(error);
    },
  });
});
