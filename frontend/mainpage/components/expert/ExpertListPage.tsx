import React from 'react';
import SimplifiedHeader from '../shared/SimplifiedHeader';
import Footer from '../Footer';
import { expertData } from '../../data/expertData';
import type { Expert } from '../../types';

interface ExpertListPageProps {
    navigate: (page: string, id?: number | string | null) => void;
}

const ExpertCard: React.FC<{ expert: Expert; onSelect: () => void }> = ({ expert, onSelect }) => {
    return (
        <button 
            onClick={onSelect}
            className="w-full bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            <img 
                src={expert.imageUrl} 
                alt={expert.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-green-100 flex-shrink-0"
            />
            <div className="flex-grow">
                <h3 className="text-2xl font-bold text-gray-800">{expert.name}</h3>
                <p className="text-lg text-green-700 font-semibold">{expert.title}</p>
                <p className="text-gray-600 mt-1">{expert.affiliation}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {expert.tags.map(tag => (
                        <span key={tag} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
                    ))}
                </div>
            </div>
        </button>
    );
};


const ExpertListPage: React.FC<ExpertListPageProps> = ({ navigate }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <SimplifiedHeader navigate={navigate} pageTitle="专家智库" />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">专家智库</h1>
        <p className="text-center text-gray-600 mb-10">汇聚农业领域权威专家，为您提供专业指导与支持。</p>

        <div className="space-y-8 max-w-4xl mx-auto">
            {expertData.map(expert => (
                <ExpertCard 
                    key={expert.id} 
                    expert={expert}
                    onSelect={() => navigate('expert', expert.id)} 
                />
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertListPage;
