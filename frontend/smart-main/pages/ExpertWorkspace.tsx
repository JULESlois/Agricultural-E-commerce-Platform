import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge, SectionTitle } from '../components/Common';
import { LayoutDashboard, MessageSquare, FileText, CheckCircle2, Clock, DollarSign, TrendingUp, Plus, Edit, Trash2, Search, ArrowRight, Eye, MoreHorizontal } from 'lucide-react';

// E-01: Expert Dashboard
export const ExpertDashboard: React.FC = () => {
   const navigate = useNavigate();

   const stats = [
      { label: '待回复咨询', value: '5', color: 'text-orange-500', bg: 'bg-orange-50', icon: MessageSquare },
      { label: '本月收益 (元)', value: '2,400', color: 'text-green-600', bg: 'bg-green-50', icon: DollarSign },
      { label: '文章阅读量', value: '12.5k', color: 'text-blue-600', bg: 'bg-blue-50', icon: Eye },
      { label: '服务评分', value: '4.9', color: 'text-purple-600', bg: 'bg-purple-50', icon: CheckCircle2 },
   ];

   return (
      <div className="space-y-6 animate-fade-in">
         <h1 className="text-2xl font-bold text-[#212121]">专家工作台</h1>
         
         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
               <Card key={i} className="p-6 flex items-center justify-between">
                  <div>
                     <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                     <h2 className="text-2xl font-bold text-[#212121]">{s.value}</h2>
                  </div>
                  <div className={`p-3 rounded-full ${s.bg} ${s.color}`}>
                     <s.icon size={24} />
                  </div>
               </Card>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Consultations */}
            <Card className="p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">待办咨询</h3>
                  <Button variant="text" size="sm" onClick={() => navigate('/expert/consultations')}>查看全部</Button>
               </div>
               <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                     <div key={i} className="flex gap-4 p-3 border border-gray-100 rounded hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/expert/consultations')}>
                        <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0"></div>
                        <div className="flex-1">
                           <h4 className="font-bold text-sm text-gray-800 mb-1">这也太难了，西瓜叶子全枯萎了怎么办？</h4>
                           <div className="text-xs text-gray-400 flex justify-between">
                              <span>用户: 王小二 | 悬赏 ¥10</span>
                              <span>10分钟前</span>
                           </div>
                        </div>
                        <Button size="sm" variant="ghost">回复</Button>
                     </div>
                  ))}
               </div>
            </Card>

            {/* Income Trend Mock */}
            <Card className="p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">近期收益趋势</h3>
                  <TrendingUp className="text-gray-400" />
               </div>
               <div className="h-48 flex items-end justify-between gap-2 px-4">
                  {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                     <div key={i} className="w-full bg-blue-100 rounded-t hover:bg-blue-200 transition-colors relative group">
                        <div className="absolute bottom-0 w-full bg-[#1976D2] rounded-t" style={{ height: `${h}%` }}></div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                           ¥{h * 10}
                        </div>
                     </div>
                  ))}
               </div>
               <div className="flex justify-between mt-2 text-xs text-gray-400 px-2">
                  <span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span>
               </div>
            </Card>
         </div>
      </div>
   );
};

// E-02: Consultation Management
export const ExpertConsultationList: React.FC = () => {
   const [selectedId, setSelectedId] = useState<number | null>(null);
   const [replyText, setReplyText] = useState('');

   const questions = [
      { id: 1, title: '西瓜叶子全枯萎了怎么办？', user: '王小二', time: '10分钟前', status: 'pending', content: '昨天还好好的，今天突然就这样了，是不是因为昨晚下了大雨？附图如下...' },
      { id: 2, title: '苹果树修剪的最佳时间是？', user: '张三', time: '2小时前', status: 'replied', content: '坐标山东烟台，红富士苹果，树龄5年。' },
      { id: 3, title: '大棚蔬菜如何预防灰霉病？', user: '李四', time: '1天前', status: 'pending', content: '最近湿度比较大，担心爆发病害。' },
   ];

   const handleReply = () => {
      alert('回复发送成功！');
      setReplyText('');
      setSelectedId(null);
   };

   return (
      <div className="space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
         <h1 className="text-2xl font-bold text-[#212121]">咨询管理</h1>

         <div className="flex gap-6 h-full min-h-0">
            {/* List */}
            <Card className="w-1/3 p-0 flex flex-col h-full">
               <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                     <input type="text" placeholder="搜索问题..." className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-transparent rounded text-sm focus:bg-white focus:border-[#4CAF50] focus:outline-none" />
                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto">
                  {questions.map(q => (
                     <div 
                        key={q.id} 
                        onClick={() => setSelectedId(q.id)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === q.id ? 'bg-blue-50 border-l-4 border-l-[#1976D2]' : ''}`}
                     >
                        <div className="flex justify-between mb-1">
                           <Badge color={q.status === 'pending' ? 'red' : 'green'}>{q.status === 'pending' ? '待回复' : '已回复'}</Badge>
                           <span className="text-xs text-gray-400">{q.time}</span>
                        </div>
                        <h4 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1">{q.title}</h4>
                        <div className="text-xs text-gray-500">{q.user}</div>
                     </div>
                  ))}
               </div>
            </Card>

            {/* Detail & Reply */}
            <Card className="flex-1 p-0 flex flex-col h-full">
               {selectedId ? (
                  <>
                     <div className="p-6 border-b border-gray-200 flex-1 overflow-y-auto">
                        <div className="mb-6">
                           <h2 className="text-xl font-bold mb-2">{questions.find(q => q.id === selectedId)?.title}</h2>
                           <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                              <span>提问者: {questions.find(q => q.id === selectedId)?.user}</span>
                              <span>时间: {questions.find(q => q.id === selectedId)?.time}</span>
                           </div>
                           <div className="bg-gray-50 p-4 rounded-lg text-gray-700 leading-relaxed">
                              {questions.find(q => q.id === selectedId)?.content}
                              <div className="mt-4 flex gap-2">
                                 {[1, 2].map(i => (
                                    <div key={i} className="w-24 h-24 bg-gray-200 rounded"></div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {questions.find(q => q.id === selectedId)?.status === 'replied' && (
                           <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                              <div className="font-bold text-green-700 mb-2">我的回复：</div>
                              <p className="text-gray-700 text-sm">建议加强通风，降低棚内湿度。可以使用腐霉利、异菌脲等药剂进行喷雾防治，注意轮换用药。</p>
                           </div>
                        )}
                     </div>

                     <div className="p-4 border-t border-gray-200 bg-white">
                        <textarea 
                           className="w-full p-4 border border-gray-300 rounded-lg focus:border-[#4CAF50] focus:outline-none resize-none h-32 mb-2"
                           placeholder="请输入专业的解答..."
                           value={replyText}
                           onChange={e => setReplyText(e.target.value)}
                        ></textarea>
                        <div className="flex justify-between items-center">
                           <div className="flex gap-2 text-gray-400">
                              <button className="hover:text-gray-600"><FileText size={20}/></button>
                           </div>
                           <Button variant="solid-green" onClick={handleReply} disabled={!replyText}>发送回复</Button>
                        </div>
                     </div>
                  </>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                     <MessageSquare size={48} className="mb-4 opacity-20" />
                     <p>请选择左侧咨询进行回复</p>
                  </div>
               )}
            </Card>
         </div>
      </div>
   );
};

// E-03: Article Management
export const ExpertArticleManager: React.FC = () => {
   const articles = [
      { id: 1, title: '秋季果园管理关键技术要点', date: '2025-09-24', views: 1230, status: 'published' },
      { id: 2, title: '新型有机肥使用指南', date: '2025-09-20', views: 850, status: 'published' },
      { id: 3, title: '大棚草莓病虫害防治（草稿）', date: '2025-09-26', views: 0, status: 'draft' },
   ];

   return (
      <div className="space-y-6 animate-fade-in">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#212121]">文章管理</h1>
            <Button variant="solid-green" icon={<Plus size={16}/>}>发布新文章</Button>
         </div>

         <Card className="p-0">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500">
                  <tr>
                     <th className="p-4 pl-6">文章标题</th>
                     <th className="p-4">发布时间</th>
                     <th className="p-4">阅读量</th>
                     <th className="p-4">状态</th>
                     <th className="p-4 text-right pr-6">操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {articles.map(article => (
                     <tr key={article.id} className="hover:bg-gray-50">
                        <td className="p-4 pl-6 font-bold text-gray-800">{article.title}</td>
                        <td className="p-4 text-gray-500">{article.date}</td>
                        <td className="p-4 text-gray-500">{article.views}</td>
                        <td className="p-4">
                           <Badge color={article.status === 'published' ? 'green' : 'gray'}>
                              {article.status === 'published' ? '已发布' : '草稿'}
                           </Badge>
                        </td>
                        <td className="p-4 text-right pr-6">
                           <div className="flex justify-end gap-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16}/></button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </Card>
      </div>
   );
};