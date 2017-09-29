const $agregarOtro = $('#agregarOtro');
const $siguiente = $('#siguiente');
const $producto = $('#producto');
const $codigo = $('#codigo');
const $cantidad = $('#cantidad');
const $chances = $('#chances');

var datos = {};
const productos = [];

function siguiente() {
  $('a[href="#step2"]').tab('show');
}

function agregar() {
  $('.agregados').append($('<hr>')).append($('#compra').clone());
}

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

$(window).on('load', function () {
  $.ajax({
    type: 'post',
    url: '/php/logica.php',
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
