import React from 'react';
import type { Seller } from '../../types';
import { products } from '../../data/ecommerceData';
import ProductGrid from './ProductGrid';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
        <span className="ml-2 text-gray-600">{rating.toFixed(1)}</span>
    </div>
);

interface SellerPageProps {
    seller: Seller;
    onProductClick: (id: string) => void;
    onBack: () => void;
}

const SellerPage: React.FC<SellerPageProps> = ({ seller, onProductClick, onBack }) => {
    const sellerProducts = products.filter(p => p.sellerId === seller.id);

    return (
        <div className="space-y-8">
            <button onClick={onBack} className="text-green-600 hover:text-green-800">&larr; 返回</button>
            {/* Seller Info Header */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <img src={seller.avatarUrl} alt={seller.name} className="w-24 h-24 rounded-full border-4 border-green-200" />
                <div className="flex-grow text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-800">{seller.name}</h1>
                    <p className="text-gray-600 mt-1">{seller.storeBio}</p>
                    <div className="mt-2 flex items-center justify-center sm:justify-start space-x-4">
                        <div className="flex items-center">
                            <span className="mr-2 font-semibold">综合评分:</span>
                            <StarRating rating={seller.rating} />
                        </div>
                        <span className="text-gray-500">|</span>
                        <span className="font-semibold text-gray-700">总销量: {seller.totalSales}+</span>
                    </div>
                </div>
                <button className="bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 transition">
                    + 关注
                </button>
            </div>

            {/* Seller's Products */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-bold text-gray-800">全部商品 ({sellerProducts.length})</h2>
                     <div className="relative w-64">
                         <input type="search" placeholder="在店铺内搜索..." className="w-full py-2 pl-4 pr-10 bg-gray-100 rounded-full border-transparent focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
                         <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                             <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                         </div>
                     </div>
                </div>
                <ProductGrid products={sellerProducts} onProductClick={onProductClick} />
            </div>
        </div>
    );
};

export default SellerPage;
