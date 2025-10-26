import React from 'react';
import { userLoanApplications } from '../../data/loanData';
import type { LoanApplication } from '../../types';

const StatusBadge: React.FC<{ status: LoanApplication['status'] }> = ({ status }) => {
    const statusStyles = {
        Active: 'bg-blue-100 text-blue-800',
        'Paid Off': 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>;
}

const MyLoansDashboard: React.FC<{ onApplyNew: () => void }> = ({ onApplyNew }) => {
  const activeLoan = userLoanApplications.find(app => app.status === 'Active');

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">我的贷款</h1>
             <button onClick={onApplyNew} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition">
                申请新贷款
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Credit Score */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">我的信用分</h3>
                <p className="text-5xl font-bold text-green-600">720</p>
                <p className="text-sm text-gray-500 mt-2">评估时间：2023-12-01</p>
            </div>

            {/* Current Loan Summary */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                 <h3 className="text-lg font-semibold text-gray-800 mb-4">当前贷款总览</h3>
                 {activeLoan ? (
                    <div className="space-y-3">
                        <div className="flex justify-between items-baseline">
                            <span className="text-gray-600">待还总额</span>
                            <span className="font-bold text-2xl text-gray-800">¥ 35,416.67</span>
                        </div>
                         <div className="flex justify-between items-baseline">
                            <span className="text-gray-600">下个还款日</span>
                            <span className="font-semibold text-gray-800">2023-12-15</span>
                        </div>
                         <div className="flex justify-between items-baseline">
                            <span className="text-gray-600">应还金额</span>
                            <span className="font-semibold text-gray-800">¥ 4,166.67</span>
                        </div>
                        <button className="w-full mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition">立即还款</button>
                    </div>
                 ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600">您当前没有生效中的贷款。</p>
                    </div>
                 )}
            </div>
        </div>

        {/* Application History */}
        <div className="bg-white p-6 rounded-lg shadow-md">
             <h3 className="text-xl font-bold text-gray-800 mb-4">申请历史</h3>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申请编号</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">贷款类型</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额 (元)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申请日期</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">操作</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {userLoanApplications.map(app => (
                            <tr key={app.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.loanType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={app.status} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-green-600 hover:text-green-900">详情</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    </div>
  );
};

export default MyLoansDashboard;