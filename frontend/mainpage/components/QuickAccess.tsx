import React from 'react';

const DirectSaleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const LoanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ExpertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CommunityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

const accessLinks = [
    { page: 'ecommerce', title: '产链直销', description: '优质农品，源头直供', icon: <DirectSaleIcon/>, color: 'bg-green-600' },
    { page: 'loan', title: '惠农贷', description: '信用贷款，解燃眉之急', icon: <LoanIcon/>, color: 'bg-amber-600' },
    { page: 'expert', title: '专家智库', description: '权威专家，在线答疑', icon: <ExpertIcon/>, color: 'bg-teal-600' },
    { page: 'community', title: '用户社区', description: '经验分享，互助交流', icon: <CommunityIcon/>, color: 'bg-indigo-600' },
]

const QuickAccess: React.FC<{onLinkClick: (page: string) => void}> = ({ onLinkClick }) => {
  return (
    <section className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-green-900 mb-8">功能快速入口</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {accessLinks.map((link) => (
                <button onClick={() => onLinkClick(link.page)} key={link.title} className="group block text-left">
                    <div className={`p-6 rounded-lg shadow-md hover:shadow-xl text-center transition-all duration-300 transform hover:-translate-y-1 ${link.color}`}>
                        <div className="flex items-center justify-center mb-4">
                           {link.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white">{link.title}</h3>
                        <p className="text-white opacity-90 mt-1">{link.description}</p>
                    </div>
                </button>
            ))}
        </div>
    </section>
  );
};

export default QuickAccess;
