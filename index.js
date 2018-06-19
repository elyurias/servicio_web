var app = require('./app');
var port = process.env.PORT || 3000;

var NodeRSA = require('node-rsa');

var server = app.listen(port, function () {
    console.log('Web Service En ejecucion - PORT:' + port);
    /*
    var key = new NodeRSA({ b: 512 })
    var guardar_clave = key.exportKey()
              /*
                Cuentas monedas vamos a generar al año 
                     //Sin limite de generacion de monedas
              * /
              /* Crear La Moneda
               * 
               * Base[10],                          //Almacenar
               *    //NumeroDeDecimales[2] 0.00
               * Simbolo[Delfin, 8x8:pixeles],      //El nombre del icono
               * Codigo:MLO, 
               * EmisoR[MAC_SERVIDOR], 
               * DondeSeGenero[MAC_ANDROID]
               * 
    var texto = "0|10|sdijnalsdkajioudijdkasdjfaoufsdjaisnfdaSIMBOLO_SIMBOLO|Android|2622as51sa5s1d45ar5|2018-12-12|"
    var encriptado = key.encrypt(texto, 'base64')//Parte de la encriptacion
    console.log(encriptado)
    var desencriptado = key.decrypt(encriptado, 'utf8')
    console.log(desencriptado)
    /*[El servidor]-> {
                    Cadena de bloques y
                    Cartera -> {
                        ----------------------------
                            La moneda del usuario
                        ----------------------------
                    }
      }
     * 
     * Local => [Generar un Archivo]
        ContenidoCifrado,
        ClavePrivada -> Otro nivel de acceso
     */
    //La idea ganadora -> "Saul"
    /*Online => [Almacenar en el servidor]
        ContenidoCifrado
        -> Clave en una base de datos
            ----------------------------------------------------------------------------
                [BlockChain, Mineria] -> Simular[Una base de datos] -> Panasea de las monedas electronicas
    var keyPersonalDeUsuario = `
        -----BEGIN RSA PRIVATE KEY-----
        MIIBOgIBAAJBAIqKrn9XP7HlqnrfnP19DdrwenGuxLp+/vqoIdNj+0UM/HgZI5Li
        H03DhV97nJ1NwMDfRzBPvHV/4s+YlIFJED8CAwEAAQJATqOJiR6tOP10V2q2Yeyq
        AKyf1AewA2wyr3TgPm1yIy7vRZ6+XcI3MfGD6kFQtLObKJSghWv3Dmit8Plk9SXq
        AQIhAPI2nyZwShcqyVQOuzs+YaMzFrVyy+rLp253Vh9dEDOvAiEAkm1sTtvmnU2/
        y5rtjyJVYRN0ms9gY3wK6Kl37dRRwHECIQC1qTPqP3PCNmvzaG0SvPG71jhk9Glu
        eznjRwvH0COzrwIgatKfOCye4lVtPZlqA4j1pptt7t6pIArHXpL7pirF9VECIDYX
        xJqgRa+qdB1xBRujd9WZByCDIxBGiiAyd4pddqGh
        -----END RSA PRIVATE KEY-----`;
    var mensaje_codificado = `GNecaXaXR6xThbaYqopy1LIo74X10U/Cy00KbGyoNEX2tRgUZuvSYbZgnBjxTY17kDx7LdkNzPS/c/dn20h4GEyGtdBjOq/Fe+Drl+Ioh2vs//lFIyR76MAU+7hlcX8EuT4OkhzYv1+n3naGdz8OVNxCHE/0P2HijD/9pAe3m5g=`;
    try {
        var keyDosPrueba = new NodeRSA(keyPersonalDeUsuario)
        console.log(keyDosPrueba.decrypt(mensaje_codificado, 'utf8'))
    } catch (e) {
        console.log("No se puede extraer la informacion")
    }*/
});