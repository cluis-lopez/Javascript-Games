const VOCALES = ["a", "e", "i", "o", "u"]
const VOCALESAcentuadas = ["á", "é", "í", "ó", "ú"]
const CONSONANTES = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "ñ", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"]
const DICCIONARIO = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
const PESOSOBJECT = {
    "a": 0.15458448730072955, "b": 0.018089494393407186, "c": 0.05704961496892732,
    "d": 0.039901589097541205, "e": 0.09349457916779248, "f": 0.011196298297757363, "g": 0.017826685355309378,
    "h": 0.010468032288570657, "i": 0.08768956025398542, "j": 0.005986557687111592, "k": 0.00033458018103215347,
    "l": 0.04721907930289111, "m": 0.031042074777087272, "n": 0.06159652796541475, "ñ": 0, "o": 0.09466402661442853,
    "p": 0.024739935152661444, "q": 0.004013906714401513, "r": 0.09083799142123751, "s": 0.04186685186436098,
    "t": 0.05432125607943799, "u": 0.031926548567954606, "v": 0.009804149216427992, "w": 0.00008760301269927046,
    "x": 0.0018122213590921372, "y": 0.001745727506079438, "z": 0.007700621453661172
}
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
const NUMLETRAS = 7 // Heptagrama :-)
const HEPTAWIDTH = 300
const HANCHO = 75
const LETTERSIZE = 30

//ID's del Modal Generar
const $generaModal = document.getElementById("generaModal")
const $auto = document.getElementById("auto")
const $check = document.getElementById("check")
const $jugar = document.getElementById("jugar")
const $revolver = document.getElementById("revolver")

//ID's del Modal Resultados
const $resultadosModal = document.getElementById("resultadosModal")
const $resultadosContent = document.getElementById("resultadosContent")
const $resultadosTitulo = document.getElementById("resultadosTitulo")

//ID's pagina principal
const $canvas = document.getElementById("principal");
const $ctx = $canvas.getContext("2d");
const $palabras = document.getElementById("palabras")
const $palabraInput = document.getElementById("palabraInput")
const $score = document.getElementById("score")
const $crono = document.getElementById("crono")
const $generar = document.getElementById("generar")
const $resolver = document.getElementById("resolver")
const $resultados = document.getElementById("resultados")

const PESOS = new Map(Object.entries(PESOSOBJECT))
var letraPrincipal = ""
var letrasOpcionales = []
var palabrasHepta = {}
var Heptas

var numPalabras
var numHeptas
var numHeptasDescubiertos = 0
var numPalabrasDescubiertas = 0

var palabra = ""
var minutos = 0
var segundos = 0
var isPaused = true

restart(escogeObligatoria(generaLetras()))
var timer = setInterval(contador, 1000)


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
                    temp = palabrasHepta.get(palabra[0])
                    temp[0] += result.length //Incrementamos el contador de palabras encontradas
                    numPalabrasDescubiertas += result.length
                    temp[3] = temp[3].concat(result)
                    temp[3].sort()
                    for (var i in result) {
                        if (Heptas.includes(result[i]))
                            numHeptasDescubiertos++
                    }
                    palabra = ""
                    $palabraInput.innerText = ""
                    listadoPalabras(palabrasHepta)
                    updateScore()

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

function letraInput(e, tipo, numLetra) {
    if ($auto.checked) // En modo automatico no se pueden cambiar las letras
        return
    var $letra = document.getElementById("letraO" + numLetra)
    var letraObli = ""
    var letrasOp = []

    if (e.key == "Backspace") {
        $letra.innerHTML = ""
        if (tipo) { //true if letra obligatoria
            letraObli = ""
        } else { //letra Opcional
            letrasOp[numLetra - 1] = ""
        }
    } else if (e.key >= "a" && e.key <= "z" || e.key == "ñ") {
        if (tipo) {
            letraObli = e.key.toUpperCase()
            $letra.innerHTML = e.key.toUpperCase()
        } else {
            letrasOp[numLetra - 1] = e.key.toUpperCase()
            $letra.innerHTML = e.key.toUpperCase()
        }
    }
}

$resolver.addEventListener("click", function () {
    isPaused = true

    var print = "<table class='table table-striped'>"

    for (var i of palabrasHepta) {
        if (i[1][1] == 0) {
            continue //No hay palabras que comiencen por esta letra
        }

        var temp = []
        i[1][2].forEach((x) => temp.push(x)) //Añadimos las palabras ya encontradas
        i[1][3].forEach((x) => {
            if (!i[1][2].includes(x))
                temp.push(x)                //Añadimos las palabras NO encontradas 
        })

        temp.sort() //Ordenamos la lista

        print = print + "<tr><td class='text-start'>Palabras que empiezan con <b>" + i[0].toUpperCase() +
            "</b> " + i[1][0] + "/" + i[1][1] + ": </td><td class='text-start'>"

        temp.forEach((x) => {
            var inicio = ""
            var fin = ""
            if (!i[1][3].includes(x)) { //Palabra no encontrada va en negrita
                inicio = "<b>"
                fin = "</b>"
                if (Heptas.includes(x)) //Además de encontrada es Hepta va en negrita y rojo
                    inicio = "<b style='color: red;'>"
            } else { //Palabra ya encontrada
                if (Heptas.includes(x)) {
                    inicio = "<b style='color: blue;'>"
                    fin = "</b>"
                }
            }
            print = print + inicio + x + fin + ", "
        })
        print = print + "</td></tr>"
    }
    registrar()
    $palabras.innerHTML = print + "</table>"
    $palabraInput.disabled = true
    $revolver.disabled = true
})

$revolver.addEventListener("click", function () {
    dibujaHepta((reordena(letrasOpcionales)).concat([letraPrincipal]))
})

$generar.addEventListener("click", function () {
    actualizaMensaje($auto.checked)
    if ($auto.checked) { //En el modo automatico generamos las letras
        var letras = escogeObligatoria(generaLetras())
        document.getElementById("letraO0").innerHTML = letras[0].toUpperCase()
        for (var i = 1; i < 7; i++) {
            document.getElementById("letraO" + i).innerHTML = letras[1][i - 1].toUpperCase()
        }
    }
    document.getElementById("resultadosCheck").innerHTML = ""
    $jugar.disabled = true
    const myModal = new bootstrap.Modal($generaModal)
    myModal.toggle()
})

$auto.addEventListener('change', function () {
    if ($auto.checked) {
        document.getElementById("label4auto").innerHTML = "Auto"
    } else {
        document.getElementById("label4auto").innerHTML = "Manual"
    }

    actualizaMensaje($auto.checked)
    document.getElementById("resultadosCheck").innerHTML = ""
    $jugar.disabled = true

    if ($auto.checked) { //En el modo automatico generamos las letras
        var letras = escogeObligatoria(generaLetras())
        document.getElementById("letraO0").innerHTML = letras[0].toUpperCase()
        for (var i = 1; i < 7; i++) {
            document.getElementById("letraO" + i).innerHTML = letras[1][i - 1].toUpperCase()
        }
    } else { //Hemos pasado al modo manual asi que borramos las letras
        for (var i = 0; i < 7; i++) {
            document.getElementById("letraO" + i).innerHTML = ""
        }
    }
})

$check.addEventListener("click", function () {
    var letras = []
    letras[0] = document.getElementById("letraO0").innerText.toLowerCase()
    var temp = []
    for (var i = 1; i < 7; i++) {
        temp[i - 1] = document.getElementById("letraO" + i).innerText.toLowerCase()
    }
    letras.push(temp)

    var mensaje = letrasValidas(letras)

    if (mensaje == "") {
        var temp = buscaPalabras(letras)
        var num1 = numPalabrasTotalesEncontradas(temp)
        var num2 = totalPalabrasHeptas(temp).length

        mensaje = "La combinación proporciona un juego con " + num1 +
            " palabras válidas y " + num2 + " palabras Hepta"
        document.getElementById("jugar").disabled = false
    }
    document.getElementById("resultadosCheck").innerHTML = mensaje
})

$jugar.addEventListener("click", function () {
    document.getElementById("resultadosCheck").innerHTML = ""
    $jugar.disabled = true
    var letras = []
    letras[0] = document.getElementById("letraO0").innerText.toLowerCase()
    var temp = []
    for (var i = 1; i < 7; i++) {
        temp[i - 1] = document.getElementById("letraO" + i).innerText.toLowerCase()
    }
    letras.push(temp)
    restart(letras)
})

function actualizaMensaje(estado) {
    if (estado) { //true by default
        document.getElementById("generaMensaje").innerHTML = "En el modo automatico " +
            "se generan letras de forma aleatoria en base al patr&oacute;n de uso " +
            "del diccionario de la RAE"
    } else {
        document.getElementById("generaMensaje").innerHTML = "En el modo manual " +
            "deben escogerse la letra obligatoria y las seis letras opcionales"
    }
}

function updateScore() {
    var temp = "<table class='table table-bordered text-start'><tr><td>Palabras Encontradas</td>"
        + "<td>" + numPalabrasDescubiertas + "/" + numPalabras + "</td>"
        + "<td>" + (numPalabrasDescubiertas / numPalabras * 100).toFixed() + "%</td></tr>"

    var i = ""
    if (numHeptas == 0)
        i = "0"
    else
        i = (numHeptasDescubiertos / numHeptas * 100).toFixed()

    temp = temp + "<tr><td>Heptas Encontrados</td>"
        + "<td>" + numHeptasDescubiertos + "/" + numHeptas + "</td>"
        + "<td>" + i + "%</td></tr></table>"

    $score.innerHTML = temp
}

//Modal Resultados

$resultados.addEventListener("click", function () {
    const myModal = new bootstrap.Modal($resultadosModal)
    myModal.toggle()
    isPaused = true

    var historico = JSON.parse(localStorage.getItem("gameHistory"))
    if (historico == null) {
        $resultadosContent.innerHTML = "<tr><td colspan='7'><b>No hay resultados almacenados</b></td></tr>"
    } else {
        historico = ultimos10Juegos(historico)
        for (var juego in historico) {
            $resultadosContent.append(nuevaLineaResultados(historico[juego]))
        }
    }


})

$resultadosModal.addEventListener("hidden.bs.modal", function () {
    isPaused = false
    while ($resultadosContent.firstChild) {
        $resultadosContent.removeChild($resultadosContent.lastChild)
    }
});

// Main Loop

function restart(letras) {
    palabra = ""
    minutos = 0
    segundos = 0
    numHeptasDescubiertos = 0
    numPalabrasDescubiertas = 0

    letraPrincipal = letras[0]
    letrasOpcionales = letras[1]
    palabrasHepta = buscaPalabras(letras)
    dibujaHepta(letrasOpcionales.concat([letraPrincipal]))
    listadoPalabras(palabrasHepta)

    numPalabras = numPalabrasTotalesEncontradas(palabrasHepta)
    Heptas = totalPalabrasHeptas(palabrasHepta)
    numHeptas = Heptas.length

    updateScore()

    $palabraInput.disabled = false
    $revolver.disabled = false
    isPaused = false
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