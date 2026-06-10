import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../services/api';
import { SEVERITIES } from '../utils/constants';
import { AlertTriangle, Plus, Check, Search, X } from 'lucide-react';

const FaultsPage = () => {
  const [faults, setFaults] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    faultId: '',
    faultType: '',
    severity: 'MEDIUM',
    description: '',
    affectedCustomers: 0,
    assetId: ''
  });

  const [resolvingFault, setResolvingFault] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const loadData = async () => {
    try {
      const [faultsRes, assetsRes] = await Promise.all([
        api.get('/faults'),
        api.get('/assets')
      ]);
      setFaults(faultsRes.data);
      setAssets(assetsRes.data);
    } catch (err) {
      console.error('Failed to load faults', err);
      // Fallbacks
      setFaults([
        { id: 1, faultId: 'FLT-20260601-001', faultType: 'Oil Leakage', severity: 'MEDIUM', description: 'Minor oil leak observed on main cooling fins.', reportedAt: '2026-06-01T10:00:00', resolvedAt: null, isResolved: false, affectedCustomers: 0, asset: { assetId: 'TR-1002', assetName: '33/11kV Transformer - Saheed Nagar' } },
        { id: 2, faultId: 'FLT-20260609-002', faultType: 'Overheating & Tripping', severity: 'CRITICAL', description: 'Transformer tripped due to severe thermal load limit breach.', reportedAt: '2026-06-09T14:30:00', resolvedAt: null, isResolved: false, affectedCustomers: 340, asset: { assetId: 'FD-2003', assetName: '11kV Feeder - Cuttack Ring Main' } }
      ]);
      setAssets([
        { id: 1, assetId: 'TR-1001', assetName: 'Transformer 1' },
        { id: 2, assetId: 'TR-1002', assetName: 'Transformer 2' },
        { id: 4, assetId: 'FD-2003', assetName: 'Feeder 3' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenReport = () => {
    setFormData({
      faultId: 'FLT-' + Date.now().toString().slice(-8),
      faultType: '',
      severity: 'MEDIUM',
      description: '',
      affectedCustomers: 0,
      assetId: assets[0]?.id || ''
    });
    setShowModal(true);
  };

  const handleReportFault = async (e) => {
    e.preventDefault();
    const payload = {
      faultId: formData.faultId,
      faultType: formData.faultType,
      severity: formData.severity,
      description: formData.description,
      affectedCustomers: parseInt(formData.affectedCustomers),
      isResolved: false,
      asset: { id: parseInt(formData.assetId) }
    };

    try {
      await api.post('/faults', payload);
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      // Fallback
      const chosenAsset = assets.find(a => a.id === parseInt(formData.assetId));
      setFaults([...faults, {
        id: Date.now(),
        reportedAt: new Date().toISOString(),
        isResolved: false,
        resolvedAt: null,
        asset: chosenAsset,
        ...payload
      }]);
      setShowModal(false);
    }
  };

  const handleResolveFault = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/faults/${resolvingFault.id}`, {
        ...resolvingFault,
        isResolved: true,
        resolutionNotes: resolutionNotes,
        resolvedAt: new Date().toISOString()
      });
      setResolvingFault(null);
      setResolutionNotes('');
      loadData();
    } catch (err) {
      console.error(err);
      // Fallback
      setFaults(faults.map(f => f.id === resolvingFault.id ? {
        ...f,
        isResolved: true,
        resolutionNotes: resolutionNotes,
        resolvedAt: new Date().toISOString()
      } : f));
      setResolvingFault(null);
      setResolutionNotes('');
    }
  };

  const filteredFaults = faults.filter(fault => {
    const matchesSearch = fault.faultType.toLowerCase().includes(search.toLowerCase()) || 
                          (fault.asset?.assetId || '').toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = selectedSeverity ? fault.severity === selectedSeverity : true;
    const matchesStatus = selectedStatus 
      ? (selectedStatus === 'RESOLVED' ? fault.isResolved : !fault.isResolved)
      : true;
    return matchesSearch && matchesSeverity && matchesStatus;
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
              Fault Reporting & Log
            </h1>
            <p className="font-outfit text-sm text-text-muted mt-1">
              Log active grid failures and track restoration status.
            </p>
          </div>
          <Button onClick={handleOpenReport} variant="primary" className="flex items-center gap-2">
            <Plus size={16} />
            <span>Report Grid Fault</span>
          </Button>
        </div>

        {/* Filters */}
        <Card className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search fault type or asset ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface text-on-surface border border-border pl-10 pr-4 py-2 font-outfit text-sm rounded-none focus:outline-none focus:border-primary"
            />
            <Search size={16} className="absolute left-3.5 top-[13px] text-text-muted" />
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-surface text-on-surface border border-border px-3 py-2 font-outfit text-xs rounded-none focus:outline-none focus:border-primary"
            >
              <option value="">All Severities</option>
              {Object.keys(SEVERITIES).map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Resolution Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-surface text-on-surface border border-border px-3 py-2 font-outfit text-xs rounded-none focus:outline-none focus:border-primary"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active / Unresolved</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </Card>

        {/* Faults List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredFaults.length === 0 ? (
            <Card className="text-center py-12 text-text-muted">
              No reported faults found.
            </Card>
          ) : (
            filteredFaults.map(fault => (
              <Card 
                key={fault.id}
                className={`border-l-4 ${
                  fault.isResolved ? 'border-l-primary/45' : 
                  fault.severity === 'CRITICAL' ? 'border-l-error text-error/90' :
                  fault.severity === 'HIGH' ? 'border-l-error/70' : 'border-l-yellow-500'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono font-bold text-xs bg-surface border border-border px-2 py-0.5 text-text-muted">
                        {fault.faultId}
                      </span>
                      <h3 className="font-syne font-semibold text-lg text-on-surface uppercase tracking-wide">
                        {fault.faultType}
                      </h3>
                      <Badge status={fault.severity}>{fault.severity}</Badge>
                      <Badge status={fault.isResolved ? 'OPERATIONAL' : 'FAULTY'}>
                        {fault.isResolved ? 'Resolved' : 'Active'}
                      </Badge>
                    </div>

                    <p className="font-outfit text-sm text-text-muted mt-1">{fault.description}</p>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-xs font-outfit text-text-muted">
                      <p><strong className="text-on-surface">Affected Grid Asset:</strong> {fault.asset?.assetName || 'Unknown'} ({fault.asset?.assetId})</p>
                      <p><strong className="text-on-surface">Affected Customers:</strong> {fault.affectedCustomers}</p>
                      <p><strong className="text-on-surface">Reported:</strong> {new Date(fault.reportedAt).toLocaleString()}</p>
                      {fault.isResolved && (
                        <p><strong className="text-on-surface text-primary">Resolved:</strong> {new Date(fault.resolvedAt).toLocaleString()}</p>
                      )}
                    </div>

                    {fault.isResolved && fault.resolutionNotes && (
                      <div className="mt-3 p-3 bg-surface border border-border/50 text-xs">
                        <strong className="text-primary font-syne uppercase tracking-wider block mb-1">Resolution Summary</strong>
                        <p className="text-text-muted italic">{fault.resolutionNotes}</p>
                      </div>
                    )}
                  </div>

                  {!fault.isResolved && (
                    <Button 
                      onClick={() => setResolvingFault(fault)}
                      variant="primary" 
                      className="h-10 px-5 text-sm shrink-0 border border-primary text-primary hover:bg-primary/10 self-start md:self-center"
                    >
                      <Check size={14} className="mr-1.5" />
                      <span>Resolve Fault</span>
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Report Fault Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-neutral/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-surface border border-border p-6 relative">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-text-muted hover:text-on-surface"
              >
                <X size={20} />
              </button>

              <h2 className="font-syne font-semibold text-xl uppercase tracking-widest text-primary mb-6">
                Log New Grid Failure
              </h2>

              <form onSubmit={handleReportFault} className="flex flex-col gap-4">
                <Input
                  label="Fault ID"
                  id="faultId"
                  name="faultId"
                  value={formData.faultId}
                  disabled
                />

                <Input
                  label="Failure Type / Title"
                  id="faultType"
                  name="faultType"
                  value={formData.faultType}
                  onChange={(e) => setFormData({ ...formData, faultType: e.target.value })}
                  placeholder="e.g. SF6 Leakage, Winding Flashover"
                  required
                />

                <div className="flex flex-col gap-2 w-full">
                  <label className="font-outfit font-medium text-sm text-text-muted uppercase tracking-wider">Target Grid Asset</label>
                  <select
                    name="assetId"
                    value={formData.assetId}
                    onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                    className="w-full bg-surface text-on-surface border border-border px-4 py-3 font-outfit text-sm rounded-none focus:outline-none focus:border-primary"
                  >
                    {assets.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.assetId} — {a.assetName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 w-full">
                    <label className="font-outfit font-medium text-sm text-text-muted uppercase tracking-wider">Severity</label>
                    <select
                      name="severity"
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                      className="w-full bg-surface text-on-surface border border-border px-4 py-3 font-outfit text-sm rounded-none focus:outline-none focus:border-primary"
                    >
                      {Object.keys(SEVERITIES).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  <Input
                    label="Affected Customers"
                    id="affectedCustomers"
                    type="number"
                    value={formData.affectedCustomers}
                    onChange={(e) => setFormData({ ...formData, affectedCustomers: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className="font-outfit font-medium text-sm text-text-muted uppercase tracking-wider">Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-surface text-on-surface border border-border px-4 py-3 font-outfit text-sm rounded-none focus:outline-none focus:border-primary"
                    placeholder="Provide details about the issue..."
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
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
                    Log Fault
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Resolve Fault Modal */}
        {resolvingFault && (
          <div className="fixed inset-0 bg-neutral/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-surface border border-border p-6 relative">
              <button 
                onClick={() => setResolvingFault(null)}
                className="absolute right-4 top-4 text-text-muted hover:text-on-surface"
              >
                <X size={20} />
              </button>

              <h2 className="font-syne font-semibold text-xl uppercase tracking-widest text-primary mb-6">
                Resolve Fault — {resolvingFault.faultId}
              </h2>

              <form onSubmit={handleResolveFault} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-outfit font-medium text-sm text-text-muted uppercase tracking-wider">Resolution Notes</label>
                  <textarea
                    rows="4"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full bg-surface text-on-surface border border-border px-4 py-3 font-outfit text-sm rounded-none focus:outline-none focus:border-primary"
                    placeholder="Describe what repair actions were taken to resolve this fault..."
                    required
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button 
                    onClick={() => setResolvingFault(null)}
                    variant="secondary"
                    className="h-10 px-6"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    variant="primary"
                    className="h-10 px-6"
                  >
                    Mark Resolved
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

export default FaultsPage;
