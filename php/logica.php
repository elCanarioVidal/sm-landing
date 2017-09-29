<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  switch ($_POST['accion']) {
    case 'listadoProductos':
      echo listadoProductos();
      break;
    case 'envioFormulario':
      echo recepcionFormulario($_POST['form']);
      break;
    default:
      die();
      break;
  }
}

function leerListado() {
  require_once('./simplexlsx.class.php');
  $xlsx = new SimpleXLSX('../datos/datos_calculo_chance.xlsx');
  $columnas = $xlsx->rows();
  $productos = [];
  for ($i=1; $i < count($columnas); $i++) {
    $columna = $columnas[$i];
    $producto = array(
      'nombre' => $columna[0],
      'codigo' => $columna[1],
      'chances' => $columna[2]
    );
    array_push($productos, $producto);
  }
  return $productos;
}

function listadoProductos() {
  $productos = leerListado();
  die(json_encode($productos));
}

function calcularChances($seleccionados) {
  $chances = 0;
  $listado = leerListado();
  foreach ($seleccionados as $seleccionado) {
    $nombre = $seleccionado['nombre'];
    $codigo = $seleccionado['codigo'];
    $cantidad = $seleccionado['cantidad'];
    if (($nombre != null) && ($codigo != null) && ($cantidad != null)) {
      foreach ($listado as $producto) {
        if ($producto['codigo'] === $codigo) {
          $chances += $producto['chances'] * $cantidad;
          return;
        }
      }
      return $chances;
    } else {
      return false;
    }
  }
}

function guardarDatos($lugar, $nombre, $ci, $celular, $email, $productos, $chances) {
  return true;
}

function recepcionFormulario($datos) {
  $lugar = $datos['lugar'];
  $nombre = $datos['nombre'];
  $ci = $datos['ci'];
  $celular = $datos['celular'];
  $email = $datos['email'];
  $productos = $datos['productos'];
  $chances = calcularChances($productos);
  if ($chances) {
    if (guardarDatos($lugar, $nombre, $ci, $celular, $email, $productos, $chances)) {
      die('EXITO');
    } else {
      die('ERROR BD');
    }
  } else {
    die('ERROR CHANCES');
  }
}
?>
