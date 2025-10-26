import React, { useState } from 'react';
import type { Product, Seller } from '../../types';
import { products } from '../../data/ecommerceData';
import ProductGrid from './ProductGrid';

const StarRating: React.FC<{ rating: number, size?: 'sm' | 'base' }> = ({ rating, size = 'base' }) => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`${starSize} ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className={`ml-2 text-sm ${size === 'sm' ? 'text-gray-500' : 'text-gray-600'}`}>{rating.toFixed(1)}</span>
        </div>
    );
};

interface ProductDetailPageProps {
    product: Product;
    seller: Seller;
    onBack: () => void;
    onSellerClick: (sellerId: string) => void;
    onProductClick: (productId: string) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, seller, onBack, onSellerClick, onProductClick }) => {
    const [selectedImage, setSelectedImage] = useState(product.images[0] || product.imageUrl);
    const relatedProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 5);

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl">
            <button onClick={onBack} className="text-green-600 hover:text-green-800 mb-4">&larr; 返回列表</button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div>
                    <div className="border rounded-lg overflow-hidden mb-4">
                        <img src={selectedImage} alt={product.name} className="w-full h-96 object-cover" />
                    </div>
                    <div className="flex space-x-2">
                        {product.images.map((img, index) => (
                            <button key={index} onClick={() => setSelectedImage(img)} className={`w-16 h-16 border-2 rounded-md overflow-hidden ${selectedImage === img ? 'border-green-500' : 'border-transparent'}`}>
                                <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                    <div>
                        <span className="text-4xl font-bold text-red-600">¥{product.price.toFixed(2)}</span>
                        {product.originalPrice && <span className="ml-4 text-gray-500 line-through">¥{product.originalPrice.toFixed(2)}</span>}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-gray-600">
                        <p><strong>发货地:</strong> {product.shippingInfo.origin}</p>
                        <p><strong>商家:</strong> <button onClick={() => onSellerClick(seller.id)} className="text-green-600 hover:underline">{seller.name}</button></p>
                        <p className="flex items-center"><strong>商家信用:</strong> <span className="ml-2"><StarRating rating={seller.rating} size="sm" /></span></p>
                        <p><strong>发货信息:</strong> {product.shippingInfo.deliveryTime}, {product.shippingInfo.guarantees.join(' / ')}</p>
                    </div>
                    <div className="flex items-center space-x-4 pt-4">
                        <button className="flex-1 bg-amber-500 text-white font-bold py-3 rounded-lg hover:bg-amber-600 transition">加入购物车</button>
                        <button className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition">立即购买</button>
                        <button className="border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-100 transition">收藏</button>
                    </div>
                </div>
            </div>

            {/* Details and Reviews */}
            <div className="mt-12">
                <div className="border-b">
                    <nav className="flex space-x-8">
                        <span className="py-4 px-1 border-b-2 border-green-500 font-semibold text-green-600">商品详情</span>
                        <span className="py-4 px-1 border-b-2 border-transparent text-gray-500">商品评价 ({product.reviews.length})</span>
                    </nav>
                </div>

                {/* Product Specs */}
                <div className="py-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">商品规格</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
                        {Object.entries(product.specs).map(([key, value]) => (
                            <div key={key}><strong>{key}:</strong> {value}</div>
                        ))}
                    </div>
                </div>
                
                {/* Product Description */}
                <div className="py-8 border-t">
                     <h3 className="text-xl font-bold mb-4 text-gray-800">图文详情</h3>
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    <img src={product.images[1] || product.imageUrl} alt="Detail" className="w-full rounded-lg" />
                </div>
                
                {/* Reviews */}
                <div className="py-8 border-t">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">商品评价</h3>
                    <div className="space-y-6">
                        {product.reviews.slice(0, 2).map(review => (
                             <div key={review.id} className="border-b pb-4">
                                <div className="flex items-center mb-2">
                                    <span className="font-semibold">{review.author}</span>
                                    <div className="ml-4"><StarRating rating={review.rating} size="sm" /></div>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                                <p className="text-sm text-gray-500 mt-2">{review.date}</p>
                            </div>
                        ))}
                        {product.reviews.length > 2 && (
                             <div className="text-center">
                                <button className="border border-gray-300 py-2 px-6 rounded-full hover:bg-gray-100 transition">查看全部评价</button>
                             </div>
                        )}
                         {product.reviews.length === 0 && (
                            <p className="text-gray-500">暂无评价。</p>
                        )}
                    </div>
                </div>

                 {/* Related Products */}
                <div className="py-8 border-t">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">相关商品</h3>
                    <ProductGrid products={relatedProducts} onProductClick={onProductClick} />
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
