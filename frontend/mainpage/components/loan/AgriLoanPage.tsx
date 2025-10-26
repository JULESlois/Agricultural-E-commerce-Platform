import React, { useState } from 'react';
import SimplifiedHeader from '../shared/SimplifiedHeader';
import Footer from '../Footer';
import LoanInfoPage from './LoanInfoPage';
import LoanApplicationForm from './LoanApplicationForm';
import MyLoansDashboard from './MyLoansDashboard';

type LoanView = 'info' | 'apply' | 'dashboard';

const AgriLoanPage: React.FC<{ navigate: (page: string) => void }> = ({ navigate }) => {
    const [view, setView] = useState<LoanView>('info');

    const renderView = () => {
        switch (view) {
            case 'apply':
                return <LoanApplicationForm onBack={() => setView('info')} onSubmitSuccess={() => setView('dashboard')} />;
            case 'dashboard':
                return <MyLoansDashboard onApplyNew={() => setView('apply')} />;
            case 'info':
            default:
                return <LoanInfoPage onApplyClick={() => setView('apply')} onDashboardClick={() => setView('dashboard')} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <SimplifiedHeader navigate={navigate} pageTitle="惠农贷 - 信用平台" />
            <main>
                {renderView()}
            </main>
            <Footer />
        </div>
    );
};

export default AgriLoanPage;