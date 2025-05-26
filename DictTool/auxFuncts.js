//Funciones Auxiliares

function isLetraValida(letra) {
    if (!acentos) // No se permiten acentos
        return (letra >= 'a' && letra <= 'z' || letra == 'ñ')
    else // acentos permitidos
        return ((letra >= 'a' && letra <= 'z') || isAcentuada(letra) || letra == 'ñ')
}

function isAcentuada(letra) {
    if (letra === 'á' ||
        letra === 'é' ||
        letra === 'í' ||
        letra === 'ó' ||
        letra === 'ú')
        return true
    else
        return false
}

function addAcentuadas(lista) {
    temp = [...lista]
    temp.forEach((x) => {
        switch (x) {
            case "a":
                lista.push("á");
                break;
            case "e":
                lista.push("é");
                break;
            case "i":
                lista.push("í");
                break;
            case "o":
                lista.push("ó");
                break;
            case "u":
                lista.push("ú");
                break;
        }
    })
    return lista;
}

function regexpAcentos(char) {
    ret = ""
    switch (char) {
        case "a":
            ret = "[a,á]";
            break;
        case "e":
            ret = "[e,é]";
            break;
        case "i":
            ret = "[i,í]";
            break;
        case "o":
            ret = "[o,ó]";
            break;
        case "u":
            ret = "[u,ú]";
            break;
        default:
            ret = char;
    }
    return ret
}

function isArrayEmpty(array) {
    return array.every(x => x == '')
}

function simpleArray2String(arr){
    ret = ""
    arr.forEach((x) => ret = ret +x )
    return ret
}

function array2String(arr) {
    var ret = ""
    arr.forEach((x) => {
        if (x == ""){
            ret = ret + "."
        } else {
            if (acentos)
                ret = ret + x
            else
                ret = ret + regexpAcentos(x)
        }
    })
    return ret
}

function string2Array(s) {
    var ret = []
    for (let i = 0; i < s.length; i++)
        ret[i] = s[i]
    return ret
}

function generateRegexpIndef() {
    temp = [...letrasFijas]
    var end = temp.splice(LETRAS_FIJAS_INDEF)
    var start = [...temp]
    var reg_start = new RegExp("^" + array2String(start))
    var reg_end = new RegExp(array2String(end) + "$")
    return [reg_start, reg_end]
}

function generateRegexpFija() {
    var temp = []
    letrasFijas.forEach(x => { if (x === '') { temp.push('.') } else { temp.push(x) } })
    palabra = array2String(temp)
    var exp = ""
    if (!acentos) { //No hay acentos
        for (let i = 0; i < palabra.length; i++) {
            switch (palabra[i]) {
                case 'a':
                    exp = exp + '[a,á]'
                    break
                case 'e':
                    exp = exp + '[e,é]'
                    break
                case 'i':
                    exp = exp + '[i,í]'
                    break
                case 'o':
                    exp = exp + '[o,ó]'
                    break
                case 'u':
                    exp = exp + '[u,ú]'
                    break
                default:
                    exp = exp + palabra[i]
            }
        }
    } else {
        exp = palabra
    }
    return new RegExp(exp)
}