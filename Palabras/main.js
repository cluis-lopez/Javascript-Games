const FILAS_LETRAS_OK = 4
const $word_len = document.getElementById("wlen")
const $acentos = document.getElementById("acentos")
const $resultados = document.getElementById("resultados")
const $soloAcentos = document.getElementById("soloAcentos")
var wlen = parseInt($word_len.value)
var acentos = $acentos.checked
var soloAcentos = $soloAcentos.checked
var letras_OKOK = [] // Letras correctas en posicion correcta
var letras_OK = [[]] // Letras correctas en posicion incorrecta
var letras_Prohibidas = [] // Letras prohibidas

createPatron()

modal = new bootstrap.Modal(document.getElementById('introModal'), { keyboard: false })
modal.show()

function createPatron() {
    var l_OKOK = document.getElementById("letras_OKOK")
    var l_OK = document.getElementById("letras_OK")
    //Update mensaje
    document.getElementById("mensaje").innerText = "El diccionario de la RAE contiene " +
        rae_words[wlen - 1].length + " palabras de " + wlen + " letras"
    //Borra todos los elementos de letras_OKOK y Letras_OK
    while (l_OKOK.firstChild) {
        l_OKOK.removeChild(l_OKOK.lastChild)
    }
    while (l_OK.firstChild) {
        l_OK.removeChild(l_OK.lastChild)
    }

    //Inicializa las variables
    letras_OKOK = Array(wlen).fill("")
    letras_Prohibidas = []

    inputBox(l_OKOK, wlen, "letra_OKOK", "teclaOKOK", 0)

    for (let i = 0; i < FILAS_LETRAS_OK; i++) {
        letras_OK[i] = Array(wlen).fill("")
        var row = document.createElement("div")
        row.classList.add("row")
        row.classList.add("justify-content-md-center")
        var col_sep = document.createElement("div")
        col_sep.classList.add("col")
        col_sep.classList.add("col-lg-2")
        var col_content = document.createElement("div")
        col_content.classList.add("col-md-auto")
        var row_content = document.createElement("div")
        row_content.classList.add("row")
        row_content.setAttribute("id", "letras_OK_fila_" + i)
        inputBox(row_content, wlen, "letra_OK_fila_" + i, "teclaOK", i)
        var col_sep2 = document.createElement("div")
        col_sep2.classList.add("col")
        col_sep2.classList.add("col-lg-2")
        col_content.appendChild(row_content)
        row.appendChild(col_sep)
        row.appendChild(col_content)
        row.appendChild(col_sep2)
        l_OK.appendChild(row)
        var row_sep = document.createElement("div")
        row_sep.classList.add("row")
        var col_sep3 = document.createElement("div")
        col_sep3.classList.add("col")
        col_sep3.classList.add("mt-2")
        row_sep.appendChild(col_sep3)
        l_OK.appendChild(row_sep)
    }

    //Vacia la tabla de resultados
    while ($resultados.firstChild)
        $resultados.removeChild($resultados.lastChild)
    //Actualiza los string de letras presentes y prohibidas
    document.getElementById("letrasP").value = array2String(letras_Prohibidas)

    function inputBox(cont, l, id, callbck, fila) {
        for (let i = 0; i < l; i++) {
            var letraBox = document.createElement("input")
            letraBox.setAttribute("type", "text")
            letraBox.setAttribute("maxlength", "1")
            letraBox.setAttribute("oninput", callbck + "(event, " + fila + ", " + i + ")")
            letraBox.setAttribute("id", id + "_" + i)
            letraBox.classList.add("form-control")
            letraBox.classList.add("letras")
            var col = document.createElement("div")
            col.classList.add("col")
            col.appendChild(letraBox)
            cont.appendChild(col)
        }
    }
}

function teclaOKOK(e, fila, t) {
    if (e.inputType === "deleteContentBackward") { // Pressed Delete
        document.getElementById("letra_OKOK_" + t).value = ""
        document.getElementById("letra_OKOK_" + t).style.backgroundColor = ""
        letras_OKOK[t] = ""
    } else if (e.inputType === "insertText" || (e.inputType === "insertCompositionText" && e.data != "´")) {
        var char = e.data.toLowerCase()
        console.log(e.data)
        if (isLetraValida(char)) {
            if (letras_Prohibidas.indexOf(char) <= -1) {
                document.getElementById("letra_OKOK_" + t).value = char
                document.getElementById("letra_OKOK_" + t).style.backgroundColor = "lightgreen"
                letras_OKOK[t] = char
            } else {
                document.getElementById("letra_OKOK_" + t).value = ""
                document.getElementById("warningMensaje").innerText = "Has usado la letra " + char + ",que está en la lista de letras prohibidas"
                modal = new bootstrap.Modal(document.getElementById('warningModal'), { keyboard: false })
                modal.show()
            }
        } else {
            document.getElementById("letra_OKOK_" + t).value = ""
        }
    } else {
        document.getElementById("letra_OKOK_" + t).value = ""
    }

    updateResultados()
}

function teclaOK(e, fila, t) {
    if (e.inputType === "deleteContentBackward") { // Pressed Delete
        document.getElementById("letra_OK_fila_" + fila + "_" + t).value = ""
        document.getElementById("letra_OK_fila_" + fila + "_" + t).style.backgroundColor = ""
        letras_OK[fila][t] = ""
    } else if (e.inputType === "insertText" || (e.inputType === "insertCompositionText" && e.data != "´")) {
        var char = e.data.toLowerCase()
        if (isLetraValida(char)) {
            if (letras_Prohibidas.indexOf(char) <= -1) {
                document.getElementById("letra_OK_fila_" + fila + "_" + t).value = char
                document.getElementById("letra_OK_fila_" + fila + "_" + t).style.backgroundColor = "orange"
                letras_OK[fila][t] = char
            } else {
                document.getElementById("letra_OK_fila_" + fila + "_" + t).value = ""
                document.getElementById("warningMensaje").innerText = "Has usado la letra " + char + ",que está en la lista de letras prohibidas"
                modal = new bootstrap.Modal(document.getElementById('warningModal'), { keyboard: false })
                modal.show()
            }
        } else {
            document.getElementById("letra_OK_fila_" + fila + "_" + t).value = ""
        }
    } else {
        document.getElementById("letra_OK_fila_" + fila + "_" + t).value = ""
    }

    updateResultados()
}

function teclaProhibidas(e) {
    if (e.inputType === "deleteContentBackward") { // Pressed Delete
        letras_Prohibidas.pop()
    } else if (e.inputType === "insertText" || (e.inputType === "insertCompositionText" && e.data != "´")) {
        var char = e.data.toLowerCase()
        if (isLetraValida(char)) {
            if (multiArrayContains(letras_OK, char) || letras_OKOK.indexOf(char) > -1) { //La letra ya esta entre las presentes
                document.getElementById("warningMensaje").innerText = "La letra " + char + " ya esta entre las necesarias de la palabra"
                modal = new bootstrap.Modal(document.getElementById('warningModal'), { keyboard: false })
                modal.show()
            } else {
                letras_Prohibidas.push(char)
            }
        }
        document.getElementById("letrasP").value = array2String(letras_Prohibidas)
    }
    updateResultados()
}

$word_len.addEventListener('change', function () {
    letrasOKOK = []
    letrasOK = [[]]
    letrasProhibidas = []
    wlen = parseInt($word_len.value)
    createPatron()
})

$acentos.addEventListener('change', function () {
    acentos = $acentos.checked
    if (acentos)
        $soloAcentos.disabled = false
    else {
        $soloAcentos.checked = false
        $soloAcentos.disabled = true
    }
    letrasOKOK = []
    letrasOK = [[]]
    letrasProhibidas = []
    createPatron()
})

$soloAcentos.addEventListener('change', function() {
    soloAcentos = $soloAcentos.checked
    updateResultados()
})

function updateResultados() {
    if (isArrayEmpty(letras_OKOK) && isArrayEmpty(letras_OK) && letras_Prohibidas.length == 0) {
        //Vacia la tabla de resultados
        while ($resultados.firstChild)
            $resultados.removeChild($resultados.lastChild)
        document.getElementById("resultado").innerText = "Palabras que se ajustan al patron"
        return
    }

    var res = filtrar()

    document.getElementById("resultado").innerText = "Encontradas " + res.length +
        " palabras con este patrón"

    while ($resultados.firstChild)
        $resultados.removeChild($resultados.lastChild)

    res.forEach(element => {
        var opt = document.createElement("li")
        opt.classList.add("list-group-item")
        opt.classList.add("d-flex")
        opt.classList.add("justify-content-between")
        opt.classList.add("align-items-center")
        opt.innerText = element["palabra"]
        var ra = document.createElement("span")
        ra.classList.add("badge")
        ra.classList.add("text-bg-dark")
        ra.classList.add("badge-pill")
        ra.innerText = element["rank"]
        opt.appendChild(ra)
        $resultados.appendChild(opt)
    });
}

function filtrar() {
    var results1 = []
    var rx = generateRegexp(letras_OKOK)
    rae_words[wlen - 1].forEach((x, i) => {
        if (x.match(rx)) {
            t = {}
            t["palabra"] = x
            t["rank"] = rae_words_rankings[wlen - 1][i]
            results1.push(t)
        }
    })

    var results2 = []
    rx = new RegExp('^[^' + filtroAcentos(letras_Prohibidas) + ']*$') //expresion para eliminar letras prohibidas de la lista
    results1.forEach(x => {
        if (x["palabra"].match(rx)) {
            results2.push(x)
        }
    })

    var results3 = []

    for (let i = 0; i < results2.length; i++) {
        var test = true
        var temp = quitaAcentos(results2[i]["palabra"])
        loop1:
        for (let j = 0; j < FILAS_LETRAS_OK; j++) { //Recorremos cada fila de letras en posicion incorrecta
            for (let k = 0; k < letras_OK[j].length; k++) {
                if (letras_OK[j][k] === '') {
                    //console.log("Letra vacía: linea: " + j + " columna: " + k)
                    continue
                }
                let indxs = stringAllIndexOf(temp, letras_OK[j][k])
                if (indxs.length == 0 || indxs.indexOf(k) > -1) { //La letra no está en la palabra o está en la posición
                    test = false
                    break loop1
                }
            }
        }

        if (test) {
            results3.push(results2[i])
        }
    }

   var results4 = []
    if (soloAcentos) {
        results3.forEach(x => {
            if (contieneAcentos(x["palabra"]))
                results4.push(x)
        })
    } else {
        results4 = results3
    }

    return results4.sort((a, b) => (b.rank) - (a.rank))
}

function filtroAcentos(s) {
    var temp = ""
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
    var temp = ""
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


function generateRegexp() {
    var temp = []
    letras_OKOK.forEach(x => { if (x === '') { temp.push('.') } else { temp.push(x) } })
    palabra = array2String(temp)
    var exp = ""
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

function contieneAcentos(s) {
    ret = false
    for (let i = 0; i < s.length; i++) {
        if (isAcentuada(s[i]))
            return true
    }
    return ret
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

function multiArrayContains(array, val) {
    var ret = false
    array.forEach(x =>
        x.forEach(y => {
            if (y == val)
                ret = true
        })
    )
    return ret
}

function isArrayEmpty(array) {
    if (array[0].constructor === Array) { //Bidimensional
        var ret = true
        array.forEach(x => {
            if (x.every(y => y == ''))
                ret = true && ret
            else
                ret = false
        })
    } else {
        ret = array.every(x => x == '')
    }
    return ret
}

function stringAllIndexOf(string, char) {
    var ret = []
    for (let i = 0; i < string.length; i++) {
        if (string[i] === char)
            ret.push(i)
    }
    return ret
}
