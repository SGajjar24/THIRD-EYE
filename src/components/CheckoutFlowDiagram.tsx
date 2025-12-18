import React from 'react';
import { ShoppingCart, CreditCard, Lock, ArrowRight, AlertOctagon } from 'lucide-react';

interface CheckoutFlowDiagramProps {
  strategyText: string;
  isEcommerce: boolean;
}

const CheckoutFlowDiagram: React.FC<CheckoutFlowDiagramProps> = ({ strategyText, isEcommerce }) => {

  if (!isEcommerce) {
    return (
      <div className="bg-tech-panel border border-tech-border rounded-lg p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <AlertOctagon className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No Commerce Detected</h2>
        <p className="text-slate-400 max-w-md">
          The forensic audit determined that this target does not possess standard e-commerce transactional capabilities (Cart/Checkout).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-tech-panel border border-tech-border rounded-lg p-6 shadow-lg animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-tech-accent" />
        Commerce Logic Breakdown
      </h2>
      <p className="text-slate-400 mb-8 text-sm">
        Forensic analysis of the target's checkout and transaction flow.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-sm uppercase">
            <Lock className="w-4 h-4" /> Auth Strategy
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Analysis indicates the site likely uses token-based session management. If a "Guest Checkout" is detected, it typically creates a temporary shadow account linked to the device fingerprint.
          </p>
        </div>

        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-green-400 font-bold text-sm uppercase">
            <CreditCard className="w-4 h-4" /> Payment Gateway
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            The checkout flow hands off sensitive data to a processor (likely Stripe, PayPal, or Shopify Payments) via iframe or redirect to maintain PCI compliance.
          </p>
        </div>

        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-sm uppercase">
            <ArrowRight className="w-4 h-4" /> Step Complexity
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Modern checkouts reduce friction by collapsing address and payment into a single step.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
        <h3 className="text-white font-bold mb-4 font-mono text-sm text-tech-accent">&gt;&gt; ARCHITECT_ANALYSIS_LOG</h3>
        <div className="font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
          {strategyText}
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlowDiagram;
