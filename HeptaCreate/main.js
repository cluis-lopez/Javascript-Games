const VOCALES = ["a", "e", "i", "o", "u"]
const VOCALESAcentuadas = ["á", "é", "í", "ó", "ú"]
const CONSONANTES = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "ñ", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"]
const DICCIONARIO = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
const NUMLETRAS = 7 // Heptagrama :-)

console.log(generaLetras())

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
        obligatoria.forEach((y) => {if (x.toLowerCase().includes(y)) temp.push(x)})
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
    for (var i=0; i<temp3.length; i++){
        var temp4 = []
        var letraInicial = temp3[i]
        temp2.forEach((x) => {if (x[0] == letraInicial) temp4.push(x)})
        ret.push([letraInicial, temp4])   
    }
    return ret
}