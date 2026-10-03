# Nexus

Editor de mapas conceptuales. Sin build y sin dependencias.

## Qué hace
- Conceptos con título, detalle y color. Enlaces curvos con flecha.
- Pan, zoom, ajuste de vista, organización automática.
- Deshacer/rehacer (100 pasos) y autoguardado en el navegador.
- Mapas a dos lados: cada nodo tiene punto de enlace izquierdo y derecho.
- Guarda/abre JSON y exporta PNG completo (nodos y líneas).

## Uso
    make run        # sirve en http://localhost:8000
    make check      # revisa la sintaxis de js/
    make zip        # empaqueta el proyecto

También sirve abrir `index.html` directo.

## Atajos
| Acción | Cómo |
|---|---|
| Nuevo concepto | doble clic en vacío, o botón |
| Conectar | arrastrar el punto lateral a otro nodo |
| Hijo enlazado | Tab (derecha) o Mayús+Tab (izquierda) |
| Desconectar | doble clic en la línea |
| Color | clic en el punto del título |
| Organizar / Ajustar | L / F |
| Deshacer / Rehacer | Ctrl+Z / Ctrl+Shift+Z |
| Borrar | Supr |

## Estructura (un archivo, una responsabilidad)
    js/state.js    estado, historial, persistencia
    js/camera.js   pan, zoom, ajuste
    js/links.js    enlaces
    js/nodes.js    nodos
    js/layout.js   organización automática
    js/io.js       JSON y PNG
    js/input.js    ratón, táctil, teclado
    js/main.js     arranque y acciones
