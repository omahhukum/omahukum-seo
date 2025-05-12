'use client';

import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Dynamic import untuk komponen Map
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Fix untuk marker icon
const icon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Map() {
  const position: LatLngExpression = [-7.5258774, 112.5382168];

  useEffect(() => {
    // Pastikan Leaflet diinisialisasi di sisi klien
    if (typeof window !== 'undefined') {
      // Import CSS Leaflet
      require('leaflet/dist/leaflet.css');
    }
  }, []);

  const handleStreetView = () => {
    window.open(
      'https://www.google.com/maps/@-7.5258774,112.5382168,3a,90y,121.04h,78.57t/data=!3m7!1e1!3m5!1st8UYU_ren1EIDH3nZyFCkQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D11.43273643680304%26panoid%3Dt8UYU_ren1EIDH3nZyFCkQ%26yaw%3D121.04182631136442!7i16384!8i8192!4m6!3m5!1s0x2e780b1cfe756907:0xee650cef30b661d1!8m2!3d-7.5258774!4d112.5382168!16s%2Fg%2F11f62v7hhg?entry=ttu',
      '_blank'
    );
  };

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
      <MapContainer 
        center={position} 
        zoom={15} 
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={position}
          icon={icon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold mb-2">Omah Hukum</h3>
              <p className="text-sm mb-3">Jurangsari, Belahantengah, Kec. Mojosari, Kabupaten Mojokerto, Jawa Timur 61382</p>
              <button
                onClick={handleStreetView}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Lihat Street View
              </button>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
} 