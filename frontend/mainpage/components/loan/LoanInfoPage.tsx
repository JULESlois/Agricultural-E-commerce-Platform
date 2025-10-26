import React, { useState } from 'react';
import type { LoanProduct } from '../../types';
import { loanProducts } from '../../data/loanData';

const LoanProductCard: React.FC<{ product: LoanProduct }> = ({ product }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                {product.icon}
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 mt-1">{product.description}</p>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-700">
            <p><span className="font-semibold">利率：</span>{product.interestRate}</p>
            <p><span className="font-semibold">期限：</span>{product.loanTerm}</p>
            <p><span className="font-semibold">额度：</span>{product.amountRange}</p>
        </div>
    </div>
);

const LoanCalculator: React.FC = () => {
    const [amount, setAmount] = useState(10000);
    const [rate, setRate] = useState(4.5);
    const [term, setTerm] = useState(12);
    const [monthlyPayment, setMonthlyPayment] = useState('');

    const calculatePayment = () => {
        if (amount > 0 && rate > 0 && term > 0) {
            const monthlyRate = (rate / 100) / 12;
            const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
            setMonthlyPayment(payment.toFixed(2));
        } else {
            setMonthlyPayment('');
        }
    };

    React.useEffect(() => {
        calculatePayment();
    }, [amount, rate, term]);

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-center text-green-900 mb-6">贷款计算器</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">贷款金额 (元)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
                </div>
                 <div>
                    <label htmlFor="rate" className="block text-sm font-medium text-gray-700">年化利率 (%)</label>
                    <input type="number" id="rate" step="0.01" value={rate} onChange={e => setRate(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
                </div>
                 <div>
                    <label htmlFor="term" className="block text-sm font-medium text-gray-700">贷款期限 (月)</label>
                    <input type="number" id="term" value={term} onChange={e => setTerm(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
                </div>
            </div>
            <div className="text-center bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600">预计每月还款</p>
                <p className="text-3xl font-bold text-green-700">¥ {monthlyPayment || '0.00'}</p>
                <p className="text-xs text-gray-500 mt-1">结果仅供参考，实际还款以合同为准。</p>
            </div>
        </div>
    );
};

const LoanInfoPage: React.FC<{ onApplyClick: () => void, onDashboardClick: () => void }> = ({ onApplyClick, onDashboardClick }) => {
  return (
    <>
        {/* Hero Section */}
        <div className="relative bg-green-800 text-white text-center py-20 px-4">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://picsum.photos/1920/500?image=1059')"}}></div>
            <div className="relative z-10">
                <h1 className="text-5xl font-extrabold mb-4">惠农贷</h1>
                <p className="text-xl max-w-2xl mx-auto">专为农业生产者打造的普惠金融服务，手续简便、放款迅速，轻松贷款，助力丰收。</p>
                <div className="mt-8 space-x-4">
                     <button onClick={onApplyClick} className="bg-lime-400 text-green-900 font-bold py-3 px-8 rounded-lg hover:bg-lime-300 transition-transform transform hover:scale-105">
                        立即申请贷款
                    </button>
                    <button onClick={onDashboardClick} className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-green-900 transition">
                        我的贷款
                    </button>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 py-16 space-y-16">
            {/* Loan Products Section */}
            <section>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">贷款产品</h2>
                <p className="text-center text-gray-600 mb-10">总有一款适合您</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loanProducts.map(p => <LoanProductCard key={p.id} product={p} />)}
                </div>
            </section>
            
            {/* Loan Calculator */}
            <section>
                <LoanCalculator />
            </section>

            {/* How It Works Section */}
            <section>
                 <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">申请流程</h2>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">1</div>
                        <h3 className="font-bold text-lg mt-4 mb-2">在线申请</h3>
                        <p className="text-gray-600">填写基本信息，提交贷款申请。</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">2</div>
                        <h3 className="font-bold text-lg mt-4 mb-2">信用评估</h3>
                        <p className="text-gray-600">平台基于大数据进行快速审核。</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">3</div>
                        <h3 className="font-bold text-lg mt-4 mb-2">签约放款</h3>
                        <p className="text-gray-600">审核通过后，线上签约，资金直达账户。</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">4</div>
                        <h3 className="font-bold text-lg mt-4 mb-2">按期还款</h3>
                        <p className="text-gray-600">线上管理还款计划，方便快捷。</p>
                    </div>
                 </div>
            </section>
        </div>
    </>
  );
};

export default LoanInfoPage;