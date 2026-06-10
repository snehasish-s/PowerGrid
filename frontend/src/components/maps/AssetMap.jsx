import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon issues in React
import 'leaflet/dist/leaflet.css';

const createCustomMarker = (status) => {
  let color = '#03FFAB'; // electric green
  let pulseClass = 'animate-ping';
  
  if (status === 'DEGRADED') {
    color = '#FBBF24'; // orange/yellow
    pulseClass = 'animate-pulse';
  } else if (status === 'FAULTY') {
    color = '#FF6B6B'; // red
    pulseClass = 'animate-ping';
  } else if (status === 'DECOMMISSIONED') {
    color = '#374151'; // dark border gray
    pulseClass = '';
  }
  
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        ${pulseClass ? `<span class="${pulseClass} absolute inline-flex h-5 w-5 rounded-full opacity-40" style="background-color: ${color}"></span>` : ''}
        <span class="relative inline-flex rounded-full h-3.5 w-3.5 border border-[#121212] shadow-md" style="background-color: ${color}"></span>
      </div>
    `,
    className: 'custom-marker-container',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const AssetMap = ({ assets = [], center = [20.2961, 85.8245], zoom = 8 }) => {
  return (
    <div className="h-full w-full border border-border bg-surface relative min-h-[350px]">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', minHeight: '350px' }}
        zoomControl={true}
      >
        {/* CartoDB Dark Matter map tile server — fits the dark theme perfectly */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />
        
        {assets.map((asset) => {
          if (!asset.latitude || !asset.longitude) return null;
          return (
            <Marker 
              key={asset.id} 
              position={[asset.latitude, asset.longitude]}
              icon={createCustomMarker(asset.status)}
            >
              <Popup>
                <div className="font-outfit p-1 flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between border-b border-border pb-1">
                    <span className="font-syne font-bold uppercase text-primary tracking-wide text-xs">
                      {asset.assetId}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold border rounded-full ${
                      asset.status === 'OPERATIONAL' ? 'border-primary/50 text-primary bg-primary/5' :
                      asset.status === 'DEGRADED' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5' :
                      asset.status === 'FAULTY' ? 'border-error/50 text-error bg-error/5' : 'border-border text-text-muted bg-border/5'
                    }`}>
                      {asset.status}
                    </span>
                  </div>
                  <p className="font-medium text-on-surface mt-1">{asset.assetName}</p>
                  <p className="text-text-muted mt-0.5"><span className="text-on-surface font-semibold">Zone:</span> {asset.zone}</p>
                  <p className="text-text-muted"><span className="text-on-surface font-semibold">Type:</span> {asset.assetType}</p>
                  <p className="text-text-muted"><span className="text-on-surface font-semibold">Health Score:</span> {asset.healthScore}%</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default AssetMap;
