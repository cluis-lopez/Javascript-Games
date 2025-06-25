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

restart ("auto")


//Eventos
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

$letraPrincipal.addEventListener('change', function(){
    restart ("manual")
})

// Main Loop

function restart(mode) {
    var letras = []
    if (mode == "auto"){
        letras = escogeObligatoria(generaLetras())
        //Letra principal = letras[0]
    } else {
        letras[0] = $letraPrincipal.value
        letras[1] = $letrasOpcionales.value
    }
    mainPanel(letras[1].concat(letras[0]))
}

function mainPanel(letras) {
    dibujaHepta(letras)
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
    console.log("Letra obligatoria: " + ret[0])
    console.log("Letras opcionales: " + ret[1])
    return ret
}

function buscaPalabras(letras) {
    var obligatoria = acentua(letras[0]) //Si es una vocal añadimos el acento a la lista
    var prohibidas = anadeVocalesAcentuadas(opuestas(letras[1], letras[0])) //letras que NO pueden aparecer. 
    //Incluyendo las vocales acentuadas en su caso

    var temp = []

    //Nos quedamos solo con las palabras que contengan la letra obligatoria
    rae_dict.forEach((x) => {
        obligatoria.forEach((y) => { if (x.toLowerCase().includes(y)) temp.push(x) })
    })

    console.log(temp.length + " palabras contienen la letra obligatoria " + obligatoria)

    //Eliminamos todas las que contengan alguna de las letras prohibidas

    console.log("Las letras prohibidas son: " + prohibidas)
    var temp2 = []
    temp.forEach((x) => {
        if (prohibidas.every((y) => !x.toLowerCase().includes(y))) temp2.push(x)
    })

    //Ordena el conjunto por la primera letra de cada palabra

    var temp3 = [letras[0]]
    temp3 = temp3.concat(letras[1]).sort()
    console.log(temp3)
    var ret = []
    for (var i = 0; i < temp3.length; i++) {
        var temp4 = []
        var letraInicial = temp3[i]
        temp2.forEach((x) => { if (x[0] == letraInicial) temp4.push(x) })
        ret.push([letraInicial,0, temp4.length, temp4, []]) //Estructura:
                                                            // ret[0] => letra Inicial
                                                            // ret[1] =>  # de palabras encontradas
                                                            // ret[2] => numero de palabras posibles
                                                            // ret[3] => palabras posibles
                                                            // ret[4] => palabras encontradas
    }
    return ret
}