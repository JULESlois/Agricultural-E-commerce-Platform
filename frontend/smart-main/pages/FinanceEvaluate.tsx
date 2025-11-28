import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/Common';
import { Radar, Shield, ChevronRight } from 'lucide-react';

export const FinanceEvaluate: React.FC = () => {
  const navigate = useNavigate();

  const username = useMemo(() => {
    const u = localStorage.getItem('username') || sessionStorage.getItem('username') || '';
    return u.trim();
  }, []);

  const isGood = username === 'seller2';
  const score = isGood ? 90 : 67;
  const [displayScore, setDisplayScore] = useState(1);
  const desc = isGood ? '您的信用分良好' : '您的信用分不佳';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1500;
    const from = 1;
    const to = score;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const val = Math.round(from + (to - from) * ease(p));
      setDisplayScore(val);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="animate-fade-in space-y-8">
      <style>{`
        .radar-wrap { position: relative; width: 280px; height: 280px; }
        .radar-circle { position:absolute; inset:0; border-radius:50%; background: radial-gradient(closest-side, rgba(25,118,210,0.24), transparent 70%); box-shadow: inset 0 0 40px rgba(25,118,210,0.35); }
        .radar-grid { position:absolute; inset:0; border-radius:50%; background:
          repeating-radial-gradient(circle at center, transparent 0 20px, rgba(255,255,255,0.08) 21px 22px),
          radial-gradient(circle at center, transparent 55%, rgba(255,255,255,0.06) 56% 57%, transparent 58%);
        }
        .radar-sweep { position:absolute; inset:0; border-radius:50%; background: conic-gradient(from 0deg, rgba(129,199,245,0.0) 0deg, rgba(129,199,245,0.35) 20deg, rgba(129,199,245,0.0) 60deg);
          animation: sweep 3s linear infinite; filter: blur(1px);
        }
        @keyframes sweep { to { transform: rotate(360deg); } }
        .pulse { position:absolute; left:50%; top:50%; width:6px; height:6px; transform: translate(-50%, -50%); background:#64B5F6; border-radius:50%; box-shadow:0 0 12px rgba(100,181,246,0.9); animation:pulse 2.2s ease-out infinite; }
        @keyframes pulse { 0% { box-shadow:0 0 0 0 rgba(100,181,246,0.6);} 100% { box-shadow:0 0 0 28px rgba(100,181,246,0);} }
        .scroll-wrap { height:64px; overflow:hidden; }
        .scroll-inner { display:flex; flex-direction:column; gap:8px; animation: scrollY 6s linear infinite; }
        @keyframes scrollY { 0% { transform: translateY(0); } 50% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
      `}</style>

      <div className="bg-gradient-to-r from-[#1976D2] to-[#64B5F6] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg overflow-hidden">
        <div className="space-y-3 max-w-xl">
          <h1 className="text-3xl font-bold">额度评估</h1>
          <p className="text-blue-100">基于您的历史经营交易、资产状况与征信信息进行综合评估。</p>
          <div className="scroll-wrap mt-2">
            <div className="scroll-inner">
              <div className="flex items-center gap-2 text-sm"><Shield size={16} className="opacity-80" /> 数据加密传输</div>
              <div className="flex items-center gap-2 text-sm"><Shield size={16} className="opacity-80" /> 银行级风控模型</div>
              <div className="flex items-center gap-2 text-sm"><Shield size={16} className="opacity-80" /> 全程线上，无需抵押</div>
              <div className="flex items-center gap-2 text-sm"><Shield size={16} className="opacity-80" /> 结果仅对本人可见</div>
            </div>
          </div>
        </div>

        <div className="radar-wrap mt-8 md:mt-0">
          <div className="radar-circle"></div>
          <div className="radar-grid"></div>
          <div className="radar-sweep"></div>
          <div className="pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-extrabold">{displayScore}</div>
              <div className="text-sm text-blue-100 mt-1">信用评分</div>
            </div>
          </div>
        </div>
      </div>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="text-xl font-bold text-[#212121] mb-1">{desc}</div>
            <div className="text-sm text-gray-600">评估基于交易信用、资产评估、经营稳定性等多维度指标。</div>
          </div>
          <div className="flex items-center gap-3">
            {isGood ? (
              <Button variant="solid-blue" size="lg" onClick={() => navigate('/finance/apply/1')}>去申请贷款</Button>
            ) : (
              <>
                <Button variant="solid-blue" size="lg" onClick={() => navigate('/finance/apply/1')}>去申请联合贷款</Button>
                <Button variant="ghost" className="whitespace-nowrap" onClick={() => navigate('/finance/materials')}>去补充材料 <ChevronRight size={16} /></Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinanceEvaluate;
