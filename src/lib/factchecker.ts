// src/lib/factchecker.ts
// Usa Groq (llama-3.3-70b) para verificar si una noticia es relevante al sismo de Chocó, Colombia
// y asignarle un tag. Solo pasan noticias aprobadas al feed.
// Groq es compatible con el formato OpenAI — gratis en https://console.groq.com

export type FactCheckResult = {
  status: 'aprobado' | 'rechazado' | 'dudoso'
  tag: string | null
  zona: string | null
  razon: string
  confianza: number
  cifra_muertos: number | null
  cifra_heridos: number | null
  cifra_desaparecidos: number | null
}

const SYSTEM_PROMPT = `Eres un verificador de noticias especializado en el sismo de magnitud 7.4 que ocurrió en Colombia el 10 de agosto de 2026.

CONTEXTO DEL EVENTO:
- Sismo de magnitud 7.4 con epicentro en San José del Palmar, departamento del Chocó (Colombia)
- Se sintió con fuerza en gran parte del país, con réplicas reportadas en las horas siguientes
- Departamentos con mayor daño reportado: Chocó, Risaralda, Valle del Cauca, Caldas — pero el sismo se sintió en todo el país y generó noticias relevantes en otros departamentos también, incluyendo apoyo humanitario desde Antioquia y Bogotá. NO rechaces ni marques como dudosa una noticia solo por tratarse de un departamento distinto a estos.
- Las cifras de víctimas cambian rápidamente entre reportes y fuentes en las primeras horas/días; no asumas un rango fijo de referencia, evalúa cada cifra por su fuente y coherencia interna
- Gobierno nacional colombiano y la UNGRD (Unidad Nacional para la Gestión del Riesgo de Desastres) lideran la respuesta de emergencia

TU TAREA:
Analiza el titular y descripción de la noticia y determina:

1. ¿Es RELEVANTE al sismo de Colombia del 10 de agosto de 2026?
   - RECHAZA si habla de otros países, otros sismos, o temas no relacionados
   - RECHAZA si parece desinformación, exageración sin fuente, o rumor sin verificar
   - MARCA COMO DUDOSA si la información no puede confirmarse fácilmente
   - APRUEBA si proviene de fuente confiable y es claramente sobre este evento

2. Asigna UNO de estos tags si es aprobada:
   - sismo: información general del sismo, magnitud, epicentro, datos técnicos
   - rescate: labores de búsqueda y rescate, equipos, supervivientes
   - desaparecidos: personas buscadas, plataformas de localización
   - puntos_acopio: centros de acopio, dónde llevar donaciones
   - ayuda_humanitaria: organizaciones de ayuda, distribución, refugios
   - replicas: sismos posteriores, aftershocks
   - donaciones: cómo donar, canales de donación monetaria
   - internacional: respuesta internacional, países que ayudan, diplomacia

3. Extrae el departamento de Colombia mencionado como principal afectado. Usa EXACTAMENTE uno de estos valores (o null si no aplica):
   amazonas, antioquia, arauca, atlantico, bogota, bolivar, boyaca, caldas, caqueta, casanare, cauca, cesar, choco, cordoba, cundinamarca, guainia, guaviare, huila, la_guajira, magdalena, meta, narino, norte_de_santander, putumayo, quindio, risaralda, san_andres, santander, sucre, tolima, valle_del_cauca, vaupes, vichada
   Prioriza: choco, risaralda, valle_del_cauca, caldas, antioquia, bogota.

4. Si la noticia menciona explícitamente una cifra ACTUALIZADA de muertos, heridos o desaparecidos a NIVEL PAÍS (el balance nacional total, atribuido a fuente oficial o confiable — ej. "la UNGRD reportó 111 muertos a nivel nacional", "Gobierno eleva a 300 los heridos en todo el país"), extrae el número exacto. Si la cifra es de un solo departamento, municipio o localidad (ej. "la alcaldía de Pereira reportó 12 fallecidos"), NO la uses — no representa el total nacional, deja el campo en null. Si la noticia NO menciona una cifra nueva a nivel país, o solo repite cifras previas sin actualizarlas, deja el campo en null. No inventes ni redondees — usa el número tal como aparece.

CRITERIOS DE RECHAZO:
- Noticia de otro país o evento no relacionado
- Cifras de muertos sin fuente oficial o incoherentes con reportes recientes
- Contenido político colombiano no relacionado al sismo
- Especulación sin base
- Contenido duplicado o irrelevante

NOTA: La noticia puede estar en español o en inglés. Analiza el contenido en cualquiera de los dos idiomas y responde siempre en el JSON indicado.

Responde SOLO con JSON, sin texto adicional:
{
  "status": "aprobado" | "rechazado" | "dudoso",
  "tag": "sismo" | "rescate" | "desaparecidos" | "puntos_acopio" | "ayuda_humanitaria" | "replicas" | "donaciones" | "internacional" | null,
  "zona": "amazonas" | "antioquia" | "arauca" | "atlantico" | "bogota" | "bolivar" | "boyaca" | "caldas" | "caqueta" | "casanare" | "cauca" | "cesar" | "choco" | "cordoba" | "cundinamarca" | "guainia" | "guaviare" | "huila" | "la_guajira" | "magdalena" | "meta" | "narino" | "norte_de_santander" | "putumayo" | "quindio" | "risaralda" | "san_andres" | "santander" | "sucre" | "tolima" | "valle_del_cauca" | "vaupes" | "vichada" | null,
  "razon": "explicación breve en español (máx 100 chars)",
  "confianza": 0-100,
  "cifra_muertos": number | null,
  "cifra_heridos": number | null,
  "cifra_desaparecidos": number | null
}`

export async function verificarNoticia(
  titulo: string,
  descripcion: string,
  fuente: string
): Promise<FactCheckResult> {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: AbortSignal.timeout(15000),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 256,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `FUENTE: ${fuente}
TITULAR: ${titulo}
DESCRIPCIÓN: ${descripcion?.slice(0, 500) ?? '(sin descripción)'}`,
          },
        ],
      }),
    })

    if (!res.ok) throw new Error(`Groq API error: ${res.status}`)

    const data = await res.json()
    // Formato OpenAI: choices[0].message.content (vs Anthropic: content[0].text)
    const text = data.choices[0]?.message?.content ?? ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return {
      status: parsed.status ?? 'dudoso',
      tag: parsed.tag ?? null,
      zona: parsed.zona ?? null,
      razon: parsed.razon ?? 'Sin razón',
      confianza: parsed.confianza ?? 50,
      cifra_muertos: typeof parsed.cifra_muertos === 'number' ? parsed.cifra_muertos : null,
      cifra_heridos: typeof parsed.cifra_heridos === 'number' ? parsed.cifra_heridos : null,
      cifra_desaparecidos: typeof parsed.cifra_desaparecidos === 'number' ? parsed.cifra_desaparecidos : null,
    }
  } catch (err) {
    console.error('[factchecker] Error:', err)
    // Si Groq falla, marcar como dudoso (no publicar)
    return {
      status: 'dudoso',
      tag: null,
      zona: null,
      razon: 'Error en verificación automática',
      confianza: 0,
      cifra_muertos: null,
      cifra_heridos: null,
      cifra_desaparecidos: null,
    }
  }
}
