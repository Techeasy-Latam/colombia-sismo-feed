![CI](https://github.com/punkyyy01/colombia-sismo-feed/actions/workflows/ci.yml/badge.svg) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E)

# Colombia Sismo — Feed de noticias verificadas

Dashboard de emergencia en tiempo real para el sismo del 10 de agosto de 2026 en Chocó, Colombia. Agrega, verifica y categoriza noticias de fuentes periodísticas y datos oficiales en un solo lugar, filtrando desinformación automáticamente.

🔴 **En vivo:** https://colombia-sismo-feed.vercel.app

---

## El evento

El 10 de agosto de 2026 un sismo de magnitud 7.4, con epicentro en San José del Palmar (Chocó), sacudió gran parte del territorio colombiano. Los departamentos con mayor daño reportado son Chocó, Risaralda, Valle del Cauca y Caldas, con apoyo humanitario desplegado desde Antioquia y Bogotá. El Gobierno nacional, a través de la UNGRD, coordina la respuesta de emergencia.

Las cifras de víctimas cambian con cada reporte, así que este proyecto no las fija a mano en ningún lugar: el balance de muertos, heridos y desaparecidos que se muestra en el sitio se extrae en vivo de las noticias verificadas más recientes, no de un número editado a mano.

Este proyecto existe para concentrar en un solo lugar las noticias verificadas sobre el evento, filtrando ruido y desinformación de forma automática.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Base de datos | Supabase (PostgreSQL + Row Level Security) |
| Tiempo real | Supabase Realtime (WebSocket, `postgres_changes`) |
| Fact-checking | Groq API — `llama-3.3-70b-versatile` |
| Datos sísmicos oficiales | USGS Earthquake Hazards Program (GeoJSON) |
| Deploy | Vercel (SSR) + GitHub Actions (cron de ingesta cada 15 min) |
| Tipografía | Newsreader (serif) + Inter (sans) vía `next/font` |

---

## Cómo funciona

```
RSS / USGS GeoJSON
        │
        ▼
[Pre-filtro keywords]   ← sin costo, sin latencia
        │ pasa
        ▼
[Groq fact-checker]     ← llama-3.3-70b verifica relevancia,
        │                  asigna tag y da confianza 0-100
        │ aprobado
        ▼
[Supabase]              ← RLS expone solo las noticias aprobadas
        │
        ▼
[Supabase Realtime]     ← push por WebSocket al browser
        │
        ▼
[Feed]                  ← se actualiza solo, sin recargar
```

Un workflow de GitHub Actions (`.github/workflows/ingest-cron.yml`) dispara el pipeline cada 15 minutos. No se usa el cron nativo de Vercel porque el plan Hobby lo limita a una ejecución diaria, insuficiente para un evento en curso.

---

## Los dos filtros

**Pre-filtro de keywords.** Antes de llamar a cualquier API, cada noticia pasa por una lista de palabras clave: nombres de departamentos colombianos, términos sísmicos, palabras de rescate. Si ninguna aparece en el titular ni en la descripción, la noticia se descarta en el momento. Elimina la mayoría del volumen entrante sin gastar un solo token.

**Groq fact-checker.** Las noticias que pasan el pre-filtro se envían a `llama-3.3-70b-versatile` con un system prompt que describe el evento en detalle: fecha, magnitud, epicentro, departamentos afectados. El modelo devuelve un JSON con tres campos: `status` (aprobado / rechazado / dudoso), `tag` (categoría de la noticia) y `confianza` (0–100). Solo las noticias con `status = aprobado` llegan al feed público. Las rechazadas y dudosas se guardan en la base de datos para auditoría, pero Row Level Security de Supabase impide que el cliente las vea.

El USGS es la excepción: sus datos sísmicos se auto-aprueban con confianza 99 sin pasar por el modelo, porque son fuente oficial.

---

## Tags

| Tag | Qué cubre |
|-----|-----------|
| `sismo` | Datos técnicos: magnitud, epicentro, profundidad, hora |
| `rescate` | Labores de búsqueda y rescate, equipos, supervivientes |
| `desaparecidos` | Personas buscadas, plataformas de localización |
| `puntos_acopio` | Centros de donación en especie, dónde llevar ayuda |
| `ayuda_humanitaria` | ONG, refugios, distribución de ayuda |
| `replicas` | Aftershocks y sismos posteriores al evento principal |
| `donaciones` | Cómo donar dinero, canales verificados |
| `internacional` | Respuesta de otros países, ayuda exterior, diplomacia |

---

## Fuentes activas

**Agencias internacionales y medios con RSS nativo:**

- Reuters América Latina
- AP News
- BBC Mundo
- DW Español
- Al Jazeera English
- The Guardian Colombia
- El Tiempo
- Revista Semana

**Medios y agencias oficiales colombianas** (sin RSS propio funcional; se consultan vía el proxy RSS de Google Noticias filtrado por dominio, `news.google.com/rss/search?q=site:<dominio>...`, que sí expone XML válido):

- Noticias Caracol
- El Espectador
- El Colombiano
- RCN Radio
- Blu Radio
- Servicio Geológico Colombiano
- UNGRD

**Datos sísmicos oficiales:**

- USGS Earthquake Hazards Program (auto-aprobado, confianza 99)

> **Nota sobre X / Nitter:** Las fuentes vía X fueron retiradas del ingestor. Las instancias públicas de Nitter están caídas y no ingresan datos. El tipo `x_twitter` se conserva en la base de datos por compatibilidad con registros históricos.

---

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí | Anon key pública de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Sí | Service role key (solo servidor) |
| `GROQ_API_KEY` | Sí | API key de Groq (gratuita en console.groq.com) |
| `CRON_SECRET` | Sí (prod) | Protege `/api/ingest` — generar con `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | Sí | URL pública del deploy (ej: https://colombia-sismo-feed.vercel.app) |

`NEXT_PUBLIC_*` son intencionalmente públicas; el acceso a datos está protegido por Row Level Security. Ver [SECURITY.md](SECURITY.md).

---

## Setup local

Requisitos: Node.js ≥ 20, cuenta gratuita en [Supabase](https://supabase.com) y [Groq](https://console.groq.com).

```bash
git clone https://github.com/punkyyy01/colombia-sismo-feed.git
cd colombia-sismo-feed
npm install
cp .env.example .env.local   # rellenar con tus claves
```

Aplica las migraciones en el SQL Editor de Supabase (archivos en `supabase/migrations/`, en orden numérico), luego:

```bash
npm run dev

# Para disparar el ingestor manualmente:
curl http://localhost:3000/api/ingest
```

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para convenciones de commits y proceso de PR.

---

## Deploy en Vercel

1. Fork de este repo
2. Crear proyecto en Supabase y correr las migraciones en `supabase/migrations/` en orden numérico
3. Obtener una API key gratuita en https://console.groq.com
4. Deploy en Vercel conectando el fork; agregar todas las variables de entorno
5. En el repo de GitHub, agregar los secrets `SITE_URL` (URL pública del deploy) y `CRON_SECRET` (el mismo valor que en Vercel) para que `.github/workflows/ingest-cron.yml` pueda disparar `/api/ingest` cada 15 minutos

---

## Seguridad

Ver [SECURITY.md](SECURITY.md) para la política de divulgación de vulnerabilidades y el alcance del Row Level Security de Supabase.

---

## Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Licencia

MIT — Copyright (c) 2026 colombia-sismo-feed Contributors. Ver [LICENSE](LICENSE).
