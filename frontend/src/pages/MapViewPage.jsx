import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AssetMap from '../components/maps/AssetMap';
import api from '../services/api';

const MapViewPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get('/assets');
        setAssets(response.data);
      } catch (err) {
        console.error('Failed to load assets for map view', err);
        // Fallback matching schema.sql
        setAssets([
          { id: 1, assetId: 'TR-1001', assetName: '33/11kV Power Transformer — Moradabad Sector-5', assetType: 'TRANSFORMER', status: 'OPERATIONAL', zone: 'Bhubaneswar', latitude: 20.2961, longitude: 85.8245, healthScore: 92 },
          { id: 2, assetId: 'TR-1002', assetName: '33/11kV Distribution Transformer — Saheed Nagar', assetType: 'TRANSFORMER', status: 'DEGRADED', zone: 'Bhubaneswar', latitude: 20.2856, longitude: 85.8462, healthScore: 64 },
          { id: 3, assetId: 'FD-2001', assetName: '11kV Feeder — Patia Industrial', assetType: 'FEEDER', status: 'OPERATIONAL', zone: 'Bhubaneswar', latitude: 20.3540, longitude: 85.8190, healthScore: 88 },
          { id: 4, assetId: 'FD-2003', assetName: '11kV Feeder — Cuttack Ring Main', assetType: 'FEEDER', status: 'FAULTY', zone: 'Cuttack', latitude: 20.4625, longitude: 85.8828, healthScore: 35 },
          { id: 5, assetId: 'PL-3045', assetName: 'RCC Pole — Mancheswar Colony', assetType: 'POLE', status: 'OPERATIONAL', zone: 'Bhubaneswar', latitude: 20.3100, longitude: 85.8380, healthScore: 78 },
          { id: 6, assetId: 'MT-4012', assetName: 'Smart Meter — Jharpada Residential', assetType: 'METER', status: 'OPERATIONAL', zone: 'Bhubaneswar', latitude: 20.2740, longitude: 85.8100, healthScore: 95 },
          { id: 7, assetId: 'SG-5008', 'assetName': '33kV SF6 Circuit Breaker — Berhampur SS', assetType: 'SWITCHGEAR', status: 'OPERATIONAL', zone: 'Berhampur', latitude: 19.3110, longitude: 84.7940, healthScore: 90 },
          { id: 8, assetId: 'CB-6021', 'assetName': '11kV XLPE Underground Cable — Sambalpur', assetType: 'CABLE', status: 'DEGRADED', zone: 'Sambalpur', latitude: 21.4669, longitude: 83.9812, healthScore: 55 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 h-full select-none">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="font-syne font-extrabold text-3xl tracking-wider text-on-surface uppercase">
              Grid GIS Map View
            </h1>
            <p className="font-outfit text-sm text-text-muted mt-1">
              Geographical distribution and real-time operational status map of TPCODL assets.
            </p>
          </div>
        </div>

        {/* Map Container */}
        <Card className="flex-1 min-h-[550px] p-0 overflow-hidden relative">
          <div className="absolute inset-0 z-0">
            <AssetMap assets={assets} center={[20.2961, 85.8245]} zoom={8} />
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default MapViewPage;
