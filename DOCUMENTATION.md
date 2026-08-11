# Documentación de cambios — adaptación a Colombia (sismo Chocó, 10 ago 2026)

Adapté el feed de emergencias, originalmente construido para el sismo de Venezuela del 24 de junio de 2026, al sismo de magnitud 7.4 ocurrido el 10 de agosto de 2026 con epicentro en San José del Palmar, Chocó, Colombia. Documento acá cada cambio de backend (ingesta, fact-checking, configuración geográfica) y las decisiones no obvias que tomé en el proceso.

## Investigación previa

Antes de tocar código, verifiqué con `curl` y una búsqueda web que las fuentes y datos que iba a hardcodear existieran de verdad, en vez de inventar URLs o cifras:

- Confirmé que el sismo es un evento real y en curso (cobertura de El Tiempo, Infobae, El Colombiano, etc., fechada el mismo 10 de agosto de 2026), con epicentro en **San José del Palmar, Chocó** — lo geocodifiqué con Nominatim/OSM (4.895°N, -76.235°O) para ubicar el marcador del mapa con coordenadas reales, no aproximadas a ojo.
- Los departamentos con mayor afectación reportada son **Chocó, Risaralda, Valle del Cauca y Caldas**, con apoyo humanitario desde Antioquia y Bogotá — así prioricé la lista de zonas en el fact-checker.
- Las cifras de víctimas varían fuertemente entre fuentes y momentos (un reporte hablaba de ~111 muertos, otro de 9 muertos y +90 heridos, horas después). Por eso decidí **no hardcodear ningún número de víctimas** en el fallback de la UI ni en el contexto del fact-checker — dejo esos campos en `null`/`'—'` y confío enteramente en la extracción en vivo que ya hacía el pipeline (`cifra_muertos`, `cifra_heridos`, `cifra_desaparecidos`), que es justamente el mecanismo correcto para un evento con cifras que cambian por hora.
- Verifiqué con `curl` cuáles RSS de medios colombianos responden de verdad antes de agregarlos a `FUENTES`, en vez de copiar URLs por intuición.

## Backend

### `src/app/api/ingest/route.ts`
Cambié la validación de `ingestUSGS` de `!lugar.toLowerCase().includes('venezuela')` a `!lugar.toLowerCase().includes('colombia')`, que es el filtro que decide qué sismos del feed GeoJSON de USGS entran a la base de datos. También renombré el `User-Agent` del bot de scraping de `VzlaSismoFeedBot` a `ColSismoFeedBot` ya que sigue siendo el mismo bot pero para este proyecto.

### `src/lib/sources.ts`
Reconstruí `FUENTES` completa:
- Mantuve las agencias internacionales genéricas que ya funcionaban (Reuters, AP, BBC Mundo, DW Español, Al Jazeera) y cambié `The Guardian Venezuela` por `The Guardian Colombia` (verifiqué que `theguardian.com/world/colombia/rss` responde 200).
- Agregué El Tiempo y Revista Semana, que sí exponen RSS nativo funcional (`eltiempo.com/rss/colombia.xml`, `semana.com/arc/outboundfeeds/rss`).
- Para los medios y agencias oficiales que pediste (Noticias Caracol, El Espectador, El Colombiano, RCN Radio, Blu Radio, Servicio Geológico Colombiano, UNGRD) descubrí que **ninguno expone un RSS propio funcional** (probé rutas típicas: `/rss.xml`, `/feed`, `/feed/`, todas devolvieron 404 o HTML). En vez de inventar una URL rota, los conecté vía el proxy RSS público de Google Noticias filtrado por dominio (`news.google.com/rss/search?q=site:dominio.com...`), que sí devuelve XML válido y verificado — es una técnica estándar para medios sin feed propio, no una fuente inventada.
- Eliminé las entradas específicas de Venezuela (La Patilla, El Nacional, Efecto Cocuyo, Runrún, Caraota Digital, Tal Cual, El Universal Venezuela, Infobae Venezuela) y los medios chilenos que no tenían relación con el evento (BioBioChile, Cooperativa), y también `VOA Noticias`, que ya tenía una URL rota en el código original (`/api/zrqotit$`).
- `KEYWORDS_REQUERIDOS`: reemplacé los estados venezolanos por los 32 departamentos de Colombia + Bogotá, además de `chocó`, `quibdó`, `san josé del palmar`, `pereira`, `cartago` (ciudades clave del evento real).
- `CIUDAD_A_ESTADO` / `detectarZonaPorCiudad`: reconstruí el mapa de ciudades colombianas → departamento (Quibdó, San José del Palmar, Pereira, Cali, Medellín, Bogotá, etc.) que sirve de respaldo determinístico cuando el LLM no logra inferir la zona.

### `src/lib/factchecker.ts`
Reescribí el `SYSTEM_PROMPT` completo:
- Contexto actualizado al sismo M7.4 de San José del Palmar, Chocó, del 10 de agosto de 2026 (antes: doble sismo M7.2/M7.5 en Venezuela del 24 de junio).
- La lista de zonas que la IA debe extraer ahora son los 32 departamentos de Colombia + Bogotá D.C. (antes, los estados venezolanos), con prioridad para Chocó, Risaralda, Valle del Cauca, Caldas, Antioquia y Bogotá — los departamentos con cobertura real confirmada.
- Quité el rango de cifras fijo del contexto original (`~920 muertos...`) porque, como señalé arriba, las cifras de este evento están cambiando entre reportes; dejé la instrucción de extracción de cifras (`cifra_muertos`, etc.) intacta en su lógica, solo ajustada al criterio de "balance nacional" colombiano (UNGRD) en vez del venezolano.

### `src/app/api/feed/route.ts`
Actualicé `ZONAS_VALIDAS` (el whitelist que valida el parámetro `?zona=` del endpoint) a los 32 departamentos colombianos + Bogotá.

## Datos geográficos

- Descargué `public/data/colombia.geojson`, el contorno real de Colombia (dataset público Natural Earth vía `johan/world.geo.json` en GitHub), para reemplazar `public/data/venezuela.geojson` que usa el mapa Leaflet (`MapaSwitcher.tsx`) como overlay del país.
- Reemplacé `src/components/MapaVenezuelaSVG.tsx` por `src/components/MapaColombiaSVG.tsx`: generé el path SVG simplificado proyectando las coordenadas reales del geojson descargado a un viewBox de 800×600 (no lo dibujé a mano), y ubiqué el marcador de epicentro en las coordenadas reales de San José del Palmar que geocodifiqué.
- `src/components/LeafletMap.tsx`: cambié el centro inicial del mapa de `[10.48, -66.90]` (Venezuela/La Guaira) a `[4.57, -74.29]` (centro de Colombia).

## Corrección de seguridad no solicitada explícitamente: números de emergencia

Al revisar el repo más allá de los archivos que mencionaste, encontré que `src/components/NumerosEmergencia.tsx` mostraba números de emergencia **reales de Venezuela** (Movistar/CANTV/Digitel/Movilnet, Protección Civil y Bomberos de Caracas/La Guaira, FUNVISIS, apps `VENApp`/`sismo2026.gob.ve`). Decidí corregir esto aunque no estaba en tu lista de archivos, porque dejar números de emergencia de otro país en un directorio de "Emergencias" de una app de desastres es un riesgo de seguridad real, no solo un problema de branding. Los reemplacé por líneas colombianas reales que verifiqué por búsqueda web contra cobertura de prensa del propio sismo (El Tiempo, Infobae, ambas del 10 de agosto de 2026):

- Línea única nacional **123**, Policía **112**, Bomberos **119**, Ambulancias **125**
- Defensa Civil **144**, Cruz Roja **132**, línea de reunificación familiar de Cruz Roja **321 213 9525**
- Atención a desastres (UNGRD) **111**, Policía de Tránsito **127**
- Servicio Geológico Colombiano — línea de reporte de sismos **(601) 200-0200**
- Plataformas oficiales: UNGRD, **Colombia Te Busca** (`colombiatebusca.com`, reemplaza al buscador de desaparecidos venezolano) y **Sismo Sentido — SGC** (`sismosentido.sgc.gov.co`)

## Vistas y componentes

- `src/app/donar/page.tsx`: reconstruí `ORGANIZACIONES` con entidades colombianas verificadas (UNGRD, Defensa Civil Colombiana, Cruz Roja Colombiana, Cáritas Colombiana, ABACO — Bancos de Alimentos de Colombia) más las internacionales que ya operan genéricamente en desastres (World Central Kitchen, ACNUR, GoFundMe). Quité las campañas de recaudación específicas del sismo de Venezuela (GoFundMe/JustGiving/People in Need con URLs de campaña de 2026 que ya no aplican) en vez de inventarles un equivalente colombiano que no pude verificar. También reescribí el bloque "Seguridad en la donación" para apuntar a UNGRD y al Servicio Geológico Colombiano como referencias de verificación, en vez de los enlaces venezolanos (La Gran Aldea, AlumnUSB, donarseguro.com) que no aplican a este evento.
- `public/manifest.json`, `src/app/layout.tsx`: nombre, título y meta descripción actualizados a Colombia / 10 de agosto de 2026.
- `src/components/MapaSismos.tsx`, `src/components/FeedNoticias.tsx`: reemplacé el listado `ZONAS` (Venezuela → los 32 departamentos + Bogotá) en ambos archivos (están duplicados en el código original), y en `FeedNoticias.tsx` también corregí el panel de cifras del evento (`ResumenEvento`): magnitud M7.4, fecha 10 ago 2026, epicentro "Chocó (Pacífico)", y cambié el fallback de víctimas de números fijos inventados a `'—'` (ver la nota sobre cifras cambiantes arriba).
- `src/components/Navbar.tsx`, `src/components/MapaSwitcher.tsx`: textos "Sismo Venezuela" → "Sismo Colombia", y la ruta del fetch del geojson del contorno actualizada a `/data/colombia.geojson`.
- `src/components/SismosUSGS.tsx`, `src/app/stats/page.tsx`: cambié el locale `es-VE` a `es-CO` en el formateo de fechas y números, y corregí la fecha del evento en `stats/page.tsx`.

## Lo que dejé fuera de alcance (a propósito)

- **Vista 3D del mapa** (`MapaEdificios3D.tsx`, antes enlazada desde `MapaSwitcher.tsx`): el iframe apunta a un webscene de ArcGIS específico con el catastro 3D de edificios de Catia La Mar, Venezuela. No encontré (ni podía fabricar de forma responsable) un webscene real equivalente para Chocó, así que **retiré la pestaña "Vista 3D"** de `MapaSwitcher.tsx` en vez de dejar un mapa 3D de otro país mostrado como si fuera de la zona afectada en Colombia. El componente `MapaEdificios3D.tsx` queda en el repo sin usar, documentado con un comentario `ponytail:`, listo para retomarse si se consigue un webscene real de la zona.
- **Cruz Roja Colombiana** en `donar/page.tsx` quedó sin enlace de donación (aparece como tarjeta de "socio local" sin URL, un patrón que ya existía en el archivo original para organizaciones sin link verificado): no logré resolver su dominio desde este entorno pese a que aparece citado como dominio de correo real en cobertura de prensa vigente; preferí no linkear una URL sin confirmar antes que arriesgar mandar a alguien a un sitio equivocado.
- No toqué `README.md`, `DESIGN.md`, `PRODUCT.md`, `PROGRESS.md` ni `repomix-output.xml` — son documentación de desarrollo, no contenido visible en la app, y quedaron fuera de la lista de archivos que pediste.

## Verificación

Corrí el flujo de verificación que define `CONSTRAINTS.md`: `npm ci`, `npx tsc --noEmit` (sin errores) y `npm run build` (compiló y generó `public/sw.js` y el manifest correctamente). No ejecuté `next lint` porque el repo no tiene ESLint configurado y no es parte del path de verificación documentado; el propio `next build` corre su chequeo de tipos y lint incorporado sin errores.

No hice ningún commit ni operación de git, según instrucción explícita.
