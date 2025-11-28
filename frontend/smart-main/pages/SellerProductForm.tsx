import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, SectionTitle } from '../components/Common';
import { ArrowLeft, Upload, Save, Image as ImageIcon } from 'lucide-react';

export const SellerProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: isEdit ? '有机红富士苹果 (特级)' : '',
    category: isEdit ? '水果' : '水果',
    price: isEdit ? '85.00' : '',
    stock: isEdit ? '1200' : '',
    origin: isEdit ? '山东烟台' : '',
    description: isEdit ? '产地直发，新鲜采摘...' : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Submit
    navigate('/mall/seller/product');
  };

  return (
    <div className="animate-fade-in space-y-6">
       <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/mall/seller/product')}>
             <ArrowLeft size={16} className="mr-1" /> 返回列表
          </Button>
          <h1 className="text-2xl font-bold text-[#212121]">{isEdit ? '编辑商品' : '发布新商品'}</h1>
       </div>

       <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Left Column: Form Fields */}
             <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 space-y-4">
                   <SectionTitle title="基本信息" />
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">商品标题</label>
                      <input 
                         type="text" 
                         required
                         className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none"
                         value={formData.title}
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                         placeholder="例如：山东烟台红富士苹果 5kg"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">商品分类</label>
                         <select 
                            className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                         >
                            <option>水果</option>
                            <option>蔬菜</option>
                            <option>粮油</option>
                            <option>茶叶</option>
                            <option>畜牧</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">产地</label>
                         <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none"
                            value={formData.origin}
                            onChange={(e) => setFormData({...formData, origin: e.target.value})}
                         />
                      </div>
                   </div>
                </Card>

                <Card className="p-6 space-y-4">
                   <SectionTitle title="价格与库存" />
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">销售价格 (元)</label>
                         <input 
                            type="number" 
                            required
                            min="0"
                            step="0.01"
                            className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">库存数量</label>
                         <input 
                            type="number" 
                            required
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none"
                            value={formData.stock}
                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                         />
                      </div>
                   </div>
                </Card>

                <Card className="p-6 space-y-4">
                   <SectionTitle title="商品详情" />
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">详细描述</label>
                      <textarea 
                         className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none h-48"
                         value={formData.description}
                         onChange={(e) => setFormData({...formData, description: e.target.value})}
                         placeholder="描述商品的特色、种植方式、口感等..."
                      />
                   </div>
                </Card>
             </div>

             {/* Right Column: Images & Publish */}
             <div className="space-y-6">
                <Card className="p-6">
                   <SectionTitle title="商品图片" />
                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer mb-4 h-48">
                      <Upload size={32} className="mb-2" />
                      <span className="text-sm">点击上传主图</span>
                   </div>
                   <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map(i => (
                         <div key={i} className="aspect-square bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                            <ImageIcon size={16} className="text-gray-300" />
                         </div>
                      ))}
                   </div>
                </Card>

                <Card className="p-6 sticky top-24">
                   <h3 className="font-bold text-gray-900 mb-4">发布设置</h3>
                   <div className="space-y-3 mb-6">
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                         <input type="checkbox" className="rounded text-[#4CAF50] focus:ring-[#4CAF50]" defaultChecked />
                         立即上架销售
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                         <input type="checkbox" className="rounded text-[#4CAF50] focus:ring-[#4CAF50]" />
                         支持坏果包赔
                      </label>
                   </div>
                   <div className="flex gap-2">
                      <Button type="submit" variant="solid-green" className="flex-1" icon={<Save size={16} />}>
                         {isEdit ? '保存修改' : '立即发布'}
                      </Button>
                      <Button type="button" variant="ghost">预览</Button>
                   </div>
                </Card>
             </div>
          </div>
       </form>
    </div>
  );
};