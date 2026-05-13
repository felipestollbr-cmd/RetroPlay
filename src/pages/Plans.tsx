import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { PLANS, getPlan, updatePlan, getUser } from '../lib/subscription';
import type { Plan } from '../lib/subscription';
import { useNavigate } from 'react-router-dom';

export default function Plans() {
  const navigate = useNavigate();
  const currentPlan = getPlan();
  const user = getUser();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSelectPlan = (plan: Plan) => {
    if (!user) {
      navigate('/');
      return;
    }
    if (plan.id === currentPlan.id) return;
    setSelectedPlan(plan.id);
  };

  const handleConfirm = () => {
    if (!selectedPlan) return;
    setProcessing(true);
    setTimeout(() => {
      updatePlan(selectedPlan as any);
      setProcessing(false);
      setSelectedPlan(null);
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="pt-12 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium mb-6">
              <Crown className="w-4 h-4" />
              <span>Escolha seu plano</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Jogue sem limites
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Escolha o plano ideal para você e tenha acesso a todos os consoles e recursos premium.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {PLANS.map((plan, index) => {
              const isCurrent = currentPlan.id === plan.id;
              const isSelected = selectedPlan === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative rounded-3xl border transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-b from-indigo-500/10 to-purple-500/5 border-indigo-500/30 shadow-xl shadow-indigo-500/10'
                      : isSelected
                      ? 'bg-white/[0.04] border-amber-500/40 shadow-xl shadow-amber-500/10'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-lg">
                        Mais Popular
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}
                      >
                        {plan.id === 'free' ? (
                          <Zap className="w-5 h-5 text-white" />
                        ) : plan.id === 'pro' ? (
                          <Sparkles className="w-5 h-5 text-white" />
                        ) : (
                          <Crown className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                        <p className="text-white/30 text-xs">{plan.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <span className="text-4xl font-extrabold text-white">
                        R$ {plan.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-white/30 text-sm">{plan.priceUnit}</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                          <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isCurrent || processing}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        isCurrent
                          ? 'bg-white/5 text-white/30 cursor-default'
                          : isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20'
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {isCurrent ? (
                        'Plano Atual'
                      ) : isSelected ? (
                        <>
                          Confirmar
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        'Selecionar'
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Confirmation modal */}
          {selectedPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPlan(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md bg-[#141428] border border-white/10 rounded-3xl p-8 shadow-2xl"
              >
                <h3 className="text-xl font-bold text-white mb-2">Confirmar Assinatura</h3>
                <p className="text-white/40 text-sm mb-6">
                  Você está selecionando o plano{' '}
                  <span className="text-white font-medium">
                    {PLANS.find((p) => p.id === selectedPlan)?.name}
                  </span>
                  . Confirma?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={processing}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Confirmar'
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
