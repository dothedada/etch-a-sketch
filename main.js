// llamado de los elementos de la interfase
const acciones = document.querySelectorAll('[name="accion"]')
const aerografo = document.getElementById('aerografo')
const aerografoFlujo = document.getElementById('aerografoFlujo')
const aerografoFlujoTexto = document.getElementById('aerografoFlujoTexto')
const color = document.getElementById('color')
const colorRandom = document.getElementById('colorRandom')
const reticulaVisualizacion = document.getElementById('reticula')
const reticulaForma = document.getElementById('reticulaForma')
const reticulaDensidad = document.getElementById('reticulaDensidad')
const tooltip = document.getElementById('tooltip')
const reticulaDensidadTexto = document.getElementById('reticulaDensidadTexto')
const botonReiniciar = document.getElementById('limpiarTablero')

// Creación del tablero de dibujo
const tablero = document.createElement('div')
tablero.classList.add('tablero')
document.body.appendChild(tablero)

// Seteo inicial de valores
let dibujar = false
reticulaDensidadTexto.value = reticulaDensidad.value
aerografoFlujoTexto.textContent = `${Math.round(aerografoFlujo.value * 100)}%`

// Creación del comportamiento del color
// Creación de la mezcla de color
const mezclarColor = (colorPincel, colorFondo = '#f2efe6', valorMezcla = 0.25) => {
    // Toma la cadena con el Hex del color, quita el primer caracte
    // crea un array de acuerdo al Regex que la corta cada dos caracteres [R, G, B]
    // pasa ese valor hexadecimal a un número decimal
    const color1 = colorPincel.substring(1).match(/\w\w/g).map(valor => parseInt(valor, 16))
    const color2 = colorFondo.slice(4, -1).split(', ').map(valor => Number(valor))
    // Se suman los valores de cada canal en relación a la mezcla y se convierten a Hex
    // para luego agregarlos a la cadena
    let colorFinal = '#'
    for(let i = 0; i < 3; i++) {
        colorFinal += Math.round(color2[i] + (color1[i] - color2[i]) * valorMezcla).toString(16).padStart(2, '0')
    }
    return colorFinal
}
// 'Carga' el color al pincel
const crearColor = (pixelDestino) => { // Crea el color que se le va a asignar al pixel
    const random = `#${Math.floor(Math.random()*16777215).toString(16)}` //Dibujar -Aplica color random
    if(acciones[0].checked && aerografo.checked) {
        if(!colorRandom.checked) return mezclarColor(color.value, pixelDestino, aerografoFlujo.value) //Dibujar -Aplica color del picker
        color.value = random
        return mezclarColor(random, pixelDestino, aerografoFlujo.value)
    }
    if(acciones[0].checked) {
        if(!colorRandom.checked) return color.value //Dibujar -Aplica color del picker
        color.value = random
        return random
    }
    if(acciones[1].checked && aerografo.checked) return mezclarColor('#f2efe6', pixelDestino, aerografoFlujo.value) 
    if(acciones[1].checked) return '#f2efe6' // Borrar -Aplica color del fondo
}

// Creación de los pixeles del tablero
const crearPixeles = () => {
    tablero.style.height = '100%'
    // Calcula cantidad de filas al dividir alto disponible entre columnas posibles
    let pixelesFilas = Math.floor(tablero.clientHeight / (tablero.clientWidth / reticulaDensidad.value))
    if (pixelesFilas > 56) pixelesFilas = 56 // 48-56 límite para evitar problemas de procesamiento
    for(let i = 1; i <= (reticulaDensidad.value * pixelesFilas); i++){
        const pixel = document.createElement('div')
        pixel.style.width = `${(100 / reticulaDensidad.value)}%` 
        pixel.style.aspectRatio = 1
        pixel.style.background = '#f2efe6'
        pixel.addEventListener('mouseenter', evento => {
            evento.stopPropagation()
            if(dibujar) pixel.style.background = crearColor(evento.target.style.background)
        })
        tablero.appendChild(pixel)
    }
    tablero.style.height = 'unset'
}
// Funciones que trabajan sobre la configuración del tablero
const verReticula = () => tablero.classList.toggle('reticulaVisible')
const cambiarFormaReticula = () => tablero.classList.toggle('reticulaRedonda')
const borrarTablero = () => {
    for(const pixel of tablero.children) pixel.style.background = '#f2efe6'
}
const redibujarTablero = fuente => {
    reticulaDensidad.value = fuente
    reticulaVisualizacion.checked = false
    reticulaForma.checked = false
    tablero.textContent = '' // No sé si sea la solución más elegante
    // La siguente solución creo que formalmente es más clara pero es un bucle que consume recursos
    // while(tablero.lastElementChild) tablero.removeChild(tablero.lastElementChild)
    crearPixeles()
}
crearPixeles()
// activacion del dibujo
tablero.addEventListener('mousedown', evento => {
    evento.preventDefault()
    evento.target.style.background = crearColor(evento.target.style.background)
    dibujar = true
})
tablero.addEventListener('mouseup', () => { 
    dibujar = false
})

// Asignación de la funcionalidad de la interfase
window.addEventListener('resize', redibujarTablero)
reticulaVisualizacion.addEventListener('click', verReticula)
reticulaForma.addEventListener('click', cambiarFormaReticula)
reticulaDensidad.addEventListener('input', () => {
    reticulaDensidadTexto.value = reticulaDensidad.value
})
aerografoFlujo.addEventListener('input', () => {
    aerografoFlujoTexto.textContent = `${Math.round(aerografoFlujo.value * 100)}%`
})
reticulaDensidad.addEventListener('change', () => {
    reticulaDensidadTexto.value = reticulaDensidad.value
    redibujarTablero(reticulaDensidad.value)
})
reticulaDensidadTexto.addEventListener('change', () => {
    if(!+reticulaDensidadTexto.value || 
        +reticulaDensidadTexto.value < 4 || 
        +reticulaDensidadTexto.value > 64) {
        reticulaDensidadTexto.value = reticulaDensidad.value
        tooltip.classList.add('tooltip-visible')
        setTimeout(() => {
            tooltip.classList.remove('tooltip-visible')
        }, 3000)
        return
    }
    reticulaDensidadTexto.blur()
    reticulaDensidad.value = reticulaDensidadTexto.value
    redibujarTablero(reticulaDensidad.value)
})
botonReiniciar.addEventListener('click', borrarTablero)

// Asignación de teclado
window.addEventListener('keydown', evento => {
    switch (evento.code){
        case 'KeyB':
            acciones[0].checked = true
            document.addEventListener('mouseover', evento => {
                evento.target.style.background = crearColor(evento.target.style.background)
            }, {once: true})
            break
        case 'KeyE':
            acciones[1].checked = true
            document.addEventListener('mouseover', evento => {
                evento.target.style.background = crearColor(evento.target.style.background)
            }, {once: true})
            break
        case 'KeyR':
            colorRandom.checked = colorRandom.checked ? false : true
            break
        case 'KeyG':
            reticulaVisualizacion.checked = reticulaVisualizacion.checked ? false : true
            verReticula()
            break
        case 'KeyS':
            reticulaForma.checked = reticulaForma.checked ? false : true
            cambiarFormaReticula()
            break
        case 'KeyF':
            aerografo.checked = aerografo.checked ? false : true
            break
    }
})
