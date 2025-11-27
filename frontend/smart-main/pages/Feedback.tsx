import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/Common';
import { ArrowLeft, Camera, CheckCircle2, AlertCircle } from 'lucide-react';

export const Feedback: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: 'suggestion',
    content: '',
    contact: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-[#4CAF50] mb-6">
           <CheckCircle2 size={40} />
        </div>
        <h1 className="text-2xl font-bold text-[#212121] mb-2">反馈提交成功</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
           感谢您的宝贵建议！我们会认真阅读并尽快处理。如有需要，客服将通过您留下的联系方式与您沟通。
        </p>
        <div className="flex gap-4">
           <Button variant="ghost" onClick={() => navigate('/help')}>返回帮助中心</Button>
           <Button variant="solid-green" onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-fade-in">
       <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/help')}>
             <ArrowLeft size={16} className="mr-1" /> 返回
          </Button>
          <h1 className="text-2xl font-bold text-[#212121]">意见反馈</h1>
       </div>

       <Card className="p-8">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-700 mb-8">
             <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
             <div className="text-sm">
                <p>为了更好地解决您的问题，请尽量详细描述遇到的情况，并提供相关截图。</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             {/* Type */}
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">反馈类型</label>
                <div className="flex flex-wrap gap-4">
                   {[
                      { id: 'suggestion', label: '功能建议' },
                      { id: 'bug', label: '系统故障' },
                      { id: 'complaint', label: '投诉举报' },
                      { id: 'other', label: '其他问题' }
                   ].map(type => (
                      <button
                         type="button"
                         key={type.id}
                         onClick={() => setFormData({...formData, type: type.id})}
                         className={`px-6 py-2 rounded-full text-sm font-medium border transition-all ${
                            formData.type === type.id 
                            ? 'bg-[#4CAF50] text-white border-[#4CAF50] shadow-sm' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                         }`}
                      >
                         {type.label}
                      </button>
                   ))}
                </div>
             </div>

             {/* Content */}
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">问题描述</label>
                <textarea 
                   className="w-full p-4 border border-gray-300 rounded-lg focus:border-[#4CAF50] focus:outline-none h-40 resize-none placeholder-gray-400"
                   placeholder="请详细描述您遇到的问题或建议，我们将不断改进..."
                   value={formData.content}
                   onChange={e => setFormData({...formData, content: e.target.value})}
                   required
                />
             </div>

             {/* Images */}
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">图片上传 <span className="text-gray-400 font-normal">(选填，最多4张)</span></label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                   <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#4CAF50] hover:text-[#4CAF50] cursor-pointer transition-colors">
                      <Camera size={24} className="mb-1" />
                      <span className="text-xs">添加图片</span>
                   </div>
                </div>
             </div>

             {/* Contact */}
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">联系方式 <span className="text-gray-400 font-normal">(选填)</span></label>
                <input 
                   type="text" 
                   className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#4CAF50] focus:outline-none placeholder-gray-400"
                   placeholder="请留下您的手机号或邮箱，方便我们联系您"
                   value={formData.contact}
                   onChange={e => setFormData({...formData, contact: e.target.value})}
                />
             </div>

             <div className="pt-4 border-t border-gray-100">
                <Button 
                   type="submit" 
                   variant="solid-green" 
                   size="lg" 
                   className="w-full sm:w-auto px-12"
                   isLoading={isSubmitting}
                >
                   提交反馈
                </Button>
             </div>
          </form>
       </Card>
    </div>
  );
};