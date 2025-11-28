import React, { useState } from 'react';
import { Button, Card, Badge } from '../components/Common';
import { Star, MessageCircle, Send } from 'lucide-react';

// Mock Data with distinct ID
const INITIAL_REVIEWS = [
   { 
      id: 1, 
      user: '用户8839', 
      date: '2025-09-23', 
      rating: 5, 
      content: '苹果非常新鲜，口感脆甜，汁水很多，包装也很用心，没有坏果，下次还会回购！',
      image: 'https://picsum.photos/50/50?random=1',
      reply: '感谢您的支持与喜爱！我们会继续努力提供优质的农产品。'
   },
   { 
      id: 2, 
      user: '用户2048', 
      date: '2025-09-22', 
      rating: 4, 
      content: '物流挺快的，东西也不错，就是个头感觉比想象中小了一点点，总体好评。',
      image: 'https://picsum.photos/50/50?random=2',
      reply: null // No reply yet
   },
   { 
      id: 3, 
      user: '用户9527', 
      date: '2025-09-20', 
      rating: 5, 
      content: '第二次购买了，一如既往的好。',
      image: null,
      reply: null // No reply yet
   }
];

export const SellerReviews: React.FC = () => {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [replyState, setReplyState] = useState<{ id: number | null; text: string }>({ id: null, text: '' });

  const handleStartReply = (id: number) => {
     setReplyState({ id, text: '' });
  };

  const handleSubmitReply = (id: number) => {
     if (!replyState.text.trim()) return;

     setReviews(prev => prev.map(review => {
        if (review.id === id) {
           return { ...review, reply: replyState.text };
        }
        return review;
     }));

     setReplyState({ id: null, text: '' });
  };

  const handleCancelReply = () => {
     setReplyState({ id: null, text: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[#212121]">评价管理</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-[#FF9800] mb-2">4.9</div>
            <div className="text-sm text-gray-500">店铺综合评分</div>
         </Card>
         <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-[#212121]">1,204</div>
            <div className="text-sm text-gray-500">累计评价数</div>
         </Card>
         <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-green-600">98%</div>
            <div className="text-sm text-gray-500">好评率</div>
         </Card>
      </div>

      <Card className="p-0">
         <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <span className="font-bold text-gray-700">最新评价</span>
         </div>
         <div className="divide-y divide-gray-100">
            {reviews.map(review => (
               <div key={review.id} className="p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500 text-xs">
                     {review.user.substring(0,1)}
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start mb-2">
                        <div>
                           <span className="font-bold text-sm mr-2">{review.user}</span>
                           <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <div className="flex text-[#FF9800]">
                           {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill={idx < review.rating ? "currentColor" : "none"} className={idx < review.rating ? "" : "text-gray-300"} />)}
                        </div>
                     </div>
                     <p className="text-gray-700 text-sm mb-3">
                        {review.content}
                     </p>
                     
                     {review.image && (
                        <div className="mb-3">
                           <img src={review.image} className="w-12 h-12 rounded object-cover cursor-pointer border border-gray-200" alt="review" />
                        </div>
                     )}

                     {/* Reply Section */}
                     {review.reply ? (
                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 flex items-start gap-2 border-l-4 border-[#4CAF50]">
                           <span className="text-[#4CAF50] font-bold whitespace-nowrap text-xs mt-0.5">商家回复:</span>
                           <span>{review.reply}</span>
                        </div>
                     ) : (
                        <div>
                           {replyState.id === review.id ? (
                              <div className="mt-3 animate-fade-in bg-gray-50 p-3 rounded border border-gray-200">
                                 <textarea 
                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none mb-2"
                                    rows={3}
                                    placeholder="请输入您的回复内容..."
                                    autoFocus
                                    value={replyState.text}
                                    onChange={(e) => setReplyState({ ...replyState, text: e.target.value })}
                                 />
                                 <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="ghost" onClick={handleCancelReply}>取消</Button>
                                    <Button size="sm" variant="solid-green" onClick={() => handleSubmitReply(review.id)} icon={<Send size={12} />}>发布回复</Button>
                                 </div>
                              </div>
                           ) : (
                              <Button variant="ghost" size="sm" icon={<MessageCircle size={14}/>} onClick={() => handleStartReply(review.id)}>
                                 回复
                              </Button>
                           )}
                        </div>
                     )}
                  </div>
               </div>
            ))}
         </div>
      </Card>
    </div>
  );
};