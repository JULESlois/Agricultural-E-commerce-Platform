import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, SectionTitle } from '../components/Common';
import { MOCK_EXPERTS, MOCK_ARTICLES, MOCK_QA } from '../constants';
import { Star, MessageCircle, MapPin, Award, BookOpen, Clock, ThumbsUp, Camera, HelpCircle, ArrowLeft, Video, Phone } from 'lucide-react';

// K-04: Expert Profile
export const ExpertProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const expert = MOCK_EXPERTS.find(e => e.id === id) || MOCK_EXPERTS[0];
  const [activeTab, setActiveTab] = useState<'intro' | 'articles' | 'qa' | 'services'>('intro');

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4 mb-2">
         <Button variant="ghost" size="sm" onClick={() => navigate('/knowledge')}>
             <ArrowLeft size={16} className="mr-1" /> 返回智库
         </Button>
      </div>

      {/* E-Cover: Profile Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
         {/* Cover Image */}
         <div className="h-48 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute bottom-6 right-8 text-white/90 text-xl font-serif italic">
               "科技兴农，服务三农"
            </div>
         </div>
         
         {/* Info Bar */}
         <div className="px-8 pb-6 relative">
            <div className="flex flex-col md:flex-row items-end -mt-12 gap-6">
               <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 overflow-hidden flex-shrink-0 relative z-10">
                  <img src={expert.avatarUrl} alt={expert.name} className="w-full h-full object-cover" />
               </div>
               
               <div className="flex-1 pb-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                     <h1 className="text-3xl font-bold text-[#212121]">{expert.name}</h1>
                     <div className="flex gap-2">
                        <Badge color="green">认证专家</Badge>
                        <Badge color="blue">{expert.title}</Badge>
                     </div>
                  </div>
                  <div className="text-gray-500 text-sm flex items-center gap-4">
                     <span className="flex items-center gap-1"><MapPin size={14}/> {expert.institution || '中国农业科学院'}</span>
                     <span className="flex items-center gap-1"><Award size={14}/> 擅长: {expert.specialty}</span>
                  </div>
               </div>

               <div className="flex gap-3 pb-2">
                  <div className="text-center px-4 border-r border-gray-200">
                     <div className="font-bold text-lg text-[#212121]">{expert.helpCount}</div>
                     <div className="text-xs text-gray-500">已帮助</div>
                  </div>
                  <div className="text-center px-4">
                     <div className="font-bold text-lg text-[#FF9800]">{expert.rating}</div>
                     <div className="text-xs text-gray-500">好评率</div>
                  </div>
                  <Button variant="solid-green" className="ml-4" onClick={() => setActiveTab('services')}>
                     立即咨询
                  </Button>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* E-Sidebar */}
         <div className="space-y-6">
            <Card className="p-6">
               <SectionTitle title="执业信息" />
               <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                     <span className="text-gray-500">执业证号</span>
                     <span className="font-mono">A2023090012</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-gray-500">所属机构</span>
                     <span>{expert.institution}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-gray-500">从业年限</span>
                     <span>15年</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 text-center">
                     <div className="w-32 h-32 bg-gray-100 mx-auto mb-2 flex items-center justify-center text-xs text-gray-400">
                        二维码占位
                     </div>
                     <p className="text-xs text-gray-400">扫码分享名片</p>
                  </div>
               </div>
            </Card>
            
            <Card className="p-6 bg-green-50 border border-green-100">
               <h3 className="font-bold text-green-800 mb-2">服务承诺</h3>
               <ul className="list-disc pl-4 space-y-1 text-sm text-green-700">
                  <li>24小时内响应</li>
                  <li>不满意可申诉退款</li>
                  <li>平台全程担保交易</li>
               </ul>
            </Card>
         </div>

         {/* E-Tabs: Main Content */}
         <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
               <div className="flex border-b border-gray-100">
                  {[
                     { id: 'intro', label: '个人简介' },
                     { id: 'services', label: '咨询服务' },
                     { id: 'articles', label: '发表文章' },
                     { id: 'qa', label: '历史问答' },
                  ].map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-4 font-medium text-sm transition-colors relative ${activeTab === tab.id ? 'text-[#2E7D32] bg-green-50/50' : 'text-gray-600 hover:bg-gray-50'}`}
                     >
                        {tab.label}
                        {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2E7D32]"></div>}
                     </button>
                  ))}
               </div>
               
               <div className="p-8">
                  {activeTab === 'intro' && (
                     <div className="space-y-6 text-gray-700 leading-relaxed animate-fade-in">
                        <div>
                           <h3 className="font-bold text-lg text-[#212121] mb-3">专家介绍</h3>
                           <p>
                              {expert.name}，{expert.title}，{expert.institution || '中国农业科学院'}特聘专家。
                              长期致力于{expert.specialty}的研究与推广工作。
                              主持参与国家级、省部级科研项目10余项，在国内外核心期刊发表学术论文30余篇。
                              具有丰富的田间指导经验，擅长解决生产一线的疑难杂症。
                           </p>
                        </div>
                        <div>
                           <h3 className="font-bold text-lg text-[#212121] mb-3">擅长领域</h3>
                           <div className="flex flex-wrap gap-2">
                              {expert.tags?.map(tag => (
                                 <span key={tag} className="px-3 py-1 bg-gray-100 rounded text-sm">{tag}</span>
                              ))}
                           </div>
                        </div>
                        <div>
                           <h3 className="font-bold text-lg text-[#212121] mb-3">荣誉奖项</h3>
                           <ul className="list-disc pl-5 space-y-2">
                              <li>2023年度全国优秀农业科技工作者</li>
                              <li>省科技进步二等奖 (2020)</li>
                              <li>市级“最美农技员”</li>
                           </ul>
                        </div>
                     </div>
                  )}

                  {activeTab === 'services' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
                           <MessageCircle className="w-8 h-8 text-blue-500 mb-4 relative z-10" />
                           <h4 className="font-bold text-lg mb-2">图文咨询</h4>
                           <p className="text-gray-500 text-sm mb-4 h-10">发送文字、图片描述问题，24小时内回复。</p>
                           <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-[#FF9800]">¥20 <span className="text-xs font-normal text-gray-400">/ 次</span></span>
                              <Button variant="ghost" size="sm" className="border-blue-500 text-blue-500 hover:bg-blue-50">立即下单</Button>
                           </div>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
                           <Phone className="w-8 h-8 text-purple-500 mb-4 relative z-10" />
                           <h4 className="font-bold text-lg mb-2">电话咨询</h4>
                           <p className="text-gray-500 text-sm mb-4 h-10">预约时间，15分钟一对一通话解答。</p>
                           <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-[#FF9800]">¥100 <span className="text-xs font-normal text-gray-400">/ 次</span></span>
                              <Button variant="ghost" size="sm" className="border-purple-500 text-purple-500 hover:bg-purple-50">预约</Button>
                           </div>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
                           <Video className="w-8 h-8 text-orange-500 mb-4 relative z-10" />
                           <h4 className="font-bold text-lg mb-2">视频诊断</h4>
                           <p className="text-gray-500 text-sm mb-4 h-10">远程视频连线，查看田间实况，现场指导。</p>
                           <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-[#FF9800]">¥300 <span className="text-xs font-normal text-gray-400">/ 30分</span></span>
                              <Button variant="ghost" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-50">预约</Button>
                           </div>
                        </div>
                     </div>
                  )}
                  
                  {activeTab === 'articles' && (
                     <div className="space-y-4 animate-fade-in">
                        {MOCK_ARTICLES.filter(a => a.author.id === expert.id).map(article => (
                           <div key={article.id} className="flex gap-4 border-b border-gray-50 pb-4 cursor-pointer hover:bg-gray-50 p-2 rounded" onClick={() => navigate(`/knowledge/article/${article.id}`)}>
                              <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                 <img src={article.coverUrl} className="w-full h-full object-cover" alt={article.title} />
                              </div>
                              <div>
                                 <h4 className="font-bold text-[#212121] mb-1 hover:text-[#2E7D32]">{article.title}</h4>
                                 <div className="text-xs text-gray-400 flex gap-4">
                                    <span>{article.publishDate}</span>
                                    <span>阅读 {article.views}</span>
                                 </div>
                              </div>
                           </div>
                        ))}
                        {MOCK_ARTICLES.filter(a => a.author.id === expert.id).length === 0 && (
                           <div className="text-center text-gray-400 py-12">暂无发表文章</div>
                        )}
                     </div>
                  )}

                  {activeTab === 'qa' && (
                     <div className="space-y-6 animate-fade-in">
                        {MOCK_QA.map((qa, i) => (
                           <div key={i} className="border-b border-gray-100 pb-4">
                              <div className="font-bold text-gray-800 text-sm mb-2 flex gap-2">
                                 <span className="text-orange-500">Q:</span> {qa.question}
                              </div>
                              <div className="text-gray-600 text-sm bg-gray-50 p-3 rounded flex gap-2">
                                 <span className="text-green-600 font-bold">A:</span> {qa.answer}
                              </div>
                              <div className="text-right text-xs text-gray-400 mt-2">{qa.time}</div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// K-05: Ask Question
export const AskQuestion: React.FC = () => {
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
      title: '',
      category: 'planting',
      description: '',
      bounty: '0'
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert('问题发布成功！等待专家解答。');
      navigate('/knowledge');
   };

   return (
      <div className="animate-fade-in max-w-3xl mx-auto space-y-6 pb-12">
         <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/knowledge')}>
               <ArrowLeft size={16} className="mr-1" /> 返回
            </Button>
            <h1 className="text-2xl font-bold text-[#212121]">快速提问</h1>
         </div>

         <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-700">
            <HelpCircle className="flex-shrink-0" />
            <div className="text-sm">
               <p className="font-bold mb-1">提问小贴士</p>
               <p>1. 标题简明扼要，例如“番茄叶子卷曲变黄怎么办？”</p>
               <p>2. 详细描述症状、发病时间、已用药情况。</p>
               <p>3. 上传清晰的患病部位照片，有助于专家准确诊断。</p>
            </div>
         </div>

         <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">问题标题</label>
                  <input 
                     type="text" 
                     className="w-full p-3 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none placeholder-gray-400"
                     placeholder="一句话描述您的问题（5-50字）"
                     value={formData.title}
                     onChange={e => setFormData({...formData, title: e.target.value})}
                     required
                  />
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">问题分类</label>
                     <select 
                        className="w-full p-3 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                     >
                        <option value="planting">种植技术</option>
                        <option value="breeding">养殖技术</option>
                        <option value="machinery">农业机械</option>
                        <option value="policy">政策法律</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">指定专家 <span className="text-gray-400 font-normal">(可选)</span></label>
                     <select className="w-full p-3 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none">
                        <option value="">系统智能匹配</option>
                        {MOCK_EXPERTS.map(e => (
                           <option key={e.id} value={e.id}>{e.name} ({e.title})</option>
                        ))}
                     </select>
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">详细描述</label>
                  <textarea 
                     className="w-full p-3 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none h-40 resize-none placeholder-gray-400"
                     placeholder="请详细描述问题背景、症状、已采取的措施..."
                     value={formData.description}
                     onChange={e => setFormData({...formData, description: e.target.value})}
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">上传照片/视频</label>
                  <div className="grid grid-cols-4 gap-4">
                     <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#4CAF50] hover:text-[#4CAF50] cursor-pointer transition-colors">
                        <Camera size={24} className="mb-2" />
                        <span className="text-xs">添加图片</span>
                     </div>
                  </div>
               </div>

               <div className="bg-gray-50 p-4 rounded-lg">
                   <label className="block text-sm font-medium text-gray-700 mb-2">悬赏金额 (元)</label>
                   <div className="flex gap-4">
                      {['0', '5', '10', '20'].map(amt => (
                         <button
                           type="button"
                           key={amt}
                           onClick={() => setFormData({...formData, bounty: amt})}
                           className={`px-6 py-2 rounded border transition-colors ${formData.bounty === amt ? 'bg-orange-50 border-orange-500 text-orange-600 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'}`}
                         >
                            {amt === '0' ? '免费' : `¥${amt}`}
                         </button>
                      ))}
                   </div>
                   <p className="text-xs text-gray-400 mt-2">悬赏金额越高，越快获得专家解答</p>
               </div>

               <div className="pt-4">
                  <Button type="submit" variant="solid-green" size="lg" className="w-full">
                     发布问题
                  </Button>
               </div>
            </form>
         </Card>
      </div>
   );
};
