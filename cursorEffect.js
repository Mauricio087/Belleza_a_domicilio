// Efecto de cursor personalizado con partículas doradas - Versión mejorada
(function() {
    'use strict';
    
    // Variables globales
    let mainCursor = null;
    let trailElements = [];
    let mouseX = 0;
    let mouseY = 0;
    let isInitialized = false;
    
    // Función para crear el cursor principal
    function createMainCursor() {
        if (mainCursor) return;
        
        mainCursor = document.createElement('div');
        mainCursor.className = 'main-cursor';
        mainCursor.style.cssText = `
            position: fixed;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: radial-gradient(circle, #FFD700 0%, #FFA500 100%);
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.8), 0 0 25px rgba(255, 215, 0, 0.6);
            pointer-events: none;
            z-index: 998; /* Reducir z-index para no interferir con navbar (1000) */
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease, opacity 0.3s ease;
            opacity: 0;
        `;
        
        document.body.appendChild(mainCursor);
        
        // Mostrar cursor después de un pequeño retraso
        setTimeout(() => {
            if (mainCursor) mainCursor.style.opacity = '1';
        }, 100);
    }
    
    // Función para crear partícula de rastro
    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-trail';
        
        const size = 15 + Math.random() * 10;
        const opacity = 0.6 + Math.random() * 0.4;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x - size/2}px;
            top: ${y - size/2}px;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 215, 0, ${opacity}) 0%, rgba(255, 165, 0, ${opacity * 0.7}) 50%, transparent 70%);
            box-shadow: 0 0 10px rgba(255, 215, 0, ${opacity * 0.8});
            pointer-events: none;
            z-index: 997; /* Reducir z-index para no interferir con navbar (1000) */
            animation: trailFade 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        // Remover partícula después de la animación
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 800);
    }
    
    // Función para actualizar la posición del cursor
    function updateCursorPosition(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (mainCursor) {
            mainCursor.style.left = mouseX + 'px';
            mainCursor.style.top = mouseY + 'px';
        }
    }
    
    // Función para manejar el movimiento del mouse
    let trailCounter = 0;
    function handleMouseMove(e) {
        updateCursorPosition(e);
        
        // Crear rastro cada 3 píxeles de movimiento
        trailCounter++;
        if (trailCounter % 3 === 0) {
            createTrailParticle(e.clientX, e.clientY);
        }
    }
    
    // Función para manejar el click
    function handleMouseDown() {
        if (mainCursor) {
            mainCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            
            // Crear partículas adicionales al hacer click
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const offsetX = (Math.random() - 0.5) * 30;
                    const offsetY = (Math.random() - 0.5) * 30;
                    createTrailParticle(mouseX + offsetX, mouseY + offsetY);
                }, i * 50);
            }
        }
    }
    
    // Función para manejar el fin del click
    function handleMouseUp() {
        if (mainCursor) {
            mainCursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }
    
    // Función para ocultar el cursor cuando sale de la ventana
    function handleMouseLeave() {
        if (mainCursor) {
            mainCursor.style.opacity = '0';
        }
    }
    
    // Función para mostrar el cursor cuando entra a la ventana
    function handleMouseEnter() {
        if (mainCursor) {
            mainCursor.style.opacity = '1';
        }
    }
    
    // Función para agregar estilos CSS necesarios
    function addCursorStyles() {
        if (document.getElementById('cursor-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'cursor-styles';
        style.textContent = `
            .main-cursor {
                display: block !important;
                position: fixed !important;
                z-index: 998 !important; /* Debajo del navbar (1000) */
                pointer-events: none !important;
            }
            
            .cursor-trail {
                display: block !important;
                position: fixed !important;
                z-index: 997 !important; /* Debajo del navbar (1000) */
                pointer-events: none !important;
            }
            
            @keyframes trailFade {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(0.3);
                    opacity: 0;
                }
            }
            
            /* Aplicar cursor personalizado solo a elementos específicos, no globalmente */
            body {
                cursor: none;
            }
            
            /* Excepto para elementos interactivos y el navbar */
            a, button, input, textarea, select, [role="button"], .navbar, .nav-container, .nav-toggle {
                cursor: pointer !important;
            }
            
            /* Ocultar cursor personalizado en dispositivos táctiles y móviles */
            @media (pointer: coarse), (max-width: 768px) {
                .main-cursor,
                .cursor-trail {
                    display: none !important;
                }
                
                body {
                    cursor: auto !important;
                }
                
                * {
                    cursor: auto !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Función principal para inicializar el efecto
    function initCursorEffect() {
        if (isInitialized) return;
        
        // Verificar si es un dispositivo táctil
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
            console.log('Dispositivo táctil detectado: cursor personalizado deshabilitado');
            return;
        }
        
        console.log('Iniciando efecto de cursor personalizado...');
        
        // Agregar estilos CSS
        addCursorStyles();
        
        // Crear cursor principal
        createMainCursor();
        
        // Agregar event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        
        isInitialized = true;
        console.log('Efecto de cursor personalizado iniciado exitosamente');
    }
    
    // Inicializar cuando el DOM esté listo
    function tryInit() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCursorEffect);
        } else {
            // DOM ya está listo
            initCursorEffect();
        }
    }
    
    // Intentar inicialización inmediata y con retraso
    tryInit();
    
    // Re-inicializar si es necesario (para SPA o cambios dinámicos)
    window.addEventListener('load', () => {
        if (!isInitialized) {
            console.log('Re-intentando inicialización con window.load...');
            setTimeout(initCursorEffect, 500);
        }
    });
    
    // Fallback adicional
    setTimeout(() => {
        if (!isInitialized) {
            console.log('Fallback: intentando inicialización forzada...');
            initCursorEffect();
        }
    }, 2000);
    
    // Exportar para uso externo
    window.initCursorEffect = initCursorEffect;
    
    // Inicialización más conservadora - solo si es realmente necesario
    console.log('CursorEffect.js cargado - esperando condiciones óptimas...');
    
    // Intentar inicialización solo en desktop y con delay prudente
    if (!window.matchMedia || !window.matchMedia('(pointer: coarse)').matches) {
        setTimeout(() => initCursorEffect(), 1500); // Solo un intento, con delay mayor
    }
    
})();