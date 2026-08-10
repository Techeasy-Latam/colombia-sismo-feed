'use client'

// Bounding box: x=0..800, y=0..600
// Projected from public/data/venezuela.geojson:
// minLng=-73.366, maxLng=-59.829, minLat=0.688, maxLat=12.178
const VENEZUELA_PATHS = [
  "M700.8 184.4L697.5 185.4L697 180.6L698 179.4L703.7 175.5L705.2 174.8L706.4 175.6L706.1 176.6L708.8 178.3L708.2 180.5L705.2 182.9L700.8 184.4Z",
  "M710.3 171.6L703.9 173.1L704 171.9L705.7 169.7L709.1 169L710.3 168.3L712.5 167.8L713.7 167.9L714.9 168.5L712 169.7L710.3 171.6Z",
  "M474.4 87.6L471.5 88.7L466.2 87.6L463.6 86.1L465.2 84.4L469.6 84.4L473.7 86.5L474.4 87.6Z",
  "M547.6 77L549.4 83.2L548.8 84.3L544 88.5L539.9 88.8L536.6 88.7L534.1 87.9L530.9 85.1L527.8 86L520.1 85L517.9 84.1L520.8 80.7L526.1 79.4L528.1 79.1L529.6 81.1L533.5 82.9L538 83.1L539.2 79.9L545.3 75.3L547.6 77Z",
  "M230 51.1L232.7 56.4L237 60.4L240.3 60.1L242.7 59.5L258.4 58.6L268 61.3L280.2 62.7L291.6 68.5L303.2 75.5L306.2 80.7L307.2 85.6L310 88.9L307.2 92.3L308.7 97.9L312.1 103.6L317.1 107.3L331.6 108.3L347.1 105.8L371.2 105.8L379 101.7L418.8 100.6L426.4 103.4L427.2 106.1L427.2 108.2L440.1 118.4L450.6 119.8L459.5 123.1L468.8 124.9L478.9 127.3L484.6 127L488.8 126.2L493.9 126L529.4 108.9L548.5 109.4L551.4 108.3L554 106.8L546.9 104.2L531.1 103.2L526.3 104.9L523.5 100.5L528.7 100.6L546.3 99.2L566.6 100.1L583.1 97L591.4 96.5L596.1 97.1L609.3 95.1L634 97.5L653.5 95.5L651.2 98.3L644.8 100L634.5 100.6L626.6 104.7L609.7 103.9L597.9 105.4L601.7 106.6L601.7 110.8L603.3 111.7L605 111.7L609.1 114.9L610.2 116.9L611.5 121.2L609.7 125.9L607.2 128L612 127.3L614.7 125.1L614.3 122.9L614.7 120.3L617.4 121.1L619.3 122.3L625.5 134.5L629.8 141L630.9 140.7L631.9 140.5L633.2 139.3L635.1 136.2L636.8 138.2L637.8 138.9L638.8 139.1L637.8 136.4L639.1 132.9L638.7 131.6L640.6 131.4L642.9 131.8L646.1 132.8L651.9 136.8L655.7 141L656.1 143.3L657.5 144.6L660 146L661.2 148.2L661.4 144.8L659.9 142.3L659.6 139.5L667.1 139.4L669.1 135.7L673.2 137.9L684.1 148.1L688.1 149.8L700 151.7L707.5 156.6L711.9 161L709.3 165.6L702.3 167.9L699.5 170.8L697.9 173.6L697.8 176.5L695.7 179.8L695.4 180.9L694.1 185.6L691.3 191.2L687.4 197.1L667.5 197.2L672.4 199.7L676.9 201.5L684.4 206.1L690.3 202.5L698.8 202.2L708 198.1L711.4 197.5L728.6 199.6L732.7 196.6L736.2 195.8L745.4 196.3L753.5 199.5L763.5 211.1L763.6 212.4L762.6 213.8L756.3 216.5L754.9 217.9L752.7 223.1L744.9 225.9L739.5 229.4L735.8 232.5L734 233.8L726.9 234.5L724.6 236.4L721.7 242.3L719.6 244.8L715.8 247.6L715.8 249.4L720.9 255.8L721.9 257.8L720.3 260.9L720.4 263.1L723.1 265.7L726.3 266.3L729.5 265.2L733.4 265.3L735.9 266L737 266.7L737.1 268.7L735.5 272.9L733.2 275.7L723 279.9L718.4 282.3L715.9 284.1L710.3 283.1L707.5 283.2L705.4 284.6L704.1 285.8L700.3 286.1L695.1 286.8L692.9 287.6L691.2 289.7L689.8 292.6L691 296.2L692.6 299.4L692.5 302.3L693.8 310.4L692.2 312.3L688.6 314.4L684.4 318.2L679.7 323.5L680.5 325L691.7 336L703.2 347.3L714.6 358.4L716.2 358.9L718.3 360.2L720.3 364.1L722 368.3L722 370.4L720.7 373.1L718 376.2L714.6 378.7L709.7 380.9L705.8 382.9L702.5 388.2L700.6 390.1L698.8 390.8L695.2 391.5L689.5 391.4L685.7 391L681 394.9L675 396.4L670.9 401.8L656.6 406.1L642.6 409.5L638.8 410.8L624.9 408.1L621.6 408.9L617.8 411.5L614.2 413.5L611.3 413.6L608.7 414.6L607.2 418.3L605.9 431L601 434.8L595 434.8L590.8 430.4L586 427.1L577.4 419.2L575.1 418.2L572.9 418.2L565 420.5L561.2 419.5L558.2 418.3L553.1 418.7L544.1 418.8L538.4 418.9L535.6 416.7L533 412.3L531.3 410.7L529.2 409.5L525.8 408.8L511.3 408.9L508.6 408.9L506.6 408L503.8 404.2L500.7 402.5L497.2 402.4L495.6 404.5L501.8 411.3L503.6 414.9L509 420.3L524.8 431.5L527.7 435.1L527.4 439.7L527.3 446.6L527.8 453.3L531.8 462.7L537.5 472.4L539.1 478.5L538 483.1L536.9 485.5L537 486.6L538.2 487.6L543.6 489L555 489.8L561.9 489.8L572.4 490.9L573.1 494.3L572.1 499.9L570 503.1L568.4 504L562.6 504.7L556.6 508.2L547.9 511.5L542.9 512L540.9 512.7L539.1 513.7L537.6 515L535.9 521.3L533.4 528.5L528.5 532.8L523.2 536.3L517.8 536.7L513.4 536.4L511.3 537.5L508.2 540.4L503.7 544L500.2 545.9L495.6 545.7L490.7 547.5L484.4 550.4L480.3 552.8L476.7 556.9L471.6 561.1L466.4 564.2L463.9 567.9L460.4 572.6L456 572.7L455.6 569.9L457.7 565.3L455.4 561.4L451.2 559.3L449.2 558.7L447.2 559L442.2 560.9L436.1 564.4L432.3 566.9L428.9 568.1L421.8 569.2L415.9 569.7L413.5 569L409 566.4L398.8 558.3L385 547.3L384 544.2L384.6 540.9L382.1 536.2L380.6 531.1L379.4 529.4L379 525.6L376 518.8L373.6 513.3L371.3 510.4L372.3 508L371.3 505.6L369.5 503.7L366.8 497.4L367.8 494.6L367.1 491.9L364.8 490.1L361.6 488.1L357.3 483.9L352.2 479.9L349.6 478.3L347.9 477.7L346.3 473.9L345.1 472.8L342.5 472.5L337.2 470.9L332.2 472.8L332.1 469.8L333.5 468.1L350.7 454.1L359.4 447.7L360.3 446.7L361.1 445.2L361.7 443.2L359.7 441L351.6 430.2L348.8 428.1L346 426.5L342.8 421.9L339 411.4L336.3 406.1L335.5 402L335.6 397.4L334.6 393.9L332.4 391.4L332.4 383.9L334.6 371.3L335.2 361.7L334.1 355.2L336 350.2L341.1 346.8L343.9 341.5L344.5 334.3L347.5 328.5L352.9 323.9L354.8 319.3L353 314.9L352.5 312L347.9 309.1L339.3 307L332.2 306.8L327.9 309.1L317 311.2L299.3 313.1L285.1 313.1L274.3 311.1L266.1 311.8L260.5 315.1L256.5 315.8L254.2 314L251.7 313.5L248 314.7L247.3 314.1L239 305.3L231.2 297.1L222.4 287.3L212.1 276L210.3 275.3L207.1 275.4L202.9 275.6L196.4 274.4L191.9 272.7L188.4 271.2L182 269.2L177.6 268.8L173.7 269.4L162.8 273.3L156.6 273.7L151.8 273.8L138.9 271.8L130.1 271.5L119.9 272.8L115.5 273.5L109.4 271.5L105.2 268.5L101.3 261.2L98.6 255.5L93.8 254.4L88.6 253.4L86 251.5L84.4 248.2L84 244L84.6 237.1L85.1 234.6L85.8 227.2L88.7 223.3L90.5 221.5L90.2 218.4L88.8 212L87.4 207.5L81.5 202.4L74 195.8L70.8 185.3L67 173L64 171.7L61.2 172.3L58.2 171.7L55.5 166.7L52.9 165.8L48.7 167.6L45.7 168.9L37.9 170.2L36.4 168.9L36.9 167.4L40.2 162.8L44 157.1L48.4 151.8L52.6 146.4L55.7 140.7L57.8 129.3L59.2 121.4L63.1 107.3L70.1 96.1L72.7 91L79 84.3L81.9 80.6L85.8 77.8L96.4 73.9L109.1 54.6L112 51.6L124.8 48.7L134.7 46.4L142 44.1L144.4 42.8L146.3 42.3L144.7 44.5L141.2 47.3L137.2 49.1L116.8 53.4L114.7 54.3L112.1 56.1L112.1 60.3L112.6 63.5L118.6 74.2L121 76.8L129 82.5L127.2 83.3L124.2 83.4L126.4 91L131.3 96.2L131.6 99.5L127.8 109.6L120.9 115.7L116 122.7L112.1 125.5L103.7 139.4L110.1 147.7L111 151.9L116.6 157.8L120.2 159.8L122.6 162.2L121.5 166.3L123.7 171.8L126.6 174.7L130.2 175.9L134.7 175.8L147.5 172.2L150.5 170.5L152.5 167.6L158.9 161.6L159.3 153.9L160.7 144.6L159.1 138.6L152.4 130L149.4 123.8L142.7 118.1L138.6 108.4L136.9 105.3L135.7 101.1L134.2 93.7L138.7 91L138.3 84.9L149.3 83.2L173.1 73.3L187.9 70.8L204.7 65.5L208.6 62.9L212 58.5L214.6 58L223.4 62.1L227.7 60.7L229.4 57.5L227 51.3L222 51.3L206.9 53.5L205.4 50.9L205.4 48.5L201.8 41.1L204 35.6L206.3 31L210.7 29.2L217 27.3L221.8 30.3L224.7 33.1L226.3 35.9L227.4 43.5L230 51.1Z"
]

export function MapaVenezuelaSVG() {
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

        {/* 1. Dibujo de la tierra (Venezuela) con sombra y estilo premium */}
        <g 
          filter="url(#glow)"
          className="fill-neutral-200/90 stroke-neutral-400 dark:fill-zinc-800/90 dark:stroke-zinc-700 transition-colors duration-300"
        >
          {VENEZUELA_PATHS.map((path, idx) => (
            <path key={idx} d={path} strokeWidth="1.5" strokeLinejoin="round" />
          ))}
        </g>

        {/* 2. Ciudades de referencia (puntos discretos) */}
        {/* Maracaibo */}
        <circle cx="129.1" cy="100.8" r="3" className="fill-neutral-400 dark:fill-zinc-500" />

        {/* Caracas */}
        <circle cx="383.6" cy="107.9" r="3" className="fill-neutral-400 dark:fill-zinc-500" />

        {/* La Guaira (ciudad afectada - marcado en rojo) */}
        <circle cx="382.0" cy="102.0" r="4.5" fill="#dc2626" />

        {/* 3. Epicentros con ondas de expansión en rojo (animación de anillos pulse mejorada) */}
        {/* Epicentro 1: San Felipe Yaracuy (M7.2) */}
        <g>
          <circle cx="284.6" cy="108.4" r="5" fill="#dc2626" />
          <circle cx="284.6" cy="108.4" r="5" fill="none" stroke="#dc2626" strokeWidth="1.5">
            <animate attributeName="r" values="5;35" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="284.6" cy="108.4" r="5" fill="none" stroke="#dc2626" strokeWidth="1">
            <animate attributeName="r" values="5;60" dur="2.2s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.2s" begin="0.7s" repeatCount="indefinite" />
          </circle>
          <circle cx="284.6" cy="108.4" r="5" fill="none" stroke="#dc2626" strokeWidth="0.8">
            <animate attributeName="r" values="5;85" dur="2.2s" begin="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.2s" begin="1.4s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Epicentro 2: Valencia (M7.5) */}
        <g>
          <circle cx="324.7" cy="122.0" r="5" fill="#dc2626" />
          <circle cx="324.7" cy="122.0" r="5" fill="none" stroke="#dc2626" strokeWidth="1.5">
            <animate attributeName="r" values="5;35" dur="2.2s" begin="0.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.2s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="324.7" cy="122.0" r="5" fill="none" stroke="#dc2626" strokeWidth="1">
            <animate attributeName="r" values="5;60" dur="2.2s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.2s" begin="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="324.7" cy="122.0" r="5" fill="none" stroke="#dc2626" strokeWidth="0.8">
            <animate attributeName="r" values="5;85" dur="2.2s" begin="1.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.2s" begin="1.7s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* 4. Líneas indicadoras de las etiquetas */}
        {/* Línea Terremoto 1 */}
        <path
          d="M 170 55 Q 220 55 277 101"
          fill="none"
          stroke="#dc2626"
          strokeWidth="1.2"
          strokeDasharray="2 2"
          markerEnd="url(#arrow)"
        />

        {/* Línea Terremoto 2 */}
        <path
          d="M 445 160 Q 380 165 331 130"
          fill="none"
          stroke="#dc2626"
          strokeWidth="1.2"
          strokeDasharray="2 2"
          markerEnd="url(#arrow)"
        />

        {/* Línea La Guaira */}
        <path
          d="M 465 72 Q 425 72 389 95"
          fill="none"
          stroke="#dc2626"
          strokeWidth="1"
          strokeDasharray="2 2"
          markerEnd="url(#arrow)"
        />
      </svg>

      {/* 5. Etiquetas HTML Absolutas (Garantizan legibilidad 100% nítida a cualquier escala) */}
      
      {/* Maracaibo */}
      <span className="absolute left-[13%] top-[13%] font-mono text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 pointer-events-none">
        Maracaibo
      </span>

      {/* Caracas */}
      <span className="absolute left-[49%] top-[19%] font-mono text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 pointer-events-none">
        Caracas
      </span>

      {/* Primer Terremoto */}
      <div className="absolute left-[2%] top-[3%] flex flex-col text-left bg-panel/80 dark:bg-panel-dark/80 backdrop-blur-[2px] p-1.5 rounded border border-rule/50 dark:border-rule-dark/50 pointer-events-none">
        <span className="font-mono text-[10px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider leading-none">
          1er Terremoto
        </span>
        <span className="font-sans text-sm font-black text-crisis-red mt-0.5 leading-none">
          7,2 <span className="text-[11px] text-neutral-500 dark:text-zinc-500 font-normal">(Yaracuy)</span>
        </span>
      </div>

      {/* Segundo Terremoto */}
      <div className="absolute left-[52%] top-[27%] flex flex-col text-left bg-panel/80 dark:bg-panel-dark/80 backdrop-blur-[2px] p-1.5 rounded border border-rule/50 dark:border-rule-dark/50 pointer-events-none">
        <span className="font-mono text-[10px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider leading-none">
          2do Terremoto
        </span>
        <span className="font-sans text-sm font-black text-crisis-red mt-0.5 leading-none">
          7,5 <span className="text-[11px] text-neutral-500 dark:text-zinc-500 font-normal">(Carabobo)</span>
        </span>
      </div>

      {/* La Guaira */}
      <div className="absolute left-[59%] top-[7%] flex flex-col text-left pointer-events-none">
        <span className="font-mono text-[11px] font-black text-crisis-red uppercase tracking-wider leading-none">
          La Guaira
        </span>
        <span className="font-mono text-[9px] text-neutral-500 dark:text-zinc-500 mt-0.5 leading-none">
          (más afectada)
        </span>
      </div>
    </div>
  )
}
