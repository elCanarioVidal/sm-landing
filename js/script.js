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
    success: function (productos) {
      productos.forEach(function (producto) {
        $('#producto').append($('<option>' + producto + '</option>', { value: producto }));
      });
    },

    error: function (error) {
      console.log(error);
    },
  });
});
