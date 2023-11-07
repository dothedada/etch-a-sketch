// llamado de los elementos de la interfase
const acciones = document.querySelectorAll('[name="accion"]')
const aerografo = document.getElementById('aerografo')
const color = document.getElementById('color')
const colorRandom = document.getElementById('colorRandom')
const reticulaVisualizacion = document.getElementById('reticula')
const reticulaForma = document.getElementById('reticulaForma')
const reticulaDensidad = document.getElementById('reticulaDensidad')
const tooltip = document.getElementById('tooltip')
const reticulaDensidadTexto = document.getElementById('reticulaDensidadTexto')
const botonReiniciar = document.getElementById('limpiarTablero')
reticulaDensidadTexto.value = reticulaDensidad.value
// Creación del tablero de dibujo
let tablero
function crearTablero() {
    tablero = document.createElement('div')
    tablero.classList.add('tablero')
    document.body.appendChild(tablero)
    // Calcula cantidad de filas al dividir alto disponible entre columnas posibles
    let pixelesFilas = Math.floor(tablero.clientHeight / (tablero.clientWidth / reticulaDensidad.value))
    if (pixelesFilas > 56) pixelesFilas = 56 // 48-56 límite para evitar problemas de procesamiento
    for(let i = 1; i <= (reticulaDensidad.value * pixelesFilas); i++){
        const pixel = document.createElement('div')
        pixel.style.width = `${(100 / reticulaDensidad.value)}%` 
        pixel.style.aspectRatio = 1
        tablero.appendChild(pixel)
    }
    tablero.style.height = "unset"
}
crearTablero()
// Funciones sobre el tablero
const verReticula = () => {
    for(const pixel of tablero.children) pixel.classList.toggle('reticulaVisible')
}
const cambiarFormaReticula = () => {
    for(const pixel of tablero.children) pixel.classList.toggle('reticulaRedonda')
}
const reiniciarTablero = () => {
    document.body.removeChild(tablero)
    reticulaVisualizacion.checked = false
    reticulaForma.checked = false
    crearTablero()
}
const reiniciarPorCambioDensidad = fuente => {
    reticulaDensidad.value = fuente
    reiniciarTablero()
}


// acciones Botones
reticulaVisualizacion.addEventListener('click', verReticula)
reticulaForma.addEventListener('click', cambiarFormaReticula)
reticulaDensidad.addEventListener('input', () => {
    reticulaDensidadTexto.value = reticulaDensidad.value
})
reticulaDensidad.addEventListener('change', () => {
    reticulaDensidadTexto.value = reticulaDensidad.value
    reiniciarPorCambioDensidad(reticulaDensidad.value)
})
reticulaDensidadTexto.addEventListener('change', () => {
    if(!+reticulaDensidadTexto.value || 
        +reticulaDensidadTexto.value < 1 || 
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
    reiniciarPorCambioDensidad(reticulaDensidad.value)
})
botonReiniciar.addEventListener('click', () => {
    document.body.removeChild(tablero)
    crearTablero()
    reticulaVisualizacion.checked = false
    reticulaForma.checked = false
})
