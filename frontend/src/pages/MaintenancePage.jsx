import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../services/api';
import { ZONES } from '../utils/constants';
import { Calendar, Plus, Wrench, ArrowRight, UserCheck, X } from 'lucide-react';

const MaintenancePage = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [assets, setAssets] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    workOrderId: '',
    maintenanceType: 'PREVENTIVE',
    title: '',
    description: '',
    scheduledDate: '',
    estimatedCost: 15000,
    priority: 3,
    assetId: '',
    assignedToId: ''
  });

  const loadData = async () => {
    try {
      const [maintRes, assetsRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/assets')
      ]);
      setMaintenance(maintRes.data);
      setAssets(assetsRes.data);
      
      // Filter or fetch users with role FIELD_ENGINEER or use defaults
      setEngineers([
        { id: 2, fullName: 'Rajesh Kumar Patel' }
      ]);
    } catch (err) {
      console.error('Failed to load maintenance records', err);
      // Fallbacks
      setMaintenance([
        {
          id: 1,
          workOrderId: 'WO-20260609-001',
          maintenanceType: 'PREVENTIVE',
          status: 'SCHEDULED',
          title: 'Quarterly Bushing Inspection',
          description: 'Routine visual and thermal inspection of HV bushings.',
          scheduledDate: '2026-06-15',
          completedDate: null,
          estimatedCost: 8000,
          priority: 3,
          asset: { assetId: 'TR-1001', assetName: '33/11kV Power Transformer — Moradabad Sector-5' },
          assignedTo: { fullName: 'Rajesh Kumar Patel' }
        }
      ]);
      setAssets([
        { id: 1, assetId: 'TR-1001', assetName: '33/11kV Power Transformer — Moradabad Sector-5' }
      ]);
      setEngineers([
        { id: 2, fullName: 'Rajesh Kumar Patel' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenSchedule = () => {
    setFormData({
      workOrderId: 'WO-' + Date.now().toString().slice(-8),
      maintenanceType: 'PREVENTIVE',
      title: '',
      description: '',
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10), // 2 days ahead
      estimatedCost: 15000,
      priority: 3,
      assetId: assets[0]?.id || '',
      assignedToId: engineers[0]?.id || ''
    });
    setShowModal(true);
  };

  const handleScheduleMaintenance = async (e) => {
    e.preventDefault();
    const payload = {
      workOrderId: formData.workOrderId,
      maintenanceType: formData.maintenanceType,
      status: 'SCHEDULED',
      title: formData.title,
      description: formData.description,
      scheduledDate: formData.scheduledDate,
      estimatedCost: parseFloat(formData.estimatedCost),
      priority: parseInt(formData.priority),
      asset: { id: parseInt(formData.assetId) },
      assignedTo: { id: parseInt(formData.assignedToId) }
    };

    try {
      await api.post('/maintenance', payload);
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      // Fallback
      const chosenAsset = assets.find(a => a.id === parseInt(formData.assetId));
      const chosenEngineer = engineers.find(e => e.id === parseInt(formData.assignedToId));
      setMaintenance([...maintenance, {
        id: Date.now(),
        asset: chosenAsset,
        assignedTo: chosenEngineer,
        completedDate: null,
        ...payload
      }]);
      setShowModal(false);
    }
  };

  const handleCompleteTask = async (task) => {
    if (window.confirm('Mark this maintenance activity as completed?')) {
      try {
        await api.put(`/maintenance/${task.id}`, {
          ...task,
          status: 'COMPLETED',
          completedDate: new Date().toISOString().slice(0, 10),
          actualCost: task.estimatedCost
        });
        loadData();
      } catch (err) {
        console.error(err);
        setMaintenance(maintenance.map(m => m.id === task.id ? {
          ...m,
          status: 'COMPLETED',
          completedDate: new Date().toISOString().slice(0, 10),
          actualCost: task.estimatedCost
        } : m));
      }
    }
  };

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
              Grid Maintenance Schedules
            </h1>
            <p className="font-outfit text-sm text-text-muted mt-1">
              Plan scheduled outages, dispatch field engineers, and manage work orders.
            </p>
          </div>
          <Button onClick={handleOpenSchedule} variant="primary" className="flex items-center gap-2">
            <Plus size={16} />
            <span>Schedule Activity</span>
          </Button>
        </div>

        {/* Maintenance list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Schedules */}
          <Card title="Upcoming & In-Progress Tasks">
            <div className="flex flex-col gap-4">
              {maintenance.filter(m => m.status !== 'COMPLETED').length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm font-outfit">
                  No active maintenance activities scheduled.
                </div>
              ) : (
                maintenance.filter(m => m.status !== 'COMPLETED').map(task => (
                  <div key={task.id} className="p-4 bg-surface border border-border flex flex-col gap-2 relative group hover:border-primary/20">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-mono font-bold text-xs text-primary">{task.workOrderId}</span>
                      <Badge status={task.status}>{task.status}</Badge>
                    </div>
                    
                    <h4 className="font-syne font-semibold text-base text-on-surface uppercase tracking-wide">
                      {task.title}
                    </h4>
                    <p className="font-outfit text-xs text-text-muted">{task.description}</p>
                    
                    <div className="mt-2 pt-2 border-t border-border/40 grid grid-cols-2 gap-2 text-xs font-outfit text-text-muted">
                      <div>
                        <strong>Asset:</strong> {task.asset?.assetName} ({task.asset?.assetId})
                      </div>
                      <div>
                        <strong>Assigned Engineer:</strong> {task.assignedTo?.fullName || 'Unassigned'}
                      </div>
                      <div>
                        <strong>Scheduled Date:</strong> {task.scheduledDate}
                      </div>
                      <div>
                        <strong>Est. Cost:</strong> INR {task.estimatedCost?.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        onClick={() => handleCompleteTask(task)}
                        variant="primary" 
                        className="h-8 px-4 text-xs font-semibold"
                      >
                        <UserCheck size={12} className="mr-1.5" />
                        <span>Complete Task</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Completed History */}
          <Card title="Completed Activities History">
            <div className="flex flex-col gap-4">
              {maintenance.filter(m => m.status === 'COMPLETED').length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm font-outfit">
                  No completed maintenance activities recorded.
                </div>
              ) : (
                maintenance.filter(m => m.status === 'COMPLETED').map(task => (
                  <div key={task.id} className="p-4 bg-neutral border border-border/40 opacity-70 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-text-muted">{task.workOrderId}</span>
                      <Badge status="COMPLETED">Completed</Badge>
                    </div>
                    <h4 className="font-syne font-medium text-base text-on-surface uppercase tracking-wide line-through">
                      {task.title}
                    </h4>
                    <div className="mt-2 text-xs font-outfit text-text-muted grid grid-cols-2 gap-2">
                      <div>
                        <strong>Asset:</strong> {task.asset?.assetId}
                      </div>
                      <div>
                        <strong>Engineer:</strong> {task.assignedTo?.fullName}
                      </div>
                      <div>
                        <strong>Completed On:</strong> {task.completedDate}
                      </div>
                      <div>
                        <strong>Actual Cost:</strong> INR {task.actualCost?.toLocaleString('en-IN') || task.estimatedCost?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>

        {/* Schedule Modal */}
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
                Schedule Maintenance Work Order
              </h2>

              <form onSubmit={handleScheduleMaintenance} className="flex flex-col gap-4">
                <Input
                  label="Work Order ID"
                  id="workOrderId"
                  name="workOrderId"
                  value={formData.workOrderId}
                  disabled
                />

                <Input
                  label="Work Order Title"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. SF6 Switchgear Pressure Check"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 w-full">
                    <label className="font-outfit font-medium text-sm text-text-muted uppercase tracking-wider">Maintenance Type</label>
                    <select
                      name="maintenanceType"
                      value={formData.maintenanceType}
                      onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
                      className="w-full bg-surface text-on-surface border border-border px-4 py-3 font-outfit text-sm rounded-none focus:outline-none focus:border-primary"
                    >
                      <option value="PREVENTIVE">Preventive (Routine)</option>
                      <option value="CORRECTIVE">Corrective (Repair)</option>
                      <option value="EMERGENCY">Emergency (Shutdown)</option>
                      <option value="PREDICTIVE">Predictive (Prognostic)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label className="font-outfit font-medium text-sm text-text-muted uppercase tracking-wider">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full bg-surface text-on-surface border border-border px-4 py-3 font-outfit text-sm rounded-none focus:outline-none focus:border-primary"
                    >
                      <option value="1">1 (Highest / Danger)</option>
                      <option value="2">2 (High)</option>
                      <option value="3">3 (Normal)</option>
                      <option value="4">4 (Low)</option>
                    </select>
                  </div>
                </div>

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

                <div className="flex flex-col gap-2 w-full">
                  <label className="font-outfit font-medium text-sm text-text-muted uppercase tracking-wider">Assign Field Engineer</label>
                  <select
                    name="assignedToId"
                    value={formData.assignedToId}
                    onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                    className="w-full bg-surface text-on-surface border border-border px-4 py-3 font-outfit text-sm rounded-none focus:outline-none focus:border-primary"
                  >
                    {engineers.map(eng => (
                      <option key={eng.id} value={eng.id}>
                        {eng.fullName} (Field Engineer)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Scheduled Date"
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    required
                  />

                  <Input
                    label="Estimated Budget (INR)"
                    id="estimatedCost"
                    type="number"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className="font-outfit font-medium text-sm text-text-muted uppercase tracking-wider">Work Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-surface text-on-surface border border-border px-4 py-3 font-outfit text-sm rounded-none focus:outline-none focus:border-primary"
                    placeholder="Provide detailed action items..."
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
                    Dispatch Order
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

export default MaintenancePage;
