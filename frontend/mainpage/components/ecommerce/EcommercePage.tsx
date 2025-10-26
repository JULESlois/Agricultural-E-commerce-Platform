import React, { useState, FormEvent } from 'react';
import LoginModal from '../auth/LoginModal';
import Footer from '../Footer';
import ProductDetailPage from './ProductDetailPage';
import SearchResultsPage from './SearchResultsPage';
import SellerPage from './SellerPage';
import ProductGrid from './ProductGrid';
import { products, categories, sellers } from '../../data/ecommerceData';

// --- Header Component ---
const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M12 12L7 17" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
);
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

interface EcommerceHeaderProps {
    onSearch: (term: string) => void;
    isLoggedIn: boolean;
    onLoginClick: () => void;
}

const EcommerceHeader: React.FC<EcommerceHeaderProps> = ({ onSearch, isLoggedIn, onLoginClick }) => {
    const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchQuery = formData.get('search') as string;
        onSearch(searchQuery);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-2">
                        <Logo />
                        <span className="text-2xl font-bold text-green-800">智农链 - 产销平台</span>
                    </div>
                    <div className="flex-1 max-w-xl mx-8">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input type="search" name="search" placeholder="搜索 新鲜水果..." className="w-full py-2 pl-4 pr-12 text-gray-700 bg-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:border-green-500 focus:bg-white transition" />
                            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3" aria-label="Search"><SearchIcon /></button>
                        </form>
                        <div className="flex items-center justify-center space-x-4 mt-1 text-sm text-gray-500">
                            {['有机蔬菜', '特色杂粮', '时令水果', '禽畜肉蛋'].map(term => (
                                <button key={term} onClick={() => onSearch(term)} className="hover:text-green-600">{term}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-6 text-gray-600">
                        <button onClick={() => alert('购物车功能开发中')} className="flex items-center space-x-1 hover:text-green-600"><CartIcon /><span>购物车</span></button>
                        <button onClick={isLoggedIn ? () => alert('个人中心功能开发中') : onLoginClick} className="flex items-center space-x-1 hover:text-green-600">
                            <UserIcon />
                            <span>{isLoggedIn ? '个人中心' : '登录/注册'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

// --- E-commerce Homepage Component ---
const EcommerceHomePage: React.FC<{ onProductClick: (id: string) => void }> = ({ onProductClick }) => (
    <div className="space-y-12">
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2 text-gray-800">商品分类</h3>
                <ul className="space-y-2">
                    {categories.map(cat => <li key={cat.id}><a href="#" className="text-gray-600 hover:text-green-700">{cat.name}</a></li>)}
                </ul>
            </div>
            <div className="lg:col-span-3 rounded-lg shadow overflow-hidden">
                 <div className="h-64 bg-gray-200 flex items-center justify-center">
                    <img src="https://picsum.photos/1200/400?image=292" className="w-full h-full object-cover" alt="Promotion"/>
                 </div>
            </div>
        </section>
        
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold text-xl mb-4 text-gray-800">热门推荐</h3>
            <ProductGrid products={products} onProductClick={onProductClick} />
        </div>
    </div>
);


// --- Main E-commerce Page (Router) ---
type EcomView = { page: 'home' } | { page: 'product'; id: string } | { page: 'search'; term: string } | { page: 'seller'; id: string };

const EcommercePage: React.FC = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [view, setView] = useState<EcomView>({ page: 'home' });

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setShowLogin(false);
    }

    const navigateToProduct = (productId: string) => setView({ page: 'product', id: productId });
    const navigateToSeller = (sellerId: string) => setView({ page: 'seller', id: sellerId });
    const navigateHome = () => setView({ page: 'home' });
    const executeSearch = (term: string) => setView({ page: 'search', term });

    const renderView = () => {
        switch (view.page) {
            case 'product':
                const product = products.find(p => p.id === view.id);
                if (!product) return <div>商品未找到</div>;
                const seller = sellers[product.sellerId];
                return <ProductDetailPage product={product} seller={seller} onBack={navigateHome} onSellerClick={navigateToSeller} onProductClick={navigateToProduct}/>;
            case 'search':
                return <SearchResultsPage searchTerm={view.term} onProductClick={navigateToProduct} onBack={navigateHome} />;
            case 'seller':
                 const foundSeller = Object.values(sellers).find(s => s.id === view.id);
                 if (!foundSeller) return <div>商家未找到</div>;
                return <SellerPage seller={foundSeller} onProductClick={navigateToProduct} onBack={navigateHome}/>
            case 'home':
            default:
                return <EcommerceHomePage onProductClick={navigateToProduct} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <EcommerceHeader onSearch={executeSearch} isLoggedIn={isLoggedIn} onLoginClick={() => setShowLogin(true)} />

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />}

            <main className="flex-grow container mx-auto px-4 py-8">
                {renderView()}
            </main>
            
            <Footer />
        </div>
    );
};

export default EcommercePage;