import React from 'react';
import type { Product } from '../../types';

interface ProductGridProps {
    products: Product[];
    onProductClick: (id: string) => void;
}

const ProductCard: React.FC<{ product: Product; onClick: () => void }> = ({ product, onClick }) => (
    <div 
        onClick={onClick}
        className="group bg-white rounded-lg shadow-md overflow-hidden border border-transparent hover:border-green-500 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
    >
        <div className="relative h-48 overflow-hidden">
            <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <p className="text-sm text-gray-800 mb-2 flex-grow">{product.name}</p>
            <div className="flex items-baseline justify-between mt-auto">
                <div>
                    <span className="text-xl font-bold text-red-600">¥{product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">¥{product.originalPrice.toFixed(2)}</span>
                    )}
                </div>
            </div>
        </div>
    </div>
);


const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
    if (products.length === 0) {
        return <div className="text-center py-10 text-gray-600">没有找到相关商品。</div>
    }
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} onClick={() => onProductClick(product.id)} />
            ))}
        </div>
    );
};

export default ProductGrid;
