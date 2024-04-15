const $word_len = document.getElementById("wlen")
const $letras_cont = document.getElementById("letras_cont")
const $acentos = document.getElementById("acentos")
const $resultados = document.getElementById("resultados")
var wlen = parseInt($word_len.value)
var acentos = $acentos.checked
var palabra = ""
var palabra_vacia = ""
var letrasProhibidas = []
var letrasPresentes = []

createPatron($letras_cont, wlen)


modal = new bootstrap.Modal(document.getElementById('introModal'), { keyboard: false })
modal.show()



function createPatron(c, l) {
    //Update mensaje
    document.getElementById("mensaje").innerText = "El diccionario de la RAE contiene " +
        rae_words[wlen - 1].length + " palabras de " + wlen + " letras"
    //remove all elements from $letras_cont
    while (c.firstChild) {
        c.removeChild(c.lastChild)
    }
    //Añade un elemento por cada letra
    palabra_vacia = ""
    for (let i = 0; i < l; i++) {
        letraBox = document.createElement("input")
        letraBox.setAttribute("type", "text")
        letraBox.setAttribute("maxlength", "1")
        letraBox.setAttribute("oninput", "teclaPatron(event, " + i + ")")
        letraBox.setAttribute("id", "letra_" + i)
        letraBox.classList.add("form-control")
        letraBox.classList.add("letras")
        col = document.createElement("div")
        col.classList.add("col")
        col.appendChild(letraBox)
        c.appendChild(col)
        palabra_vacia = palabra_vacia + "."
    }
    palabra = palabra_vacia

    //Vacia la tabla de resultados
    while ($resultados.firstChild)
        $resultados.removeChild($resultados.lastChild)
    //Actualiza los string de letras presentes y prohibidas
    document.getElementById("letrasP").value = array2String(letrasProhibidas)
    document.getElementById("letrasOK").value = array2String(letrasPresentes)
}

function teclaPatron(e, t) {
    palabra_temp = palabra

    if (e.inputType === "deleteContentBackward") { // Pressed Delete
        document.getElementById("letra_" + t).value = ""
        palabra_temp = palabra_temp.replaceAt(t, ".")
    } else if (e.inputType === "insertText" || (e.inputType === "insertCompositionText" && e.data != "´")) {
        char = e.data.toLowerCase()
        if (isLetraValida(char)) {
            if (letrasProhibidas.indexOf(char) <= -1) {
                document.getElementById("letra_" + t).value = char
                palabra_temp = palabra_temp.replaceAt(t, char)
            } else {
                document.getElementById("letra_" + t).value = ""
                document.getElementById("warningMensaje").innerText = "Has usado una letra que está; en la lista de letras prohibidas"
                modal = new bootstrap.Modal(document.getElementById('warningModal'), { keyboard: false })
                modal.show()
            }
        } else {
            document.getElementById("letra_" + t).value = ""
        }
    } else {
        document.getElementById("letra_" + t).value = ""
    }



    // Si la palabra ha cambiado
    // Realiza el filtro
    if (palabra_temp == palabra_vacia && letrasPresentes.length == 0 && letrasProhibidas.length == 0) { //Vacia resultados
        while ($resultados.firstChild)
            $resultados.removeChild($resultados.lastChild)
        document.getElementById("resultado").innerText = "Palabras que se ajustan al patron"
    } else if (palabra_temp != palabra) {
        res = filtrar(palabra_temp, letrasProhibidas, letrasPresentes)
        updateResultados(res)
    }

    palabra = palabra_temp
}

function teclaProhibidas(e) {
    ol = letrasProhibidas.length
    if (e.inputType === "deleteContentBackward") { // Pressed Delete
        letrasProhibidas.pop()
    } else if (e.inputType === "insertText" || (e.inputType === "insertCompositionText" && e.data != "´")) {
        char = e.data.toLowerCase()
        if (isLetraValida(char)) {
            if (letrasPresentes.indexOf(char) > -1 || palabra.indexOf(char) > -1) { //La letra ya esta entre las presentes
                document.getElementById("warningMensaje").innerText = "La letra ya esta entre las obligatorias de la palabra"
                modal = new bootstrap.Modal(document.getElementById('warningModal'), { keyboard: false })
                modal.show()
            } else {
                letrasProhibidas.push(char)
            }
        }
        document.getElementById("letrasP").value = array2String(letrasProhibidas)
    }

    if (palabra == palabra_vacia && letrasPresentes.length == 0 && letrasProhibidas.length == 0) { //Vacia resultados
        while ($resultados.firstChild)
            $resultados.removeChild($resultados.lastChild)
        document.getElementById("resultado").innerText = "Palabras que se ajustan al patron"
    } else if (letrasProhibidas.length != ol) {
        res = filtrar(palabra, letrasProhibidas, letrasPresentes)
        updateResultados(res)
    }
}

function teclaPresentes(e) {
    ol = letrasPresentes.length
    if (e.inputType === "deleteContentBackward") { // Pressed Delete
        letrasPresentes.pop()
    } else if (e.inputType === "insertText" || (e.inputType === "insertCompositionText" && e.data != "´")) {
        char = e.data.toLowerCase()

        if (isLetraValida(char)) {
            if (letrasProhibidas.indexOf(char) > -1) { //La letra ya esta entre las prohibidas
                document.getElementById("warningMensaje").innerText = "La letra ya está entre las prohibidas en la pablabra"
                modal = new bootstrap.Modal(document.getElementById('warningModal'), { keyboard: false })
                modal.show()
            } else {
                letrasPresentes.push(char)
            }
        }
        document.getElementById("letrasOK").value = array2String(letrasPresentes)
    }

    if (palabra == palabra_vacia && letrasPresentes.length == 0 && letrasProhibidas.length == 0) { //Vacia resultados
        while ($resultados.firstChild)
            $resultados.removeChild($resultados.lastChild)
        document.getElementById("resultado").innerText = "Palabras que se ajustan al patron"
    } else if (letrasPresentes.length != ol) {
        res = filtrar(palabra, letrasProhibidas, letrasPresentes)
        updateResultados(res)
    }
}

$word_len.addEventListener('change', function () {
    palabra = ""
    letrasPresentes = []
    letrasProhibidas = []
    wlen = parseInt($word_len.value)
    createPatron(letras_cont, wlen)
})

$acentos.addEventListener('change', function () {
    acentos = $acentos.checked
    palabra = ""
    letrasPresentes = []
    letrasProhibidas = []
    createPatron($letras_cont, wlen)
})

String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function updateResultados(res) {
    document.getElementById("resultado").innerText = "Encontradas " + res.length +
        " palabras con este patrón"

    while ($resultados.firstChild)
        $resultados.removeChild($resultados.lastChild)

    res.forEach(element => {
        opt = document.createElement("li")
        opt.classList.add("list-group-item")
        opt.innerText = element
        $resultados.appendChild(opt)
    });
}

function filtrar(palabra, letrasProhibidas, letrasPresentes) {
    res = rae_words[wlen - 1].filter((x) => { return generateRegexp(palabra).exec(x) })
    ret = []
    for (let i = 0; i < res.length; i++) {
        test = true

        temp = filtroAcentos(letrasProhibidas)
        for (let j = 0; j < temp.length; j++) {
            if (res[i].indexOf(temp[j]) > -1) { //Contiene letra prohibida
                test = false
                break
            }
        }

        temp = quitaAcentos(res[i])
        for (let j = 0; j < letrasPresentes.length; j++) {
            if (temp.indexOf(letrasPresentes[j]) < 0) { //No contiene una letra obligatoria
                test = false
                break
            }
        }

        if (test)
            ret.push(res[i])
    }
    return ret.sort()
}

function filtroAcentos(s) {
    temp = ""
    if (!acentos) {
        for (let i = 0; i < s.length; i++) {
            if (isVocal(s[i]))
                temp = temp + s[i] + acentua(s[i])
            else
                temp = temp + s[i]
        }
    } else {
        temp = s
    }
    return temp
}

function quitaAcentos(s) {
    temp = ""
    if (!acentos) {
        for (let i = 0; i < s.length; i++) {
            if (isAcentuada(s[i]))
                temp = temp + desacentua(s[i])
            else
                temp = temp + s[i]
        }
    } else {
        temp = s
    }
    return temp
}


function generateRegexp(palabra) {
    exp = ""
    if (!acentos) { //No hay acentos
        for (let i = 0; i < palabra.length; i++) {
            switch (palabra[i]) {
                case 'a':
                    exp = exp + '[a,á]'
                    break
                case 'e':
                    exp = exp + '[e,é]'
                    break
                case 'i':
                    exp = exp + '[i,í]'
                    break
                case 'o':
                    exp = exp + '[o,ó]'
                    break
                case 'u':
                    exp = exp + '[u,ú]'
                    break
                default:
                    exp = exp + palabra[i]
            }
        }
    } else {
        exp = palabra
    }
    return new RegExp(exp)
}

function isLetraValida(letra) {
    if (!acentos) // No se permiten acentos
        return (letra >= 'a' && letra <= 'z' || letra == 'ñ')
    else // acentos permitidos
        return ((letra >= 'a' && letra <= 'z') || isAcentuada(letra) || letra == 'ñ')
}

function isVocal(letra) {
    if (letra === 'a' ||
        letra === 'e' ||
        letra === 'i' ||
        letra === 'o' ||
        letra === 'u')
        return true
    else
        return false
}

function acentua(vocal) {
    switch (vocal) {
        case 'a':
            return 'á'
        case 'e':
            return 'é'
        case 'i':
            return 'í'
        case 'o':
            return 'ó'
        case 'u':
            return 'ú'
        default:
            return vocal
    }
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

function desacentua(vocal) {
    switch (vocal) {
        case 'á':
            return 'a'
        case 'é':
            return 'e'
        case 'í':
            return 'i'
        case 'ó':
            return 'o'
        case 'ú':
            return 'u'
        default:
            return vocal
    }
}

function array2String(arr) {
    ret = ""
    arr.forEach((x) => { ret = ret + x })
    return ret
}

function string2Array(s) {
    ret = []
    for (let i = 0; i < s.length; i++)
        ret[i] = s[i]
    return ret
}
