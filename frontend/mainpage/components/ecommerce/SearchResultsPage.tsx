import React from 'react';
import ProductGrid from './ProductGrid';
import { products } from '../../data/ecommerceData';

interface SearchResultsPageProps {
    searchTerm: string;
    onProductClick: (id: string) => void;
    onBack: () => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ searchTerm, onProductClick, onBack }) => {
    const results = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
             <div className="flex justify-between items-center mb-6">
                <div>
                     <button onClick={onBack} className="text-green-600 hover:text-green-800 mb-1">&larr; 返回首页</button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        搜索结果: <span className="text-green-600">"{searchTerm}"</span>
                    </h1>
                </div>
                <p className="text-gray-600">共找到 {results.length} 件相关商品</p>
            </div>

            {/* Placeholder for price prediction chart */}
             <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">"{searchTerm}" 价格指数 (模拟)</h3>
                <div className="h-40 bg-gray-200 rounded animate-pulse flex items-center justify-center text-gray-500">
                    价格走势图
                </div>
            </div>
            
            <ProductGrid products={results} onProductClick={onProductClick} />
        </div>
    );
};

export default SearchResultsPage;
