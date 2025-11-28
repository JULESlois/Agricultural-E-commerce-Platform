import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, SectionTitle } from '../components/Common';
import { MOCK_ORDER_DETAIL } from '../constants';
import { ArrowLeft, Star, Camera, Upload } from 'lucide-react';

export const BuyerReviewPublish: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const item = MOCK_ORDER_DETAIL.items[0]; // Demo first item
  
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  const handleSubmit = () => {
     alert('评价发布成功！');
     navigate('/mall/buyer/orders');
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
       <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
             <ArrowLeft size={16} className="mr-1" /> 返回
          </Button>
          <h1 className="text-2xl font-bold text-[#212121]">评价晒单</h1>
       </div>

       <Card className="p-8">
          <div className="flex gap-4 items-center mb-6 pb-6 border-b border-gray-100">
             <img src={item.imageUrl} className="w-16 h-16 rounded object-cover" alt={item.name} />
             <div>
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">购买时间: {MOCK_ORDER_DETAIL.createTime}</p>
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-4">
                <span className="font-bold text-gray-700">总体评分</span>
                <div className="flex gap-1 text-[#FF9800]">
                   {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                         <Star size={24} fill={star <= rating ? "currentColor" : "none"} className={star <= rating ? "" : "text-gray-300"} />
                      </button>
                   ))}
                </div>
                <span className="text-sm text-gray-400 ml-2">{rating === 5 ? '非常满意' : rating >= 3 ? '满意' : '不满意'}</span>
             </div>

             <div>
                <label className="block font-bold text-gray-700 mb-2">评价内容</label>
                <textarea 
                   className="w-full p-4 border border-gray-300 rounded-lg focus:border-[#4CAF50] focus:outline-none h-32 resize-none"
                   placeholder="宝贝满足您的期待吗？说说它的优点和不足吧..."
                   value={content}
                   onChange={e => setContent(e.target.value)}
                />
             </div>

             <div>
                <label className="block font-bold text-gray-700 mb-2">晒图/视频</label>
                <div className="flex gap-4">
                   <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#4CAF50] hover:text-[#4CAF50] cursor-pointer bg-gray-50">
                      <Camera size={24} className="mb-1" />
                      <span className="text-xs">上传图片</span>
                   </div>
                </div>
             </div>

             <div className="pt-4 flex items-center gap-4">
                <Button variant="solid-green" size="lg" onClick={handleSubmit}>发布评价</Button>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                   <input type="checkbox" className="rounded text-[#4CAF50] focus:ring-[#4CAF50]" />
                   匿名评价
                </label>
             </div>
          </div>
       </Card>
    </div>
  );
};