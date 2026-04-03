'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    label?: string;
  }>;
  onMapReady?: (map: L.Map) => void;
}

// TODO: set up current location to point to report location
const Location: React.FC<MapComponentProps> = ({
  center = [51.505, -0.09],
  zoom = 13,
  markers = [],
  onMapReady,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapInstance.current = L.map(mapContainer.current).setView(center, zoom);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // Add markers
    markers.forEach((marker) => {
      L.marker([marker.lat, marker.lng])
        .bindPopup(marker.label || `Lat: ${marker.lat}, Lng: ${marker.lng}`)
        .addTo(mapInstance.current!);
    });

    // Callback when map is ready
    if (onMapReady && mapInstance.current) {
      onMapReady(mapInstance.current);
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center, zoom, markers, onMapReady]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '70vh',
      }}
    />
  );
};

export default Location;
