
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, SectionTitle } from '../components/Common';
import { ArrowLeft, Sparkles, Loader2, Save } from 'lucide-react';

export const ProcurementPost: React.FC = () => {
  const navigate = useNavigate();
  const [aiInput, setAiInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '水果',
    quantity: '',
    unit: '吨',
    priceMode: 'range', // range, negotiable
    minPrice: '',
    maxPrice: '',
    location: '',
    deadline: '',
    specs: '',
    description: ''
  });

  // Mock AI Analysis
  const handleAiAnalyze = () => {
    if (!aiInput.trim()) return;
    setIsAnalyzing(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsAnalyzing(false);
      // Simple mock parsing logic
      let newForm = { ...formData };
      
      if (aiInput.includes('苹果')) {
         newForm.title = '优质苹果采购';
         newForm.category = '水果';
      } else if (aiInput.includes('大米')) {
         newForm.title = '东北大米采购';
         newForm.category = '粮油';
      }

      const qtyMatch = aiInput.match(/(\d+)\s*(吨|斤|kg)/);
      if (qtyMatch) {
         newForm.quantity = qtyMatch[1];
         newForm.unit = qtyMatch[2];
      }

      if (aiInput.includes('北京')) newForm.location = '北京';
      if (aiInput.includes('上海')) newForm.location = '上海';

      setFormData(newForm);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('需求发布成功！系统将为您智能匹配供应商。');
    navigate('/mall/buyer/match'); // Redirect to Smart Match Dashboard
  };

  return (
    <div className="animate-fade-in bg-[#F5F5F5] min-h-screen py-8">
       <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
             <Button variant="ghost" size="sm" onClick={() => navigate('/mall')}>
                <ArrowLeft size={16} className="mr-1" /> 返回大厅
             </Button>
             <h1 className="text-2xl font-bold text-[#212121]">发布采购需求</h1>
          </div>

          <div className="space-y-6">
             {/* [MATCH-02] AI Input Area */}
             <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex items-center gap-2 mb-3 text-[#1976D2]">
                   <Sparkles size={20} />
                   <h3 className="font-bold">AI 智能识别</h3>
                </div>
                <textarea 
                   className="w-full p-4 border border-blue-200 rounded-lg focus:border-[#1976D2] focus:outline-none focus:ring-2 focus:ring-blue-100 h-32 resize-none text-sm placeholder-blue-300"
                   placeholder="试试粘贴您的需求：例如“急购20吨烟台红富士苹果，直径80mm以上，发往北京新发地，要求下周五前到货，预算4元左右。”"
                   value={aiInput}
                   onChange={(e) => setAiInput(e.target.value)}
                />
                <div className="flex justify-end mt-3">
                   <Button 
                     onClick={handleAiAnalyze} 
                     disabled={isAnalyzing || !aiInput.trim()}
                     className="bg-[#1976D2] hover:bg-[#1565C0] text-white border-none"
                     icon={isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                   >
                      {isAnalyzing ? '正在分析...' : '自动识别填充'}
                   </Button>
                </div>
             </Card>

             {/* Form */}
             <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                   <SectionTitle title="需求详情" />
                   
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">采购标题</label>
                      <input 
                         type="text" 
                         className="w-full p-3 border border-gray-300 rounded focus:border-[#1976D2] focus:outline-none"
                         placeholder="例如：优质红富士苹果采购"
                         value={formData.title}
                         onChange={e => setFormData({...formData, title: e.target.value})}
                         required
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">采购品类</label>
                         <select 
                            className="w-full p-3 border border-gray-300 rounded focus:border-[#1976D2] focus:outline-none"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                         >
                            <option>水果</option>
                            <option>蔬菜</option>
                            <option>粮油</option>
                            <option>畜牧</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">采购数量</label>
                         <div className="flex gap-2">
                            <input 
                               type="number" 
                               className="flex-1 p-3 border border-gray-300 rounded focus:border-[#1976D2] focus:outline-none"
                               placeholder="数量"
                               value={formData.quantity}
                               onChange={e => setFormData({...formData, quantity: e.target.value})}
                               required
                            />
                            <select 
                               className="w-24 p-3 border border-gray-300 rounded focus:border-[#1976D2] focus:outline-none"
                               value={formData.unit}
                               onChange={e => setFormData({...formData, unit: e.target.value})}
                            >
                               <option>吨</option>
                               <option>斤</option>
                               <option>kg</option>
                               <option>车</option>
                            </select>
                         </div>
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">期望价格</label>
                      <div className="flex items-center gap-4">
                         <label className="flex items-center gap-2">
                            <input type="radio" name="price" checked={formData.priceMode === 'range'} onChange={() => setFormData({...formData, priceMode: 'range'})} /> 区间报价
                         </label>
                         <label className="flex items-center gap-2">
                            <input type="radio" name="price" checked={formData.priceMode === 'negotiable'} onChange={() => setFormData({...formData, priceMode: 'negotiable'})} /> 面议
                         </label>
                      </div>
                      {formData.priceMode === 'range' && (
                         <div className="flex items-center gap-2 mt-2">
                            <input 
                               type="number" 
                               className="w-32 p-2 border border-gray-300 rounded focus:border-[#1976D2] focus:outline-none" 
                               placeholder="最低价"
                               value={formData.minPrice}
                               onChange={e => setFormData({...formData, minPrice: e.target.value})}
                            />
                            <span className="text-gray-400">-</span>
                            <input 
                               type="number" 
                               className="w-32 p-2 border border-gray-300 rounded focus:border-[#1976D2] focus:outline-none" 
                               placeholder="最高价"
                               value={formData.maxPrice}
                               onChange={e => setFormData({...formData, maxPrice: e.target.value})}
                            />
                            <span className="text-gray-500 text-sm">元 / {formData.unit}</span>
                         </div>
                      )}
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">收货地点</label>
                         <input 
                            type="text" 
                            className="w-full p-3 border border-gray-300 rounded focus:border-[#1976D2] focus:outline-none"
                            placeholder="省 / 市 / 区"
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
                         <input 
                            type="date" 
                            className="w-full p-3 border border-gray-300 rounded focus:border-[#1976D2] focus:outline-none"
                            value={formData.deadline}
                            onChange={e => setFormData({...formData, deadline: e.target.value})}
                         />
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">规格要求</label>
                      <input 
                         type="text" 
                         className="w-full p-3 border border-gray-300 rounded focus:border-[#1976D2] focus:outline-none"
                         placeholder="例如：果径80mm以上，着色度80%..."
                         value={formData.specs}
                         onChange={e => setFormData({...formData, specs: e.target.value})}
                      />
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">补充说明</label>
                      <textarea 
                         className="w-full p-3 border border-gray-300 rounded focus:border-[#1976D2] focus:outline-none h-24 resize-none"
                         placeholder="其他包装、运输、账期等要求..."
                         value={formData.description}
                         onChange={e => setFormData({...formData, description: e.target.value})}
                      />
                   </div>

                   <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                      <Button type="button" variant="ghost" onClick={() => navigate(-1)}>取消</Button>
                      <Button type="submit" variant="solid-blue" className="px-8" icon={<Save size={16} />}>发布需求</Button>
                   </div>
                </form>
             </Card>
          </div>
       </div>
    </div>
  );
};
