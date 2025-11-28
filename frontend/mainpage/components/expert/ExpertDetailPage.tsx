import React, { useState } from 'react';
import SimplifiedHeader from '../shared/SimplifiedHeader';
import Footer from '../Footer';
import { expertData } from '../../data/expertData';

interface ExpertDetailPageProps {
    navigate: (page: string) => void;
    expertId: number;
}

const ExpertDetailPage: React.FC<ExpertDetailPageProps> = ({ navigate, expertId }) => {
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultType, setConsultType] = useState<'text' | 'phone' | 'video'>('text');
  const [textDesc, setTextDesc] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  const expert = expertData.find(e => e.id === expertId);

  const submitConsult = () => {
    if (consultType === 'text' && !textDesc.trim()) {
      alert('请填写问题描述');
      return;
    }
    if (consultType !== 'text') {
      if (!scheduleDate || !scheduleTime) {
        alert('请选择预约日期与时间');
        return;
      }
      if (consultType === 'phone' && !phoneNumber.trim()) {
        alert('请填写联系电话');
        return;
      }
    }
    setConsultOpen(false);
    setTextDesc('');
    setPhoneNumber('');
    setScheduleDate('');
    setScheduleTime('');
    alert('下单成功，稍后将与您联系');
  };

  if (!expert) {
     return (
         <div className="bg-gray-50">
            <SimplifiedHeader navigate={navigate} pageTitle="专家介绍" />
            <main className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-red-600">错误</h1>
                <p className="text-gray-600 mt-4">未找到该专家信息，请返回首页。</p>
                 <button onClick={() => navigate('home')} className="mt-6 bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition">
                    返回首页
                </button>
            </main>
            <Footer />
        </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <SimplifiedHeader navigate={navigate} pageTitle="专家介绍" />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                    <img 
                        src={expert.imageUrl} 
                        alt={expert.name}
                        className="w-40 h-40 rounded-full object-cover border-4 border-green-200 shadow-md"
                    />
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">{expert.name}</h1>
                    <p className="text-xl text-green-700 mt-1">{expert.title}</p>
                    <p className="text-gray-600 mt-2">{expert.affiliation}</p>
                    <div className="mt-4 flex justify-center md:justify-start space-x-2">
                        {expert.tags.map(tag => (
                             <span key={tag} className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-10 border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">专家简介</h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
                    {expert.bio.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">研究方向</h2>
                 <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {expert.researchFields.map((field, index) => <li key={index}>{field}</li>)}
                </ul>

            <div className="mt-10 text-center">
              <button onClick={() => setConsultOpen(true)} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors">
                下单咨询
              </button>
            </div>
            {consultOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-xl w-[92%] max-w-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">选择咨询方式</h3>
                    <button className="text-gray-500" onClick={() => setConsultOpen(false)}>×</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <button className={`px-3 py-2 rounded-lg border ${consultType === 'text' ? 'border-green-600 text-green-700 font-bold bg-green-50' : 'border-gray-200 text-gray-700'}`} onClick={() => setConsultType('text')}>图文咨询</button>
                    <button className={`px-3 py-2 rounded-lg border ${consultType === 'phone' ? 'border-green-600 text-green-700 font-bold bg-green-50' : 'border-gray-200 text-gray-700'}`} onClick={() => setConsultType('phone')}>电话咨询</button>
                    <button className={`px-3 py-2 rounded-lg border ${consultType === 'video' ? 'border-green-600 text-green-700 font-bold bg-green-50' : 'border-gray-200 text-gray-700'}`} onClick={() => setConsultType('video')}>视频咨询</button>
                  </div>
                  {consultType === 'text' && (
                    <div className="space-y-3">
                      <label className="text-sm text-gray-600">问题描述</label>
                      <textarea value={textDesc} onChange={(e) => setTextDesc(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200" rows={4} placeholder="请详细描述您的问题"></textarea>
                    </div>
                  )}
                  {consultType !== 'text' && (
                    <div className="grid grid-cols-1 gap-3">
                      {consultType === 'phone' && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">联系电话</label>
                          <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200" placeholder="请输入手机号" />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">预约日期</label>
                          <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">预约时间</label>
                          <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-6 flex gap-3">
                    <button onClick={submitConsult} className="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg">立即下单咨询</button>
                    <button onClick={() => setConsultOpen(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded-lg">取消</button>
                  </div>
                </div>
              </div>
            )}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertDetailPage;
