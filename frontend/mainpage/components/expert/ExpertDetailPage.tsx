import React from 'react';
import SimplifiedHeader from '../shared/SimplifiedHeader';
import Footer from '../Footer';
import { expertData } from '../../data/expertData';

interface ExpertDetailPageProps {
    navigate: (page: string) => void;
    expertId: number;
}

const ExpertDetailPage: React.FC<ExpertDetailPageProps> = ({ navigate, expertId }) => {
  
  const expert = expertData.find(e => e.id === expertId);

  const handleAskExpert = () => {
    console.log('Opening "Ask Expert" modal...');
    alert('“向专家提问”功能开发中，敬请期待！');
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
                    <button onClick={handleAskExpert} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors">
                        向专家提问
                    </button>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertDetailPage;