'use client'

// Bounding box: x=0..800, y=0..600
// Projected from public/data/colombia.geojson (simplified admin-0 boundary):
// minLng=-78.991, maxLng=-66.876, minLat=-4.298, maxLat=12.437
const COLOMBIA_PATH =
  "M255.0 431.2L229.6 423.8L200.4 413.5L183.5 418.5L133.1 414.2L118.6 400.8L107.5 401.3L48.1 383.5L40.0 373.9L62.2 371.6L59.5 356.0L73.5 344.7L103.0 342.7L128.0 323.1L150.7 306.8L128.8 299.4L140.0 281.4L126.6 253.0L139.4 244.8L130.0 218.5L105.9 202.0L113.5 186.9L132.7 189.1L143.9 179.9L130.1 161.6L137.3 157.0L168.0 158.0L212.6 136.3L237.1 133.0L237.7 122.8L248.6 96.5L282.7 82.1L320.2 81.5L324.9 75.0L371.4 77.6L418.2 61.9L441.3 55.0L470.1 40.0L491.2 41.9L506.8 50.1L495.2 60.5L457.0 65.7L442.0 81.3L419.0 90.2L401.7 101.7L394.4 123.9L377.9 142.1L408.6 144.2L416.2 158.4L429.3 165.3L434.0 177.8L427.0 189.3L429.1 195.8L443.7 198.4L457.9 209.2L534.3 206.2L568.8 210.2L610.6 236.9L634.7 233.6L677.5 235.3L711.3 231.7L732.4 237.1L721.7 253.8L708.4 264.2L703.7 286.5L715.7 307.1L732.6 316.4L734.6 323.3L704.5 338.8L726.1 345.7L741.9 356.5L760.0 387.5L748.8 391.3L737.2 373.0L720.7 363.1L701.0 373.9L585.2 373.2L586.0 392.6L620.8 395.8L618.8 407.7L606.9 404.5L573.4 409.6L573.1 432.2L599.5 443.5L608.8 461.3L607.4 474.8L580.7 560.0L550.9 543.5L533.2 542.7L571.5 511.1L526.0 496.6L490.3 499.2L468.9 493.9L436.1 502.1L391.9 498.2L356.9 465.6L329.3 457.6L310.4 442.9L270.9 428.2L255.0 431.2Z"

export function MapaColombiaSVG() {
  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden bg-transparent">
      {/* El mapa SVG principal */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sombra suave para darle volumen al mapa (efecto premium flotante) */}
          <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.3" />
          </filter>

          {/* Marcador de flecha roja y minimalista */}
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 2 L 8 5 L 0 8 z" fill="#dc2626" />
          </marker>
        </defs>

        {/* 1. Dibujo de la tierra (Colombia) con sombra y estilo premium */}
        <g
          filter="url(#glow)"
          className="fill-neutral-200/90 stroke-neutral-400 dark:fill-zinc-800/90 dark:stroke-zinc-700 transition-colors duration-300"
        >
          <path d={COLOMBIA_PATH} strokeWidth="1.5" strokeLinejoin="round" />
        </g>

        {/* 2. Ciudades de referencia (puntos discretos) */}
        {/* Bogotá */}
        <circle cx="332.3" cy="280.1" r="3" className="fill-neutral-400 dark:fill-zinc-500" />

        {/* Medellín */}
        <circle cx="243.7" cy="232.4" r="3" className="fill-neutral-400 dark:fill-zinc-500" />

        {/* Quibdó (capital de Chocó) */}
        <circle cx="178.5" cy="249.5" r="3" className="fill-neutral-400 dark:fill-zinc-500" />

        {/* 3. Epicentro con ondas de expansión en rojo (animación de anillos pulse) */}
        {/* Epicentro: San José del Palmar, Chocó (M7.4) */}
        <g>
          <circle cx="203.8" cy="274.4" r="5" fill="#dc2626" />
          <circle cx="203.8" cy="274.4" r="5" fill="none" stroke="#dc2626" strokeWidth="1.5">
            <animate attributeName="r" values="5;35" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="203.8" cy="274.4" r="5" fill="none" stroke="#dc2626" strokeWidth="1">
            <animate attributeName="r" values="5;60" dur="2.2s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.2s" begin="0.7s" repeatCount="indefinite" />
          </circle>
          <circle cx="203.8" cy="274.4" r="5" fill="none" stroke="#dc2626" strokeWidth="0.8">
            <animate attributeName="r" values="5;85" dur="2.2s" begin="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.2s" begin="1.4s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* 4. Líneas indicadoras de las etiquetas */}
        {/* Línea Epicentro */}
        <path
          d="M 70 55 Q 140 130 200 270"
          fill="none"
          stroke="#dc2626"
          strokeWidth="1.2"
          strokeDasharray="2 2"
          markerEnd="url(#arrow)"
        />
      </svg>

      {/* 5. Etiquetas HTML Absolutas (Garantizan legibilidad 100% nítida a cualquier escala) */}

      {/* Bogotá */}
      <span className="absolute left-[41%] top-[47%] font-mono text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 pointer-events-none">
        Bogotá
      </span>

      {/* Medellín */}
      <span className="absolute left-[27%] top-[38%] font-mono text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 pointer-events-none">
        Medellín
      </span>

      {/* Quibdó */}
      <span className="absolute left-[19%] top-[41%] font-mono text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 pointer-events-none">
        Quibdó
      </span>

      {/* Epicentro */}
      <div className="absolute left-[2%] top-[3%] flex flex-col text-left bg-panel/80 dark:bg-panel-dark/80 backdrop-blur-[2px] p-1.5 rounded border border-rule/50 dark:border-rule-dark/50 pointer-events-none">
        <span className="font-mono text-[10px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider leading-none">
          Epicentro
        </span>
        <span className="font-sans text-sm font-black text-crisis-red mt-0.5 leading-none">
          7,4 <span className="text-[11px] text-neutral-500 dark:text-zinc-500 font-normal">(San José del Palmar, Chocó)</span>
        </span>
      </div>
    </div>
  )
}
