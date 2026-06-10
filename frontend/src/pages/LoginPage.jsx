import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usernameOrEmail, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Authentication failed. Please verify credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-neutral overflow-hidden px-4">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0b0f0d_1px,transparent_1px),linear-gradient(to_bottom,#0b0f0d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
      
      {/* Pulse backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-surface border border-border p-8 relative z-10 transition-all duration-300 hover:border-primary/20">
        
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 border border-primary p-4 mb-4 text-primary text-electric-glow">
            <Zap size={32} />
          </div>
          <h1 className="font-syne font-extrabold text-3xl uppercase tracking-wider text-on-surface">
            PowerPulse <span className="text-primary text-electric-glow">AI</span>
          </h1>
          <p className="font-outfit text-xs text-text-muted uppercase tracking-widest mt-2">
            TPCODL Asset Intelligence Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error/10 border border-error text-error text-xs font-outfit flex items-center gap-2">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Username or Email"
            id="usernameOrEmail"
            placeholder="e.g. admin@tpcodl.com"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            disabled={loading}
          />

          <div className="relative w-full">
            <Input
              label="Password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-text-muted hover:text-on-surface"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs mt-1">
            <label className="flex items-center gap-2 text-text-muted cursor-pointer font-outfit">
              <input type="checkbox" className="accent-primary border-border bg-neutral rounded-none h-4 w-4" />
              <span>Remember Device</span>
            </label>
            <a href="#forgot" className="text-primary hover:underline font-outfit">Reset Password</a>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading} 
            className="w-full mt-2"
          >
            {loading ? 'Validating Token...' : 'Enter System'}
          </Button>
        </form>

        {/* Demo Notice */}
        <div className="mt-8 border-t border-border/50 pt-4 text-center">
          <p className="font-outfit text-[11px] text-text-muted leading-relaxed">
            Authorized personnel only. Access logs are monitored.<br/>
            Demo login: <code className="text-primary">admin@tpcodl.com</code> / <code className="text-primary">Admin@2026!</code>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
