'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Sismo } from './LeafletMap'
import { MapaSismosView } from './MapaSismos'

// ponytail: la vista 3D (MapaEdificios3D) apuntaba a un webscene de ArcGIS con
// edificios de Catia La Mar, Venezuela — no hay equivalente real para Chocó, así
// que se retira en vez de mostrar contenido de otro país como si fuera de acá.
// Restaurar cuando se consiga (o genere) un webscene real de la zona afectada.
type View = '2d'

const TABS: { id: View; label: string; meta: string }[] = [
  { id: '2d', label: 'Mapa 2D', meta: 'Sismos · Colombia' },
]

const LEAD: Record<View, string> = {
  '2d': 'Ubicación geográfica de los sismos reportados por fuentes oficiales en todo el territorio.',
}

function useDarkMode() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const update = () => setDark(root.classList.contains('dark'))
    update()

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          update()
          break
        }
      }
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return dark
}

export function MapaSwitcher() {
  const supabase = useMemo(
    () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!),
    []
  )
  const [sismos, setSismos] = useState<Sismo[]>([])
  const [outline, setOutline] = useState<GeoJSON.GeoJsonObject | null>(null)
  const [view] = useState<View>('2d')
  const dark = useDarkMode()

  useEffect(() => {
    supabase
      .from('noticias')
      .select('id, titulo, url, factcheck_confianza, tsunami, lat, lng, zona')
      .eq('fuente_tipo', 'oficial')
      .eq('factcheck_status', 'aprobado')
      .not('lat', 'is', null)
      .limit(100)
      .then(({ data }) => { if (data) setSismos(data as Sismo[]) })

    fetch('/data/colombia.geojson')
      .then((r) => r.json())
      .then(setOutline)
      .catch((err) => console.error('[mapa] Error cargando contorno:', err))
  }, [supabase])

  return (
    <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
      <header className="border-b-2 border-ink dark:border-ink-dark pb-6 mb-6">
        <p className="text-eyebrow uppercase text-crisis-red mb-3">Cartografía sísmica</p>
        <h1 className="font-serif text-display text-ink dark:text-ink-dark">Mapa sísmico</h1>
        <p className="text-lead text-ink-muted dark:text-ink-muted-dark mt-3 max-w-prose min-h-[3.2em]">
          {LEAD[view]}
        </p>
      </header>

      <div className="border-b border-rule dark:border-rule-dark mb-6 pb-3">
        <span className="text-small font-semibold text-ink dark:text-ink-dark">{TABS[0].label}</span>
        <span className="block text-caption text-ink-muted dark:text-ink-muted-dark mt-0.5">{TABS[0].meta}</span>
      </div>

      <div>
        <MapaSismosView sismos={sismos} outline={outline} dark={dark} />
      </div>
    </main>
  )
}
