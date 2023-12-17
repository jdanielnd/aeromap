type MapStyle = {
  name: string,
  label: string,
  url: string,
}

export const MAP_STYLES: Array<MapStyle> = [
  {
    name: 'openstreetmap',
    label: 'OpenStreetMap',
    url: 'https://api.maptiler.com/maps/openstreetmap/style.json',
  },
  {
    name: 'satellite',
    label: 'Satellite',
    url: 'https://api.maptiler.com/maps/satellite/style.json',
  }
]

export function getMapStyle(style: string) {
  return MAP_STYLES.find((mapStyle) => mapStyle.name === style ).url + '?key=' + 'meAsdWW3UYh2qKW3Zp3P'
}