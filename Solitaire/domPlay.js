//DOM Elements
const $mazoP = document.getElementById("mazoP")
const $pilas = []
const $mazos = []
const $mazoT = document.getElementById("mazoT")
const $counter = document.getElementById('counter')
const $newGame = document.getElementById('newgame')
var isPaused = false

//Initialize DOM elements
for (let i = 0; i < 7; i++) {
    $pilas[i] = document.getElementById("pila" + i)
}

for (let i = 0; i < 4; i++) {
    $mazos[i] = document.getElementById("mazo" + i)
}

//Actualiza contador
function dom_contador() {
    if (isPaused) return
    segundos++
    if (segundos == 60) {
        segundos = 0
        minutos++
    }
    $counter.innerHTML = '<b>' + minutos.toString().padStart(2, '0') + ':' + segundos.toString().padStart(2, '0') + '</b>'
}

//Drag&Drop functions
function dragPila(ev) {
    ev.target.classList.add('hide');
    let data = ""
    let tgt = (ev.target.id).split(':')
    let src = (ev.srcElement.id).split(':')
    let size = pilas[parseInt(tgt[1])].length - parseInt(tgt[2])
    if (tgt[0] === "PosPila" || tgt[0] === "CartaPila") {
        data = JSON.stringify({ "size": size, "carta": pilas[tgt[1]][tgt[2]], "fromPila": src[1] })
        console.log("Tpo: " + tgt[0] + "Data: " + data)
    }
    ev.dataTransfer.setData("text/plain", data);
}

function dragMazoT(ev) {
    ev.target.classList.add('hide');
    let carta = mazoTemporal[mazoTemporal.length - 1] //La última carta del mazo
    let data = JSON.stringify({ "size": 1, "carta": mazoTemporal[mazoTemporal.length - 1], "fromPila": 11 })
    ev.dataTransfer.setData("text/plain", data)
    console.log("Dragging from MazoT: " + data)
}

function dragMazos(ev, mazo) {
    ev.target.classList.add('hide');
    let carta = mazos[mazo][mazos[mazo].length - 1] //La ultima carta del mazo
    let data = JSON.stringify({ "size:": 1, "carta": carta, "fromPila": mazo + 7 })
    ev.dataTransfer.setData("text/plain", data)
    console.log("Dragging from Mazos: " + data)
}

function endDrag(e) {
    e.srcElement.classList.remove('hide');
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dropPila(ev, pila) {
    ev.preventDefault();
    var data = JSON.parse(ev.dataTransfer.getData("text/plain"));
    let lDestino = pilas[pila].length
    //let mainTest = pilas[pila][lDestino - 1].valor - 1 == data.carta.valor && pilas[pila][lDestino - 1].color != data.carta.color
    if (data.fromPila == 11 &&
        ((lDestino == 0 && data.carta.valor == 13) ||
            pilas[pila][lDestino - 1].valor - 1 == data.carta.valor && pilas[pila][lDestino - 1].color != data.carta.color)) { //Viene desde el mazo Temporal
        carta = mazoTemporal.pop()
        dom_anadeAPila(pila, carta)
        pilas[pila].push(carta)
        dom_sacaMazoTemporal()
        return
    } else if ((data.fromPila > 6 && data.fromPila < 11) &&
        (pilas[pila][lDestino - 1].valor - 1 == data.carta.valor && pilas[pila][lDestino - 1].color != data.carta.color)) {
        carta = mazos[data.fromPila - 7].pop()
        dom_anadeAPila(pila, carta)
        pilas[pila].push(carta)
        dom_sacaDeMazo(data.fromPila - 7)
    } else if ((lDestino == 0 && data.carta.valor == 13) ||
        pilas[pila][lDestino - 1].valor - 1 == data.carta.valor && pilas[pila][lDestino - 1].color != data.carta.color) { //.. O la ultima carta de la pila destino es del mismo palo y el valor inmediatamente superior

        let lOrigen = pilas[data.fromPila].length
        temp = pilas[data.fromPila].slice(lOrigen - data.size, lOrigen)

        for (let i = 0; i < data.size; i++) {
            dom_anadeAPila(pila, temp[i])
            pilas[pila].push(temp[i])
            dom_popPila(data.fromPila)
        }
        //Tranfer cartas from pilas Origen to destino. Orderly
        pilas[data.fromPila] = pilas[data.fromPila].slice(0, lOrigen - data.size)
        dom_muestraUltimaCartaPila(data.fromPila)
        return
    }
    return false
}

function dropMazo(ev, mazo) {
    ev.preventDefault();
    var data = JSON.parse(ev.dataTransfer.getData("text"));
    if (data.size > 1)
        return false
    if (moveToMazo(mazo, data.carta)) {
        d = document.getElementById("mazo" + mazo)
        i = document.createElement("img")
        i.setAttribute("class", "imgResponsive")
        i.setAttribute("draggable", "false")
        i.style.position = "absolute"
        i.style.top = "0px"
        i.style.left = "0px"
        i.setAttribute("src", data.carta.file)
        if (data.carta.valor != 1 && data.carta.valor < 13) {//Mazo completo o solo As no se pueden mover
            i.setAttribute("draggable", "true")
            d.setAttribute("ondragstart", "dragMazos(event, " + mazo + ")")
            d.setAttribute("ondragend", "endDrag(event)")
        }
        d.appendChild(i)
        if (data.fromPila == 11) {//Dragging from Mazo Temporal
            dom_sacaMazoTemporal()
            mazoTemporal.pop()
        } else { //Dragging from una de las pilas
            vaciaPila(data.fromPila, 1)
            dom_muestraUltimaCartaPila(data.fromPila)
        }
        if (!isFinJuego()) return
        else {
            isPaused = true
            window.alert("CONSEGUIDO !!!!")
        }
    }
    return false
}

//Inital drawings
function dom_limpiaTablero() {
    for (let i in $pilas) {
        while ($pilas[i].firstChild) {
            $pilas[i].removeChild($pilas[i].lastChild)
        }
    }

    for (let i in $mazos) {
        while ($mazos[i].firstChild) {
            $mazos[i].removeChild($mazos[i].lastChild)
        }
    }

    while ($mazoT.firstChild) {
        $mazoT.removeChild($mazoT.lastChild)
    }
    dom_vaciaMazoP()
    dom_reiniciaMazoP()
}


function dom_dibujaPilas() {
    pilas.forEach((e, idx1) => {
        p = $pilas[idx1]
        e.forEach((c, idx2) => {
            d = document.createElement("div")
            d.setAttribute("id", "PosPila:" + idx1 + ":" + idx2)
            d.setAttribute("draggable", "false")
            d.style.position = "absolute"
            d.style.left = "0px"
            d.style.top = "30px"
            if (idx2 == 0) { //El primer elemento de la pila
                p.appendChild(d)
            } else {
                dtop.appendChild(d)
            }
            i = document.createElement("img")
            i.setAttribute("src", "cartas/back.png")
            i.setAttribute("draggable", "false")
            i.setAttribute("class", "imgResponsive")
            i.setAttribute("id", "CartaPila:" + idx1 + ":" + idx2)
            d.appendChild(i)
            dtop = d
        })
    });
    //Ahora dejamos al descubierto la ultima carta y la hacemos draggable
    $pilas.forEach((e, idx) => {
        dom_muestraUltimaCartaPila(idx)
    })
}

//Mazos solución

function dom_sacaDeMazo(mazo) {
    $mazos[mazo].removeChild($mazos[mazo].lastChild)
}

//Pilas

function dom_pilaVacia(pila) {
    p = $pilas[pila]
    d = document.createElement("div")
    d.setAttribute("id", "PosPila:" + pila + ":0")
    d.setAttribute("class", "pila")
    d.setAttribute("draggable", "false")
    d.style.position = "absolute"
    d.style.left = "0px"
    d.style.top = "30px"
    d.style.height = "145px"
    d.setAttribute("ondrop", "dropPila(event, " + pila + ")")
    d.setAttribute("ondragover", "allowDrop(event)")
    p.appendChild(d)
}

function dom_muestraUltimaCartaPila(pila) {
    x = pilas[pila].length - 1
    if (x == -1) {
        dom_pilaVacia(pila) //TODO: Pinta un cuadrado vacío
        return
    }
    d = document.getElementById("PosPila:" + pila + ":" + x) //El último <div> de cada pila
    i = d.childNodes[0] //Solo debería de haber un "hijo" en cada div y es de tipo img
    d.setAttribute("draggable", "true")
    d.setAttribute("ondragstart", "dragPila(event)")
    d.setAttribute("ondragend", "endDrag(event)")
    d.setAttribute("ondrop", "dropPila(event, " + pila + ")")
    d.setAttribute("ondragover", "allowDrop(event)")
    d.setAttribute("ondblclick", "mueveAMazo(pilas[" + pila + "][pilas[" + pila + "].length - 1], " + pila + ")")
    i.setAttribute("src", pilas[pila][x].file)
}

function dom_anadeAPila(pila, carta) {
    l = pilas[pila].length - 1
    if (l == -1) { //Pila vacia
        pd = $pilas[pila]
        let divs = pd.getElementsByTagName("div")
        divs[divs.length - 1].parentElement.removeChild(divs[divs.length - 1]) //Remove the first div
    } else {
        pd = document.getElementById("PosPila:" + pila + ":" + l) //El ultimo <div> de la pila
    }
    d = document.createElement("div")
    d.setAttribute("id", "PosPila:" + pila + ":" + (l + 1))
    d.setAttribute("draggable", "true")
    d.setAttribute("ondragstart", "dragPila(event)")
    d.setAttribute("ondragend", "endDrag(event)")
    d.setAttribute("ondrop", "dropPila(event, " + pila + ")")
    d.setAttribute("ondragover", "allowDrop(event)")
    d.style.position = "absolute"
    d.style.left = "0px"
    d.style.top = "30px"
    i = document.createElement("img")
    i.setAttribute("class", "imgResponsive")
    i.setAttribute("draggable", "false")
    i.setAttribute("ondblclick", "mueveAMazo(pilas[" + pila + "][pilas[" + pila + "].length - 1], " + pila + ")")
    i.setAttribute("id", "CartaPila:" + pila + ":" + (l + 1))
    i.setAttribute("src", carta.file)
    d.appendChild(i)
    pd.setAttribute("ondrop", "return false;") // To avoid dropping in the previous "last" element
    pd.setAttribute("ondblclick", "") //Remove prevoius double click if any
    pd.appendChild(d)
}

function dom_popPila(pila) {
    let divs = $pilas[pila].getElementsByTagName("div")
    divs[divs.length - 1].parentElement.removeChild(divs[divs.length - 1])
}

//Mazo Principal

function dom_reiniciaMazoP() {
    $mazoP.removeChild($mazoP.firstChild)
    i = document.createElement("img")
    i.setAttribute("src", "cartas/back.png")
    i.setAttribute("class", "imgResponsive")
    i.setAttribute("draggable", "false")
    $mazoP.appendChild(i)
    //Vacia Mazo Temporal
    while ($mazoT.firstChild) {
        $mazoT.removeChild($mazoT.lastChild)
    }
}

//Mazo Temporal

function dom_drawMazoTemporal() {
    //Borra el mazo temporal
    while ($mazoT.firstChild) {
        $mazoT.removeChild($mazoT.lastChild)
    }
    //Ahora pinta las tres últimas cartas del mazo temporal (si las hay)
    let count = mazoTemporal.length >= 3 ? 3 : mazoTemporal.length
    for (let i = 0; i < count; i++) {
        n = document.createElement("img")
        n.setAttribute("src", mazoTemporal[mazoTemporal.length - count + i].file)
        n.setAttribute("draggable", "false")
        n.setAttribute("class", "imgResponsive")
        n.setAttribute("id", "CartaMazoT:")
        n.style.position = "absolute"
        n.style.left = "0px"
        n.style.top = (30 * i) + "px"
        $mazoT.appendChild(n)
    }
    //Hace draggable la ultima carta
    n.setAttribute("draggable", "true")
    n.setAttribute("ondragstart", "dragMazoT(event)")
    n.setAttribute("ondragend", "endDrag(event)")
    //Añade evento doble click a la última carta
    n.setAttribute("ondblclick", "mueveAMazo(mazoTemporal[mazoTemporal.length-1], 11)")
}

function dom_sacaMazoTemporal() {
    $mazoT.removeChild($mazoT.lastChild)
    lastCarta = $mazoT.lastChild
    if (lastCarta != undefined) {
        lastCarta.setAttribute("draggable", "true")
        lastCarta.setAttribute("ondragstart", "dragMazoT(event)")
        lastCarta.setAttribute("ondragend", "endDrag(event)")
        lastCarta.setAttribute("ondblclick", "mueveAMazo(mazoTemporal[mazoTemporal.length-1], 11)")
    }
}

//Click Events

function mueveAMazo(carta, from) {
    let m = mayGoMazo(carta)
    if (m === undefined) return
    if (from == 11) {
        dom_sacaMazoTemporal()
        mazoTemporal.pop()
    } else { //Viene de una de las pilas
        vaciaPila(from, 1)
        dom_muestraUltimaCartaPila(from)
    }
    d = $mazos[m]
    i = document.createElement("img")
    i.setAttribute("class", "imgResponsive")
    i.setAttribute("draggable", "false")
    i.style.position = "absolute"
    i.style.top = "0px"
    i.style.left = "0px"
    i.setAttribute("src", carta.file)
    if (carta.valor != 1 && carta.valor < 13) {//Mazo completo o solo As no se pueden mover
        i.setAttribute("draggable", "true")
        d.setAttribute("ondragstart", "dragMazos(event, " + m + ")")
        d.setAttribute("ondragend", "endDrag(event)")
    }
    d.appendChild(i)
    mazos[m].push(carta)
    
    if (isFinJuego()) {
        isPaused = true
        window.alert("CONSEGUIDO !!!!")
    }
}

$mazoP.addEventListener("click", function () {
    if (mazoPrincipal.numCartas > 0) {
        sacarDelMazo()
        dom_drawMazoTemporal()
    } else {
        dom_reiniciaMazoP()
        let l = mazoTemporal.length
        for (let i = 0; i < l; i++) {
            mazoPrincipal.push(mazoTemporal.pop(i))
        }
    }
})

$newGame.addEventListener("click", function () {
    //newJuego()
})