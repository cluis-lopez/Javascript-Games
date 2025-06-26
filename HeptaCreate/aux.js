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
                temp.push("ü")
                break

        }
    }
    return temp
}

function desacentua(palabra) {
    ret = ""
    for (i in palabra) {
        switch (palabra[i]) {
            case "á":
                ret = ret + "a"
                break
            case "é":
                ret = ret + "e"
                break
            case "í":
                ret = ret + "i"
                break
            case "ó":
                ret = ret + "o"
                break
            case "ú":
                ret = ret + "u"
                break
            case "ü":
                ret = ret + "u"
                break
            default:
                ret = ret + palabra[i]
                break
        }
    }

    return ret
}

function opuestas(lista, letraObligatoria) {
    temp = []
    DICCIONARIO.forEach((x) => {
        if (!lista.includes(x) && x != letraObligatoria) { temp.push(x) }
    })
    return temp
}

function anadeVocalesAcentuadas(lista) {
    var temp = []
    lista.forEach((x) => {
        var temp2 = acentua(x)
        temp2.forEach((y) => temp.push(y))
    })

    return temp
}

function totalElementos(array) {
    result = 0
    for (var i = 0; i < array.length; i++) {
        result = result + array[i][1].length
    }
    return result
}

function weighted_random(items, weights) {
    var i;

    for (i = 1; i < weights.length; i++)
        weights[i] += weights[i - 1];

    var random = Math.random() * weights[weights.length - 1];

    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;

    return i; //Devolvemos el índice, no el elemento !!!
}

function array2str(array) {
    ret = ""
    array.forEach((x) => ret = ret + x)
    return ret
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

function listadoPalabras(datos) {
    text = "<table class='table table-striped'>"

    for (var i of datos) {
        if (i[1][1] == 0) {
            continue //No hay palabras que comiencen por esta letra
        }
        text = text + "<tr><td class='text-start'>Palabras que empiezan con <b>" + i[0].toUpperCase() +
            "</b> " + i[1][0] + "/" + i[1][1] + ": </td><td>"
        i[1][3].forEach((x) => text = text + x + ", ")
        text = text + "</td></tr>"
    }

    $palabras.innerHTML = text + "</table>"
}

function dibujaHepta(letras) {
    $ctx.resetTransform()
    $ctx.clearRect(0, 0, $canvas.width, $canvas.height)
    $ctx.fillStyle = "rgb(200 200 200)";
    $ctx.lineWidth = 5
    $ctx.translate(10, 10)

    var p1 = HEPTAWIDTH / 2 * Math.sin(g2r(30))
    var p2 = HEPTAWIDTH - p1
    var p3 = p2 - HANCHO * Math.sin(g2r(30))
    var p4 = p1 + HANCHO * Math.sin(g2r(30))

    //Arriba
    $ctx.beginPath();
    $ctx.moveTo(p1, 0)
    $ctx.lineTo(p2, 0);
    $ctx.lineTo(p3, HANCHO);
    $ctx.lineTo(p4, HANCHO)
    $ctx.lineTo(p1, 0)
    $ctx.stroke()
    $ctx.fill();

    //Arriba derecha
    $ctx.beginPath();
    $ctx.moveTo(p2, 0)
    $ctx.lineTo(HEPTAWIDTH, HEPTAWIDTH / 2)
    $ctx.lineTo(HEPTAWIDTH - HANCHO, HEPTAWIDTH / 2)
    $ctx.lineTo(p3, HANCHO)
    $ctx.lineTo(p2, 0)
    $ctx.stroke()
    $ctx.fill()

    //Abajo derecha
    $ctx.beginPath();
    $ctx.moveTo(HEPTAWIDTH, HEPTAWIDTH / 2)
    $ctx.lineTo(p2, HEPTAWIDTH)
    $ctx.lineTo(p3, HEPTAWIDTH - HANCHO)
    $ctx.lineTo(HEPTAWIDTH - HANCHO, HEPTAWIDTH / 2)
    $ctx.lineTo(HEPTAWIDTH, HEPTAWIDTH / 2)
    $ctx.stroke()
    $ctx.fill()

    //Abajo
    $ctx.beginPath();
    $ctx.moveTo(p1, HEPTAWIDTH)
    $ctx.lineTo(p4, HEPTAWIDTH - HANCHO);
    $ctx.lineTo(p3, HEPTAWIDTH - HANCHO);
    $ctx.lineTo(p2, HEPTAWIDTH)
    $ctx.lineTo(p1, HEPTAWIDTH)
    $ctx.stroke()
    $ctx.fill();

    //Abajo izquierda
    $ctx.beginPath();
    $ctx.moveTo(p1, HEPTAWIDTH)
    $ctx.lineTo(0, HEPTAWIDTH / 2);
    $ctx.lineTo(HANCHO, HEPTAWIDTH / 2);
    $ctx.lineTo(p4, HEPTAWIDTH - HANCHO);
    $ctx.lineTo(p1, HEPTAWIDTH)
    $ctx.stroke()
    $ctx.fill();

    //Arriba izquierda
    $ctx.beginPath();
    $ctx.moveTo(0, HEPTAWIDTH / 2)
    $ctx.lineTo(HANCHO, HEPTAWIDTH / 2);
    $ctx.lineTo(p4, HANCHO);
    $ctx.lineTo(p1, 0);
    $ctx.lineTo(0, HEPTAWIDTH / 2)
    $ctx.stroke()
    $ctx.fill();

    $ctx.fillStyle = "rgb(0 0 0)";
    $ctx.font = LETTERSIZE + "px Arial";
    var gap = LETTERSIZE / 3
    $ctx.fillText(letras[0].toUpperCase(), HEPTAWIDTH / 2 - gap, HANCHO / 2 + gap);
    $ctx.fillText(letras[1].toUpperCase(), p3 + HANCHO / 2, HEPTAWIDTH / 3 + gap);
    $ctx.fillText(letras[2].toUpperCase(), p3 + HANCHO / 2, HEPTAWIDTH - HEPTAWIDTH / 3 + gap);
    $ctx.fillText(letras[3].toUpperCase(), HEPTAWIDTH / 2 - gap, HEPTAWIDTH - HANCHO / 2 + gap);
    $ctx.fillText(letras[4].toUpperCase(), p1 - HANCHO / 2 + gap, HEPTAWIDTH - HEPTAWIDTH / 3 + gap);
    $ctx.fillText(letras[5].toUpperCase(), p1 - HANCHO / 2 + gap, HEPTAWIDTH / 3 + gap);

    //Letra Central = > Letra principal
    $ctx.fillText(letras[6].toUpperCase(), HEPTAWIDTH / 2 - gap, HEPTAWIDTH / 2 + gap);


    function g2r(grados) {
        return grados * Math.PI / 180
    }
}