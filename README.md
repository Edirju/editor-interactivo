# Nebula Editor ✦

**Un editor Markdown interactivo con vista previa en vivo.**  
Escribí, formateá y mirá el resultado al instante — sin cambiar de pestaña.

![Astro](https://img.shields.io/badge/Astro-6.4-FF5D01?logo=astro&logoColor=fff)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=fff)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=fff)
![CodeMirror](https://img.shields.io/badge/CodeMirror-6-D30707?logo=codemirror&logoColor=fff)
![KaTeX](https://img.shields.io/badge/KaTeX-0.17-008080?logo=katex&logoColor=fff)

---

## ✨ Features

- **Live Preview** — todo lo que escribís se renderiza al instante dentro del mismo editor. Headings, lists, code blocks, tables, math, callouts, footnotes… todo aparece como va a quedar.
- **Toolbar completa** — formato (bold, italic, strikethrough, highlight, code, math), párrafos, tablas, bloques de código con selector de lenguaje, footnotes.
- **Context menu** — clic derecho con acceso rápido a clipboard, formato e inserción.
- **Tema claro/oscuro** — detecta tu preferencia del sistema, y podés cambiarlo manualmente. Se guarda en localStorage.
- **Autoguardado** — cada 500ms se guarda lo que escribís en IndexedDB. Si cerrás sin querer, no perdés nada.
- **Internacionalización** — interfaz en español e inglés. Seleccionable al toque.
- **Mobile friendly** — la toolbar se adapta con un drawer deslizable para pantallas chicas.
- **Contador de palabras** — en la barra de estado, junto al nombre del archivo y la posición del cursor.

---

## 🧰 Tech Stack

| Capa          | Tecnología                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------- |
| Framework     | [Astro](https://astro.build) + [React](https://react.dev) islands                                  |
| Editor        | [CodeMirror 6](https://codemirror.net) con [Lezer](https://lezer.codemirror.net) parser             |
| Estilos       | [Tailwind CSS](https://tailwindcss.com) v4 + CSS custom properties                                  |
| Estado        | [Nanostores](https://github.com/nanostores/nanostores)                                              |
| Animación     | [Framer Motion](https://www.framer.com/motion/)                                                     |
| Componentes   | [Headless UI](https://headlessui.com) (Dialog, Menu, Transition)                                    |
| Math          | [KaTeX](https://katex.org)                                                                          |
| Iconos        | [Remixicon](https://remixicon.com)                                                                  |
| Persistencia  | [idb-keyval](https://github.com/jakearchibald/idb-keyval) (IndexedDB)                               |
| Tooling       | ESLint + Prettier + TypeScript strict                                                               |
| Paquetería    | pnpm                                                                                                |

---

## 🚀 Comenzando

```bash
pnpm install
pnpm dev
```

El servidor de desarrollo arranca en `http://localhost:4321`. Los cambios en caliente se reflejan al instante.

### Scripts

| Comando                | Acción                                        |
| ---------------------- | --------------------------------------------- |
| `pnpm dev`             | Inicia servidor de desarrollo                 |
| `pnpm build`           | Compila el sitio para producción en `dist/`   |
| `pnpm preview`         | Previsualiza la build localmente              |
| `pnpm lint`            | Ejecuta ESLint sobre `src/`                   |
| `pnpm format`          | Formatea el código con Prettier               |
| `pnpm check`           | Type-checking con `astro check`               |

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── editor/                # El corazón del editor
│   │   ├── EditorContainer    # Layout principal (toolbar + editor + statusbar)
│   │   ├── EditorIsland       # Contenedor de CodeMirror + autosave
│   │   ├── Toolbar            # Toolbar desktop + menú mobile
│   │   ├── Statusbar          # Info en vivo (línea, columna, palabras)
│   │   ├── extensions/        # Extensiones de CodeMirror 6
│   │   │   └── live-preview/  # Motor de preview en vivo
│   │   │       ├── headings, lists, quotes, code, tables
│   │   │       ├── math, footnotes, callouts, formatting
│   │   │       └── horizontal-rule
│   │   └── hooks/
│   │       └── useCodeMirror   # Hook que orquesta la instancia de CodeMirror
│   ├── ui/                    # Componentes reutilizables
│       ├── ContextMenu        # Menú contextual con clic derecho
│       ├── MenuDropdown       # Dropdowns de la toolbar
│       └── MobileDrawer       # Drawer responsive para mobile
├── i18n/                      # Traducciones (español / inglés)
├── store/                     # Estados globales con Nanostores
├── services/
│   └── persistence.ts         # Servicio de autoguardado en IndexedDB
├── layouts/
│   └── RootLayout.astro       # Layout raíz (meta, tema, global CSS)
├── pages/
│   └── index.astro            # Página única — la app completa
└── styles/
    └── global.css             # Tailwind + variables de tema
```

---

## ⚙️ Cómo funciona el Live Preview

En lugar del clásico "escribís a la izquierda, ves el resultado a la derecha", Nebula Editor renderiza todo **dentro del mismo editor**. El truco está en una extensión personalizada de CodeMirror 6 que:

1. Escucha **cada cambio** en el documento.
2. Parsea el Markdown con el parser **Lezer** y construye un árbol sintáctico.
3. Recorre el árbol y aplica **decoraciones CSS** a cada nodo: los headings se agrandan, las listas sangran, los bloques de código obtienen fondo oscuro, el math se transforma con KaTeX, etc.
4. El resultado se ve al instante, sin cambiar de vista, sin iframes, sin demoras.

Cada elemento del Markdown tiene su propio "procesador" (un archivo dentro de `live-preview/`) que sabe exactamente cómo decorar ese tipo de nodo. Esto hace que sea fácil agregar nuevos formatos o modificar los existentes.

---

## 🧪 Roadmap (ideas)

- [ ] Exportar a HTML / PDF
- [ ] Múltiples documentos con pestañas
- [ ] Atajos de teclado configurables
- [ ] Drag & drop de imágenes
- [ ] Colaboración en tiempo real (CRDTs)
- [ ] Plugins / extensiones de terceros

---

## 📄 Licencia

MIT — podés usar, copiar, modificar y distribuir este proyecto libremente.
