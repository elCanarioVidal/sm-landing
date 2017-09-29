<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  switch ($_POST['accion']) {
    case 'listadoProductos':
      die(json_encode(array('exito' => true, 'listado' => listadoProductos())));
      break;
    case 'envioFormulario':
      echo recepcionFormulario($_POST['form']);
      break;
    default:
      die();
      break;
  }
}

function dumpLog($var, $title = "") {
  $f = fopen(dirname(__FILE__) . '/troubleshooting.log.html', 'a');
  fwrite($f, $title . "\n");
  ob_start();
  var_dump($var);
  $o = ob_get_clean();
  fwrite($f, $o . "\n\n");
  fclose($f);
}

function listadoProductos() {
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

function calcularChances($compras) {
  $chances = 0;
  $listado = listadoProductos();
  // Calcular las chances generadas por cada compra
  foreach ($compras as $compra) {
    $nombre = $compra['nombre'];
    $codigo = $compra['codigo'];
    $cantidad = $compra['cantidad'];
    // Si están todos los datos de la compra
    if (($nombre != null) && ($codigo != null) && ($cantidad != null)) {
      // Buscar el producto de la compra en el listado
      foreach ($listado as $producto) {
        if ($chances !== false) {
          if ($producto['codigo'] === $codigo) {
            if ($producto['nombre'] === $nombre) {
              // Sumar las chances generadas por la compra y continuar con la siguiente
              $chances += $producto['chances'] * $cantidad;
              break;
            } else {
              // Si el nombre del listado difiere del nombre en la compra => abortar
              return false;
            }
          }
        }
      }
      return $chances;
    } else { // Si no están los datos de la compra => fallar
      return false;
    }
  }
}

function guardarDatos($lugar, $nombre, $ci, $celular, $email, $productos, $chances) {
  return true;
}

function enviarEmail($nombre, $email, $chances) {
  global $debug;

  ob_start();
  require_once("./mail.php");
  $mensaje = ob_get_clean();

  $asunto	= '=?UTF-8?B?'.base64_encode("SmartLife - sorteo").'?=';
  $cabezal = "From: SmartLife <hola@smartlife.com.uy> \r\n";
  $cabezal .= "MIME-Version: 1.0\r\n";
  $cabezal .= "Content-type: text/html; charset=utf-8\r\n";
  return @mail($email, $asunto, $mensaje, $cabezal);
}

function recepcionFormulario($datos) {
  $lugar = $datos['lugar'];
  $factura = $datos['factura'];
  $nombre = $datos['nombre'];
  $ci = $datos['ci'];
  $celular = $datos['celular'];
  $email = $datos['email'];
  $productos = $datos['productos'];
  $chances = calcularChances($productos);
  if ($chances) { // Si no falló el cálculo de chances => guardar los datos
    if (guardarDatos($lugar, $factura, $nombre, $ci, $celular, $email, $productos, $chances)) {
      enviarEmail($nombre, $email, $chances);
      die(json_encode(array('exito' => true)));
    } else {
      die(json_encode(array('exito' => false, 'error' => 'Error en la base de datos')));
    }
  } else {
    die(json_encode(array('exito' => false, 'error' => 'Error al calcular las chances')));
  }
}
?>
