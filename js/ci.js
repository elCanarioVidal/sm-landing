// https://github.com/picandocodigo/ci_js

function digitoVerificacion(ci) {
  var a = 0;
  var i = 0;
  if (ci.length <= 6) {
    for (i = ci.length; i < 7; i++) {
      ci = '0' + ci;
    }
  }

  for (i = 0; i < 7; i++) {
    a += (parseInt('2987634'[i]) * parseInt(ci[i])) % 10;
  }

  if (a % 10 === 0) {
    return 0;
  } else {
    return 10 - a % 10;
  }
}

function validarCi(ci) {
  ci = limpiarCi(ci);
  var dig = ci[ci.length - 1];
  ci = ci.replace(/[0-9]$/, '');
  return (dig == digitoVerificacion(ci));
}

function randomCi() {
  var ci = Math.floor(Math.random() * 10000000).toString();
  ci = ci.substring(0, 7) + digitoVerificacion(ci);
  return ci;
}

function limpiarCi(ci) {
  return ci.replace(/\D/g, '');
}
