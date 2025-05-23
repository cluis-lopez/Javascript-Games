const $word_len = document.getElementById("wlen")
const $acentos = document.getElementById("acentos")
const $resultados = document.getElementById("resultados")

var wlen = parseInt($word_len.value)
var acentos = $acentos.checked

var letrasFijas = [] //letras en posicion prefijada
var letrasObligatorias = []
var letrasProhibidas = []

var tempFiltro = []

createApp()

function createApp() {
    var $letrasFijas = document.getElementById("letrasFijas")

    while ($letrasFijas.firstChild) {
        $letrasFijas.removeChild($letrasFijas.lastChild)
    }

    if (wlen == 0)
        inputBox($letrasFijas, 3, "letrasFijas", "teclaLetraFija")
    else
        inputBox($letrasFijas, wlen, "letrasFijas", "teclaLetraFija")

    function inputBox(container, l, id, callbck) {
        for (let i = 0; i < l; i++) {
            letrasFijas[i] = ""
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

//Funciones clave de filtrado

function filtrar() {
    if (isArrayEmpty(letrasFijas) && isArrayEmpty(letrasOligatorias) && isArrayEmpty(letrasOpcionales)) {
        tempFiltro = [] //Reinicio del buffer de palabras
    }

    if (wlen != 0) { //Longitud de palabra prefijada
        rae_dict.forEach(x => { if (x.length == 5) tempFiltro.push(x) })
    } else {
        tempFiltro = [...rae_dict]
    }
}

function filtraLetrasObligatorias(lista, letrasObli) {
    temp = lista

    if (!isArrayEmpty(letrasObli)) {
        temp = []
        lista.forEach((x) => { if (letrasObli.every((y) => x.includes(y))) temp.push(x) })
    }
    return temp
}

function filtraLetrasProhibidas(lista, letrasP) {
    temp = lista
    if (!acentos) { //No se consideran las tildes
        letrasP = addAcentuadas(letrasP)
    }

    if (!isArrayEmpty(letrasP)){
        temp = []
        lista.forEach((x) => {if (! letrasP.some((y) => x.includes(y))) temp.push(x) })
    }
    return temp
}

//Funciones Auxiliares

function isLetraValida(letra) {
    if (!acentos) // No se permiten acentos
        return (letra >= 'a' && letra <= 'z' || letra == 'ñ')
    else // acentos permitidos
        return ((letra >= 'a' && letra <= 'z') || isAcentuada(letra) || letra == 'ñ')
}

function isAcentuada(letra) {
    if (letra === 'á' ||
        letra === 'é' ||
        letra === 'í' ||
        letra === 'ó' ||
        letra === 'ú')
        return true
    else
        return false
}

function addAcentuadas(lista) {
    temp = [...lista]
    temp.forEach((x) => {
        switch (x) {
            case "a":
                lista.push("á");
                break;
            case "e":
                lista.push("é");
                break;
            case "i":
                lista.push("í");
                break;
            case "o":
                lista.push("ó");
                break;
            case "u":
                lista.push("ú");
                break;
        }
    })
    return lista;
}

function isArrayEmpty(array) {
    return array.every(x => x == '')
}

function array2String(arr) {
    var ret = ""
    arr.forEach((x) => { ret = ret + x })
    return ret
}

function string2Array(s) {
    var ret = []
    for (let i = 0; i < s.length; i++)
        ret[i] = s[i]
    return ret
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
        letrasFijas
//Callbacksi] = ""
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
            } else if(letrasProhibidas.indexOf(char) > -1 ) { //La letra ya está entre las prohibidas
                document.getElementById("warningMensaje").innerHTML = "La letra <B>" + char.toUpperCase() + "</B> est&aacute; entre las prohibidas de la palabra"
                modal = new bootstrap.Modal(document.getElementById('warningModal'), { keyboard: false })
                modal.show()
            } else {
                letrasObligatorias.push(char)
            }
        }
        document.getElementById("letrasProhibidas").value = array2String(letrasProhibidas)
    }
    console.log(letrasObligatorias)
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
            } else if(letrasProhibidas.indexOf(char) > -1 ) { //La letra ya está entre las prohibidas
                document.getElementById("warningMensaje").innerHTML = "La letra <B>" + char.toUpperCase() + "</B> ya est&aacute; entre las prohibidas de la palabra"
                modal = new bootstrap.Modal(document.getElementById('warningModal'), { keyboard: false })
                modal.show()
            } else {
                letrasProhibidas.push(char)
            }
        }
        document.getElementById("letrasProhibidas").value = array2String(letrasProhibidas)
    }
    console.log(letrasProhibidas)
}