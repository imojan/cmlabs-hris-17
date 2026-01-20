// Separate map component untuk fix HMR issue dengan react-leaflet
import { useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

// Simple marker icon (biar nggak ribet path image bundler)
const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ position, onChange }) {
  const mapRef = useRef(null);
  const map = useMapEvents({
    click(e) {
      // klik di peta → update posisi & lat/long
      onChange(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  // Store map reference
  mapRef.current = map;

  useEffect(() => {
    const currentMap = mapRef.current;
    if (currentMap && position) {
      currentMap.setView(position, currentMap.getZoom());
    }
  }, [position]);

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export function MapComponent({ mapPosition, onLocationChange }) {
  // Convert object to array format for Leaflet if needed
  const center = Array.isArray(mapPosition) 
    ? mapPosition 
    : [mapPosition.lat, mapPosition.lng];
  
  return (
    <div className="relative h-64 w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm map-container">
      <style>{`
        .map-container .leaflet-control-container {
          z-index: 400 !important;
        }
        .map-container .leaflet-control-zoom {
          z-index: 400 !important;
        }
        .map-container .leaflet-top,
        .map-container .leaflet-bottom {
          z-index: 400 !important;
        }
      `}</style>
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={center}
          onChange={onLocationChange}
        />
      </MapContainer>
    </div>
  );
}
