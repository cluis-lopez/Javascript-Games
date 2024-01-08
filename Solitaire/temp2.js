//Testing 2
function drag(ev) {
    ev.target.classList.add('hide');
    ev.dataTransfer.setData("text", ev.target.id);
    console.log(ev.target.id);
}

function endDrag(e) {
    e.srcElement.classList.remove('hide');
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dropPila(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data));
    console.log("Carta " + ev.dataTransfer.getData("text") + " Target: " + ev.target.id);
}

function dropMazo(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data));
    console.log("Carta " + ev.dataTransfer.getData("text") + " Target: " + ev.target.id);
}

e = document.getElementById("mazoT")
ndiv = document.createElement("div")
ndiv.setAttribute("draggable", "true")
ndiv.setAttribute("ondragstart", "drag(event)")
ndiv.setAttribute("ondragend", "endDrag(event)")
ndiv.setAttribute("id", "CartaSuperior")
n = document.createElement("img")
n.setAttribute("src", "Cartas/2_of_clubs.png")
n.setAttribute("draggable", "false")
n.setAttribute("class", "imgResponsive")
ndiv.style.position = "absolute"
ndiv.style.top = "0px"
ndiv.style.left = "0px"
ndiv.appendChild(n)
e.appendChild(ndiv)

mdiv = document.createElement("div")
mdiv.setAttribute("draggable", "true")
mdiv.setAttribute("ondragstart", "drag(event)")
mdiv.setAttribute("id", "CartaInferior")
m = document.createElement("img")
m.setAttribute("src", "Cartas/3_of_hearts.png")
m.setAttribute("draggable", "false")
m.setAttribute("class", "imgResponsive")
mdiv.style.position = "absolute"
mdiv.style.top = "60px"
mdiv.style.left = "0px"
mdiv.appendChild(m)
ndiv.appendChild(mdiv)

l = document.createElement("img")
l.setAttribute("src", "Cartas/4_of_diamonds.png")
l.setAttribute("draggable", "true")
l.setAttribute("class", "imgResponsive")
l.style.position = "absolute"
l.style.top = "120px"
l.style.left = "0px"
e.appendChild(n)
e.appendChild(m)
e.appendChild(l)