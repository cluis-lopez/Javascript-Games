//Logica
function generaLetras() {
    var letras = []
    var numVocales = 2 + Math.floor(Math.random() * 3) //NumVocales entre 2 y 4
    var numConsonantes = NUMLETRAS - numVocales
    var vocales = [...VOCALES]
    var consonantes = [...CONSONANTES]
    for (var i = 0; i < numVocales; i++) {
        //var index = Math.floor(Math.random() * vocales.length)
        var pesosVocales = []
        for (j in vocales)
            pesosVocales[j] = PESOS.get(vocales[j])
        var index = weighted_random(vocales, pesosVocales)
        letras.push(vocales[index])
        vocales.splice(index, 1)
    }

    for (var i = 0; i < numConsonantes; i++) {
        //var index = Math.floor(Math.random() * consonantes.length)
        var pesosConsonantes = []
        for (j in consonantes)
            pesosConsonantes[j] = PESOS.get(consonantes[j])
        var index = weighted_random(consonantes, pesosConsonantes)
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
        for (var i in obligatoria) {
            if (x.toLowerCase().includes(obligatoria[i]) && x.length > 2) {
                temp.push(x); break
            }
        }
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
        temp2.forEach((x) => { if (desacentua(x[0]) == letraInicial) temp4.push(x) })
        temp5 = [0, temp4.length, temp4, []] //Estructura:
        // [0] =>  # de palabras encontradas
        // [1] => numero de palabras posibles
        // [2] => palabras posibles
        // [3] => palabras encontradas
        ret.set(letraInicial, temp5)
    }
    return ret
}

function numPalabrasTotalesEncontradas(struct) {
    ret = 0
    for (var i of struct) {
        ret = ret + i[1][1]
    }
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

function esHeptaPalabra(palabra, letras) {
    ret = true
    for (var x in letras) {
        if (!palabra.includes(letras[x])) {
            ret = false
        }
    }
    return ret
}

function totalPalabrasHeptas(struct) {
    var ret = []
    var letras = []
    for (var i of struct) { // Cada letra inicial
        letras.push(i[0])
    }

    for (var i in letras) {
        for (var j of struct.get(letras[i])[2]) {// Cada palabra 
            if (esHeptaPalabra(desacentua(j), letras))
                ret.push(j)
        }
    }
    return ret
}

function letrasValidas(let) {
    var le = let[1].concat(let[0])
    var j = le.length
    for (var i = 0; i < j; i++) {
        l = array2str(le.splice(0, 1))
        if (l == "")
            return "Alguna de las letras esta vacia"
        if (le.includes(l))
            return "Alguna letra esta repetida"
    }
    return ""
}

function registrar() {
    //Almacena en LocalStorage estructura con los datos del juego
    var ret = {}
    ret["Fecha"] = new Date().toISOString()
    var time = minutos.toString().padStart(2, '0') + ':' + segundos.toString().padStart(2, '0')
    ret["Tiempo"] = time
    ret["LetraObligatoria"] = letraPrincipal
    ret["LetrasOpcionales"] = letrasOpcionales
    ret["PalabrasDescubiertas"] = numPalabrasDescubiertas
    ret["PalabrasTotales"] = numPalabras
    if (numPalabras > 0) {
        ret["percentPalabras"] = numPalabrasDescubiertas / numPalabras
    } else {
        ret["percentPalabras"] = 0
    }
    ret["HeptasDescubiertos"] = numHeptasDescubiertos
    ret["HeptasTotales"] = numHeptas
    if (
        numHeptas > 0) {
        ret["percentHeptas"] = numHeptasDescubiertos / numHeptas 
    } else {
        ret["percentHeptas"] = 0
    }
    var temp = []
    for (var i of palabrasHepta) {
        if (i[1][1] == 0) {
            continue //No hay palabras que comiencen por esta letra
        }
        i[1][3].forEach((x) => temp.push(x)) //Añadimos las palabras ya encontradas
    }
    ret["PalabrasEncontradas"] = temp

    var history = JSON.parse(localStorage.getItem("gameHistory"))
    if (history == null) { //First store
        history = [ret]
    } else { //already results saved
        history.push(ret)
    }
    console.log(history)
    localStorage.setItem("gameHistory", JSON.stringify(history))
}
