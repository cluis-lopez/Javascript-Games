const Palos = ['treboles', 'diamantes', 'corazones', 'picas']
const PalosEng = { 'treboles': 'clubs', 'diamantes': 'diamonds', 'corazones': 'hearts', 'picas': 'spades' }
const valuesEng = ['ace_of', '2_of', '3_of', '4_of', '5_of', '6_of', '7_of', '8_of', '9_of', '10_of', 'jack_of', 'queen_of', 'king_of']
var mazoPrincipal = []
var mazoTemporal = []
var indexMazoP
var mazos = [[], [], [], []]
var pilas = [[]]
var minutos = 0
var segundos = 0

class Carta {
    palo
    valor
    file
    color

    constructor(palo, valor) {
        this.palo = palo
        this.valor = valor
        if (this.palo === 'diamantes' || this.palo === 'corazones')
            this.color = "rojo"
        else
            this.color = 'negro'
        this.file = 'cartas/' + valuesEng[valor - 1] + '_' + PalosEng[palo] + '.png'
    }
}

class Baraja {
    baraja = []
    numCartas

    constructor() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 13; j++) {
                let carta = new Carta(Palos[i], j + 1)
                this.baraja.push(carta)
            }
        }
        this.numCartas = this.baraja.length
    }

    barajar() {
        for (let i = this.baraja.length - 1; i > 0; i--) {
            let r = Math.floor(Math.random() * (i - 1))
            let temp = this.baraja[i]
            this.baraja[i] = this.baraja[r]
            this.baraja[r] = temp
        }
    }

    robarCarta() {
        if (this.numCartas > 0) {
            this.numCartas--
            return this.baraja.pop()
        } else {
            return undefined
        }
    }
    push(carta) {
        this.baraja.push(carta)
        this.numCartas++
    }
}

function repartir() {
    for (let i = 0; i < 7; i++) {
        pilas[i] = []
        for (let j = 0; j < i + 1; j++) {
            pilas[i][j] = mazoPrincipal.robarCarta()
        }
    }
}

function mayMoveToPila(numPila, carta) {
    let len = pilas[numPila].length
    if (len == 0 && carta.valor == 13) // Pila vacia y rey
        return true
    else if (len > 0 && pilas[numPila][len - 1].valor == carta.valor - 1 && pilas[numPila][len - 1].color != carta.color)
        return true
    else
        return false
}

function vaciaPila(pila, numCartas) {
    if (pilas[pila].length < numCartas)
        return
    for (let i = 0; i < numCartas; i++) {
        dom_popPila(pila)
        pilas[pila].pop()
    }
}

function moveToMazo(numMazo, carta) {
    if (mayMoveToMazo(numMazo, carta)) {
        mazos[numMazo].push(carta)
        return true
    } else {
        return false
    }

}

function mayMoveToMazo(numMazo, carta) {
    let len = mazos[numMazo].length
    if (len == 0 && carta.valor == 1) //mazo vacío y as
        return true
    else if (len > 0 && mazos[numMazo][len - 1].valor == carta.valor - 1 && mazos[numMazo][len - 1].palo == carta.palo)
        return true
    else
        return false
}

function sacarDelMazo(num = 3) {
    for (let i = 0; i < num; i++) {
        let c = mazoPrincipal.robarCarta()
        if (c != undefined) {
            mazoTemporal.push(c)
        }
    }
}

function mayGoMazo(carta) {
    for (i in mazos) {
        mazo = mazos[i]
        if (mazo.length == 0 && carta.valor == 1) return i
        if (mazo.length == 0) continue
        else if (mazo[mazo.length - 1].palo === carta.palo &&
            mazo[mazo.length - 1].valor === carta.valor - 1) return i
    }
    return undefined
}

function isFinJuego() {
    for (let m in mazos) {
        if (mazos[m].length < 13)
            return false
    }
    return true
}

function newJuego() {
    //dom_limpiaTablero()
    mazoPrincipal = new Baraja()
    mazoPrincipal.barajar()
    repartir()
    dom_dibujaPilas()
    setInterval(dom_contador, 1000)
}

newJuego()
