# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

Las entradas anteriores a la `0.3.0` documentan el proyecto original, `vzla-sismo-feed`, construido para el sismo de Venezuela del 24 de junio de 2026. Se conservan como historial; no describen el estado actual de este repositorio, adaptado al sismo de Chocó, Colombia, del 10 de agosto de 2026.

---

## [0.3.0] — 2026-08-10 (Fork Colombia)

### Changed

- Adaptación completa del proyecto (fork de `vzla-sismo-feed`) al sismo de magnitud 7.4 del 10 de agosto de 2026 en Chocó, Colombia
- `FUENTES` en `src/lib/sources.ts` reconstruida: fuentes venezolanas reemplazadas por medios y agencias oficiales colombianas (El Tiempo, Semana, Noticias Caracol, El Espectador, El Colombiano, RCN Radio, Blu Radio, Servicio Geológico Colombiano, UNGRD), varias vía proxy RSS de Google Noticias por no exponer feed propio
- `KEYWORDS_REQUERIDOS` y `CIUDAD_A_ESTADO` migrados de estados/ciudades venezolanas a los 32 departamentos de Colombia + Bogotá D.C. y sus ciudades principales
- System prompt del fact-checker (`src/lib/factchecker.ts`) reescrito para el contexto del sismo de Chocó; ya no fija un rango de cifras de víctimas de referencia (las cifras reales cambiaban fuerte entre reportes al momento del fork)
- Números de emergencia en `NumerosEmergencia.tsx` reemplazados de líneas venezolanas (Movistar/CANTV/FUNVISIS) a líneas colombianas reales (123, 112, 119, 132, 144, UNGRD, Sismo Sentido — SGC)
- Mapa: contorno GeoJSON, centro del mapa y el SVG ilustrativo (`MapaColombiaSVG.tsx`, antes `MapaVenezuelaSVG.tsx`) migrados a Colombia, con el epicentro ubicado en coordenadas reales de San José del Palmar
- `ORGANIZACIONES` en `/donar` reemplazadas por entidades de respuesta colombianas verificadas (UNGRD, Defensa Civil Colombiana, Cruz Roja Colombiana, Cáritas Colombiana, ABACO)

### Removed

- Vista 3D del mapa (`MapaEdificios3D.tsx`): apuntaba a un webscene de ArcGIS específico de Catia La Mar, Venezuela, sin equivalente real para Chocó
- Tabla `cifras_evento` (migración `007_cifras_evento.sql`): quedó huérfana desde que el resumen del evento pasó a leer cifras en vivo de `noticias` (migración `009_cifras_por_noticia.sql`); nunca se leía desde el código
- Cron nativo de Vercel en `vercel.json` (el plan Hobby lo limita a una vez al día); la ingesta ahora depende únicamente de `.github/workflows/ingest-cron.yml` (cada 15 min)

### Fixed

- `npm test` fallaba porque `node --test` (sin argumentos) auto-descubría y ejecutaba los `.ts` originales de `tests/` además del output compilado en `dist-test/`, y los originales no resuelven imports sin extensión bajo ESM. Se acotó el comando a `node --test "dist-test/tests/**/*.test.js"`
- `tests/unit/sources.test.ts` probaba keywords venezolanos que ya no existen en `KEYWORDS_REQUERIDOS`; reescrito con fixtures colombianos

### Archived

- Remanentes del proyecto original sin uso en el código (mockups de diseño de `outputs/`, `guion-video-sismo-venezuela.md`, `repomix-output.xml`) movidos a `archive/vzla-original/` en vez de borrarse, para conservar el historial de diseño sin mezclarlo con el contexto actual

---

## [0.2.0] — 2026-06-28

### Added

- Soporte de idioma en fuentes y noticias: campo `idioma: 'es' | 'en'` en el tipo `Fuente` y migración 004 que agrega la columna `idioma` a la tabla `noticias`
- 12 fuentes RSS nuevas: El Nacional, Efecto Cocuyo, Runrún.es, Caraota Digital, Tal Cual, El Universal Venezuela, Infobae Venezuela, NTN24, DW Español, VOA Noticias, BioBioChile, Cooperativa, The Guardian Venezuela, Al Jazeera English
- Filtro de idioma en la UI del feed: toggle ES / EN / Todos
- Pill "EN" en tarjetas de noticias en inglés
- Keywords en inglés en el pre-filtro: earthquake, quake, aftershock, tremor, seismic, magnitude, epicenter, fault, Richter, aftershocks, death toll, survivors, rubble, collapse, debris

### Fixed

- Cron de Vercel corregido de `0 0 * * *` (una vez al día) a `*/5 * * * *` (cada 5 minutos)

---

## [0.1.0] — 2026-06-25

### Added

- Feed principal con noticias verificadas en tiempo real vía Supabase Realtime (WebSocket, sin recargar la página)
- Pipeline de ingestión completo: RSS / USGS GeoJSON / Nitter → pre-filtro de keywords → Groq fact-checker (`llama-3.3-70b-versatile`) → Supabase
- 8 tags de categorización: `sismo`, `rescate`, `desaparecidos`, `puntos_acopio`, `ayuda_humanitaria`, `replicas`, `donaciones`, `internacional`
- Fuentes iniciales: Reuters América Latina, AP News, BBC Mundo, CNN en Español, Univisión Noticias, El Tiempo (Colombia), La Patilla, USGS Earthquake Hazards Program, cuentas X via Nitter (#TerremotoVenezuela, #SismoVenezuela)
- Auto-aprobación de datos USGS con confianza 99, sin pasar por el modelo (fuente oficial)
- Página de estadísticas por tag
- Mapa de sismos con Leaflet
- Directorio de emergencias venezolanas (Protección Civil, Bomberos, FUNVISIS)
- Modo oscuro
- PWA instalable en móvil (manifest + service worker)
- Paginación con infinite scroll
- Búsqueda por texto en el feed
