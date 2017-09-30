<?php

define('DB_HOST', 'localhost');
define('DB_NAME', 'smartland_smartlife');
define('DB_USER', 'smartland_dbadmin');
define('DB_PASS', '17d SL20');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  switch ($_POST['accion']) {
    case 'listadoProductos':
      die(json_encode(array('exito' => true, 'listado' => listadoProductos())));
      break;
    case 'envioFormulario':
      recepcionFormulario($_POST['form']);
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
    } else { // Si no están los datos de la compra => fallar
      return false;
    }
  }
  return $chances;
}

function guardarDatos($lugar, $factura, $nombre, $ci, $celular, $email, $productos, $chances) {
  $dberror = false;
  try {
    $db = new PDO("mysql:host=".DB_HOST.";port=3306;dbname=".DB_NAME.";charset=utf8", DB_USER, DB_PASS);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  } catch(Exception $e) {
    dumpLog($e);
    $dberror = true;
  }

  if (!$dberror) {
    $campos = 'lugar, factura, nombre, ci, celular, email, chances';
    $valores = ':lugar, :factura, :nombre, :ci, :celular, :email, :chances';
    try {
      $db->beginTransaction();
      $stmt = $db->prepare("INSERT INTO datos ($campos) VALUES ($valores)");
      $stmt->execute(array(
        ':lugar' => $lugar,
        ':factura' => $factura,
        ':nombre' => $nombre,
        ':ci' => $ci,
        ':celular' => $celular,
        ':email' => $email,
        ':chances' => $chances
      ));
      $id = $db->lastInsertId();
      $campos = 'nombre, codigo, cantidad, chances, iddatos';
      $valores = ':nombre, :codigo, :cantidad, :chances, :iddatos';
      foreach ($productos as $producto) {
        $stmt = $db->prepare("INSERT INTO productos ($campos) VALUES ($valores)");
        $stmt->execute(array(
          ':nombre' => $producto['nombre'],
          ':codigo' => $producto['codigo'],
          ':cantidad' => $producto['cantidad'],
          ':chances' => $producto['chances'],
          ':iddatos' => $id
        ));
      }
      $campos = 'nombre, ci, celular, iddatos';
      $valores = ':nombre, :ci, :celular, :iddatos';
      for ($i = 0; $i < $chances; $i++) {
        $stmt = $db->prepare("INSERT INTO sorteo ($campos) VALUES ($valores)");
        $stmt->execute(array(
          ':nombre' => $nombre,
          ':ci' => $ci,
          ':celular' => $celular,
          ':iddatos' => $id
        ));
      }
      $db->commit();
      return true;
    } catch(Exception $e) {
      $db->rollBack();
      dumpLog($e);
      return false;
    }
  } else {
    return false;
  }
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
  require_once("./ci.php");
  $lugar = $datos['lugar'];
  $factura = $datos['factura'];
  $nombre = $datos['nombre'];
  $ci = $datos['ci'];
  $celular = $datos['celular'];
  $email = $datos['email'];
  $productos = $datos['productos'];
  $chances = calcularChances($productos);

  // Si no falla el cálculo de chances ni la validación de la CI => guardar los datos
  if ($chances) {
    if (validarCedula($ci)) {
      if (guardarDatos($lugar, $factura, $nombre, $ci, $celular, $email, $productos, $chances)) {
        enviarEmail($nombre, $email, $chances);
        die(utf8_encode(json_encode(array('exito' => true))));
      } else {
        die(utf8_encode(json_encode(array('exito' => false, 'error' => 'Error al guardar en la base de datos'))));
      }
    } else {
      die(utf8_encode(json_encode(array('exito' => false, 'error' => 'Error al verificar la CI'))));
    }
  } else {
    die(utf8_encode(json_encode(array('exito' => false, 'error' => 'Error al calcular las chances'))));
  }
}
?>
