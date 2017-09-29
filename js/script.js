// Botones paso 1
const $agregarOtro = $('#agregarOtro');
const $siguiente = $('#siguiente');

// Span chances
const $chances = $('#chances');

// Campos formulario
const $form = $('form');
const $producto = $('#producto');
const $codigo = $('#codigo');
const $cantidad = $('#cantidad');
const $lugar = $('#lugar');
const $numero = $('#numero');
const $nombre = $('#nombre');
const $ci = $('#ci');
const $celular = $('#celular');
const $email = $('#email');

// Datos del formulario
var datos = {};

// Productos del sistema
const productos = [];

// Selección del productos del usuario (compras)
const seleccionados = [];

// Al hacer click en siguiente en el paso 1
function siguiente() {
  const nombre = $producto.val();
  const codigo = $codigo.val();
  const cantidad = $cantidad.val();
  agregar(); // Agregar la selección al arreglo seleccionados
  if (seleccionados.length) { // Si hubo seleccionados cambiar de paso
    $('a[href="#step2"]').tab('show');
  }
}

// Agregar producto al arreglo de productos seleciconados
function agregarSeleccionados(nombre, codigo, cantidad) {
  if ((nombre) && (codigo) && (cantidad)) {
    // Si los datos están => agregar al arreglo
    seleccionados.push({
      nombre: nombre,
      codigo: codigo,
      cantidad: cantidad,
      chances: calcularChancesProducto(codigo, cantidad),
    });

    // Vaciar los campos del formulario
    $producto.val('');
    $codigo.val('');
    $cantidad.val('');
    return true;
  } else {
    return false;
  }
}

// Eliminar del arreglo de productos seleccionados y sacar del DOM
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

function calcularChancesProducto(codigo, cantidad) {
  var chances = 0;
  if ((codigo) && (cantidad)) {
    datos.forEach(function (dato) {
      if (dato.codigo === codigo) {
        chances = dato.chances * cantidad;
        return;
      }
    });
  }

  return chances;
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
function validarFormulario() {
  return true;
}

function limpiarFormulario() {
  $lugar.val('');
  $numero.val('');
  $nombre.val('');
  $ci.val('');
  $celular.val('');
  $email.val('');
  $producto.val('');
  $codigo.val('');
  $cantidad.val('');
  productos.splice(0, productos.length);
}

function envioFormulario(e) {
  e.preventDefault();
  const nombre = $producto.val();
  const codigo = $codigo.val();
  const cantidad = $cantidad.val();

  agregarSeleccionados(nombre, codigo, cantidad);

  if ((seleccionados.length) && (validarFormulario())) {
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
        if (res.exito) {
          limpiarFormulario();
          mensajeExito();
        } else {
          console.error(res.error);
        }
      },

      error: function (error) {
        console.error(error);
      },
    });
  }
}

$(window).on('load', function () {
  $.ajax({
    type: 'post',
    url: 'php/logica.php',
    dataType: 'json',
    data: {
      accion: 'listadoProductos',
    },
    success: function (data) {
      if (data.exito) {
        datos = data.listado;
        filtrarRepetidos();
        mostrarProductos();
      } else {
        console.error(data.error);
      }
    },

    error: function (error) {
      console.error(error);
    },
  });

  $form.on('submit', function (event) {
    envioFormulario(event);
  });

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
});
