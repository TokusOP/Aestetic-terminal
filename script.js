document.addEventListener('DOMContentLoaded', () => {
    // Elementos principales
    const textContainer = document.getElementById('textContainer');
    const controls = document.getElementById('controls');
    const toggleButton = document.getElementById('toggleControlsButton');
    const creditsModal = document.getElementById('creditsModal');
    const openCreditsButton = document.getElementById('openCreditsButton');
    const closeCreditsButton = document.getElementById('closeCreditsButton');
    const copyButton = document.getElementById('copyTextButton');
    const pasteButton = document.getElementById('pasteTextButton');

    // Elementos de control
    const inputTextElement = document.getElementById('inputText');
    const textColorElement = document.getElementById('textColor');
    const bgColorElement = document.getElementById('bgColor');
    const fontSelectElement = document.getElementById('fontSelect');
    const effectSelectElement = document.getElementById('effectSelect');
    const crtGlowColorElement = document.getElementById('crtGlowColor');
    const crtGlowLabelElement = document.getElementById('crtGlowLabel');
    const lineBaseClass = 'text-line';

    /**
     * Calcula la repetición del texto para llenar la pantalla.
     */
    function repeatTextToFillScreen() {
        const textToRepeat = inputTextElement.value;
        // Restamos 40px de la altura de la barra superior
        const screenHeight = window.innerHeight - 40; 

        // 1. Crear una línea de prueba para medir su altura
        const tempLine = document.createElement('div');
        tempLine.className = lineBaseClass;
        tempLine.textContent = textToRepeat;
        tempLine.style.visibility = 'hidden';
        tempLine.style.position = 'absolute';
        tempLine.style.fontFamily = fontSelectElement.value;
        textContainer.appendChild(tempLine);

        const lineHeight = tempLine.clientHeight; 
        textContainer.removeChild(tempLine);

        if (lineHeight === 0) {
            return;
        }

        // 2. Calcular cuántas líneas caben
        const linesCount = Math.ceil(screenHeight / lineHeight) + 2; 

        // 3. Generar y actualizar el contenido
        let newContent = '';
        for (let i = 0; i < linesCount; i++) {
            newContent += `<div class="${lineBaseClass}">${textToRepeat}</div>`;
        }
        textContainer.innerHTML = newContent;
        
        applyStyles();
    }

    /**
     * Aplica todos los estilos personalizados (color, fuente y efectos).
     */
function applyStyles() {
    const lines = document.querySelectorAll(`.${lineBaseClass}`);
    const newColor = textColorElement.value;
    const newFont = fontSelectElement.value;
    const newEffect = effectSelectElement.value;
    const crtGlowColor = crtGlowColorElement.value;

    // Limpieza de estilos de body
    document.body.classList.remove('effect-crt', 'effect-vhs');
    document.body.style.backgroundColor = bgColorElement.value;
    document.body.style.fontFamily = newFont;

    // Mostrar/Ocultar el control de color CRT
    const isCrtActive = newEffect === 'crt';
    const isVhsActive = newEffect === 'vhs';
    crtGlowColorElement.classList.toggle('hidden', !isCrtActive);
    crtGlowLabelElement.classList.toggle('hidden', !isCrtActive);

    // Aplicar estilos y efectos a cada línea de texto
    lines.forEach(line => {
        line.style.color = newColor;
        line.style.fontFamily = newFont;
        
        // Limpiar TODAS las clases y sombras/filtros antes de aplicar el nuevo efecto
        line.classList.remove('effect-bloom', 'effect-crt', 'effect-vhs');
        line.style.textShadow = 'none'; 
        line.style.filter = 'none';
        
        // Remover pseudo-elementos si existen
        line.removeAttribute('data-text');
        
        if (newEffect === 'bloom') {
            line.classList.add('effect-bloom');
            line.style.textShadow = `
                0 0 5px ${newColor}, 
                0 0 10px ${newColor}, 
                0 0 15px ${newColor}
            `;
            
        } else if (newEffect === 'crt') {
            line.classList.add('effect-crt');
            document.body.classList.add('effect-crt');
            line.style.textShadow = `0 0 4px ${crtGlowColor}, 0 0 8px ${crtGlowColor}`;
            
} else if (newEffect === 'vhs') {
    line.classList.add('effect-vhs');
    document.body.classList.add('effect-vhs');
    // Guardar el texto para los pseudo-elementos
    line.setAttribute('data-text', line.textContent);
    // Color base blanco para mejor aberración
    line.style.color = '#ffffff';
    // Un poco de distorsión sutil
    line.style.filter = 'blur(0.2px)';
}
    });
}
    // --- Funciones de Interfaz y Botones ---

    function toggleControls() {
        controls.classList.toggle('hidden');
    }

    function toggleCreditsModal(show) {
        creditsModal.classList.toggle('hidden', !show);
    }
    
    // Función de Copiar
    function copyText() {
        const textToCopy = inputTextElement.value;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert("Texto copiado: " + textToCopy);
        }).catch(err => {
            console.error('Error al copiar: ', err);
            alert("Error: No se pudo copiar el texto.");
        });
    }

    // Función de Pegar
    async function pasteText() {
        try {
            if (!navigator.clipboard || !navigator.clipboard.readText) {
                alert("Error: Tu navegador no soporta la función Pegar desde el portapapeles.");
                return;
            }
            
            const text = await navigator.clipboard.readText();
            inputTextElement.value = text;
            repeatTextToFillScreen();
            alert("Texto pegado: " + text);
        } catch (err) {
            console.error('Error al pegar: ', err);
            alert("Error: No se pudo acceder al portapapeles para pegar.");
        }
    }

    // --- Escuchadores de Eventos ---

    // Interfaz
    toggleButton.addEventListener('click', toggleControls);
    openCreditsButton.addEventListener('click', () => toggleCreditsModal(true));
    closeCreditsButton.addEventListener('click', () => toggleCreditsModal(false));
    copyButton.addEventListener('click', copyText);
    pasteButton.addEventListener('click', pasteText);

    // Controles de Contenido y Estilo
    inputTextElement.addEventListener('input', repeatTextToFillScreen);
    textColorElement.addEventListener('input', applyStyles);
    bgColorElement.addEventListener('input', applyStyles);
    
    effectSelectElement.addEventListener('change', applyStyles);
    crtGlowColorElement.addEventListener('input', applyStyles); 

    // La fuente necesita re-calcular la repetición
    fontSelectElement.addEventListener('change', repeatTextToFillScreen); 

    // Re-calcula al redimensionar la ventana
    window.addEventListener('resize', repeatTextToFillScreen);

    // Inicializar el display
    repeatTextToFillScreen();
});