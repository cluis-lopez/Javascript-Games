function reordena(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array
}

function isVocal(letra) {
    var ret = false
    if (letra == "a" || letra == "e" || letra == "i" || letra == "o" || letra == "u")
        ret = true
    return ret
}

function acentua(letra) {
    temp = []
    temp.push(letra)
    if (isVocal(letra)) {
        switch (letra) {
            case "a":
                temp.push("á")
                break
            case "e":
                temp.push("é")
                break
            case "i":
                temp.push("í")
                break
            case "o":
                temp.push("ó")
                break
            case "u":
                temp.push("ú")
                break

        }
    }
    return temp
}

function opuestas(lista, letraObligatoria){
    temp = []
    DICCIONARIO.forEach((x) => {
        if (!lista.includes(x) && x != letraObligatoria){temp.push(x)}
    })
    return temp
}

function anadeVocalesAcentuadas(lista){
    var temp = []
    lista.forEach((x) => {
        var temp2 = acentua(x)
        temp2.forEach((y) => temp.push(y))
    })

    return temp
}

function totalElementos(array){
    result = 0
    for (var i=0; i<array.length; i++){
        result = result + array[i][1].length
    }
    return result
}