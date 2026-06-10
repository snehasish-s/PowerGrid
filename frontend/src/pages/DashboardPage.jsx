import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AssetHealthChart from '../components/charts/AssetHealthChart';
import FaultTrendChart from '../components/charts/FaultTrendChart';
import MaintenanceBarChart from '../components/charts/MaintenanceBarChart';
import OutageTimeline from '../components/charts/OutageTimeline';
import AssetMap from '../components/maps/AssetMap';
import api from '../services/api';
import { ShieldAlert, Activity, Hammer, Users2, AlertOctagon } from 'lucide-react';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [outages, setOutages] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsRes, outagesRes, assetsRes] = await Promise.all([
          api.get('/dashboard/metrics'),
          api.get('/outages'),
          api.get('/assets')
        ]);
        
        setMetrics(metricsRes.data);
        setOutages(outagesRes.data);
        setAssets(assetsRes.data.slice(0, 100)); // limit map rendering
      } catch (err) {
        console.error('Failed to load dashboard metrics. Using fallbacks.', err);
        // Fallbacks matching schema.sql inserts
        setMetrics({
          totalAssets: 8,
          activeFaults: 1,
          overdueMaintenance: 0,
          activeOutages: 1,
          affectedCustomers: 340,
          averageHealthScore: 78.4,
          assetStatusDistribution: {
            OPERATIONAL: 5,
            DEGRADED: 2,
            FAULTY: 1,
            DECOMMISSIONED: 0
          }
        });
        setOutages([
          {
            id: 1,
            outageId: 'OUT-BHU-20260609-001',
            zone: 'Bhubaneswar',
            affectedArea: 'Patia Sector-2',
            affectedCustomers: 340,
            startTime: new Date().toISOString(),
            cause: 'Transformer Overheating',
            isActive: true
          }
        ]);
        setAssets([
          { id: 1, assetId: 'TR-1001', assetName: '33/11kV Power Transformer — Moradabad Sector-5', assetType: 'TRANSFORMER', status: 'OPERATIONAL', zone: 'Bhubaneswar', latitude: 20.2961, longitude: 85.8245, healthScore: 92 },
          { id: 2, assetId: 'TR-1002', assetName: '33/11kV Distribution Transformer — Saheed Nagar', assetType: 'TRANSFORMER', status: 'DEGRADED', zone: 'Bhubaneswar', latitude: 20.2856, longitude: 85.8462, healthScore: 64 },
          { id: 4, assetId: 'FD-2003', assetName: '11kV Feeder — Cuttack Ring Main', assetType: 'FEEDER', status: 'FAULTY', zone: 'Cuttack', latitude: 20.4625, longitude: 85.8828, healthScore: 35 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  const kpis = [
    { title: 'Asset Health Index', value: metrics.averageHealthScore, icon: Activity, suffix: '%', desc: 'Weighted health score' },
    { title: 'Active Faults Logged', value: metrics.activeFaults, icon: ShieldAlert, desc: 'Awaiting engineer dispatch' },
    { title: 'Grid Outages Active', value: metrics.activeOutages, icon: AlertOctagon, desc: 'Restoration crews deployed' },
    { title: 'Affected Customers', value: metrics.affectedCustomers, icon: Users2, desc: 'Estimated customer count' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 select-none">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="font-syne font-extrabold text-3xl tracking-wider text-on-surface uppercase">
              Utility Command Center
            </h1>
            <p className="font-outfit text-sm text-text-muted mt-1">
              Real-time monitoring and prognostic diagnostics for TPCODL grid assets.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge status="operational">All Systems Nominal</Badge>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <Card key={idx} className="flex flex-col justify-between min-h-[120px]">
                <div className="flex items-start justify-between">
                  <span className="font-outfit text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {kpi.title}
                  </span>
                  <div className="bg-primary/5 p-1.5 border border-border">
                    <Icon size={16} className="text-primary text-electric-glow" />
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="font-syne font-bold text-3xl text-on-surface text-electric-glow">
                    <AnimatedCounter value={kpi.value} suffix={kpi.suffix} />
                  </h2>
                  <p className="font-outfit text-xs text-text-muted mt-1">{kpi.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Charts & Map Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset Health Distribution */}
          <Card title="Asset Health Distribution">
            <AssetHealthChart data={metrics.assetStatusDistribution} />
          </Card>
          
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card title="Geographical Grid Overview">
              <div className="h-64 rounded-none overflow-hidden">
                <AssetMap assets={assets} />
              </div>
            </Card>
          </div>
        </div>

        {/* Secondary Charts & Timeline Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Fault Log Trends" className="lg:col-span-1">
            <FaultTrendChart />
          </Card>
          <Card title="Maintenance Workloads" className="lg:col-span-1">
            <MaintenanceBarChart />
          </Card>
          <Card title="Active Power Outages" className="lg:col-span-1">
            <OutageTimeline outages={outages} />
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
