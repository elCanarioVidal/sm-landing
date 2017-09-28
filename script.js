$(window).on('load', function () {
  $.ajax({
    type: 'post',
    url: '/logica.php',
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
