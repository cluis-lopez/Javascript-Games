//Logica
function generaLetras() {
    var letras = []
    var numVocales = 2 + Math.floor(Math.random() * 2) //NumVocales entre 2 y 3
    var numConsonantes = NUMLETRAS - numVocales
    var vocales = [...VOCALES]
    var consonantes = [...CONSONANTES]
    for (var i = 0; i < numVocales; i++) {
        //var index = Math.floor(Math.random() * vocales.length)
        var pesosVocales = []
        for (j in vocales)
            pesosVocales[j] = PESOS.get(vocales[j])
        var index = weighted_random(vocales, pesosVocales)
        console.log("Vocales: " + vocales + " Pesos" + pesosVocales)
        console.log("Escogida " + vocales[index])
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