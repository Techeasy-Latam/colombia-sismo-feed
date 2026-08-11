// src/lib/sources.ts
// Fuentes verificadas y sus RSS feeds

export type Source = {
  nombre: string
  tipo: 'rss' | 'x_twitter' | 'oficial'
  url: string
  confiabilidad: 'alta' | 'media'
  idioma: 'es' | 'en'
}

export const FUENTES: Source[] = [
  // Agencias internacionales — máxima confiabilidad
  {
    nombre: 'Reuters América Latina',
    tipo: 'rss',
    url: 'https://feeds.reuters.com/reuters/latinAmericaNews',
    confiabilidad: 'alta',
    idioma: 'en',
  },
  {
    nombre: 'AP News',
    tipo: 'rss',
    url: 'https://rss.apnews.com/apf-latinamerica',
    confiabilidad: 'alta',
    idioma: 'en',
  },
  {
    nombre: 'BBC Mundo',
    tipo: 'rss',
    url: 'https://feeds.bbci.co.uk/mundo/rss.xml',
    confiabilidad: 'alta',
    idioma: 'es',
  },
  {
    nombre: 'DW Español',
    tipo: 'rss',
    url: 'https://rss.dw.com/rdf/rss-spa-all',
    confiabilidad: 'alta',
    idioma: 'es',
  },
  {
    nombre: 'Al Jazeera English',
    tipo: 'rss',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    confiabilidad: 'alta',
    idioma: 'en',
  },
  {
    nombre: 'The Guardian Colombia',
    tipo: 'rss',
    url: 'https://www.theguardian.com/world/colombia/rss',
    confiabilidad: 'alta',
    idioma: 'en',
  },
  // Medios colombianos con RSS nativo
  {
    nombre: 'El Tiempo',
    tipo: 'rss',
    url: 'https://www.eltiempo.com/rss/colombia.xml',
    confiabilidad: 'alta',
    idioma: 'es',
  },
  {
    nombre: 'Revista Semana',
    tipo: 'rss',
    url: 'https://www.semana.com/arc/outboundfeeds/rss/?outputType=xml',
    confiabilidad: 'alta',
    idioma: 'es',
  },
  // Medios y agencias oficiales colombianas sin RSS propio: se consultan vía el
  // proxy RSS de Google Noticias filtrado por dominio (site:), que sí expone XML.
  {
    nombre: 'Noticias Caracol',
    tipo: 'rss',
    url: 'https://news.google.com/rss/search?q=site:noticiascaracol.com%20sismo%20OR%20terremoto%20OR%20choc%C3%B3&hl=es-419&gl=CO&ceid=CO:es-419',
    confiabilidad: 'alta',
    idioma: 'es',
  },
  {
    nombre: 'El Espectador',
    tipo: 'rss',
    url: 'https://news.google.com/rss/search?q=site:elespectador.com%20sismo%20OR%20terremoto%20OR%20choc%C3%B3&hl=es-419&gl=CO&ceid=CO:es-419',
    confiabilidad: 'alta',
    idioma: 'es',
  },
  {
    nombre: 'El Colombiano',
    tipo: 'rss',
    url: 'https://news.google.com/rss/search?q=site:elcolombiano.com%20sismo%20OR%20terremoto%20OR%20choc%C3%B3&hl=es-419&gl=CO&ceid=CO:es-419',
    confiabilidad: 'alta',
    idioma: 'es',
  },
  {
    nombre: 'RCN Radio',
    tipo: 'rss',
    url: 'https://news.google.com/rss/search?q=site:rcnradio.com%20sismo%20OR%20terremoto%20OR%20choc%C3%B3&hl=es-419&gl=CO&ceid=CO:es-419',
    confiabilidad: 'alta',
    idioma: 'es',
  },
  {
    nombre: 'Blu Radio',
    tipo: 'rss',
    url: 'https://news.google.com/rss/search?q=site:bluradio.com%20sismo%20OR%20terremoto%20OR%20choc%C3%B3&hl=es-419&gl=CO&ceid=CO:es-419',
    confiabilidad: 'alta',
    idioma: 'es',
  },
  {
    nombre: 'Servicio Geológico Colombiano',
    tipo: 'rss',
    url: 'https://news.google.com/rss/search?q=site:sgc.gov.co&hl=es-419&gl=CO&ceid=CO:es-419',
    confiabilidad: 'alta',
    idioma: 'es',
  },
  {
    nombre: 'UNGRD',
    tipo: 'rss',
    url: 'https://news.google.com/rss/search?q=site:gestiondelriesgo.gov.co&hl=es-419&gl=CO&ceid=CO:es-419',
    confiabilidad: 'alta',
    idioma: 'es',
  },
  // USGS - Datos sísmicos oficiales
  {
    nombre: 'USGS Sismos',
    tipo: 'oficial',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson',
    confiabilidad: 'alta',
    idioma: 'en',
  },
  // x_twitter: sin entradas — instancias públicas de Nitter caídas, no ingresan datos
]

// Keywords mínimos para pre-filtrar antes de enviar a Groq
// (evitar gastar tokens en noticias obvias de otros temas)
export const KEYWORDS_REQUERIDOS = [
  // Español
  'colombia', 'colombiano', 'colombiana',
  // Departamentos (todos, no solo los más golpeados) — para que noticias que
  // mencionan un departamento sin usar una palabra genérica de desastre también pasen el pre-filtro.
  'chocó', 'choco', 'risaralda', 'valle del cauca', 'antioquia', 'caldas',
  'quindío', 'quindio', 'cauca', 'nariño', 'narino', 'bogotá', 'bogota',
  'cundinamarca', 'santander', 'norte de santander', 'tolima', 'huila',
  'boyacá', 'boyaca', 'atlántico', 'atlantico', 'bolívar', 'bolivar', 'cesar',
  'córdoba', 'cordoba', 'magdalena', 'la guajira', 'sucre', 'meta', 'casanare',
  'arauca', 'caquetá', 'caqueta', 'putumayo', 'amazonas', 'guainía', 'guainia',
  'guaviare', 'vaupés', 'vaupes', 'vichada', 'san andrés', 'san andres',
  'quibdó', 'quibdo', 'san josé del palmar', 'san jose del palmar', 'pereira',
  'cartago', 'terremoto', 'sismo', 'temblor', 'réplica', 'replica',
  'rescate', 'desaparecid', 'escombros', 'derrumb',
  // Inglés
  'earthquake', 'quake', 'aftershock', 'magnitude', 'seismic',
  'rescue', 'missing', 'rubble', 'collapse', 'relief',
]

export function preFiltroPasa(titulo: string, desc: string): boolean {
  const texto = `${titulo} ${desc}`.toLowerCase()
  return KEYWORDS_REQUERIDOS.some(kw => texto.includes(kw))
}

// Ciudades/municipios colombianos conocidos → departamento (zona) al que pertenecen.
// Se usa como respaldo determinístico cuando el fact-checker (LLM) no logra
// inferir una zona: si el titular/descripción menciona una de estas ciudades,
// la mapeamos directo a su departamento sin depender del modelo.
export const CIUDAD_A_ESTADO: Record<string, string> = {
  // Chocó
  'quibdó': 'choco',
  'quibdo': 'choco',
  'san josé del palmar': 'choco',
  'san jose del palmar': 'choco',
  'istmina': 'choco',
  'condoto': 'choco',
  'nuquí': 'choco',
  'nuqui': 'choco',
  'bahía solano': 'choco',
  'bahia solano': 'choco',
  // Risaralda
  'pereira': 'risaralda',
  'dosquebradas': 'risaralda',
  'santa rosa de cabal': 'risaralda',
  // Valle del Cauca
  'cali': 'valle_del_cauca',
  'cartago': 'valle_del_cauca',
  'buenaventura': 'valle_del_cauca',
  'tuluá': 'valle_del_cauca',
  'tulua': 'valle_del_cauca',
  'buga': 'valle_del_cauca',
  'palmira': 'valle_del_cauca',
  // Antioquia
  'medellín': 'antioquia',
  'medellin': 'antioquia',
  'envigado': 'antioquia',
  'itagüí': 'antioquia',
  'itagui': 'antioquia',
  'bello': 'antioquia',
  'apartadó': 'antioquia',
  'apartado': 'antioquia',
  // Caldas
  'manizales': 'caldas',
  'la dorada': 'caldas',
  // Quindío
  'armenia': 'quindio',
  // Cauca
  'popayán': 'cauca',
  'popayan': 'cauca',
  // Nariño
  'pasto': 'narino',
  'tumaco': 'narino',
  // Bogotá D.C.
  'bogotá': 'bogota',
  'bogota': 'bogota',
  // Cundinamarca
  'soacha': 'cundinamarca',
  'girardot': 'cundinamarca',
  'zipaquirá': 'cundinamarca',
  'zipaquira': 'cundinamarca',
  // Santander
  'bucaramanga': 'santander',
  'barrancabermeja': 'santander',
  // Norte de Santander
  'cúcuta': 'norte_de_santander',
  'cucuta': 'norte_de_santander',
  // Tolima
  'ibagué': 'tolima',
  'ibague': 'tolima',
  // Huila
  'neiva': 'huila',
  // Boyacá
  'tunja': 'boyaca',
  'duitama': 'boyaca',
  // Atlántico
  'barranquilla': 'atlantico',
  'soledad': 'atlantico',
  // Bolívar
  'cartagena': 'bolivar',
  'magangué': 'bolivar',
  'magangue': 'bolivar',
  // Cesar
  'valledupar': 'cesar',
  // Córdoba
  'montería': 'cordoba',
  'monteria': 'cordoba',
  // Magdalena
  'santa marta': 'magdalena',
  // La Guajira
  'riohacha': 'la_guajira',
  // Sucre
  'sincelejo': 'sucre',
  // Meta
  'villavicencio': 'meta',
  // Casanare
  'yopal': 'casanare',
  // Arauca
  'arauca': 'arauca',
  // Caquetá
  'florencia': 'caqueta',
  // Putumayo
  'mocoa': 'putumayo',
  // Amazonas
  'leticia': 'amazonas',
  // San Andrés y Providencia
  'san andrés': 'san_andres',
  'san andres': 'san_andres',
}

// Busca nombres de ciudad conocidos en el texto y devuelve su departamento.
// Ordena las claves por longitud descendente para que coincidencias más
// específicas ("san josé del palmar") ganen sobre las más cortas ("palmar").
export function detectarZonaPorCiudad(texto: string): string | null {
  const t = texto.toLowerCase()
  const ciudades = Object.keys(CIUDAD_A_ESTADO).sort((a, b) => b.length - a.length)
  for (const ciudad of ciudades) {
    if (t.includes(ciudad)) return CIUDAD_A_ESTADO[ciudad]
  }
  return null
}
