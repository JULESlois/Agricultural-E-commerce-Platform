import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge, SectionTitle } from '../components/Common';
import { useMockQuery } from '../src/hooks/useMockQuery';
import { MockApi } from '../src/mock/mockApi';
import { Search, MessageCircle, BookOpen, ChevronRight, PlayCircle, Eye, ThumbsUp } from 'lucide-react';

export const KnowledgeHome: React.FC = () => {
  const navigate = useNavigate();
  const { data: articleResp, isLoading: aLoading, isError: aError, retry: aRetry } = useMockQuery(() => MockApi.getArticles({ page: 1, pageSize: 10 }), []);
  const { data: expert } = useMockQuery(() => MockApi.getExpertById('e1'), []);
  const { data: qaResp } = useMockQuery(() => MockApi.getQA({ page: 1, pageSize: 5 }), []);

  return (
    <div className="animate-fade-in space-y-8">
      {/* K-Hero: Search & Index */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2E7D32] to-[#43A047] text-white py-12 px-6 shadow-lg">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/agricuture.png')]"></div>
         <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-wide">智慧农库 · 专家在线</h1>
            <p className="text-green-100 text-lg">汇集全国顶尖农业专家，提供科学种植技术文档与在线一对一咨询服务。</p>
            
            <div className="relative max-w-xl mx-auto">
               <input 
                 type="text" 
                 className="w-full pl-6 pr-32 py-4 rounded-full text-gray-800 focus:outline-none shadow-xl text-lg placeholder-gray-400"
                 placeholder="搜索病虫害、施肥技术、专家..."
               />
               <Button className="absolute right-2 top-2 rounded-full px-8 h-10 bg-[#2E7D32] hover:bg-[#1B5E20] border-none">
                  搜索
               </Button>
            </div>
            
            <div className="flex justify-center gap-4 text-sm text-green-100 pt-2">
               <span>热搜：</span>
               {['小麦白粉病', '有机肥配比', '农机补贴', '大豆选种'].map(tag => (
                  <span key={tag} className="cursor-pointer hover:text-white underline decoration-dotted">{tag}</span>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Left Column (Main Content) */}
         <div className="lg:col-span-8 space-y-6">
            {/* K-Tabs: Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex justify-between items-center overflow-x-auto no-scrollbar">
               <div className="flex gap-2">
                  {['推荐', '种植技术', '养殖技术', '农业机械', '政策解读'].map((tab, i) => (
                     <button 
                        key={tab} 
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${i === 0 ? 'bg-[#2E7D32] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                     >
                        {tab}
                     </button>
                  ))}
               </div>
               <div className="border-l border-gray-200 pl-4 ml-4 hidden md:block">
                  <Button variant="text" size="sm" className="text-gray-500">更多频道 <ChevronRight size={14}/></Button>
               </div>
            </div>

            <div className="space-y-4">
               {aLoading && Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[140px] bg-white border border-gray-200 rounded animate-pulse" />)}
               {aError && (
                 <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">文章加载失败 <Button variant="ghost" size="sm" onClick={aRetry}>重试</Button></div>
               )}
               {articleResp && articleResp.data.map((article) => (
                  <Card 
                     key={article.id} 
                     variant="interactive" 
                     className="p-6 flex flex-col md:flex-row gap-6 group"
                     onClick={() => navigate(`/knowledge/article/${article.id}`)}
                  >
                     <div className="flex-1 flex flex-col justify-between">
                        <div>
                           <h3 className="text-xl font-bold text-[#212121] mb-2 group-hover:text-[#2E7D32] transition-colors leading-snug">
                              {article.title}
                           </h3>
                           <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                              {article.summary}
                           </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                           <div className="flex items-center gap-2">
                              <img src={article.author.avatarUrl} className="w-5 h-5 rounded-full" alt="author" />
                              <span className="text-gray-600">{article.author.name}</span>
                           </div>
                           <span>{article.publishDate}</span>
                           <span className="flex items-center gap-1"><Eye size={12}/> {article.views}</span>
                           <span className="flex items-center gap-1"><ThumbsUp size={12}/> {article.likes}</span>
                           <div className="flex gap-1 ml-auto">
                              {article.tags.map(tag => (
                                 <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded text-gray-500">{tag}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                     <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src={article.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={article.title} />
                     </div>
                  </Card>
               ))}
            </div>
            
            <div className="text-center pt-4">
               <Button variant="ghost" className="w-full text-gray-500">加载更多文章</Button>
            </div>
         </div>

         {/* Right Column (Widgets) */}
         <div className="lg:col-span-4 space-y-6">
            {/* K-Expert-Widget */}
            <Card className="p-0 border border-gray-200">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-[#212121]">金牌专家推荐</h3>
                  <span className="text-xs text-gray-400 cursor-pointer hover:text-[#2E7D32]">查看全部</span>
               </div>
               <div className="divide-y divide-gray-50">
                  {[expert].filter(Boolean).map((expert) => (
                     <div key={expert.id} className="p-4 flex items中心 gap-3 hover:bg-gray-50 transition-colors">
                        <div className="relative">
                           <img src={expert.avatarUrl} className="w-12 h-12 rounded-full object-cover" alt={expert.name} />
                           <div className="absolute -bottom-1 -right-1 bg黄400 text白 text-[8px] px-1 rounded-sm font-bold">认证</div>
                        </div>
                        <div className="flex-1">
                           <div className="font-bold text-sm text-[#212121]">{expert.name}</div>
                           <div className="text-xs text-gray-500">{expert.title}</div>
                        </div>
                        <Button 
                           variant="ghost" 
                           size="sm" 
                           className="text-[#2E7D32] border-[#2E7D32] h-7 px-2 text-xs hover:bg-green-50"
                           onClick={() => navigate(`/knowledge/expert/${expert.id}`)}
                        >
                           咨询
                        </Button>
                     </div>
                  ))}
              </div>
            </Card>

            {/* K-Q&A Widget */}
            <Card className="p-0 border border-gray-200">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-[#212121]">最新问答</h3>
                  <Button variant="solid-green" size="sm" className="h-7 px-3 text-xs" onClick={() => navigate('/knowledge/ask')}>
                     我要提问
                  </Button>
               </div>
               <div className="p-4 space-y-4">
                  {qaResp && qaResp.data.map((qa) => (
                     <div key={qa.id} className="group cursor-pointer">
                        <div className="flex gap-2 mb-1">
                           <span className="bg-orange-100 text-orange-600 text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 h-fit mt-0.5">问</span>
                           <h4 className="text-sm font-bold text-gray-700 group-hover:text-[#2E7D32] line-clamp-1">{qa.question}</h4>
                        </div>
                        <p className="text-xs text-gray-500 pl-7 line-clamp-2">{qa.answer}</p>
                        <div className="text-[10px] text-gray-400 pl-7 mt-1">{qa.time}</div>
                     </div>
                  ))}
              </div>
            </Card>

            {/* Promotion/Video */}
            <div className="rounded-xl overflow-hidden relative h-40 group cursor-pointer">
               <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover" alt="Video" />
               <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                  <PlayCircle size={40} className="mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">2025 智慧农业技术峰会回顾</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
