import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { PORTAL_NAV_ITEMS, DASHBOARD_MENU } from '../constants';
import { ShoppingCart, Bell, User, ChevronDown, Search, LogOut, Home, ShoppingBag, Landmark, GraduationCap, HelpCircle, Filter, Trash2, Store } from 'lucide-react';
import { ChatWidget } from './ChatWidget';

// --- Header Components ---

const TopHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState(['红富士苹果', '有机大米', '大棚建设贷款', '果树修剪技术']);
  const [isScrolled, setIsScrolled] = useState(false);

  // Ensure we match strictly for the root path
  const isPortalHome = location.pathname === '/';
  
  // Scroll listener for home page
  useEffect(() => {
    if (!isPortalHome) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 60); // Hide header when scrolled past 60px
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPortalHome]);
  
  // Page type checks
  const isMall = location.pathname.startsWith('/mall');
  const isHelp = location.pathname.startsWith('/help');
  const isKnowledge = location.pathname.startsWith('/knowledge');
  const isFinance = location.pathname.startsWith('/finance');
  
  // Determine which logo to use
  const getLogoSrc = () => {
    if (isPortalHome) return '/assests/logo.png';
    if (isMall) return '/assests/logo3.png';
    return '/assests/logo2.png';
  };
  
  let subtitle = '融销一体化平台';
  let placeholder = '搜索商品、服务、政策...';
  let showFilter = false;

  if (isMall) {
    subtitle = '产链直销平台';
    placeholder = '搜索商品';
    showFilter = true;
  } else if (isFinance) {
    subtitle = '助农融资平台';
    placeholder = '搜索贷款、理财...';
  } else if (isKnowledge) {
    subtitle = '知识库';
    placeholder = '搜索专家、文章...';
  } else if (isHelp) {
    placeholder = '搜索问题...';
  }
  
  const handleClearHistory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchHistory([]);
  };

  // Dynamic Theme Colors based on isMall
  const theme = {
    headerBg: isMall ? 'bg-[#4CAF50] border-[#388E3C] shadow-md' : 'bg-white border-[#E0E0E0] shadow-sm',
    logoBg: isMall ? 'bg-white text-[#4CAF50]' : 'bg-[#4CAF50] text-white',
    textPrimary: isMall ? 'text-white' : 'text-[#212121]',
    textSecondary: isMall ? 'text-green-100' : 'text-[#757575]',
    icon: isMall ? 'text-white hover:text-green-100' : 'text-[#212121] hover:text-[#4CAF50]',
    divider: isMall ? 'border-green-400' : 'border-[#E0E0E0]',
    searchBg: isMall ? 'bg-white' : 'bg-[#FAFAFA]',
    searchBorder: isMall ? 'border-transparent' : 'border-[#E0E0E0]',
    searchRing: isMall ? 'ring-2 ring-white/30' : 'ring-2 ring-[#4CAF50]/10',
    userBg: isMall ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500',
  };

  return (
    <header className={`fixed w-full h-[60px] z-50 transition-all duration-300 ${theme.headerBg} ${isPortalHome && isScrolled ? '-top-[60px]' : 'top-0'}`}>
      <div className="w-full max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center shrink-0 h-full py-2">
          <img 
            src={getLogoSrc()} 
            alt="智农链Logo" 
            className={`${isPortalHome ? 'h-full' : 'h-8 md:h-10'} object-contain shrink-0`}
          />
          {!isPortalHome && (
            <div className="flex flex-col shrink-0 ml-2 md:ml-3">
              <span className={`text-[18px] md:text-[20px] font-bold leading-none whitespace-nowrap ${theme.textPrimary}`}>智农链</span>
              <span className={`text-[10px] hidden sm:block ${theme.textSecondary}`}>{subtitle}</span>
            </div>
          )}
        </Link>

        {/* Right Side Content */}
        {isPortalHome ? (
          // PORTAL HOME MODE: Extra Links + Language Switch
          <div className="flex items-center justify-end gap-6">
             <button 
               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
               className={`text-sm font-medium hidden sm:block hover:opacity-80 ${theme.textPrimary} cursor-pointer`}
             >
               合作交流
             </button>
             <Link to="/app-download" className={`text-sm font-medium flex items-center gap-1 hover:opacity-80 ${theme.textPrimary}`}>
               APP下载
             </Link>
             <div className={`w-px h-4 bg-gray-300 hidden sm:block ${theme.divider}`}></div>
             <div className={`flex items-center gap-1 text-sm cursor-pointer hover:opacity-80 ${theme.textPrimary}`}>
               简体中文 <ChevronDown size={14} />
             </div>
          </div>
        ) : (
          // OTHER PAGES MODE: Search + Full Actions
          <>
            {/* Middle: Search - Flexible width - Hidden on Help & Knowledge pages */}
            {!isHelp && !isKnowledge ? (
              <div className="hidden md:flex flex-1 items-center justify-center px-4 md:px-8 lg:px-12 min-w-0 relative">
                <div className={`flex items-center rounded-full px-4 py-1.5 w-full max-w-[500px] transition-all duration-200 relative z-20 border ${theme.searchBg} ${isSearchFocused ? `${isMall ? theme.searchRing : 'border-[#4CAF50] ring-2 ring-[#4CAF50]/10'}` : theme.searchBorder}`}>
                  <Search className="w-4 h-4 text-[#757575] mr-2 shrink-0" />
                  <input 
                    type="text" 
                    placeholder={placeholder} 
                    className="bg-transparent border-none outline-none text-sm w-full text-[#212121] placeholder-gray-400"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  />
                  {showFilter && (
                     <button className="ml-2 pl-2 border-l border-gray-200 text-gray-500 hover:text-[#4CAF50] flex items-center gap-1 shrink-0 transition-colors">
                        <Filter size={14} />
                        <span className="text-xs font-medium">筛选</span>
                     </button>
                  )}
                </div>

                {/* Search History Dropdown */}
                {isSearchFocused && (
                   <div className="absolute top-[calc(100%+4px)] w-full max-w-[500px] bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 p-4 z-10 animate-fade-in text-[#212121]">
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-xs font-bold text-gray-500">历史搜索</span>
                         <button 
                            onMouseDown={handleClearHistory}
                            className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                         >
                            <Trash2 size={12} /> 清空
                         </button>
                      </div>
                      {searchHistory.length > 0 ? (
                         <div className="flex flex-wrap gap-2">
                            {searchHistory.map((term, idx) => (
                               <button key={idx} className="px-3 py-1 bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-[#4CAF50] text-sm rounded-full transition-colors">
                                  {term}
                               </button>
                            ))}
                         </div>
                      ) : (
                         <div className="text-center text-xs text-gray-400 py-4">暂无搜索历史</div>
                      )}
                   </div>
                )}
              </div>
            ) : (
              <div className="flex-1"></div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-3 md:gap-4 shrink-0 min-w-0">
              {/* Notifications */}
              <div 
                className={`relative cursor-pointer p-1 transition-colors ${theme.icon}`}
                onClick={() => navigate('/messages')}
                title="消息"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </div>

              {/* Cart - Hidden on Help, Knowledge, and Finance pages */}
              {!isHelp && !isKnowledge && !isFinance && (
                <div 
                  className={`relative cursor-pointer flex items-center gap-1 transition-colors p-1 ${theme.icon}`}
                  onClick={() => navigate('/mall/cart')}
                  title="购物车"
                >
                  <ShoppingCart size={20} />
                  <span className="text-xs font-medium hidden lg:inline whitespace-nowrap">购物车</span>
                </div>
              )}

              {/* User Profile - Redirects to Orders now */}
              <div 
                className={`flex items-center gap-2 cursor-pointer pl-3 md:pl-4 border-l ml-1 ${theme.divider}`}
                onClick={() => navigate('/mall/buyer/orders')}
                title="个人中心"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-white/50 transition-all shrink-0 ${theme.userBg}`}>
                   <User size={18} />
                </div>
                {/* Only show name on larger screens to prevent overflow */}
                <span className={`text-sm font-medium hidden lg:inline whitespace-nowrap max-w-[100px] truncate ${theme.textPrimary}`}>张三 (农户)</span>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

const PortalNav = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isPortalHome = location.pathname === '/';
  
  // Scroll listener for home page
  useEffect(() => {
    if (!isPortalHome) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 60);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPortalHome]);
  
  return (
    <nav className={`fixed w-full h-[50px] bg-white border-b-2 border-[#4CAF50] z-40 shadow-sm hidden md:block transition-all duration-300 ${isPortalHome && isScrolled ? 'top-0' : 'top-[60px]'}`}>
      {/* Changed px-8 to responsive px-4 lg:px-8 to fit smaller screens */}
      <div className="w-full max-w-[1200px] mx-auto px-4 h-full flex items-center justify-center gap-1">
        {PORTAL_NAV_ITEMS.map((item) => {
          const isActive = item.path === '/' 
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
            
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`
                px-4 lg:px-8 h-full flex items-center text-[15px] lg:text-[16px] font-medium transition-all duration-300 relative whitespace-nowrap
                ${isActive ? 'text-[#4CAF50] bg-[#F9F9F9]' : 'text-[#212121] hover:bg-[#FAFAFA] hover:text-[#4CAF50]'}
              `}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#4CAF50] animate-fade-in" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const MobilePortalNav = () => {
  const location = useLocation();
  
  const getIcon = (path: string) => {
    switch(path) {
      case '/': return Home;
      case '/mall': return ShoppingBag;
      case '/finance': return Landmark;
      case '/knowledge': return GraduationCap;
      case '/help': return HelpCircle;
      default: return Home;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full h-[60px] bg-white border-t border-[#E0E0E0] z-50 md:hidden flex items-center justify-around pb-1 safe-area-pb shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {PORTAL_NAV_ITEMS.map((item) => {
        const Icon = getIcon(item.path);
        const isActive = item.path === '/' 
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
            
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-[#4CAF50]' : 'text-[#757575]'}`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const MobileDashboardNav = () => {
  const location = useLocation();
  const role = location.pathname.includes('/banker') ? 'BANKER' : 
               location.pathname.includes('/expert') ? 'EXPERT' : 
               location.pathname.includes('/buyer') ? 'BUYER' : 'FARMER';
  
  const menuItems = DASHBOARD_MENU[role] || DASHBOARD_MENU.FARMER;

  return (
    <nav className="fixed bottom-0 left-0 w-full h-[60px] bg-white border-t border-[#E0E0E0] z-50 lg:hidden flex items-center justify-around pb-1 safe-area-pb shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {menuItems.slice(0, 5).map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-[#4CAF50]' : 'text-[#757575]'}`}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-[#FAFAFA] border-t border-[#E0E0E0] pt-[40px] pb-8 mt-auto hidden md:block">
    <div className="w-full max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
      <div>
        <h4 className="text-[14px] font-bold text-[#212121] mb-4">关于我们</h4>
        <ul className="space-y-2 text-xs text-[#757575]">
          <li><a href="#" className="hover:text-[#4CAF50]">平台简介</a></li>
          <li><a href="#" className="hover:text-[#4CAF50]">发展历程</a></li>
          <li><a href="#" className="hover:text-[#4CAF50]">联系方式</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-[14px] font-bold text-[#212121] mb-4">帮助中心</h4>
        <ul className="space-y-2 text-xs text-[#757575]">
          <li><a href="#" className="hover:text-[#4CAF50]">新手指南</a></li>
          <li><a href="#" className="hover:text-[#4CAF50]">常见问题</a></li>
          <li><a href="#" className="hover:text-[#4CAF50]">交易规则</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-[14px] font-bold text-[#212121] mb-4">商务合作</h4>
        <ul className="space-y-2 text-xs text-[#757575]">
          <li><a href="#" className="hover:text-[#4CAF50]">供应商入驻</a></li>
          <li><a href="#" className="hover:text-[#4CAF50]">金融机构合作</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-[14px] font-bold text-[#212121] mb-4">关注我们</h4>
        <div className="flex justify-center md:justify-start gap-4">
          {/* Social placeholders */}
          <div className="w-8 h-8 bg-gray-200 rounded-full hover:bg-[#4CAF50] transition-colors"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full hover:bg-[#4CAF50] transition-colors"></div>
        </div>
      </div>
    </div>
    <div className="text-center text-[12px] text-[#9E9E9E] mt-8 border-t border-[#E0E0E0] pt-4">
      <p>&copy; 2025 Smart Agro Chain. All rights reserved. ICP备12345678号</p>
    </div>
  </footer>
);

// --- Layouts ---

export const PortalLayout: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isPortalHome = location.pathname === '/';
  
  // Logic: Show PortalNav only on Home or Help Center pages
  const showPortalNav = location.pathname === '/' || location.pathname.startsWith('/help');
  
  // Scroll listener for home page
  useEffect(() => {
    if (!isPortalHome) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 60);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPortalHome]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <TopHeader />
      
      {/* Conditionally render PortalNav */}
      {showPortalNav && <PortalNav />}
      
      {/* Adjust padding based on PortalNav visibility and scroll state:
          - Home page scrolled: 60px (nav at top)
          - Home page not scrolled: 120px (header + nav)
          - Other pages with nav: 120px
          - Other pages without nav: 80px
      */}
      <main className={`flex-grow pb-[80px] md:pb-12 w-full max-w-[1200px] mx-auto px-4 ${
        isPortalHome && isScrolled 
          ? 'pt-[60px] md:pt-[60px]' 
          : showPortalNav 
            ? 'pt-[70px] md:pt-[120px]' 
            : 'pt-[70px] md:pt-[80px]'
      }`}>
        <Outlet />
      </main>
      
      <Footer />
      <MobilePortalNav />
      <ChatWidget />
    </div>
  );
};

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Determine role based on URL for demo purposes
  const role = location.pathname.includes('/banker') ? 'BANKER' : 
               location.pathname.includes('/expert') ? 'EXPERT' : 
               location.pathname.includes('/buyer') ? 'BUYER' : 'FARMER';
  
  const menuItems = DASHBOARD_MENU[role] || DASHBOARD_MENU.FARMER;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      {/* Simplified Header for Dashboard */}
      <header className="fixed top-0 w-full h-[60px] bg-white border-b border-[#E0E0E0] z-50 flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="返回门户首页">
          <img 
            src="/assests/logo2.png" 
            alt="智农链Logo" 
            className="h-8 w-8 object-contain"
          />
          <span className="font-bold text-lg hidden sm:block">工作台</span>
        </Link>
        <button onClick={() => navigate(-1)} className="text-sm text-[#757575] hover:text-[#4CAF50] whitespace-nowrap">返回上一级 &rarr;</button>
      </header>

      <div className="flex pt-[60px] h-[calc(100vh)]">
        {/* Sidebar */}
        <aside className="w-[240px] bg-white border-r border-[#E0E0E0] h-full overflow-y-auto hidden lg:block shrink-0">
          <div className="p-6">
            <div className="text-xs font-bold text-gray-400 uppercase mb-4">Menu</div>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                      isActive 
                      ? 'bg-[#4CAF50]/10 text-[#4CAF50] font-medium' 
                      : 'text-[#757575] hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              
              {/* Seller Switch for Buyers */}
              {role === 'BUYER' && (
                 <div className="pt-4 mt-4 border-t border-gray-100">
                    <div className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-2">商家管理</div>
                    <Link 
                      to="/mall/seller/dashboard" 
                      className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-[#757575] hover:bg-gray-50 hover:text-[#4CAF50]"
                    >
                       <Store size={18} />
                       进入卖家工作台
                    </Link>
                 </div>
              )}

              <div className="pt-4 mt-4 border-t border-gray-100">
                 <Link to="/auth/login" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-md">
                    <LogOut size={18} />
                    退出登录
                 </Link>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto relative pb-[80px] lg:pb-6 min-w-0">
          <Outlet />
          <div className="absolute bottom-[90px] lg:bottom-6 right-6 z-10">
             <ChatWidget />
          </div>
        </main>
      </div>
      <MobileDashboardNav />
    </div>
  );
};

export const TradeLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
       <header className="h-[80px] bg-white border-b border-[#E0E0E0] flex items-center justify-center sticky top-0 z-50 shadow-sm">
          <div className="w-full max-w-[1000px] px-4 flex justify-between items-center">
             <Link to="/" className="flex items-center gap-4">
                <img 
                  src="/assests/logo2.png" 
                  alt="智农链Logo" 
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold text-[#212121]">收银台</span>
             </Link>
             <div className="text-sm text-[#757575] flex items-center gap-2">
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">安全加密支付</span>
             </div>
          </div>
       </header>
       <main className="flex-grow py-8 px-4 w-full max-w-[1000px] mx-auto">
         <Outlet />
       </main>
       <div className="text-center py-6 text-xs text-gray-400">
         Smart Agro Chain Secure Payment
       </div>
    </div>
  );
};