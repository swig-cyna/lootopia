# Mapbox — Conventions

## Setup

```typescript
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
```

Toujours importer le CSS avec la lib. Le token vient de `VITE_MAPBOX_ACCESS_TOKEN`.

---

## Initialisation de la carte

Toujours dans un `useEffect` avec un `ref` sur le container.

```typescript
const mapRef = useRef<mapboxgl.Map | null>(null)
const mapContainerRef = useRef<HTMLDivElement>(null)
const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)

useEffect(() => {
  if (!mapContainerRef.current) return undefined

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

  const map = new mapboxgl.Map({
    container: mapContainerRef.current,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [2.3522, 48.8566], // Paris par défaut
    zoom: 5,
  })

  mapRef.current = map
  setMapInstance(map)

  map.addControl(new mapboxgl.NavigationControl(), 'top-right')

  return () => {
    map.remove()
  }
}, [])
```

**Règles :**
- `mapRef` → pour les opérations impératives (`flyTo`, `addLayer`, etc.)
- `mapInstance` → pour passer la carte en prop à des composants enfants
- Toujours retourner `() => map.remove()` pour le cleanup

---

## Markers

```typescript
// Créer un marker custom avec du HTML
const el = document.createElement('div')
el.className =
  'flex size-8 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground text-sm font-semibold shadow-md cursor-grab active:cursor-grabbing'

const marker = new mapboxgl.Marker({ element: el, draggable: true })
  .setLngLat([lng, lat])
  .addTo(map)

// Écouter le drag
marker.on('dragend', () => {
  const { lng: newLng, lat: newLat } = marker.getLngLat()
  // mettre à jour le state
})

// Supprimer un marker
marker.remove()
```

**Règles :**
- Le style du marker utilise les classes Tailwind et les tokens du thème (`bg-primary`, `text-primary-foreground`, etc.)
- Toujours appeler `marker.remove()` quand le point est supprimé du state

---

## Écouter les clics sur la carte

```typescript
map.on('click', (e) => {
  const { lng, lat } = e.lngLat
  // créer un marker, ajouter au state, etc.
})
```

---

## Navigation / flyTo

```typescript
// Via mapRef pour les appels impératifs dans des callbacks
mapRef.current?.flyTo({ center: [lng, lat], zoom: 14 })
```

---

## SearchBox (recherche d'adresse)

```tsx
import { SearchBox } from '@mapbox/search-js-react'

<SearchBox
  accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
  map={mapInstance ?? undefined}
  mapboxgl={mapboxgl}
  marker={false}
  placeholder="Search for an address..."
/>
```

Positionner la SearchBox en `absolute` par-dessus le container de la carte.

---

## Rendu JSX

```tsx
<Card className="flex-1 min-h-0 relative w-full h-full p-0">
  <div ref={mapContainerRef} className="w-full h-full rounded-xl min-h-100" />
  <div className="absolute top-3 left-3 z-10 w-80 max-w-[calc(100%-1.5rem)]">
    <SearchBox ... />
  </div>
</Card>
```

Le container de la carte doit avoir une hauteur explicite (`min-h-100` ou `h-full` avec un parent flex).
