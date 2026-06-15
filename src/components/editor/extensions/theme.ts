import { EditorView } from '@codemirror/view';
import { Compartment } from '@codemirror/state';

export const themeCompartment = new Compartment();

export const getEditorTheme = (theme: 'light' | 'dark') => {
  const isDark = theme === 'dark';

  return EditorView.theme(
    {
      '&': {
        background: 'transparent',
        color: 'rgb(var(--color),0.8)',
        height: '100%',
        outline: 'none',
      },
      '.cm-content': {
        caretColor: isDark ? '#fffefe' : '#1e252c',
        fontFamily: '"Inter", sans-serif',
        lineHeight: '1.8',
        padding: '40px 0',
      },
      '.cm-cursor': {
        borderLeftColor: isDark ? '#fffefe' : '#1e252c',
      },
      '.cm-line': {
        padding: '0 2px',
      },
      // Formatos
      '.cm-md-bold': {
        fontWeight: '700',
        color: 'rgb(var(--color))',
      },
      '.cm-md-italic': { fontStyle: 'italic' },
      '.cm-md-strikethrough': {
        textDecoration: 'line-through',
        opacity: '0.5',
      },
      '.cm-md-highlight': {
        backgroundColor: 'rgba(234, 179, 8, 0.6)',
        color: 'rgb(var(--dark),0.75)',
        borderRadius: '3px',
        padding: '2px 6px',
      },
      '.cm-md-code': {
        fontFamily: 'var(--font-mono)',
        backgroundColor: 'rgb(var(--color),0.80)',
        color: isDark ? 'rgb(var(--dark),0.85)' : 'rgb(var(--light),0.8)', // Blue 400
        padding: '3px 6px',
        borderRadius: '4px',
        fontSize: '.875rem',
      },
      // Fórmulas Matemáticas
      '.cm-md-math': {
        fontFamily: 'var(--font-mono)',
        backgroundColor: 'rgba(168, 85, 247, 0.25)',
        color: 'rgb(var(--color),0.85)',
        border: '1px solid rgba(168, 85, 247, 0.45)',
        padding: '2px 6px',
        borderRadius: '4px',
      },
      // Subíndices
      '.cm-md-sub': {
        verticalAlign: 'sub',
        fontSize: '0.75em',
        lineHeight: '0',
        color: 'rgb(var(--color),0.85)', // Un poco más oscuro para contraste
      },
      // Superíndices (Exponentes)
      '.cm-md-super': {
        verticalAlign: 'super',
        fontSize: '0.75em',
        lineHeight: '0',
        color: 'rgb(var(--color),0.85)',
      },
      // Bloque Matemático (modo edición)
      '.cm-md-math-block-edit': {
        display: 'block',
        fontFamily: 'var(--font-mono)',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        borderLeft: '3px solid rgba(59, 130, 246, 0.35)',
        padding: '8px 14px',
        margin: '4px 0',
        borderRadius: '0 4px 4px 0',
      },
      // HEADINGS
      '.cm-md-h1': {
        color: 'rgb(var(--color),0.85)',
        fontSize: '48px',
        fontWeight: '700',
        lineHeight: '1.2',
      },
      '.cm-md-h2': {
        fontSize: '40px',
        fontWeight: '700',
        lineHeight: '1.2',
        color: 'rgb(var(--color),0.80)',
      },
      '.cm-md-h3': {
        fontSize: '36px',
        fontWeight: '700',
        lineHeight: '1.2',
        color: 'rgb(var(--color),0.75)',
      },
      '.cm-md-h4': {
        fontSize: '32px',
        fontWeight: '700',
        lineHeight: '1.2',
        color: 'rgb(var(--color),0.75)',
      },
      '.cm-md-h5': {
        fontSize: '24px',
        fontWeight: '700',
        lineHeight: '1.2',
        color: 'rgb(var(--color),0.7)',
      },
      '.cm-md-h6': {
        fontSize: '20px',
        fontWeight: '700',
        lineHeight: '1.2',
        color: 'rgb(var(--color),0.7)',
      },
      // LISTAS (Indentación) ---
      '.cm-md-list-line': { display: 'flex', alignItems: 'flex-start' },
      '.cm-md-indent-1': { paddingLeft: '4px' },
      '.cm-md-indent-2': { paddingLeft: '28px' },
      '.cm-md-indent-3': { paddingLeft: '52px' },
      '.cm-md-indent-4': { paddingLeft: '76px' },
      '.cm-md-indent-5': { paddingLeft: '100px' },
      '.cm-md-indent-6': { paddingLeft: '124px' },
      '.cm-md-indent-7': { paddingLeft: '148px' },
      '.cm-md-indent-8': { paddingLeft: '172px' },
      // Transformación de viñeta: Ocultamos el "-" y mostramos "•"
      '.cm-md-bullet-hidden': {
        color: 'transparent !important',
        position: 'relative',
      },
      '.cm-md-bullet-hidden::before': {
        content: "'•'",
        color: 'rgb(var(--color),0.85)',
        position: 'absolute',
        left: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        visibility: 'visible',
        fontWeight: 'bold',
        fontSize: '1.2em',
      },
      // --- LISTA NUMERADA (widget computado)
      '.cm-md-list-number': {
        display: 'inline-block',
        marginRight: '6px',
        color: 'rgb(var(--color),0.85)',
        fontVariantNumeric: 'tabular-nums',
      },
      '.cm-md-list-number-1': { fontWeight: '600', fontSize: 'inherit' },
      '.cm-md-list-number-2': { fontWeight: '500', fontSize: '0.93em' },
      '.cm-md-list-number-3': { fontWeight: '400', fontSize: '0.86em' },
      '.cm-md-list-number-4': { fontWeight: '400', fontSize: '0.8em' },
      '.cm-md-list-number-5': { fontWeight: '400', fontSize: '0.75em' },
      '.cm-md-list-number-6': { fontWeight: '400', fontSize: '0.7em' },
      '.cm-md-list-number-7': { fontWeight: '400', fontSize: '0.65em' },
      '.cm-md-list-number-8': { fontWeight: '400', fontSize: '0.6em' },
      // LISTA DE TAREAS
      '.cm-md-task-checked': {
        textDecoration: 'line-through',
        opacity: '0.4',
      },
      '.cm-md-checkbox': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '18px',
        height: '18px',
        marginRight: '8px',
        marginLeft: '6px',
        borderRadius: '4px',
        border: '2px solid #94a3b8', // Un gris más claro (slate-400) para que se vea
        cursor: 'pointer',
        verticalAlign: 'middle',
        transition: 'all 0.2s ease',
        backgroundColor: 'rgba(255,255,255,0.05)', // Un toque de fondo
      },
      ".cm-md-checkbox[data-checked='true']": {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        color: '#ffffff',
      },
      '.cm-md-checkbox:hover': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      },
      // CITAS (líneas continuas — profundidad dinámica)
      '.cm-md-quote-line': {
        position: 'relative',
        display: 'block',
        marginTop: '0 !important',
        marginBottom: '0 !important',
        paddingTop: '2px',
        paddingBottom: '2px',
        backgroundColor: 'rgba(59, 130, 246, 0.03)',
        backgroundImage:
          'repeating-linear-gradient(to right, #3b82f6 0px, #3b82f6 2px, transparent 2px, transparent 16px)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '8px 0',
      },
      ...Object.fromEntries(
        Array.from({ length: 10 }, (_, i) => {
          const d = i + 1;
          const size = d * 16;
          return [
            `.cm-md-quote-depth-${d}`,
            {
              paddingLeft: `${size}px !important`,
              backgroundSize: `${size}px 100%`,
            },
          ];
        }),
      ),
      // BLOQUES DE CÓDIGO (FencedCode)
      '.cm-md-code-block': {
        display: 'block',
        fontFamily: 'var(--font-mono)',
        fontSize: '.875rem',
        lineHeight: '1.25',
        padding: '4px 16px',
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.03)',
        borderLeft: isDark
          ? '1px solid rgba(255, 255, 255, 0.06)'
          : '1px solid rgba(0, 0, 0, 0.08)',
        borderRight: isDark
          ? '1px solid rgba(255, 255, 255, 0.06)'
          : '1px solid rgba(0, 0, 0, 0.08)',
      },
      '.cm-md-code-block-first': {
        borderTop: isDark
          ? '1px solid rgba(255, 255, 255, 0.06)'
          : '1px solid rgba(0, 0, 0, 0.08)',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        paddingTop: '12px',
        marginTop: '12px',
      },
      '.cm-md-code-block-last': {
        borderBottom: isDark
          ? '1px solid rgba(255, 255, 255, 0.06)'
          : '1px solid rgba(0, 0, 0, 0.08)',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
        paddingBottom: '12px',
        marginBottom: '12px',
      },
      '.cm-md-code-info': {
        display: 'inline',
        fontFamily: 'var(--font-sans)',
        fontSize: '10px',
        fontWeight: '600',
        color: '#3b82f6',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        padding: '2px 6px',
        borderRadius: '3px',
        marginLeft: '4px',
      },
      // SYNTAX HIGHLIGHTING (tokens dentro de FencedCode)
      '.cm-keyword': { color: isDark ? '#c678dd' : '#8250df' },
      '.cm-atom': { color: isDark ? '#d19a66' : '#0550ae' },
      '.cm-number': { color: isDark ? '#d19a66' : '#0550ae' },
      '.cm-def': { color: isDark ? '#e5c07b' : '#953800' },
      '.cm-variable': { color: isDark ? '#e06c75' : '#8250df' },
      '.cm-variableName': { color: isDark ? '#e06c75' : '#cf222e' },
      '.cm-property': { color: isDark ? '#98c379' : '#116329' },
      '.cm-propertyName': { color: isDark ? '#98c379' : '#116329' },
      '.cm-operator': { color: isDark ? '#56b6c2' : '#0550ae' },
      '.cm-string': { color: isDark ? '#98c379' : '#0a3069' },
      '.cm-string2': { color: isDark ? '#98c379' : '#0a3069' },
      '.cm-comment': {
        color: isDark ? '#5c6370' : '#6e7781',
        fontStyle: 'italic',
      },
      '.cm-typeName': { color: isDark ? '#e5c07b' : '#953800' },
      '.cm-tagName': { color: isDark ? '#e06c75' : '#cf222e' },
      '.cm-attributeName': { color: isDark ? '#d19a66' : '#0550ae' },
      '.cm-bracket': { color: isDark ? '#abb2bf' : '#1e252c' },
      '.cm-meta': { color: isDark ? '#61afef' : '#0550ae' },
      '.cm-builtin': { color: isDark ? '#56b6c2' : '#8250df' },
      '.cm-qualifier': { color: isDark ? '#e5c07b' : '#953800' },
      // CALLOUTS (Destacados)
      '.cm-md-callout': {
        display: 'block',
        marginTop: '0 !important',
        marginBottom: '0 !important',
        paddingTop: '2px',
        paddingBottom: '2px',
        paddingLeft: '12px',
        paddingRight: '12px',
        backgroundColor: isDark
          ? 'rgba(var(--callout-color-rgb), 0.12)'
          : 'rgba(var(--callout-color-rgb), 0.06)',
        borderLeft: '4px solid rgb(var(--callout-color-rgb))',
        borderRight: '1px solid rgba(var(--callout-color-rgb), 0.12)',
      },
      '.cm-md-callout-first': {
        fontWeight: '700',
        paddingTop: '12px',
        marginTop: '8px',
        borderTop: '1px solid rgba(var(--callout-color-rgb), 0.12)',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
      },
      '.cm-md-callout-last': {
        paddingBottom: '12px',
        marginBottom: '8px',
        borderBottom: '1px solid rgba(var(--callout-color-rgb), 0.12)',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
      },
      ...Object.fromEntries(
        [
          ['note', '59, 130, 246'],
          ['info', '59, 130, 246'],
          ['tip', '34, 197, 94'],
          ['warning', '245, 158, 11'],
          ['question', '139, 92, 246'],
          ['danger', '239, 68, 68'],
          ['failure', '239, 68, 68'],
        ].map(([name, rgb]) => [
          `.cm-md-callout-${name}`,
          { '--callout-color-rgb': rgb },
        ]),
      ),
      ...Object.fromEntries(
        [
          ['note', "'📝'"],
          ['info', "'ℹ️'"],
          ['tip', "'💡'"],
          ['warning', "'⚠️'"],
          ['question', "'❓'"],
          ['danger', "'🛡️'"],
          ['failure', "'❌'"],
        ].map(([name, icon]) => [
          `.cm-md-callout-first.cm-md-callout-${name}::before`,
          {
            content: icon,
            display: 'inline-block',
            marginRight: '8px',
            fontSize: '1.1em',
            verticalAlign: 'middle',
          },
        ]),
      ),

      // Bloque Matemático Renderizado (widget KaTeX)
      '.cm-md-math-block-display': {
        display: 'block',
        textAlign: 'center',
        padding: '24px 16px',
        margin: '4px 0',
        backgroundColor: 'rgba(168, 85, 247, 0.08)',
        border: '1px solid rgba(168, 85, 247, 0.2)',
        borderRadius: '8px',
        overflowX: 'auto',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
      },
      '.cm-md-math-block-display:hover': {
        backgroundColor: 'rgba(168, 85, 247, 0.12)',
        borderColor: 'rgba(168, 85, 247, 0.35)',
      },
      '.cm-md-math-block-display .katex': {
        fontSize: '1.15em',
      },
      // Matemáticas Inline Renderizado (widget KaTeX)
      '.cm-md-math-inline-katex': {
        cursor: 'pointer',
        padding: '0 2px',
        borderRadius: '3px',
        fontSize: '.8125em',
      },
      '.cm-md-math-inline-katex:hover': {
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
      },

      // Regla Horizontal (HR)
      '.cm-md-hr': {
        display: 'inline-block',
        width: '100%',
        height: '0',
        color: 'transparent',
        overflow: 'hidden',
        borderTop: '1px solid rgb(var(--color),0.15)',
        marginTop: '1rem',
        marginBottom: '1rem',
        verticalAlign: 'middle',
      },

      '&.cm-focused .cm-selectionBackground, ::selection': {
        backgroundColor: 'rgba(59, 130, 246, 0.2) !important',
      },
    },
    { dark: isDark },
  );
};


