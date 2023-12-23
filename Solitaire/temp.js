e = document.getElementById("mazoT")
n = document.createElement("img")
n.setAttribute("src", "Cartas/2_of_clubs.png")
n.setAttribute("draggable", "false")
n.setAttribute("class", "imgResponsive")
n.style.position="absolute"
n.style.top="0px"
n.style.left="0px"
m = document.createElement("img")
m.setAttribute("src", "Cartas/3_of_hearts.png")
m.setAttribute("draggable", "false")
m.setAttribute("class", "imgResponsive")
m.style.position="absolute"
m.style.top="60px"
m.style.left="0px"
l = document.createElement("img")
l.setAttribute("src", "Cartas/4_of_diamonds.png")
l.setAttribute("draggable", "true")
l.setAttribute("class", "imgResponsive")
l.style.position="absolute"
l.style.top="120px"
l.style.left="0px"
e.appendChild(n)
e.appendChild(m)
e.appendChild(l)