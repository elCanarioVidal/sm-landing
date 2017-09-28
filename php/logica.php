<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  switch ($_POST['accion']) {
    case 'listadoProductos':
      echo listadoProductos();
      break;
    case 'envioFormulario':
      echo recepcionFormulario($_POST['datos']);
      break;
    default:
      die();
      break;
  }
}

function listadoProductos() {
  require_once('./simplexlsx.class.php');
  $xlsx = new SimpleXLSX('./datos/datos_calculo_chance.xlsx');
  $columnas = $xlsx->rows();
  $productos = [];
  for ($i=1; $i < count($columnas); $i++) {
    $columna = $columnas[$i];
    array_push($productos, $columna[0]);
  }
  die(json_encode($productos));
}

function recepcionFormulario($datos) {

}
?>
