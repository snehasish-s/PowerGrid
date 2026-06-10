import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../services/api';
import { ZONES, ASSET_TYPES, ASSET_STATUS } from '../utils/constants';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({
    assetId: '',
    assetName: '',
    assetType: 'TRANSFORMER',
    status: 'OPERATIONAL',
    location: '',
    zone: 'Bhubaneswar',
    latitude: '',
    longitude: '',
    manufacturer: '',
    model: '',
    installationDate: '',
    ratedCapacity: '',
    voltageLevel: '',
    healthScore: 100
  });

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets');
      setAssets(response.data);
    } catch (error) {
      console.error('Failed to load assets', error);
      // Fallback
      setAssets([
        { id: 1, assetId: 'TR-1001', assetName: '33/11kV Power Transformer — Moradabad Sector-5', assetType: 'TRANSFORMER', status: 'OPERATIONAL', location: 'Moradabad Sector-5, Near SBI Bank', zone: 'Bhubaneswar', latitude: 20.2961, longitude: 85.8245, manufacturer: 'Crompton Greaves', model: 'CGL 33kV 5MVA ONAN', installationDate: '2019-03-15', ratedCapacity: '5 MVA', voltageLevel: '33kV', healthScore: 92 },
        { id: 2, assetId: 'TR-1002', assetName: '33/11kV Distribution Transformer — Saheed Nagar', assetType: 'TRANSFORMER', status: 'DEGRADED', location: 'Saheed Nagar, Main Road Junction', zone: 'Bhubaneswar', latitude: 20.2856, longitude: 85.8462, manufacturer: 'ABB India', model: 'ABB 33kV 3MVA ONAN', installationDate: '2017-06-20', ratedCapacity: '3 MVA', voltageLevel: '33kV', healthScore: 64 },
        { id: 3, assetId: 'FD-2001', assetName: '11kV Feeder — Patia Industrial', assetType: 'FEEDER', status: 'OPERATIONAL', location: 'Patia Industrial Area, KIIT Road', zone: 'Bhubaneswar', latitude: 20.3540, longitude: 85.8190, manufacturer: 'Siemens India', model: 'Siemens 11kV HV', installationDate: '2020-01-10', ratedCapacity: '400A', voltageLevel: '11kV', healthScore: 88 },
        { id: 4, assetId: 'FD-2003', assetName: '11kV Feeder — Cuttack Ring Main', assetType: 'FEEDER', status: 'FAULTY', location: 'Cuttack Ring Road, Near Barabati', zone: 'Cuttack', latitude: 20.4625, longitude: 85.8828, manufacturer: 'L&T Electrical', model: 'LT 11kV RMU', installationDate: '2018-09-05', ratedCapacity: '630A', voltageLevel: '11kV', healthScore: 35 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleOpenCreate = () => {
    setEditingAsset(null);
    setFormData({
      assetId: '',
      assetName: '',
      assetType: 'TRANSFORMER',
      status: 'OPERATIONAL',
      location: '',
      zone: 'Bhubaneswar',
      latitude: '',
      longitude: '',
      manufacturer: '',
      model: '',
      installationDate: '',
      ratedCapacity: '',
      voltageLevel: '',
      healthScore: 100
    });
    setShowModal(true);
  };

  const handleOpenEdit = (asset) => {
    setEditingAsset(asset);
    setFormData({
      assetId: asset.assetId,
      assetName: asset.assetName,
      assetType: asset.assetType,
      status: asset.status,
      location: asset.location || '',
      zone: asset.zone,
      latitude: asset.latitude || '',
      longitude: asset.longitude || '',
      manufacturer: asset.manufacturer || '',
      model: asset.model || '',
      installationDate: asset.installationDate || '',
      ratedCapacity: asset.ratedCapacity || '',
      voltageLevel: asset.voltageLevel || '',
      healthScore: asset.healthScore || 100
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to decommission/delete this asset?')) {
      try {
        await api.delete(`/assets/${id}`);
        fetchAssets();
      } catch (err) {
        console.error(err);
        // Local state cleanup fallback
        setAssets(assets.filter(a => a.id !== id));
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      healthScore: parseInt(formData.healthScore)
    };

    try {
      if (editingAsset) {
        await api.put(`/assets/${editingAsset.id}`, payload);
      } else {
        await api.post('/assets', payload);
      }
      setShowModal(false);
      fetchAssets();
    } catch (err) {
      console.error('Submit failed', err);
      // Local state update fallback
      if (editingAsset) {
        setAssets(assets.map(a => a.id === editingAsset.id ? { ...a, ...payload } : a));
      } else {
        setAssets([...assets, { id: Date.now(), ...payload }]);
      }
      setShowModal(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.assetName.toLowerCase().includes(search.toLowerCase()) || 
                          asset.assetId.toLowerCase().includes(search.toLowerCase());
    const matchesZone = selectedZone ? asset.zone === selectedZone : true;
    const matchesType = selectedType ? asset.assetType === selectedType : true;
    const matchesStatus = selectedStatus ? asset.status === selectedStatus : true;
    return matchesSearch && matchesZone && matchesType && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 select-none">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="font-syne font-extrabold text-3xl tracking-wider text-on-surface uppercase">
              Grid Assets Inventory
            </h1>
            <p className="font-outfit text-sm text-text-muted mt-1">
              Manage and track grid components across Tata Power distribution zones.
            </p>
          </div>
          <Button onClick={handleOpenCreate} variant="primary" className="flex items-center gap-2">
            <Plus size={16} />
            <span>Commission Asset</span>
          </Button>
        </div>

        {/* Filters Panel */}
        <Card className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search assets name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface text-on-surface border border-border pl-10 pr-4 py-2 font-outfit text-sm rounded-none focus:outline-none focus:border-primary"
            />
            <Search size={16} className="absolute left-3.5 top-[13px] text-text-muted" />
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            {/* Zone Filter */}
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-surface text-on-surface border border-border px-3 py-2 font-outfit text-xs rounded-none focus:outline-none focus:border-primary"
            >
              <option value="">All Zones</option>
              {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-surface text-on-surface border border-border px-3 py-2 font-outfit text-xs rounded-none focus:outline-none focus:border-primary shadow-sm"
            >
              <option value="">All Types</option>
              {Object.keys(ASSET_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-surface text-on-surface border border-border px-3 py-2 font-outfit text-xs rounded-none focus:outline-none focus:border-primary shadow-sm"
            >
              <option value="">All Statuses</option>
              {Object.keys(ASSET_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </Card>

        {/* Assets Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-outfit text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted uppercase text-xs tracking-wider">
                  <th className="py-3 px-4">Asset ID</th>
                  <th className="py-3 px-4">Asset Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Zone</th>
                  <th className="py-3 px-4">Health</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-text-muted">
                      No assets match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-surface/30 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-primary text-electric-glow">{asset.assetId}</td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-on-surface">{asset.assetName}</div>
                        <div className="text-xs text-text-muted">{asset.location}</div>
                      </td>
                      <td className="py-4 px-4 font-mono text-xs">{asset.assetType}</td>
                      <td className="py-4 px-4">{asset.zone}</td>
                      <td className="py-4 px-4">
                        <span className={`font-mono font-bold ${
                          asset.healthScore > 80 ? 'text-primary' :
                          asset.healthScore > 50 ? 'text-yellow-500' : 'text-error'
                        }`}>
                          {asset.healthScore}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge status={asset.status}>{asset.status}</Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEdit(asset)}
                            className="p-1.5 border border-border hover:border-primary text-text-muted hover:text-primary transition-all duration-200"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(asset.id)}
                            className="p-1.5 border border-border hover:border-error text-text-muted hover:text-error transition-all duration-200"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-neutral/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl bg-surface border border-border p-6 relative max-h-[90vh] overflow-y-auto">
              
              <button 
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-text-muted hover:text-on-surface"
              >
                <X size={20} />
              </button>

              <h2 className="font-syne font-semibold text-xl uppercase tracking-widest text-primary mb-6">
                {editingAsset ? 'Edit Commissioned Asset' : 'Commission New Asset'}
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Asset ID"
                  id="assetId"
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleFormChange}
                  placeholder="e.g. TR-1001"
                  required
                />
                
                <Input
                  label="Asset Name"
                  id="assetName"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleFormChange}
                  placeholder="e.g. 33/11kV Transformer"
                  required
                />

                <div className="flex flex-col gap-2 w-full">
                  <label className="font-outfit font-medium text-sm text-text-muted uppercase tracking-wider">Asset Type</label>
                  <select
                    name="assetType"
                    value={formData.assetType}
                    onChange={handleFormChange}
                    className="w-full bg-surface text-on-surface border border-border px-4 py-3 font-outfit text-sm rounded-none focus:outline-none focus:border-primary"
                  >
                    {Object.keys(ASSET_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className="font-outfit font-medium text-sm text-text-muted uppercase tracking-wider">Zone</label>
                  <select
                    name="zone"
                    value={formData.zone}
                    onChange={handleFormChange}
                    className="w-full bg-surface text-on-surface border border-border px-4 py-3 font-outfit text-sm rounded-none focus:outline-none focus:border-primary"
                  >
                    {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className="font-outfit font-medium text-sm text-text-muted uppercase tracking-wider">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full bg-surface text-on-surface border border-border px-4 py-3 font-outfit text-sm rounded-none focus:outline-none focus:border-primary"
                  >
                    {Object.keys(ASSET_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <Input
                  label="Health Score (%)"
                  id="healthScore"
                  name="healthScore"
                  type="number"
                  value={formData.healthScore}
                  onChange={handleFormChange}
                  placeholder="100"
                  required
                />

                <Input
                  label="Location Description"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  placeholder="e.g. Near SBI Bank"
                />

                <Input
                  label="Manufacturer"
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleFormChange}
                  placeholder="e.g. ABB India"
                />

                <Input
                  label="Model"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleFormChange}
                  placeholder="e.g. SF6 Circuit Breaker"
                />

                <Input
                  label="Installation Date"
                  id="installationDate"
                  name="installationDate"
                  type="date"
                  value={formData.installationDate}
                  onChange={handleFormChange}
                />

                <Input
                  label="Latitude"
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={handleFormChange}
                  placeholder="e.g. 20.2961"
                />

                <Input
                  label="Longitude"
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={handleFormChange}
                  placeholder="e.g. 85.8245"
                />

                <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                  <Button 
                    onClick={() => setShowModal(false)}
                    variant="secondary"
                    className="h-10 px-6 font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    variant="primary"
                    className="h-10 px-6 font-semibold"
                  >
                    {editingAsset ? 'Save Changes' : 'Commission'}
                  </Button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AssetsPage;
