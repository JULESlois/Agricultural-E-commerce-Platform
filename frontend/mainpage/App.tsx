import React, { useState } from 'react';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import FocusNews from './components/FocusNews';
import Announcements from './components/Announcements';
import AgriKnowledge from './components/AgriKnowledge';
import QuickAccess from './components/QuickAccess';
import FeedbackSection from './components/FeedbackSection';
import Footer from './components/Footer';
import EcommercePage from './components/ecommerce/EcommercePage';
import NewsDetailPage from './components/news/NewsDetailPage';
import ExpertListPage from './components/expert/ExpertListPage';
import ExpertDetailPage from './components/expert/ExpertDetailPage';
import AgriLoanPage from './components/loan/AgriLoanPage';
import CommunityPage from './components/community/CommunityPage';

interface ViewState {
  page: string;
  id?: number | string | null;
}

const HomePage: React.FC<{ navigate: (page: string, id?: number) => void }> = ({ navigate }) => (
  <>
    <Header onNavClick={navigate} />
    <main>
      <HeroCarousel />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <FocusNews onNewsClick={(id) => navigate('news', id)} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[450px]">
          <div className="lg:col-span-2">
            <Announcements />
          </div>
          <div>
            <AgriKnowledge onExpertClick={() => navigate('expert')} />
          </div>
        </div>
        <QuickAccess onLinkClick={navigate} />
        <FeedbackSection />
      </div>
    </main>
    <Footer />
  </>
);


const App: React.FC = () => {
  const [view, setView] = useState<ViewState>({ page: 'home' });

  const navigate = (pageName: string, id: number | string | null = null) => {
    if (pageName === 'ecommerce') {
      window.location.href = 'https://shop-489.pages.dev/';
      return;
    }
    const validPages = ['home', 'ecommerce', 'news', 'expert', 'loan', 'community'];
    if (validPages.includes(pageName)) {
      setView({ page: pageName, id });
      window.scrollTo(0, 0);
    } else {
        console.log(`Navigation to "${pageName}" is not implemented yet.`);
        alert(`"${pageName}" 页面正在开发中，敬请期待！`);
    }
  };

  const renderPage = () => {
    const { page, id } = view;
    switch (page) {
      case 'ecommerce':
        return <EcommercePage />;
      case 'news':
        return <NewsDetailPage navigate={navigate} articleId={Number(id)} />;
      case 'expert':
        if (id !== null && id !== undefined) {
          return <ExpertDetailPage navigate={navigate} expertId={Number(id)} />;
        }
        return <ExpertListPage navigate={navigate} />;
      case 'loan':
        return <AgriLoanPage navigate={navigate} />;
      case 'community':
        return <CommunityPage navigate={navigate} />;
      case 'home':
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {renderPage()}
    </div>
  );
};

export default App;