
import React, { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PortalLayout, DashboardLayout, TradeLayout } from './components/Layouts';
import { ErrorBoundary } from './components/ErrorBoundary';

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-[#757575] text-sm">加载中...</p>
    </div>
  </div>
);

// Lazy load all pages
const Home = lazy(() => import('./pages/Home'));
const MallHome = lazy(() => import('./pages/Mall').then(m => ({ default: m.MallHome })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Cart = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const PaymentResult = lazy(() => import('./pages/PaymentResult').then(m => ({ default: m.PaymentResult })));
const ShopProfile = lazy(() => import('./pages/ShopProfile').then(m => ({ default: m.ShopProfile })));
const MallActivity = lazy(() => import('./pages/MallMarketing').then(m => ({ default: m.MallActivity })));
const CouponCenter = lazy(() => import('./pages/MallMarketing').then(m => ({ default: m.CouponCenter })));
const Procurement = lazy(() => import('./pages/Procurement').then(m => ({ default: m.Procurement })));
const ProcurementPost = lazy(() => import('./pages/ProcurementPost').then(m => ({ default: m.ProcurementPost })));
const SmartMatchDashboard = lazy(() => import('./pages/SmartMatchDashboard').then(m => ({ default: m.SmartMatchDashboard })));
const ProductCompare = lazy(() => import('./pages/MallTools').then(m => ({ default: m.ProductCompare })));
const InvoiceList = lazy(() => import('./pages/OrderServices').then(m => ({ default: m.InvoiceList })));
const LogisticsDetail = lazy(() => import('./pages/OrderServices').then(m => ({ default: m.LogisticsDetail })));
const FinanceHome = lazy(() => import('./pages/Finance').then(m => ({ default: m.FinanceHome })));
const LoanApplyWizard = lazy(() => import('./pages/Finance').then(m => ({ default: m.LoanApplyWizard })));
const FarmerFinance = lazy(() => import('./pages/FinanceFarmer').then(m => ({ default: m.FarmerFinance })));
const BankerDashboard = lazy(() => import('./pages/FinanceBanker').then(m => ({ default: m.BankerDashboard })));
const BankerApprovalList = lazy(() => import('./pages/FinanceBanker').then(m => ({ default: m.BankerApprovalList })));
const BankerApprovalDetail = lazy(() => import('./pages/FinanceBanker').then(m => ({ default: m.BankerApprovalDetail })));
const SellerDashboardHome = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.SellerDashboardHome })));
const SellerProduct = lazy(() => import('./pages/SellerProduct').then(m => ({ default: m.SellerProduct })));
const SellerProductForm = lazy(() => import('./pages/SellerProductForm').then(m => ({ default: m.SellerProductForm })));
const SellerOrderList = lazy(() => import('./pages/SellerOrders').then(m => ({ default: m.SellerOrderList })));
const SellerOrderDetail = lazy(() => import('./pages/SellerOrders').then(m => ({ default: m.SellerOrderDetail })));
const SellerReviews = lazy(() => import('./pages/SellerReviews').then(m => ({ default: m.SellerReviews })));
const SellerSettings = lazy(() => import('./pages/SellerSettings').then(m => ({ default: m.SellerSettings })));
const BuyerDashboard = lazy(() => import('./pages/BuyerDashboard').then(m => ({ default: m.BuyerDashboard })));
const BuyerOrders = lazy(() => import('./pages/BuyerOrders').then(m => ({ default: m.BuyerOrders })));
const BuyerOrderDetail = lazy(() => import('./pages/BuyerOrderDetail').then(m => ({ default: m.BuyerOrderDetail })));
const BuyerAddress = lazy(() => import('./pages/BuyerAddress').then(m => ({ default: m.BuyerAddress })));
const PaymentManagement = lazy(() => import('./pages/PaymentManagement').then(m => ({ default: m.PaymentManagement })));
const BuyerReviewPublish = lazy(() => import('./pages/BuyerReviewPublish').then(m => ({ default: m.BuyerReviewPublish })));
const BuyerReviews = lazy(() => import('./pages/BuyerReviews').then(m => ({ default: m.BuyerReviews })));
const BuyerRefund = lazy(() => import('./pages/BuyerRefund').then(m => ({ default: m.BuyerRefund })));
const AccountSettings = lazy(() => import('./pages/AccountSettings').then(m => ({ default: m.AccountSettings })));
const KnowledgeHome = lazy(() => import('./pages/Knowledge').then(m => ({ default: m.KnowledgeHome })));
const ExpertProfile = lazy(() => import('./pages/ExpertPublic').then(m => ({ default: m.ExpertProfile })));
const AskQuestion = lazy(() => import('./pages/ExpertPublic').then(m => ({ default: m.AskQuestion })));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail').then(m => ({ default: m.ArticleDetail })));
const ExpertDashboard = lazy(() => import('./pages/ExpertWorkspace').then(m => ({ default: m.ExpertDashboard })));
const ExpertConsultationList = lazy(() => import('./pages/ExpertWorkspace').then(m => ({ default: m.ExpertConsultationList })));
const ExpertArticleManager = lazy(() => import('./pages/ExpertWorkspace').then(m => ({ default: m.ExpertArticleManager })));
const Login = lazy(() => import('./pages/Auth').then(m => ({ default: m.Login })));
const CommunityHome = lazy(() => import('./pages/Community').then(m => ({ default: m.CommunityHome })));
const HelpCenter = lazy(() => import('./pages/HelpCenter').then(m => ({ default: m.HelpCenter })));
const Feedback = lazy(() => import('./pages/Feedback').then(m => ({ default: m.Feedback })));
const MessageCenter = lazy(() => import('./pages/MessageCenter').then(m => ({ default: m.MessageCenter })));
const AppDownload = lazy(() => import('./pages/AppDownload').then(m => ({ default: m.AppDownload })));

// Logic: Automatically scroll to top when switching pages,
// EXCEPT when navigating FROM Search Page (/mall), Help Center (/help), or Knowledge Base (/knowledge).
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    
    // If path hasn't changed, do nothing
    if (prevPath === pathname) return;

    // Define the "From" pages that should PREVENT scrolling to top
    // 1. Search/List Pages (/mall acts as the search/list hub)
    const isFromSearch = prevPath === '/mall' || prevPath === '/mall/list' || prevPath === '/mall/procurement';
    // 2. Help Center
    const isFromHelp = prevPath.startsWith('/help');
    // 3. Knowledge Base
    const isFromKnowledge = prevPath.startsWith('/knowledge');

    const shouldPreventScroll = isFromSearch || isFromHelp || isFromKnowledge;

    if (!shouldPreventScroll) {
      window.scrollTo(0, 0);
    }

    prevPathRef.current = pathname;
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* Auth */}
        <Route path="/auth/login" element={<Login />} />
        
        {/* App Download (Standalone) */}
        <Route path="/app-download" element={<AppDownload />} />

        {/* Portal Routes (Public) */}
        <Route element={<PortalLayout />}>
          <Route path="/" element={<Home />} />
          
          {/* Mall Public */}
          <Route path="/mall" element={<MallHome />} />
          <Route path="/mall/list" element={<MallHome />} />
          <Route path="/mall/item/:id" element={<ProductDetail />} />
          <Route path="/mall/shop/:id" element={<ShopProfile />} /> {/* M-04 */}
          <Route path="/mall/activity" element={<MallActivity />} /> {/* M-05 */}
          <Route path="/mall/coupons" element={<CouponCenter />} /> {/* M-07 */}
          <Route path="/mall/procurement" element={<Procurement />} /> {/* M-08 / MATCH-01 */}
          <Route path="/mall/compare" element={<ProductCompare />} /> {/* M-06 */}
          
          {/* Finance Public */}
          <Route path="/finance" element={<FinanceHome />} />
          <Route path="/finance/apply/:id" element={<LoanApplyWizard />} />
          
          {/* Knowledge Public */}
          <Route path="/knowledge" element={<KnowledgeHome />} />
          <Route path="/knowledge/expert/:id" element={<ExpertProfile />} /> {/* K-04 */}
          <Route path="/knowledge/ask" element={<AskQuestion />} /> {/* K-05 */}
          <Route path="/knowledge/article/:id" element={<ArticleDetail />} /> {/* K-02 */}
          
          {/* Community Public */}
          <Route path="/community" element={<CommunityHome />} /> {/* COM-01 */}
          
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/help/feedback" element={<Feedback />} />
          <Route path="/messages" element={<MessageCenter />} />
        </Route>

        {/* Dashboard Routes (Private/Role Based) */}
        <Route path="/mall/seller" element={<DashboardLayout />}>
           <Route path="dashboard" element={<SellerDashboardHome />} />
           <Route path="match" element={<SmartMatchDashboard />} /> {/* MATCH-03 */}
           <Route path="product" element={<SellerProduct />} />
           <Route path="product/new" element={<SellerProductForm />} />
           <Route path="product/edit/:id" element={<SellerProductForm />} />
           <Route path="orders" element={<SellerOrderList />} />
           <Route path="order/:id" element={<SellerOrderDetail />} />
           <Route path="reviews" element={<SellerReviews />} />
           <Route path="settings" element={<SellerSettings />} />
           
           {/* Legacy/Redirects */}
           <Route path="order" element={<Navigate to="/mall/seller/orders" replace />} />
           <Route index element={<Navigate to="/mall/seller/dashboard" replace />} />
        </Route>

        <Route path="/mall/buyer" element={<DashboardLayout />}>
           <Route path="dashboard" element={<BuyerDashboard />} />
           <Route path="procurement/post" element={<ProcurementPost />} /> {/* MATCH-02 */}
           <Route path="match" element={<SmartMatchDashboard />} /> {/* MATCH-04 */}
           <Route path="orders" element={<BuyerOrders />} />
           <Route path="order/:id" element={<BuyerOrderDetail />} /> {/* UC-03 */}
           <Route path="address" element={<BuyerAddress />} /> {/* UC-06 */}
           <Route path="payment" element={<PaymentManagement />} />
           <Route path="review/publish/:orderId" element={<BuyerReviewPublish />} /> {/* UC-04 */}
           <Route path="reviews" element={<BuyerReviews />} /> {/* UC-08 */}
           <Route path="refund/:orderId" element={<BuyerRefund />} /> {/* UC-05 */}
           <Route path="invoices" element={<InvoiceList />} /> {/* B-05 */}
           <Route path="logistics/:id" element={<LogisticsDetail />} /> {/* B-07 */}
           <Route path="settings" element={<AccountSettings />} />
           {/* Changed default index from dashboard to orders */}
           <Route index element={<Navigate to="/mall/buyer/orders" replace />} />
        </Route>

        <Route path="/finance" element={<DashboardLayout />}>
           <Route path="farmer" element={<FarmerFinance />} />
           
           {/* Banker Routes */}
           <Route path="banker/dashboard" element={<BankerDashboard />} />
           <Route path="banker/approvals" element={<BankerApprovalList />} />
           <Route path="banker/approval/:id" element={<BankerApprovalDetail />} />
           <Route path="banker/monitoring" element={<Navigate to="/finance/banker/dashboard" replace />} />
           
           <Route path="customers" element={<Navigate to="/" replace />} />
        </Route>
        
        {/* Expert Dashboard Routes */}
        <Route path="/expert" element={<DashboardLayout />}>
           <Route path="dashboard" element={<ExpertDashboard />} /> {/* E-01 */}
           <Route path="consultations" element={<ExpertConsultationList />} /> {/* E-02 */}
           <Route path="articles" element={<ExpertArticleManager />} /> {/* E-03 */}
           <Route path="settings" element={<AccountSettings />} />
           <Route index element={<Navigate to="/expert/dashboard" replace />} />
        </Route>

        {/* Trade Routes (Minimal Layout) */}
        <Route path="/mall" element={<TradeLayout />}>
           <Route path="cart" element={<Cart />} />
           <Route path="checkout" element={<Checkout />} />
           <Route path="payment/success" element={<PaymentResult />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
