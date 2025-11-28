import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Download, Star, Apple } from 'lucide-react';
import { Button } from '../components/Common';

export const AppDownload: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#4CAF50] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 transition-colors z-20"
      >
        <ArrowLeft size={20} />
        <span>返回首页</span>
      </button>

      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-12 z-10 animate-fade-in">
        {/* Left: Phone Mockup */}
        <div className="relative w-[280px] md:w-[320px] aspect-[9/19] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden hidden md:block transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-xl z-20"></div>
           <img 
             src="/assests/app-download.png" 
             alt="App Screenshot" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 text-white">
              <div className="font-bold text-xl mb-1">智农链 App</div>
              <div className="text-sm opacity-80">随时随地，智慧助农</div>
           </div>
        </div>

        {/* Right: Content */}
        <div className="text-center md:text-left text-white space-y-8 max-w-lg">
           <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                 <Star size={14} className="fill-current text-yellow-300" />
                 <span>4.9 分好评 | 累计下载 500万+</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                 智农链 App<br/>
                 <span className="text-green-200">融销一体，掌上助农</span>
              </h1>
              <p className="text-lg text-green-50 opacity-90 leading-relaxed">
                 一站式解决农产品销售难、融资贵问题。汇集专家智慧，打通产销对接，让农业更简单，让农民更富裕。
              </p>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="flex items-center gap-3 bg-white text-[#4CAF50] px-6 py-3.5 rounded-xl hover:bg-gray-100 transition-all shadow-lg active:scale-95">
                 <Apple size={28} className="text-[#4CAF50]" />
                 <div className="text-left leading-tight">
                    <div className="text-[10px] font-medium uppercase">Download on the</div>
                    <div className="font-bold text-lg">App Store</div>
                 </div>
              </button>
              <button className="flex items-center gap-3 bg-transparent border border-white/40 text-white px-6 py-3.5 rounded-xl hover:bg-white/10 transition-all shadow-lg active:scale-95">
                 <div className="text-2xl"><Smartphone size={28}/></div>
                 <div className="text-left leading-tight">
                    <div className="text-[10px] font-medium uppercase">Get it on</div>
                    <div className="font-bold text-lg">Google Play</div>
                 </div>
              </button>
           </div>

           {/* QR Code */}
           <div className="pt-8 flex flex-col md:flex-row items-center gap-4 border-t border-white/20">
              <div className="w-24 h-24 bg-white p-2 rounded-lg shadow-sm">
                 {/* Mock QR */}
                 <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-[8px]">
                    Scan QR Code
                 </div>
              </div>
              <div className="text-sm opacity-80 text-center md:text-left">
                 <p className="font-bold mb-1">扫描二维码下载</p>
                 <p>支持 iOS 与 Android</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
