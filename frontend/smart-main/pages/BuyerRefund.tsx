import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card } from '../components/Common';
import { MOCK_ORDER_DETAIL } from '../constants';
import { ArrowLeft, Camera, AlertCircle } from 'lucide-react';

export const BuyerRefund: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const item = MOCK_ORDER_DETAIL.items[0];

  const [refundType, setRefundType] = useState('money_only'); // money_only, return_goods
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
     alert('售后申请已提交，等待商家审核。');
     navigate('/mall/buyer/orders');
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
       <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
             <ArrowLeft size={16} className="mr-1" /> 返回
          </Button>
          <h1 className="text-2xl font-bold text-[#212121]">申请售后</h1>
       </div>

       <Card className="p-6 mb-4">
          <div className="flex gap-4 items-center">
             <img src={item.imageUrl} className="w-16 h-16 rounded object-cover" alt={item.name} />
             <div>
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">数量: {item.quantity} | 实付: ¥{item.price * item.quantity}</p>
             </div>
          </div>
       </Card>

       <Card className="p-8 space-y-6">
          <div>
             <label className="block font-bold text-gray-700 mb-3">服务类型</label>
             <div className="flex gap-4">
                <button 
                   onClick={() => setRefundType('money_only')}
                   className={`px-6 py-3 border rounded-lg transition-colors ${refundType === 'money_only' ? 'border-[#4CAF50] bg-green-50 text-[#4CAF50] font-bold' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                   仅退款 (未收到货)
                </button>
                <button 
                   onClick={() => setRefundType('return_goods')}
                   className={`px-6 py-3 border rounded-lg transition-colors ${refundType === 'return_goods' ? 'border-[#4CAF50] bg-green-50 text-[#4CAF50] font-bold' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                   退货退款 (已收到货)
                </button>
             </div>
          </div>

          <div>
             <label className="block font-bold text-gray-700 mb-3">申请原因</label>
             <select 
                className="w-full p-3 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none"
                value={reason}
                onChange={e => setReason(e.target.value)}
             >
                <option value="">请选择原因</option>
                <option value="quality">商品质量问题 (坏果/腐烂)</option>
                <option value="description">商品与描述不符</option>
                <option value="missing">少件/漏发</option>
                <option value="wrong">发错货</option>
                <option value="other">其他</option>
             </select>
          </div>

          <div>
             <label className="block font-bold text-gray-700 mb-2">退款金额</label>
             <div className="flex items-center gap-2 text-xl font-bold text-[#FF9800]">
                ¥ <input type="number" defaultValue={item.price * item.quantity} className="w-32 border-b border-gray-300 focus:border-[#FF9800] focus:outline-none text-[#FF9800]" />
             </div>
             <p className="text-xs text-gray-400 mt-1">最多可退 ¥{(item.price * item.quantity).toFixed(2)}</p>
          </div>

          <div>
             <label className="block font-bold text-gray-700 mb-2">补充描述</label>
             <textarea className="w-full p-3 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none h-24" placeholder="请详细描述您遇到的问题..." />
          </div>

          <div>
             <label className="block font-bold text-gray-700 mb-2">上传凭证</label>
             <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#4CAF50] hover:text-[#4CAF50] cursor-pointer bg-gray-50">
                <Camera size={24} className="mb-1" />
                <span className="text-xs">上传照片</span>
             </div>
             <div className="flex items-start gap-2 mt-2 text-xs text-gray-400 bg-orange-50 p-2 rounded text-orange-600">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                为了帮您快速处理，申请“坏果包赔”请务必上传清晰的坏果照片（需包含快递面单）。
             </div>
          </div>

          <div className="pt-4">
             <Button variant="solid-green" size="lg" className="w-full md:w-auto" onClick={handleSubmit}>提交申请</Button>
          </div>
       </Card>
    </div>
  );
};