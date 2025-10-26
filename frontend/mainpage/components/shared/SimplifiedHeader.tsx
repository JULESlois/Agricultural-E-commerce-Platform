import React from 'react';

const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-700">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M12 12L7 17" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
);


interface SimplifiedHeaderProps {
    navigate: (page: string) => void;
    pageTitle: string;
}

const SimplifiedHeader: React.FC<SimplifiedHeaderProps> = ({ navigate, pageTitle }) => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="w-full h-1.5 bg-green-600"></div>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('home')} className="flex items-center space-x-2">
                             <Logo />
                            <span className="text-xl font-bold text-green-800">智农链</span>
                        </button>
                        <span className="text-gray-400">/</span>
                        <h1 className="text-lg text-gray-700">{pageTitle}</h1>
                    </div>
                    <button onClick={() => navigate('home')} className="text-green-700 hover:text-green-900 font-medium">
                        &larr; 返回首页
                    </button>
                </div>
            </div>
        </header>
    );
};

export default SimplifiedHeader;
