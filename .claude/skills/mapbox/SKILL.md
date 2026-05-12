---
name: mapbox
description: Mapbox GL JS — map initialization, markers, click events, SearchBox, flyTo. Use when the user asks about maps, Mapbox, geolocation, markers, or map interactions.
---

# Mapbox — Conventions

## Setup

```typescript
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
```

Always import the CSS with the lib. The token comes from `VITE_MAPBOX_ACCESS_TOKEN`.

---

## Map initialization

Always inside a `useEffect` with a `ref` on the container.

```typescript
const mapRef = useRef<mapboxgl.Map | null>(null)
const mapContainerRef = useRef<HTMLDivElement>(null)
const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)

useEffect(() => {
  if (!mapContainerRef.current) return undefined

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

  const map = new mapboxgl.Map({
    container: mapContainerRef.current,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [2.3522, 48.8566], // Paris by default
    zoom: 5,
  })

  mapRef.current = map
  setMapInstance(map)

  map.addControl(new mapboxgl.NavigationControl(), "top-right")

  return () => {
    map.remove()
  }
}, [])
```

**Rules:**

- `mapRef` → for imperative operations (`flyTo`, `addLayer`, etc.)
- `mapInstance` → for passing the map as a prop to child components
- Always return `() => map.remove()` for cleanup

---

## Markers

```typescript
// Create a custom marker with HTML
const el = document.createElement("div")
el.className =
  "flex size-8 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground text-sm font-semibold shadow-md cursor-grab active:cursor-grabbing"

const marker = new mapboxgl.Marker({ element: el, draggable: true })
  .setLngLat([lng, lat])
  .addTo(map)

// Listen to drag
marker.on("dragend", () => {
  const { lng: newLng, lat: newLat } = marker.getLngLat()
  // update state
})

// Remove a marker
marker.remove()
```

**Rules:**

- Marker style uses Tailwind classes and theme tokens (`bg-primary`, `text-primary-foreground`, etc.)
- Always call `marker.remove()` when the point is removed from state

---

## Listening to map clicks

```typescript
map.on("click", (e) => {
  const { lng, lat } = e.lngLat
  // create a marker, add to state, etc.
})
```

---

## Navigation / flyTo

```typescript
// Via mapRef for imperative calls in callbacks
mapRef.current?.flyTo({ center: [lng, lat], zoom: 14 })
```

---

## SearchBox (address search)

```tsx
import { SearchBox } from "@mapbox/search-js-react"

;<SearchBox
  accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
  map={mapInstance ?? undefined}
  mapboxgl={mapboxgl}
  marker={false}
  placeholder="Search for an address..."
/>
```

Position the SearchBox as `absolute` over the map container.

---

## JSX layout

```tsx
<Card className="flex-1 min-h-0 relative w-full h-full p-0">
  <div ref={mapContainerRef} className="w-full h-full rounded-xl min-h-100" />
  <div className="absolute top-3 left-3 z-10 w-80 max-w-[calc(100%-1.5rem)]">
    <SearchBox ... />
  </div>
</Card>
```

The map container must have an explicit height (`min-h-100` or `h-full` with a flex parent).
