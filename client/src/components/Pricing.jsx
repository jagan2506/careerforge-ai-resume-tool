import React from "react";

const Pricing = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Plans (Stripe disabled in dev)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold mb-1">Free</h3>
          <p className="text-sm text-slate-500 mb-4">
            Test the magic once (concept only).
          </p>
          <p className="text-3xl font-bold mb-4">₹0</p>
          <ul className="text-sm text-slate-600 space-y-1 mb-6">
            <li>• 1 AI-optimized resume</li>
            <li>• Basic ATS scoring</li>
          </ul>
          <button
            className="mt-auto border border-slate-300 rounded-full py-2 text-sm"
            disabled
          >
            Current plan
          </button>
        </div>

        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-semibold mb-1">Pro</h3>
          <p className="text-sm text-slate-300 mb-4">
            In development, all features are unlocked without payment.
          </p>
          <p className="text-3xl font-bold mb-4">
            ₹499<span className="text-sm font-normal"> / month</span>
          </p>
          <ul className="text-sm text-slate-100 space-y-1 mb-6">
            <li>• Unlimited resume rewrites</li>
            <li>• Unlimited cover letters</li>
            <li>• Premium templates (coming soon)</li>
          </ul>
          <button
            className="mt-auto bg-gray-400 text-slate-900 rounded-full py-2 text-sm font-medium"
            disabled
          >
            Payments disabled in dev
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
