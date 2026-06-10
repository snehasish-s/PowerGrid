import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../services/api';
import { BrainCircuit, Play, AlertOctagon, Check } from 'lucide-react';

const PredictionsPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggeringId, setTriggeringId] = useState(null);

  const loadData = async () => {
    try {
      const [predsRes, assetsRes] = await Promise.all([
        api.get('/predictions'),
        api.get('/assets')
      ]);
      setPredictions(predsRes.data);
      setAssets(assetsRes.data);
    } catch (err) {
      console.error('Failed to load predictions', err);
      // Fallback
      setPredictions([
        {
          id: 1,
          predictionId: 'PRD-20260609-001',
          failureProbability: 0.64,
          predictedFailureDate: '2026-06-25',
          failureMode: 'Bushing Failure (Moisture Content)',
          confidenceScore: 0.88,
          modelVersion: 'XGBoost-AssetHealth-v1.0',
          recommendedAction: 'Schedule inspection within next cycle',
          predictionHorizonDays: 30,
          actionTaken: false,
          asset: { id: 2, assetId: 'TR-1002', assetName: '33/11kV Distribution Transformer — Saheed Nagar', status: 'DEGRADED', zone: 'Bhubaneswar' }
        }
      ]);
      setAssets([
        { id: 1, assetId: 'TR-1001', assetName: '33/11kV Power Transformer — Moradabad Sector-5', status: 'OPERATIONAL' },
        { id: 2, assetId: 'TR-1002', assetName: '33/11kV Distribution Transformer — Saheed Nagar', status: 'DEGRADED' },
        { id: 4, assetId: 'FD-2003', assetName: '11kV Feeder — Cuttack Ring Main', status: 'FAULTY' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTriggerPrediction = async (assetId) => {
    setTriggeringId(assetId);
    try {
      await api.post(`/predictions/trigger/${assetId}`);
      await loadData();
    } catch (err) {
      console.error('Failed to run ML prediction model', err);
      // Mock insert fallback
      const targetAsset = assets.find(a => a.id === assetId);
      let prob = 0.18;
      let risk = "MEDIUM";
      if (targetAsset.status === 'DEGRADED') {
        prob = 0.65;
        risk = "HIGH";
      } else if (targetAsset.status === 'FAULTY') {
        prob = 0.92;
        risk = "CRITICAL";
      }
      
      setPredictions(prev => [
        {
          id: Date.now(),
          predictionId: 'PRD-' + Math.floor(Date.now() / 1000),
          failureProbability: prob,
          predictedFailureDate: new Date(Date.now() + 86400000 * (risk === 'CRITICAL' ? 2 : 15)).toISOString().slice(0, 10),
          failureMode: `${targetAsset.assetType || 'Asset'} Insulation Failure`,
          confidenceScore: 0.85,
          modelVersion: 'FallbackHeuristic-v1.0',
          recommendedAction: risk === 'CRITICAL' ? 'Schedule emergency shutdown maintenance immediately' : 'Request diagnostic inspection',
          predictionHorizonDays: 30,
          actionTaken: false,
          asset: targetAsset
        },
        ...prev
      ]);
    } finally {
      setTriggeringId(null);
    }
  };

  const handleTakeAction = async (predId) => {
    try {
      await api.post(`/predictions/${predId}/action`);
      loadData();
    } catch (err) {
      console.error(err);
      setPredictions(predictions.map(p => p.id === predId ? { ...p, actionTaken: true } : p));
    }
  };

  const getRiskLevel = (prob) => {
    if (prob > 0.75) return 'CRITICAL';
    if (prob > 0.40) return 'HIGH';
    if (prob > 0.15) return 'MEDIUM';
    return 'LOW';
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
              AI Failure Predictions
            </h1>
            <p className="font-outfit text-sm text-text-muted mt-1">
              Prognostics and health management workspace powered by XGBoost failure probability models.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Diagnostic Controls */}
          <Card title="Run Diagnostic Models" className="lg:col-span-1">
            <p className="font-outfit text-xs text-text-muted mb-4">
              Select an asset to compile operating features (vibration, thermal telemetry, load profiles) and execute failure prediction.
            </p>
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
              {assets.map(asset => (
                <div key={asset.id} className="p-3 bg-surface border border-border flex items-center justify-between gap-4">
                  <div>
                    <h5 className="font-syne font-semibold text-sm text-on-surface uppercase">{asset.assetId}</h5>
                    <p className="font-outfit text-[11px] text-text-muted truncate max-w-[160px]">{asset.assetName}</p>
                  </div>
                  <Button
                    onClick={() => handleTriggerPrediction(asset.id)}
                    variant="primary"
                    disabled={triggeringId === asset.id}
                    className="h-8 px-3 text-xs uppercase font-bold border border-primary text-primary"
                  >
                    {triggeringId === asset.id ? (
                      <span className="animate-spin inline-block h-3 w-3 border border-transparent border-t-primary rounded-full mr-1"></span>
                    ) : (
                      <Play size={10} className="mr-1" />
                    )}
                    <span>Run ML</span>
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Predictions Log */}
          <Card title="Predictions Prognostics Log" className="lg:col-span-2">
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
              {predictions.length === 0 ? (
                <div className="text-center py-12 text-text-muted font-outfit text-sm">
                  No predictions recorded. Execute diagnostics on the left.
                </div>
              ) : (
                predictions.map(pred => {
                  const risk = getRiskLevel(pred.failureProbability);
                  return (
                    <div 
                      key={pred.id} 
                      className={`p-4 bg-surface border flex flex-col gap-2 transition-all ${
                        pred.actionTaken ? 'border-border/30 opacity-60' :
                        risk === 'CRITICAL' ? 'border-error shadow-[0_0_10px_rgba(255,107,107,0.15)]' :
                        risk === 'HIGH' ? 'border-yellow-500/70' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-text-muted">{pred.predictionId}</span>
                          <span className="text-[10px] font-mono text-text-muted">Model: {pred.modelVersion}</span>
                        </div>
                        <Badge status={risk}>{risk} RISK</Badge>
                      </div>

                      <div className="flex items-center justify-between gap-4 mt-1">
                        <div>
                          <h4 className="font-syne font-semibold text-base text-on-surface uppercase">
                            {pred.asset?.assetName} ({pred.asset?.assetId})
                          </h4>
                          <p className="font-outfit text-xs text-text-muted mt-1">
                            <strong className="text-on-surface">Failure Mode:</strong> {pred.failureMode || 'General Breakdown'}
                          </p>
                          <p className="font-outfit text-xs text-text-muted">
                            <strong className="text-on-surface">Recommendations:</strong> {pred.recommendedAction}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-syne font-extrabold text-2xl text-on-surface block leading-none">
                            {Math.round(pred.failureProbability * 100)}%
                          </span>
                          <span className="font-outfit text-[10px] text-text-muted uppercase tracking-widest block mt-1">
                            Probability
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between flex-wrap gap-2 text-[10px] font-mono text-text-muted">
                        <span>Horizon: {pred.predictionHorizonDays} Days (Est. Failure: {pred.predictedFailureDate})</span>
                        {!pred.actionTaken ? (
                          <button
                            onClick={() => handleTakeAction(pred.id)}
                            className="flex items-center gap-1 text-primary hover:underline font-outfit uppercase tracking-widest text-[9px] font-bold"
                          >
                            <Check size={10} />
                            <span>Acknowledge / Act</span>
                          </button>
                        ) : (
                          <span className="text-primary font-outfit uppercase tracking-widest text-[9px] font-bold">Action Logged</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default PredictionsPage;
