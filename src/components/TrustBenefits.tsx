import React from 'react';
import { ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';

export const TrustBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <ShieldCheck size={36} className="text-[#00a84e]" />,
      title: 'Compra Segura',
      description: 'Ambiente seguro para pagamentos online',
    },
    {
      icon: <Truck size={36} className="text-[#00a84e]" />,
      title: 'Frete Grátis',
      description: 'Envio rápido e acompanhado com código de rastreio',
    },
    {
      icon: <Headphones size={36} className="text-[#00a84e]" />,
      title: 'Suporte Profissional',
      description: 'Equipe de suporte de extrema qualidade a semana toda',
    },
    {
      icon: <RotateCcw size={36} className="text-[#00a84e]" />,
      title: 'Satisfação ou Reembolso',
      description: 'Caso haja algo, devolvemos seu dinheiro com velocidade',
    },
  ];

  return (
    <section className="py-12 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50/70 border border-zinc-100 hover:border-zinc-200 transition-colors"
            >
              <div className="flex-shrink-0 p-2.5 bg-white rounded-lg shadow-sm border border-zinc-100">
                {b.icon}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-zinc-900 tracking-tight">
                  {b.title}
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-snug">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
