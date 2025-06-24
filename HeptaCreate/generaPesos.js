const DICCIONARIO = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
const temp = new Map()

for (i in DICCIONARIO) {
    temp.set(DICCIONARIO[i], 0)
}

var totalLetras = 0

rae_dict.forEach(palabra => {
    palabra = palabra.toLowerCase()
    for (caracter of palabra) {
        letra = quitaAcentos(caracter)
        if (letra < "a" || letra > "z")
            break
        totalLetras++
        temp.set(letra, temp.get(letra) + 1)
    }
});

var text = JSON.stringify(Object.fromEntries(temp))

PESOS = new Map(temp)
for (i of PESOS){
    var t = temp.get(i[0])/totalLetras
    PESOS.set(i[0], t)
}

text = text + "\n\n"

text = text + JSON.stringify(Object.fromEntries(PESOS))

var testOK = 0
for (i of PESOS){
    testOK = testOK + i[1]
}

text = text + "\n\n" + testOK


document.getElementById("textContainer").innerText = text

function quitaAcentos(char) {
    ret = ""
    switch (char) {
        case "á":
            ret = "a"
            break
        case "é":
            ret = "e"
            break
        case "í":
            ret = "i"
            break
        case "ó":
            ret = "o"
            break
        case "ú":
            ret = "u"
            break
        default:
            ret = char
            break
    }
    return ret
}