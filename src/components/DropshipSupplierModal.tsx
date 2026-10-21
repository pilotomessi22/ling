import React from 'react';
import { X, PackageCheck, ShieldCheck } from 'lucide-react';
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
          <div className="w-12 h-12 rounded-2xl bg-[#0F2942] text-white flex items-center justify-center">
            <PackageCheck size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Store Owner Intelligence Hub
            </span>
            <h3 className="text-xl font-black text-stone-900 mt-1">
              Central Warehouse Fulfillment & Profit Breakdown
            </h3>
          </div>
        </div>

        {/* 3-Step Fulfillment Workflow */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
            Automated Central Warehouse Fulfillment:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-[#0F2942] text-white font-black text-xs flex items-center justify-center mb-2">
                1
              </span>
              <p className="font-bold text-stone-900">Customer Places Order</p>
              <p className="text-[11px] text-stone-500 mt-1">
                Customer places an order on Ling Petshop paying retail price.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-[#0F2942] text-white font-black text-xs flex items-center justify-center mb-2">
                2
              </span>
              <p className="font-bold text-stone-900">Order Routing</p>
              <p className="text-[11px] text-stone-500 mt-1">
                Order details are routed to Central Warehouse for immediate processing.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-[#0F2942] text-white font-black text-xs flex items-center justify-center mb-2">
                3
              </span>
              <p className="font-bold text-stone-900">2-4 Day US Delivery</p>
              <p className="text-[11px] text-stone-500 mt-1">
                Package is dispatched directly from Central Warehouse via USPS Ground Advantage.
              </p>
            </div>
          </div>
        </div>

        {/* Profit Margin Matrix */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center justify-between">
            <span>Product Profit & Margin Breakdown:</span>
            <span className="text-blue-700 font-extrabold text-[11px]">
              High Profit Margin
            </span>
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Retail Price</th>
                  <th className="p-3">Cost</th>
                  <th className="p-3 text-right">Net Profit</th>
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

        {/* Central Warehouse Partner Info */}
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2 text-xs text-stone-700">
          <div className="flex items-center gap-2 font-bold text-[#0F2942]">
            <ShieldCheck size={16} className="text-[#2563EB]" />
            <span>Central Warehouse Logistics Hub:</span>
          </div>
          <p className="text-stone-600">
            Full inventory synchronization, 24 business hours order dispatch, and 100% verified tracking integration.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-5 py-2.5 rounded-full cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
