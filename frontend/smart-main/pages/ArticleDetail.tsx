import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, SectionTitle } from '../components/Common';
import { MOCK_ARTICLES, MOCK_PRODUCTS } from '../constants';
import { ArrowLeft, Clock, Eye, ThumbsUp, Star, MessageSquare, Share2, ShoppingBag } from 'lucide-react';

export const ArticleDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = MOCK_ARTICLES.find(a => a.id === id) || MOCK_ARTICLES[0];
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="animate-fade-in bg-white min-h-screen pb-20">
      {/* K-02: Sticky Reading Header */}
      <div className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="w-full h-[2px] bg-gray-100 absolute top-0 left-0">
           <div className="h-full bg-[#4CAF50] transition-all duration-300" style={{ width: `${scrollProgress * 100}%` }}></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
           <Button variant="ghost" size="sm" onClick={() => navigate('/knowledge')}>
              <ArrowLeft size={16} className="mr-1" /> 返回
           </Button>
           <div className="text-sm font-bold text-gray-700 truncate max-w-[200px] hidden md:block">{article.title}</div>
           <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-[#4CAF50]" title="字体大小">A+</button>
              <button className="p-2 text-gray-500 hover:text-[#4CAF50]" title="分享"><Share2 size={16}/></button>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Main Content (Center) */}
         <div className="lg:col-span-8 lg:col-start-2">
            <h1 className="text-3xl font-bold text-[#212121] mb-6 leading-tight">{article.title}</h1>
            
            <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
               <div className="flex items-center gap-2">
                  <img src={article.author.avatarUrl} className="w-8 h-8 rounded-full object-cover" alt={article.author.name} />
                  <span className="font-bold text-gray-700">{article.author.name}</span>
                  <Badge color="blue">{article.author.title}</Badge>
               </div>
               <span>{article.publishDate}</span>
               <span className="flex items-center gap-1"><Eye size={14}/> {article.views}</span>
            </div>

            <div className="bg-[#F9F9F9] p-6 rounded-lg mb-8 text-gray-600 italic border-l-4 border-[#4CAF50]">
               摘要：{article.summary}
            </div>

            <div className="prose max-w-none text-lg leading-loose text-gray-800 space-y-6">
               <p>
                  进入秋季，果树的养分回流，根系进入生长高峰期，此时的管理直接影响来年的产量和品质。本文将从施肥、修剪、病虫害防治三个方面进行详细讲解。
               </p>
               <img src={article.coverUrl} className="w-full rounded-lg my-4" alt="Content" />
               <p className="text-sm text-gray-400 text-center">图1：标准化果园秋季管理示范</p>

               <h2 className="text-2xl font-bold mt-8 mb-4">一、秋施基肥</h2>
               <p>
                  秋施基肥宜早不宜晚，一般在9月中下旬至10月中旬进行。此时地温尚高，有利于肥料分解和根系吸收。建议以有机肥为主，配合适量的复合肥。
                  推荐使用腐熟的农家肥或商品有机肥，每亩用量3000-5000公斤。
               </p>

               <h2 className="text-2xl font-bold mt-8 mb-4">二、合理修剪</h2>
               <p>
                  秋季修剪主要是疏除徒长枝、病虫枝和过密枝，改善通风透光条件。对于生长过旺的树，可适当拉枝开角，促进花芽分化。
               </p>

               <h2 className="text-2xl font-bold mt-8 mb-4">三、病虫害综合防治</h2>
               <p>
                  秋季是腐烂病、轮纹病等病害的高发期，同时也是潜叶蛾、红蜘蛛等害虫的越冬准备期。应及时清理果园落叶、烂果，集中深埋或销毁。
                  药剂防治可选用石硫合剂或波尔多液进行全园喷施。
               </p>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mt-8 mb-12">
               {article.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-gray-600 text-sm">#{tag}</span>
               ))}
            </div>

            {/* Author Card (Bottom) */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between mb-12">
               <div className="flex items-center gap-4">
                  <img src={article.author.avatarUrl} className="w-16 h-16 rounded-full object-cover" alt={article.author.name} />
                  <div>
                     <h3 className="font-bold text-lg">{article.author.name}</h3>
                     <p className="text-gray-500 text-sm">{article.author.institution} · {article.author.specialty}</p>
                  </div>
               </div>
               <Button variant="solid-green" size="sm" onClick={() => navigate(`/knowledge/expert/${article.author.id}`)}>
                  向专家提问
               </Button>
            </div>
         </div>

         {/* K-Related: Sidebar Recommendation (Desktop) */}
         <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
            <div className="font-bold text-gray-700 border-l-4 border-[#4CAF50] pl-3">相关农资推荐</div>
            <div className="space-y-4">
               {MOCK_PRODUCTS.slice(0, 3).map(product => (
                  <Card key={product.id} className="p-3 flex gap-3 cursor-pointer hover:border-[#4CAF50] transition-colors" onClick={() => navigate(`/mall/item/${product.id}`)}>
                     <img src={product.imageUrl} className="w-16 h-16 rounded object-cover" alt={product.title} />
                     <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1">{product.title}</h4>
                        <div className="text-[#FF9800] font-bold text-sm">¥{product.price}</div>
                     </div>
                  </Card>
               ))}
            </div>
         </div>
      </div>

      {/* K-Action: Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 z-40">
         <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2 text-gray-500 cursor-text">
               <MessageSquare size={16} />
               <span className="text-sm">写下您的评论...</span>
            </div>
            <div className="flex items-center gap-6 text-gray-600">
               <button className="flex flex-col items-center gap-1 hover:text-[#4CAF50]">
                  <MessageSquare size={20} />
                  <span className="text-[10px]">12</span>
               </button>
               <button className="flex flex-col items-center gap-1 hover:text-[#4CAF50]">
                  <Star size={20} />
                  <span className="text-[10px]">收藏</span>
               </button>
               <button className="flex flex-col items-center gap-1 hover:text-[#4CAF50]">
                  <ThumbsUp size={20} />
                  <span className="text-[10px]">{article.likes}</span>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
