import React, { useState, useEffect } from 'react';

const Logo = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M12 12L7 17" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
);


const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('简体中文');

  const languages = ['简体中文', '繁體中文', 'English'];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-white px-3 py-2 border border-transparent hover:border-white rounded-md transition-colors"
      >
        {selectedLang}
        <svg className={`w-4 h-4 ml-1 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-20">
          <ul className="py-1">
            {languages.map(lang => (
              <li 
                key={lang} 
                onClick={() => {
                  setSelectedLang(lang);
                  setIsOpen(false);
                }}
                className="cursor-pointer px-4 py-2 text-gray-800 hover:bg-green-100"
              >
                {lang}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface HeaderProps {
    onNavClick: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { name: '首页', page: 'home' },
    { name: '产链直销', page: 'ecommerce' },
    { name: '惠农贷', page: 'loan' },
    { name: '专家智库', page: 'expert' },
    { name: '用户社区', page: 'community' },
    { name: '合作交流', page: 'cooperation' },
  ];

  return (
    <>
      {/* Spacer to prevent content jump */}
      <div className="h-[128px]" /> 
      
      <header className={`fixed top-0 left-0 right-0 z-50 bg-green-900 text-white transition-transform duration-300 ease-in-out ${isScrolled ? '-translate-y-[80px]' : 'translate-y-0'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20"> {/* h-20 is 80px */}
            <div className="flex items-center space-x-3">
              <Logo />
              <span className="text-2xl font-bold">智农链</span>
            </div>
            <div className="flex items-center space-x-6">
              <LanguageSelector />
            </div>
          </div>
        </div>
        <nav className="bg-green-800 shadow-md">
          <div className="container mx-auto px-4">
              <ul className="flex items-center justify-center space-x-10 h-12">
                  {navItems.map((item) => (
                      <li key={item.name}>
                          <button onClick={() => onNavClick(item.page)} className="text-lg font-medium text-white hover:text-lime-300 transition-colors duration-200 pb-2 border-b-2 border-transparent hover:border-lime-300">
                              {item.name}
                          </button>
                      </li>
                  ))}
              </ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
