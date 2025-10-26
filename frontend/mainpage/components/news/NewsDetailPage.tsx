import React, { useState } from 'react';
import SimplifiedHeader from '../shared/SimplifiedHeader';
import Footer from '../Footer';
import { newsData } from '../../data/newsData';

const ShareIcon = () => <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>;
const FontIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.49 3.026a.75.75 0 01.44 1.252l-3.32 2.214A.75.75 0 015.5 6.002v5.996c0 .343.193.653.499.748l3.32 1.008a.75.75 0 01.44-1.252l-2.091-.634a.75.75 0 01-.408-.698V6.69a.75.75 0 01.408-.698l2.09-.634a.75.75 0 011.252.44 4.5 4.5 0 000 8.708.75.75 0 01.44 1.252A6 6 0 014 12.498V6.002a2.25 2.25 0 012.25-2.25h.75a2.25 2.25 0 012.25 2.25v.194a.75.75 0 01-1.5 0V6.002a.75.75 0 00-.75-.75h-.75a.75.75 0 00-.75.75v5.996c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75v-.194a.75.75 0 011.5 0v.194a2.25 2.25 0 01-2.25 2.25h-.75a2.25 2.25 0 01-2.25-2.25V6.002A2.25 2.25 0 015.5 3.752l.24-.076a.75.75 0 01.44-1.252l.25.076.25-.076.25.076.25-.076.25.076z" clipRule="evenodd" /></svg>;

const fontSizes = ['prose-base', 'prose-lg', 'prose-xl'];

interface NewsDetailPageProps {
    navigate: (page: string) => void;
    articleId: number;
}

const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ navigate, articleId }) => {
  const [fontSizeIndex, setFontSizeIndex] = useState(1); // Default to prose-lg
  
  const article = newsData.find(a => a.id === articleId);

  const toggleFontSize = () => {
    setFontSizeIndex((prevIndex) => (prevIndex + 1) % fontSizes.length);
  };
  
  const handleShare = () => {
    console.log('Sharing news article...');
    alert('分享功能已复制链接到剪贴板（模拟）');
  };

  if (!article) {
    return (
         <div className="bg-white">
            <SimplifiedHeader navigate={navigate} pageTitle="新闻正文" />
            <main className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-red-600">错误</h1>
                <p className="text-gray-600 mt-4">未找到该新闻文章，请返回首页。</p>
                 <button onClick={() => navigate('home')} className="mt-6 bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition">
                    返回首页
                </button>
            </main>
            <Footer />
        </div>
    )
  }

  return (
    <div className="bg-white">
      <SimplifiedHeader navigate={navigate} pageTitle="新闻正文" />
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          <div className="flex items-center justify-between text-gray-500 border-y py-3 mb-8">
            <div>
              <span>发布日期：{article.date}</span>
              <span className="mx-2">|</span>
              <span>来源：{article.source}</span>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={toggleFontSize} className="flex items-center px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition">
                    <FontIcon />
                    <span>字体</span>
                </button>
                 <button onClick={handleShare} className="flex items-center px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition">
                    <ShareIcon />
                    <span>分享</span>
                </button>
            </div>
          </div>

          <div className={`prose ${fontSizes[fontSizeIndex]} max-w-none text-gray-800 leading-relaxed transition-all duration-300`}>
            {article.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
            <figure className="my-8">
              <img src={article.imageUrl} alt={article.title} className="rounded-lg shadow-md w-full" />
              <figcaption className="text-center text-sm text-gray-600 mt-2">图为相关新闻图片。</figcaption>
            </figure>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetailPage;