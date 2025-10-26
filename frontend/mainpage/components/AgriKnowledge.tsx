import React from 'react';
import { expertData } from '../data/expertData';

const AgriKnowledge: React.FC<{onExpertClick: () => void}> = ({ onExpertClick }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h3 className="text-2xl font-bold text-green-900 border-b-2 border-green-200 pb-2 mb-4 flex-shrink-0">农业知识 / 专家信息</h3>
      <div className="space-y-4 overflow-y-auto flex-grow">
        {expertData.map(expert => (
            <button key={expert.id} onClick={onExpertClick} className="w-full flex items-center space-x-4 p-2 rounded-md hover:bg-gray-50 transition-colors text-left">
                <img src={expert.imageUrl} alt={expert.name} className="w-16 h-16 rounded-full object-cover border-2 border-green-200"/>
                <div>
                    <h4 className="font-bold text-lg text-gray-800">{expert.name}</h4>
                    <p className="text-gray-600">{expert.title}</p>
                </div>
            </button>
        ))}
      </div>
       <div className="mt-4 text-right flex-shrink-0">
            <button onClick={onExpertClick} className="text-green-700 hover:underline font-medium">查看更多 &rarr;</button>
       </div>
    </div>
  );
};

export default AgriKnowledge;