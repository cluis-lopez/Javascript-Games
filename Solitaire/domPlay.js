//DOM Elements
const $mazoP = document.getElementById("mazoP")
const $pilas = []
const $mazos = []
const $mazoT = document.getElementById("mazoT")

//Initialize DOM elements
for (let i = 0; i < 7; i++) {
    $pilas[i] = document.getElementById("pila" + i)
}

for (let i = 0; i < 4; i++) {
    $mazos[i] = document.getElementById("mazo" + i)
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
    let data = JSON.stringify({ "size": 1, "carta": mazoTemporal[mazoTemporal.length - 1], "fromPila": 10 })
    ev.dataTransfer.setData("text/plain", data)
    console.log("Dragging from MazoT: " + data)
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
    if (data.fromPila == 10 &&
         ((lDestino == 0 && data.carta.valor == 13) ||
         pilas[pila][lDestino - 1].valor - 1 == data.carta.valor && pilas[pila][lDestino - 1].color != data.carta.color)) { //Viene desde el mazo Temporal
        carta = mazoTemporal.pop()
        dom_anadeAPila(pila, carta)
        pilas[pila].push(carta)
        dom_sacaMazoTemporal()
        return
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
        d.appendChild(i)
        if (data.fromPila == 10) {//Dragging from Mazo Temporal
            dom_sacaMazoTemporal()
            mazoTemporal.pop()
        } else { //Dragging from una de las pilas
            vaciaPila(data.fromPila, 1)
            dom_muestraUltimaCartaPila(data.fromPila)
        }
        if (! isFinJuego()) return
        else window.alert("CONSEGUIDO !!!!")
    }
    return false
}

//Inital drawings
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
            i.setAttribute("src", "Cartas/back.png")
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
    i.setAttribute("id", "CartaPila:" + pila + ":" + (l + 1))
    i.setAttribute("src", carta.file)
    d.appendChild(i)
    pd.setAttribute("ondrop", "return false;") // To avoid dropping in the previous "last" element
    pd.appendChild(d)
}

function dom_popPila(pila) {
    let divs = $pilas[pila].getElementsByTagName("div")
    divs[divs.length - 1].parentElement.removeChild(divs[divs.length - 1])
}

//Mazo Principal
function dom_vaciaMazoP() {
    $mazoP.removeChild($mazoP.firstElementChild)
}

function dom_reiniciaMazoP() {
    i = document.createElement("img")
    i.setAttribute("src", "Cartas/back.png")
    i.setAttribute("class", "imgResponsive")
    i.setAttribute("draggable", "false")
    $mazoP.appendChild(i)
    //Vacia Mazo Temporal
    while ($mazoT.firstChild) {
        $mazoT.removeChild($mazoT.lastChild)
    }
}

//Mazo Temporal

function dom_drawMazoTemporal(cartas) {
    let l = cartas.length //l may be 0, 1 or 2
    //Borra las cartas actuales antes de pintar las nuevas
    let nodes = $mazoT.childNodes
    for(let i=nodes.length; i>l; i--) {
        $mazoT.removeChild($mazoT.lastChild)
    }

    for (let i = l-1; i >= 0 ; i--) {
        n = document.createElement("img")
        n.setAttribute("src", cartas[i].file)
        n.setAttribute("draggable", "false")
        n.setAttribute("class", "imgResponsive")
        n.setAttribute("id", "CartaMazoT:")
        n.style.position = "absolute"
        n.style.left = "0px"
        n.style.top = (30 * i) + "px"
        //$mazoT.appendChild(n)
        modes = $mazoT.childNodes
        if (nodes.length > 0){ //Quedan cartas colgadas en el mazo temporal
            $mazoT.insertBefore(n, nodes[nodes.length-1])
        } else {
            $mazoT.appendChild(n)
        }
    }
    //Hace draggable la ultima carta
    n.setAttribute("draggable", "true")
    n.setAttribute("ondragstart", "dragMazoT(event)")
    n.setAttribute("ondragend", "endDrag(event)")
}

function dom_sacaMazoTemporal() {
    $mazoT.removeChild($mazoT.lastChild)
    lastCarta = $mazoT.lastChild
    if (lastCarta != undefined) {
        lastCarta.setAttribute("draggable", "true")
        lastCarta.setAttribute("ondragstart", "dragMazoT(event)")
        lastCarta.setAttribute("ondragend", "endDrag(event)")
    }
}

//Click Events

$mazoP.addEventListener("click", function () {
    if (mazoPrincipal.numCartas > 0) {
        dom_drawMazoTemporal(sacarDelMazo())
        if (mazoPrincipal.numCartas == 0) {
            dom_vaciaMazoP()
        }
    } else {
        dom_reiniciaMazoP()
        let l = mazoTemporal.length
        for (let i = 0; i < l; i++) {
            mazoPrincipal.push(mazoTemporal.pop(i))
        }
    }
})