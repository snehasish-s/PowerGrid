import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral flex flex-col items-center justify-center p-8 select-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0b0f0d_1px,transparent_1px),linear-gradient(to_bottom,#0b0f0d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      
      <div className="text-center flex flex-col items-center max-w-md relative z-10">
        <div className="text-error border border-error bg-error/5 p-4 mb-6 text-electric-glow">
          <AlertCircle size={48} />
        </div>
        <h1 className="font-syne font-extrabold text-5xl text-on-surface uppercase tracking-wider mb-2">
          404 Error
        </h1>
        <h3 className="font-syne font-semibold text-lg text-primary uppercase tracking-widest mb-4">
          Grid Node Offline
        </h3>
        <p className="font-outfit text-sm text-text-muted mb-8 leading-relaxed">
          The requested coordinate or view node does not exist on the current platform topology mapping.
        </p>
        <Button onClick={() => navigate('/')} variant="primary">
          Return to Command Center
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
