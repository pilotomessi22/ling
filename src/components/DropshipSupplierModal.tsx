import React from 'react';
import { X, PackageCheck, DollarSign, TrendingUp, ExternalLink, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../data/storeData.ts';
import { formatCurrency } from '../utils/storeLogic.ts';

interface DropshipSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DropshipSupplierModal: React.FC<DropshipSupplierModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#2D5A43] text-white flex items-center justify-center">
            <PackageCheck size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Store Owner Intelligence Hub
            </span>
            <h3 className="text-xl font-black text-stone-900 mt-1">
              US Dropshipping & Supplier Fulfillment Guide
            </h3>
          </div>
        </div>

        {/* 3-Step Dropshipping Fulfillment Workflow */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
            How Your Automated US Dropshipping Works:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-[#2D5A43] text-white font-black text-xs flex items-center justify-center mb-2">
                1
              </span>
              <p className="font-bold text-stone-900">American Customer Buys</p>
              <p className="text-[11px] text-stone-500 mt-1">
                Customer places order on Ling Petshop paying retail price ($44.95).
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-[#2D5A43] text-white font-black text-xs flex items-center justify-center mb-2">
                2
              </span>
              <p className="font-bold text-stone-900">Forward to Supplier</p>
              <p className="text-[11px] text-stone-500 mt-1">
                You forward the customer's US address to CJ Dropshipping / Zendrop paying wholesale ($15.50).
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-[#2D5A43] text-white font-black text-xs flex items-center justify-center mb-2">
                3
              </span>
              <p className="font-bold text-stone-900">Fast 3-Day US Delivery</p>
              <p className="text-[11px] text-stone-500 mt-1">
                Supplier ships unbranded package from US warehouse with USPS tracking. You keep <strong>$29.45 profit!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Profit Margin Matrix */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center justify-between">
            <span>Product Profit & Margin Breakdown (65%–79% Gross Margin):</span>
            <span className="text-emerald-700 font-extrabold text-[11px]">
              High Profit Niche
            </span>
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Retail Price</th>
                  <th className="p-3">Supplier Cost</th>
                  <th className="p-3 text-right">Net Profit / Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {PRODUCTS.map((p) => {
                  const profit = p.price - p.supplierCost;
                  const marginPct = Math.round((profit / p.price) * 100);
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/50">
                      <td className="p-3 font-semibold text-stone-900">
                        {p.name}
                      </td>
                      <td className="p-3 font-bold text-stone-800 tabular-nums">
                        {formatCurrency(p.price)}
                      </td>
                      <td className="p-3 text-stone-500 tabular-nums">
                        {formatCurrency(p.supplierCost)}
                      </td>
                      <td className="p-3 text-right font-black text-emerald-700 tabular-nums">
                        +{formatCurrency(profit)} ({marginPct}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Top Suppliers */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2.5">
          <h4 className="text-xs font-black text-[#2D5A43] uppercase tracking-wide">
            Recommended US Pet Sourcing Platforms:
          </h4>
          <div className="space-y-2 text-xs text-stone-700">
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#2D5A43]">1. CJ Dropshipping (USA Warehouse):</span>
              <span className="text-stone-600">
                Filter by "US Warehouse" for 3–5 day USPS delivery and unbranded boxes. Free to connect.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#2D5A43]">2. Zendrop (US Fast Shipping):</span>
              <span className="text-stone-600">
                Curated pet catalog with express domestic shipping, automated tracking uploads, and custom thank-you cards.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#2D5A43]">3. Spocket (US / North America Suppliers):</span>
              <span className="text-stone-600">
                Direct partnerships with verified American pet manufacturers with 2–5 business days delivery.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-5 py-2.5 rounded-full"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
