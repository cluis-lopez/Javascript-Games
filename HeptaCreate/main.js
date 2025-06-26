const VOCALES = ["a", "e", "i", "o", "u"]
const VOCALESAcentuadas = ["á", "é", "í", "ó", "ú"]
const CONSONANTES = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "ñ", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"]
const DICCIONARIO = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
const PESOS = {
    "a": 0.15458448730072955, "b": 0.018089494393407186, "c": 0.05704961496892732,
    "d": 0.039901589097541205, "e": 0.09349457916779248, "f": 0.011196298297757363, "g": 0.017826685355309378,
    "h": 0.010468032288570657, "i": 0.08768956025398542, "j": 0.005986557687111592, "k": 0.00033458018103215347,
    "l": 0.04721907930289111, "m": 0.031042074777087272, "n": 0.06159652796541475, "ñ": 0, "o": 0.09466402661442853,
    "p": 0.024739935152661444, "q": 0.004013906714401513, "r": 0.09083799142123751, "s": 0.04186685186436098,
    "t": 0.05432125607943799, "u": 0.031926548567954606, "v": 0.009804149216427992, "w": 0.00008760301269927046,
    "x": 0.0018122213590921372, "y": 0.001745727506079438, "z": 0.007700621453661172
}
const NUMLETRAS = 7 // Heptagrama :-)
const HEPTAWIDTH = 300
const HANCHO = 75
const LETTERSIZE = 30

const $generar = document.getElementById("generar")
const $resolver = document.getElementById("resolver")
const $auto = document.getElementById("auto")
const $letraPrincipal = document.getElementById("letraPrincipal")
const $letrasOpcionales = document.getElementById("letrasOpcionales")
const $canvas = document.getElementById("principal");
const $ctx = $canvas.getContext("2d");
const $palabras = document.getElementById("palabras")
const $palabraInput = document.getElementById("palabraInput")
const $score = document.getElementById("score")
const $crono = document.getElementById("crono")

var letraPrincipal = ""
var letrasOpcionales = []
var palabrasHepta = {}
var palabra = ""
var minutos = 0
var segundos = 0
var isPaused = false

restart("auto")


//Eventos
function palabraInput(e) {
    var temp = letraPrincipal + array2str(letrasOpcionales)
    if (e.key == "Backspace") {
        palabra = palabra.slice(0, palabra.length - 1)
        $palabraInput.innerText = palabra.toUpperCase()
    } else if (temp.includes(e.key) && palabra.length < 25) {
        palabra = palabra + e.key
        $palabraInput.innerText = palabra.toUpperCase()
    } else if (e.key == "Enter") {
        if (!palabra.includes(letraPrincipal)) {
            palabra = ""
            $palabraInput.innerText = "La palabra no incluye la letra " + letraPrincipal.toUpperCase()
        } else if (palabra.length < 3) {
            palabra = ""
            $palabraInput.innerText = "La palabra debe tener al menos 3 letras"
        } else {//La letra principal está incluida en la palabra hay que comprobar si es válida
            result = esPalabraValida(palabra)
            if (result.length > 0) {
                if (esPalabraYaValidada(palabra)) {
                    palabra = ""
                    $palabraInput.innerText = "Palabra ya descubierta"
                } else { //Nueva palabra descubierta !!!
                    console.log("Success. Palabra(s) valida(s): " + result)
                    console.log(palabrasHepta.get(palabra[0]))
                    temp = palabrasHepta.get(palabra[0])
                    temp[0] = temp[0] + result.length //Incrementamos el contador de palabras encontradas
                    temp[3] = temp[3].concat(result)
                    palabra = ""
                    $palabraInput.innerText = ""
                    listadoPalabras(palabrasHepta)

                }
            } else {
                palabra = ""
                $palabraInput.innerText = "Palabra inválida"
            }
        }
    } else { //letra invalida
        if (palabra.length == 0) $palabraInput.innerText = ""
    }
}

$resolver.addEventListener("click", function(){
    isPaused = true
    for (i of palabrasHepta){
        i[1][2].forEach((x) => i[1][3].push("<b>"+x+"</b>"))
    }
    listadoPalabras(palabrasHepta)
})


$auto.addEventListener('change', function () {
    if ($auto.checked == true) {
        document.getElementById("lineaLetraOb").style.display = ""
        document.getElementById("lineaLetrasOp").style.display = ""
        document.getElementById("label4auto").innerText = "Manual"
    } else {
        document.getElementById("lineaLetraOb").style.display = "none"
        document.getElementById("lineaLetrasOp").style.display = "none"
        document.getElementById("letraObligatoria").value = ""
        document.getElementById("letrasOpcionales").value = ""
        document.getElementById("label4auto").innerText = "Auto"
        restart("auto")
    }
})

// Main Loop

function restart(mode) {
    palabra = ""
    minutos = 0
    segundos = 0
    var letras = []
    if (mode == "auto") {
        letras = escogeObligatoria(generaLetras())
        letraPrincipal = letras[0]
        letrasOpcionales = letras[1]
    } else {
        letraPrincipal = $letraPrincipal.value
        letrasOpcionales = $letrasOpcionales.value.split("")
    }

    palabrasHepta = buscaPalabras(letras)
    dibujaHepta(letrasOpcionales.concat([letraPrincipal]))
    listadoPalabras(palabrasHepta)

    var totalPalabras = 0
    for (i of palabrasHepta)
        totalPalabras += i[1][1]
    $score.innerText = "0/" + totalPalabras

    setInterval(contador, 1000)
}

function contador() {
    if (isPaused) return
    segundos++
    if (segundos == 60) {
        segundos = 0
        minutos++
    }
    $crono.innerHTML = '<b>' + minutos.toString().padStart(2, '0') + ':' + segundos.toString().padStart(2, '0') + '</b>'
}


//Logica
function generaLetras() {
    var letras = []
    var numVocales = 2 + Math.floor(Math.random() * 2) //NumVocales entre 2 y 3
    var numConsonantes = NUMLETRAS - numVocales
    var vocales = [...VOCALES]
    var consonantes = [...CONSONANTES]
    for (var i = 0; i < numVocales; i++) {
        var index = Math.floor(Math.random() * vocales.length)
        letras.push(vocales[index])
        vocales.splice(index, 1)
    }

    for (var i = 0; i < numConsonantes; i++) {
        var index = Math.floor(Math.random() * consonantes.length)
        letras.push(consonantes[index])
        consonantes.splice(index, 1)
    }

    letras = reordena(letras)
    return letras
}

function escogeObligatoria(letras) {
    var ret = []
    var index = Math.floor(Math.random() * letras.length)
    ret.push(letras[index])
    letras.splice(index, 1)
    ret.push(letras)
    return ret
}

function buscaPalabras(letras) {
    var obligatoria = acentua(letras[0]) //Si es una vocal añadimos el acento a la lista
    var prohibidas = anadeVocalesAcentuadas(opuestas(letras[1], letras[0])) //letras que NO pueden aparecer. 
    //Incluyendo las vocales acentuadas en su caso

    var temp = []

    //Nos quedamos solo con las palabras que contengan la letra obligatoria y tengan 3 o más letras
    rae_dict.forEach((x) => {
        obligatoria.forEach((y) => { if (x.toLowerCase().includes(y) && x.length > 2) temp.push(x) })
    })

    //Eliminamos todas las que contengan alguna de las letras prohibidas
    var temp2 = []
    temp.forEach((x) => {
        if (prohibidas.every((y) => !x.toLowerCase().includes(y))) temp2.push(x)
    })

    //Ordena el conjunto por la primera letra de cada palabra

    var temp3 = [letras[0]]
    temp3 = temp3.concat(letras[1]).sort()
    var ret = new Map()
    for (var i = 0; i < temp3.length; i++) {
        var temp4 = []
        var letraInicial = temp3[i]
        temp2.forEach((x) => { if (x[0] == letraInicial) temp4.push(x) })
        temp5 = [0, temp4.length, temp4, []] //Estructura:
        // [0] =>  # de palabras encontradas
        // [1] => numero de palabras posibles
        // [2] => palabras posibles
        // [3] => palabras encontradas
        ret.set(letraInicial, temp5)
    }
    console.log(ret)
    return ret
}

function esPalabraValida(palabra) {
    var ret = []
    for (var i of palabrasHepta) {
        for (var x in i[1][2]) {
            if (desacentua(i[1][2][x]) === palabra)
                ret.push(i[1][2][x])
        }
    }
    return ret
}

function esPalabraYaValidada(palabra) {
    for (var i of palabrasHepta) {
        for (var x in i[1][2]) {
            if (desacentua(i[1][3][x]) === palabra)
                return true
        }
    }
    return false
}