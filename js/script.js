// Expresión regular para chequear los emails
const regex = new RegExp([
  '^(([^<>()\\[\\]\\.,;:\\s@\\"]+(\\.[^<>()\\[\\]\\.,;:\\s@\\"]+)*)',
  '|(\\".+\\"))@(([^<>()[\\]\\.,;:\\s@\\"]+\\.)+[^<>()[\\]\\.,;:\\s@\\"]{2,})$',
].join(''));

// Botones paso 1
const $agregarOtro = $('#agregarOtro');
const $siguiente = $('#siguiente');

// Span chances
const $chances = $('#chances');

// Div para mensajes al usuario
const $mensaje = $('#mensaje');

// Campos formulario
const $form = $('form');
const $producto = $('#producto');
const $codigo = $('#codigo');
const $cantidad = $('#cantidad');
const $lugar = $('#lugar');
const $factura = $('#factura');
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

// Agregar producto al arreglo de productos seleccionados
function agregarSeleccionados(nombre, codigo, cantidad) {
  if ((nombre) && (codigo) && (cantidad) && (Number(cantidad))) {
    // Si los datos están => agregar al arreglo
    seleccionados.push({
      nombre: nombre,
      codigo: codigo,
      cantidad: cantidad,
      chances: calcularChancesSeleccion(codigo, cantidad),
    });

    // Vaciar los campos del formulario
    $producto.val('');
    $codigo.val('');
    $cantidad.val('');
    mostrarCodigos();
    return true;
  } else if (!seleccionados.length) {
    $cantidad.parent().addClass('has-error');
    $codigo.parent().addClass('has-error');
    $producto.parent().addClass('has-error');
    mensajeFracaso('<p>Ingrese al menos una compra correcta</p>');
    return false;
  } else {
    ocultarMensaje();
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

function borrarSeleccionados() {
  seleccionados.splice(0, seleccionados.length);
  $('.agregados').html('');
  calcularChances();
}

// Agregar un producto al DOM y a la lista de seleccionados
function agregar() {
  const nombre = $producto.val();
  const codigo = $codigo.val();
  const cantidad = $cantidad.val();
  if (agregarSeleccionados(nombre, codigo, cantidad)) {
    // $('.agregados').append(
    //   $('<div>', { class: 'seleccion' }).append(
    //     $('<hr>'),
    //     $('<span>', { class: 'close', text: 'X', onclick: 'borrarSleccionado(event)' })
    //   ).append(
    //     $('<div>', { class: 'form-group' }).append(
    //       $('<label>', { class: 'col-xs-12', text: 'Producto comprado' }),
    //       $('<div>', { class: 'col-xs-12' }).append(
    //         $('<span>', { class: 'producto-nombre', text: nombre })
    //       )
    //     ),
    //     $('<div>', { class: 'form-group' }).append(
    //       $('<label>', { class: 'col-xs-6', text: 'Código producto' }),
    //       $('<label>', { class: 'col-xs-6', text: 'Cantidad comprada' }),
    //     ),
    //     $('<div>', { class: 'form-group' }).append(
    //       $('<div>', { class: 'col-xs-6' }).append(
    //         $('<span>', { class: 'producto-codigo', text: codigo })
    //       ),
    //       $('<div>', { class: 'col-xs-6' }).append(
    //         $('<span>', { class: 'producto-cantidad', text: cantidad })
    //       )
    //     )
    //   )
    // );
    calcularChances();
  }
}

// Calcular las chances acumuladas por todos los productos seleccionados (compras)
function calcularChances() {
  var chances = 0;
  seleccionados.forEach(function (seleccionado) {
    chances += seleccionado.chances;
  });

  $chances.html(chances);
}

// Calcular las chances generadas por una selección (compra)
function calcularChancesSeleccion(codigo, cantidad) {
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

// Filtrar los nombres de productos repetidos y guardarlos en "productos"
function filtrarRepetidos() {
  datos.forEach(function (dato) {
    if (productos.indexOf(dato.nombre) === -1) {
      productos.push(dato.nombre);
    }
  });
}

// Desplegar las opciones para el input de "Producto comprado"
function mostrarProductos() {
  productos.forEach(function (producto) {
    $producto.append(
      $('<option value="' + producto + '">' + producto + '</option>')
    );
  });
}

// Desplegar las opciones de códigos para el producto seleccionado
function mostrarCodigos(e) {
  $codigo.html('<option disabled hidden selected value>Elige el código</option>');
  $cantidad.val('');
  if (e) {
    const nombre = e.target.value;
    datos.forEach(function (dato) {
      if (dato.nombre === nombre) {
        $codigo.append(
          $('<option value="' + dato.codigo + '">' + dato.codigo + '</option>')
        );
      }
    });
  }
}

// Mostrar un mensaje al usuario confirmando el éxito de una acción
function mensajeExito(mensaje) {
  $mensaje.removeClass('alert-danger');
  $mensaje.addClass('alert-success');
  $mensaje.html(mensaje);
  $mensaje.slideDown();
}

// Mostrar un mensaje al usuario avisando del fracaso de una acción
function mensajeFracaso(mensaje) {
  $mensaje.removeClass('alert-success');
  $mensaje.addClass('alert-danger');
  $mensaje.html(mensaje);
  $mensaje.slideDown();
}

// Oculta los mensajes
function ocultarMensaje() {
  $mensaje.slideUp();
}

// Validar los datos del formulario
function validarFormulario() {
  var mensaje = '';
  $('input').parent().removeClass('has-error');
  $('select').parent().removeClass('has-error');
  if (!$lugar.val()) {
    $lugar.parent().addClass('has-error');
    mensaje += '<p>Ingrese el lugar de compra</p>';
  }

  if (!$factura.val()) {
    $factura.parent().addClass('has-error');
    mensaje += '<p>Ingrese el número de factura</p>';
  }

  if (!$nombre.val()) {
    $nombre.parent().addClass('has-error');
    mensaje += '<p>Ingrese su nombre completo</p>';
  }

  if (!$ci.val()) {
    $ci.parent().addClass('has-error');
    mensaje += '<p>Ingrese su CI</p>';
  }

  if (!$celular.val()) {
    $celular.parent().addClass('has-error');
    mensaje += '<p>Ingrese su celular</p>';
  }

  if (!$email.val()) {
    $email.parent().addClass('has-error');
    mensaje += '<p>Ingrese su email</p>';
  } else if (!regex.test($email.val())) {
    $email.parent().addClass('has-error');
    mensaje += '<p>Ingrese un email válido</p>';
  }

  if (!seleccionados.length) {
    $producto.parent().addClass('has-error');
    $codigo.parent().addClass('has-error');
    $cantidad.parent().addClass('has-error');
    mensaje += '<p>Ingrese al menos una compra</p>';
  }

  if (mensaje != '') {
    mensajeFracaso(mensaje);
    return false;
  } else {
    ocultarMensaje();
    return true;
  }
}

// Limpiar los datos del formulario y el arreglo de productos seleccionados
function borrarFormulario() {
  $lugar.val('');
  $factura.val('');
  $nombre.val('');
  $ci.val('');
  $celular.val('');
  $email.val('');
  $producto.val('');
  $codigo.val('');
  $cantidad.val('');
  borrarSeleccionados();
}

// Enviar el formulario al servidor
function envioFormulario(e) {
  e.preventDefault();
  const nombre = $producto.val();
  const codigo = $codigo.val();
  const cantidad = $cantidad.val();

  agregar();

  if (validarFormulario()) {
    const datos = {
      lugar: $lugar.val(),
      factura: $factura.val(),
      nombre: $nombre.val(),
      ci: $ci.val(),
      celular: $celular.val(),
      email: $email.val(),
      productos: seleccionados,
    };
    $.ajax({
      type: 'post',
      dataType: 'json',
      url: 'php/logica.php',
      data: {
        accion: 'envioFormulario',
        form: datos,
      },
      success: function (res) {
        if (res.exito) {
          const mensaje = 'Sus compras fueron registradas con éxito, usted tiene ' +
            $chances.html() + ' nuevas chances para el sorteo';
          mensajeExito(mensaje);
          borrarFormulario();
          setTimeout(function () { ocultarMensaje(); }, 30000);
        } else {
          mensajeFracaso(res.error);
        }
      },

      error: function (error) {
        mensajeFracaso(error);
      },
    });
  }
}

$(window).on('load', function () {

  // Cargar el listado de productos desde el servidor
  $.ajax({
    type: 'post',
    dataType: 'json',
    url: 'php/logica.php',
    data: {
      accion: 'listadoProductos',
    },
    success: function (data) {
      if (data.exito) {
        datos = data.listado;
        filtrarRepetidos();
        mostrarProductos();
      } else {
        mensajeFracaso(data.error);
      }
    },

    error: function (error) {
      mensajeFracaso(error);
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
