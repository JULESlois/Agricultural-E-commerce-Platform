import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../components/Common';
import { MOCK_BUYER_REVIEWS } from '../constants';
import { Star, MessageCircle, Edit } from 'lucide-react';

export const BuyerReviews: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#212121]">我的评价</h1>
          <div className="flex gap-2">
             <Button variant="solid-green" size="sm" onClick={() => navigate('/mall/buyer/orders')}>去评价订单</Button>
          </div>
       </div>

       <div className="space-y-4">
          {MOCK_BUYER_REVIEWS.map(review => (
             <Card key={review.id} className="p-6">
                <div className="flex gap-6 items-start">
                   <div className="w-20 h-20 flex-shrink-0 rounded bg-gray-100 overflow-hidden">
                      <img src={review.productImage} alt={review.productName} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="font-bold text-[#212121]">{review.productName}</h3>
                         <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                         <div className="flex text-[#FF9800]">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />)}
                         </div>
                         <span className="text-sm text-gray-500">{review.rating}分</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3 bg-gray-50 p-3 rounded">{review.content}</p>
                      
                      {review.reply && (
                         <div className="text-sm text-gray-500 pl-3 border-l-2 border-[#4CAF50] mb-3">
                            <span className="font-bold text-[#4CAF50]">商家回复：</span> {review.reply}
                         </div>
                      )}

                      <div className="flex gap-4">
                         <button className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                            <Edit size={12} /> 追加评价
                         </button>
                      </div>
                   </div>
                </div>
             </Card>
          ))}
          {MOCK_BUYER_REVIEWS.length === 0 && (
             <div className="text-center py-12 text-gray-400 bg-white rounded-lg border border-gray-200">
                <MessageCircle size={48} className="mx-auto mb-2 opacity-20" />
                <p>暂无评价记录</p>
             </div>
          )}
       </div>
    </div>
  );
};