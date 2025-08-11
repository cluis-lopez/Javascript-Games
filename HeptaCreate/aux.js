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

function ultimosElementos(lista, numero) {//Devuelve los últimos x elementos de la lista (si los hay)
    var ret = []
    var index = lista.length - 1
    while (lista[index] != undefined) {
        ret.push(lista[index])
        index--
        if (ret.length > numero)
            break
    }
    return ret

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

function listadoPalabras(datos) {
    text = "<table class='table table-striped'>"

    for (var i of datos) {
        if (i[1][1] == 0) {
            continue //No hay palabras que comiencen por esta letra
        }

        var temp = []
        i[1][3].forEach((x) => {
            if (Heptas.includes(x))
                temp.push("<b style='color: blue;'>" + x + "</b>")
            else
                temp.push(x)
        })

        text = text + "<tr><td class='text-start'>Palabras que empiezan con <b>" + i[0].toUpperCase() +
            "</b> " + i[1][0] + "/" + i[1][1] + ": </td><td>"
        temp.forEach((x) => text = text + x + ", ")
        text = text + "</td></tr>"
    }

    $palabras.innerHTML = text + "</table>"
}

function dibujaHepta(letras) {
    $ctx.resetTransform()
    $ctx.clearRect(0, 0, $canvas.width, $canvas.height)
    $ctx.translate(10, 10)
    var gap = LETTERSIZE / 3

    var p1 = HEPTAWIDTH / 2 * Math.sin(g2r(30))
    var p2 = HEPTAWIDTH - p1
    var p3 = p2 - HANCHO * Math.sin(g2r(30))
    var p4 = p1 + HANCHO * Math.sin(g2r(30))

    const zonas = {
        "Arriba": [[[p1, 0], [p2, 0], [p3, HANCHO], [p4, HANCHO], [p1, 0]],
        [letras[0], HEPTAWIDTH / 2 - gap, HANCHO / 2 + gap]],

        "ArribaDerecha": [[[p2, 0], [HEPTAWIDTH, HEPTAWIDTH / 2], [HEPTAWIDTH - HANCHO, HEPTAWIDTH / 2],
        [p3, HANCHO], [p2, 0]],
        [letras[1], p3 + HANCHO / 2, HEPTAWIDTH / 3 + gap]],

        "AbajoDerecha": [[[HEPTAWIDTH, HEPTAWIDTH / 2], [p2, HEPTAWIDTH], [p3, HEPTAWIDTH - HANCHO],
        [HEPTAWIDTH - HANCHO, HEPTAWIDTH / 2], [HEPTAWIDTH, HEPTAWIDTH / 2]],
        [letras[2], p3 + HANCHO / 2, HEPTAWIDTH - HEPTAWIDTH / 3 + gap]],

        "Abajo": [[[p1, HEPTAWIDTH], [p4, HEPTAWIDTH - HANCHO], [p3, HEPTAWIDTH - HANCHO],
        [p2, HEPTAWIDTH], [p1, HEPTAWIDTH]],
        [letras[3], HEPTAWIDTH / 2 - gap, HEPTAWIDTH - HANCHO / 2 + gap]],

        "AbajoIzquierda": [[[p1, HEPTAWIDTH], [0, HEPTAWIDTH / 2], [HANCHO, HEPTAWIDTH / 2],
        [p4, HEPTAWIDTH - HANCHO], [p1, HEPTAWIDTH]],
        [letras[4], p1 - HANCHO / 2 + gap, HEPTAWIDTH - HEPTAWIDTH / 3 + gap]],

        "ArribaIzquierda": [[[0, HEPTAWIDTH / 2], [HANCHO, HEPTAWIDTH / 2],
        [p4, HANCHO], [p1, 0], [0, HEPTAWIDTH / 2]],
        [letras[5], p1 - HANCHO / 2 + gap, HEPTAWIDTH / 3 + gap]],

        "Centro": [[[p4, HANCHO], [p3, HANCHO], [HEPTAWIDTH - HANCHO, HEPTAWIDTH / 2],
        [p3, HEPTAWIDTH - HANCHO], [p4, HEPTAWIDTH - HANCHO], [HANCHO, HEPTAWIDTH / 2], [p4, HANCHO]],
        [letras[6], HEPTAWIDTH / 2 - gap, HEPTAWIDTH / 2 + gap]]
    }

    $ctx.lineWidth = 5
    $ctx.font = LETTERSIZE + "px Arial";

    for (var i in zonas) {
        var temp = new Path2D()
        for (var j in zonas[i][0]) {
            temp.lineTo(zonas[i][0][j][0], zonas[i][0][j][1])
        }
        $ctx.stroke(temp)
        if (i == "Centro")
            $ctx.fillStyle = "white"
        else
            $ctx.fillStyle = "rgb(200 200 200)";
        $ctx.fill(temp)
        $ctx.fillStyle = "rgb(0 0 0)"
        $ctx.fillText(zonas[i][1][0].toUpperCase(), zonas[i][1][1], zonas[i][1][2])
        PATHS[i] = [temp, zonas[i][1][0].toUpperCase(), zonas[i][1][1], zonas[i][1][2]]
    }

    function g2r(grados) {
        return grados * Math.PI / 180
    }
}

function nuevaLineaResultados(juego) {
    var ret = document.createElement("tr")
    //Fecha
    var cell = document.createElement("td")
    var temp = new Date(juego["Fecha"])
    cell.innerHTML = temp.getDate() + "-" + MESES[temp.getMonth()] + "-" + temp.getFullYear()
    ret.appendChild(cell)
    //Tiempo
    cell = document.createElement("td")
    cell.innerHTML = juego["Tiempo"]
    ret.appendChild(cell)
    //Letras
    cell = document.createElement("td")
    cell.innerHTML = "<b>" + juego["LetraObligatoria"].toUpperCase() + "</b>" + array2str(juego["LetrasOpcionales"]).toUpperCase()
    ret.appendChild(cell)
    //Encontradas
    cell = document.createElement("td")
    var desc = juego["PalabrasDescubiertas"]
    var tot = juego["PalabrasTotales"]
    cell.innerHTML = desc + "/" + tot + "  "
    cell.setAttribute("data-bs-toggle", "popover")
    cell.setAttribute("data-bs-content", juego["PalabrasEncontradas"])
    cell.setAttribute("data-bs-trigger", "hover")
    ret.appendChild(cell)
    cell = document.createElement("td")
    cell.innerHTML = (juego["percentPalabras"] * 100).toFixed() + "%"
    ret.appendChild(cell)
    //Heptas
    cell = document.createElement("td")
    desc = juego["HeptasDescubiertos"]
    tot = juego["HeptasTotales"]
    cell.innerHTML = desc + "/" + tot + "  "
    if (tot > 0) {
        var temp = []
        var letras = [juego["LetraObligatoria"]].concat(juego["LetrasOpcionales"])
        for (i of juego["PalabrasEncontradas"]) {
            if (esHeptaPalabra(i, letras))
                temp.push(i)
        }
        cell.setAttribute("data-bs-toggle", "popover")
        cell.setAttribute("data-bs-content", temp)
        cell.setAttribute("data-bs-trigger", "hover")
    }
    ret.appendChild(cell)
    cell = document.createElement("td")
    cell.innerHTML = (juego["percentHeptas"] * 100).toFixed() + "%"
    ret.appendChild(cell)

    return ret
}