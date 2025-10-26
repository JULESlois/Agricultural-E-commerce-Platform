import React from 'react';
import type { NewsArticle } from '../types';
import { newsData } from '../data/newsData';

const HeadlineNews: React.FC<{ article: NewsArticle, onClick: () => void }> = ({ article, onClick }) => (
  <div className="group relative overflow-hidden rounded-lg shadow-lg h-full cursor-pointer" onClick={onClick}>
    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/70 to-transparent">
      <h2 className="text-3xl font-bold text-white mb-2">{article.title}</h2>
      <p className="text-gray-200">{article.excerpt}</p>
    </div>
    <div className="absolute inset-0"></div>
  </div>
);

const NewsList: React.FC<{ articles: NewsArticle[], onArticleClick: (id: number) => void }> = ({ articles, onArticleClick }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
    <h3 className="text-2xl font-bold text-green-900 border-b-2 border-green-200 pb-2 mb-4 flex-shrink-0">新闻栏</h3>
    <ul className="space-y-4 overflow-y-auto">
      {articles.map(article => (
        <li key={article.id}>
          <button onClick={() => onArticleClick(article.id)} className="group flex items-start space-x-2 text-gray-700 hover:text-green-700 transition-colors text-left w-full">
            <span className="text-green-800 font-bold mt-1 text-lg">&bull;</span>
            <div>
              <p className="font-medium group-hover:underline">{article.title}</p>
              <time className="text-sm text-gray-500">{article.date}</time>
            </div>
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const FocusNews: React.FC<{onNewsClick: (id: number) => void}> = ({ onNewsClick }) => {
  const headline = newsData.find(n => n.isHeadline);
  const newsList = newsData.filter(n => !n.isHeadline);

  if (!headline) return null;

  return (
    <section>
        <h2 className="text-3xl font-bold text-center text-green-900 mb-8">焦点新闻</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[450px]">
                <HeadlineNews article={headline} onClick={() => onNewsClick(headline.id)} />
            </div>
            <div className="lg:col-span-1 h-[450px]">
                <NewsList articles={newsList} onArticleClick={onNewsClick} />
            </div>
        </div>
    </section>
  );
};

export default FocusNews;