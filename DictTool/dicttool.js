const $word_len = document.getElementById("wlen")
const $acentos = document.getElementById("acentos")
const $resultados = document.getElementById("resultados")
const LETRAS_FIJAS_INDEF = 3

var wlen = parseInt($word_len.value)
var acentos = $acentos.checked

var letrasFijas = [] //letras en posicion prefijada
var letrasObligatorias = []
var letrasProhibidas = []
var tempFiltro = []

restart()

//Creacion/Limpieza de widgets
function restart() {
    creaLetrasFijas()
    limpiaLetrasObligatorias()
    limpiaLetrasProhibidas()
    tempFiltro = [...rae_dict]
}

function creaLetrasFijas() {
    letrasFijas = []
    if (wlen == 0) {
        var $letrasFijas = document.getElementById("letrasFijasStart")
        while ($letrasFijas.firstChild) {
            $letrasFijas.removeChild($letrasFijas.lastChild)
        }
        inputBox($letrasFijas, 0, LETRAS_FIJAS_INDEF, "letrasFijas", "teclaLetraFija")

        $letrasFijas = document.getElementById("letrasFijasEnd")
        while ($letrasFijas.firstChild) {
            $letrasFijas.removeChild($letrasFijas.lastChild)
        }
        inputBox($letrasFijas, LETRAS_FIJAS_INDEF, LETRAS_FIJAS_INDEF * 2, "letrasFijas", "teclaLetraFija")
        document.getElementById("separadorIndef").innerHTML = "<B>...</B>"
        letrasFijas = Array(LETRAS_FIJAS_INDEF * 2).fill("")
    }
    else {
        var $letrasFijas = document.getElementById("letrasFijasStart")
        while ($letrasFijas.firstChild) {
            $letrasFijas.removeChild($letrasFijas.lastChild)
        }
        inputBox($letrasFijas, 0, wlen, "letrasFijas", "teclaLetraFija")

        $letrasFijas = document.getElementById("letrasFijasEnd")
        while ($letrasFijas.firstChild) {
            $letrasFijas.removeChild($letrasFijas.lastChild)
        }
        document.getElementById("separadorIndef").innerHTML = ""
        letrasFijas = Array(wlen).fill("")
    }

    function inputBox(container, s, e, id, callbck) {
        for (let i = s; i < e; i++) {
            var letraBox = document.createElement("input")
            letraBox.setAttribute("type", "text")
            letraBox.setAttribute("maxlength", "1")
            letraBox.setAttribute("oninput", callbck + "(event, " + i + ")")
            letraBox.setAttribute("id", id + "_" + i)
            letraBox.classList.add("form-control")
            letraBox.classList.add("letras")
            var col = document.createElement("div")
            col.classList.add("col")
            col.appendChild(letraBox)
            container.appendChild(col)
        }
    }

}

function limpiaLetrasObligatorias() {
    letrasObligatorias = []
    document.getElementById("letrasObligatorias").value = ""
}

function limpiaLetrasProhibidas() {
    letrasObligatorias = []
    document.getElementById("letrasProhibidas").value = ""
}

//Funciones clave de filtrado
function filtrar() {
    if (isArrayEmpty(letrasFijas) && isArrayEmpty(letrasOligatorias) && isArrayEmpty(letrasOpcionales)) {
        tempFiltro = [] //Reinicio del buffer de palabras
    }

    if (wlen != 0) { //Longitud de palabra prefijada
        rae_dict.forEach(x => { if (x.length == wlen) tempFiltro.push(x) })
    } else {
        tempFiltro = [...rae_dict]
    }
}

function filtraLetrasObligatorias(lista, letrasObli) {
    temp = lista

    if (!isArrayEmpty(letrasObli)) {
        temp = []
        lista.forEach((x) => { if (letrasObli.every((y) => x.toLowerCase().includes(y))) temp.push(x) })
    }
    return temp
}

function filtraLetrasProhibidas(lista, letrasP) {
    var temp = lista
    var lP = [...letrasP]
    if (!acentos) { //No se consideran las tildes
        lP = addAcentuadas(lP)
    }

    if (!isArrayEmpty(lP)) {
        temp = []
        lista.forEach((x) => {
            if (!lP.some((y) => x.toLowerCase().includes(y))) temp.push(x)
        })
    }
    return temp
}

//Gestión eventos y callbacks
$word_len.addEventListener('change', function () {
    letras_fijas = []
    wlen = parseInt($word_len.value)
    createApp()
})

function teclaLetraFija(e, i) {
    if (e.inputType === "deleteContentBackward") { // Pressed Delete
        document.getElementById("letrasFijas_" + i).value = ""
        document.getElementById("letrasFijas_" + i).style.backgroundColor = ""
        letrasFijas[i] = ""
    } else if (e.inputType === "insertText" || (e.inputType === "insertCompositionText" && e.data != "´")) {
        var char = e.data.toLowerCase()
        if (isLetraValida(char)) {
            document.getElementById("letrasFijas_" + i).value = char
            document.getElementById("letrasFijas_" + i).style.backgroundColor = "lightgreen"
            letrasFijas[i] = char
        } else {
            document.getElementById("letrasFijas_" + i).value = letrasFijas[i]
            document.getElementById("letrasFijas_" + i).style.backgroundColor = ""
        }

    }

    console.log(letrasFijas)
}

function teclaObligatorias(e) {
    if (e.inputType === "deleteContentBackward") { // Pressed Delete
        letrasObligatorias.pop()
    } else if (e.inputType === "insertText" || (e.inputType === "insertCompositionText" && e.data != "´")) {
        var char = e.data.toLowerCase()
        if (isLetraValida(char)) {
            if (letrasFijas.indexOf(char) > -1 || letrasObligatorias.indexOf(char) > -1) { //La letra ya esta entre las presentes
                document.getElementById("warningMensaje").innerHTML = "La letra <B>" + char.toUpperCase() + "</B> ya est&aacute; entre las necesarias de la palabra"
                modal = new bootstrap.Modal(document.getElementById('warningModal'), { keyboard: false })
                modal.show()
            } else if (letrasProhibidas.indexOf(char) > -1) { //La letra ya está entre las prohibidas
                document.getElementById("warningMensaje").innerHTML = "La letra <B>" + char.toUpperCase() + "</B> est&aacute; entre las prohibidas de la palabra"
                modal = new bootstrap.Modal(document.getElementById('warningModal'), { keyboard: false })
                modal.show()
            } else {
                letrasObligatorias.push(char)
            }
        }
        document.getElementById("letrasObligatorias").value = simpleArray2String(letrasObligatorias)
    }
    console.log("Obligatorias: " + letrasObligatorias)
    tempFiltro = filtraLetrasObligatorias(tempFiltro, letrasObligatorias)
    console.log(tempFiltro)
}
function teclaProhibidas(e) {
    if (e.inputType === "deleteContentBackward") { // Pressed Delete
        letrasProhibidas.pop()
    } else if (e.inputType === "insertText" || (e.inputType === "insertCompositionText" && e.data != "´")) {
        var char = e.data.toLowerCase()
        if (isLetraValida(char)) {
            if (letrasFijas.indexOf(char) > -1 || letrasObligatorias.indexOf(char) > -1) { //La letra ya esta entre las presentes
                document.getElementById("warningMensaje").innerHTML = "La letra <B>" + char.toUpperCase() + "</B> est&aacute; entre las necesarias de la palabra"
                modal = new bootstrap.Modal(document.getElementById('warningModal'), { keyboard: false })
                modal.show()
            } else if (letrasProhibidas.indexOf(char) > -1) { //La letra ya está entre las prohibidas
                document.getElementById("warningMensaje").innerHTML = "La letra <B>" + char.toUpperCase() + "</B> ya est&aacute; entre las prohibidas de la palabra"
                modal = new bootstrap.Modal(document.getElementById('warningModal'), { keyboard: false })
                modal.show()
            } else {
                letrasProhibidas.push(char)
            }
        }
        document.getElementById("letrasProhibidas").value = simpleArray2String(letrasProhibidas)
    }
    console.log("Prohibidas: " + letrasProhibidas)
    tempFiltro = filtraLetrasProhibidas(tempFiltro, letrasProhibidas)
    console.log(tempFiltro)
}