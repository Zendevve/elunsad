
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Permit {
  id: number;
  lat: number;
  lng: number;
  status: string;
  type: string;
}

interface MapProps {
  permits: Permit[];
}

const Map = ({ permits }: MapProps) => {
  const getMarkerIcon = (status: string) => {
    const color = 
      status === "approved" ? "#22c55e" :
      status === "pending" ? "#eab308" : "#ef4444";

    return new L.DivIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: ${color};
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.4);
        "></div>
      `,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  };

  const center: LatLngExpression = [14.5995, 120.9842];

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {permits.map((permit) => (
        <Marker
          key={permit.id}
          position={[permit.lat, permit.lng] as LatLngExpression}
          icon={getMarkerIcon(permit.status)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">Permit #{permit.id}</h3>
              <p className="text-sm">Type: {permit.type}</p>
              <p className="text-sm">Status: {permit.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
