function siguiente() {
  $('a[href="#step2"]').tab('show');
}

function agregar() {
  $('.agregados').append($('<hr>')).append($('#compra').clone());
}

$(window).on('load', function () {
  $.ajax({
    type: 'post',
    url: '/php/logica.php',
    dataType: 'json',
    data: {
      accion: 'listadoProductos',
    },
    success: function (response) {
      console.log(response);
    },

    error: function (error) {
      console.log(error);
    },
  });
});
