import React, { useState } from 'react';
import { loanProducts } from '../../data/loanData';

const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

const LoanApplicationForm: React.FC<{ onBack: () => void, onSubmitSuccess: () => void }> = ({ onBack, onSubmitSuccess }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        personal_name: '张三',
        personal_id: '11010119900307001X',
        farm_name: '希望田野农场',
        farm_area: '50',
        loan_type: 'planting_loan',
        loan_amount: '50000',
        loan_term: '12',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting loan application:', formData);
        alert('申请提交成功！我们将尽快审核。');
        onSubmitSuccess();
    };

    const renderStepContent = () => {
        switch (step) {
            case 1: // Loan Details
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="loan_type" className="block text-sm font-medium text-gray-700">贷款类型</label>
                            <select id="loan_type" name="loan_type" value={formData.loan_type} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                                {loanProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="loan_amount" className="block text-sm font-medium text-gray-700">期望金额 (元)</label>
                            <input type="number" name="loan_amount" id="loan_amount" value={formData.loan_amount} onChange={handleInputChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>
                         <div>
                            <label htmlFor="loan_term" className="block text-sm font-medium text-gray-700">期望期限 (月)</label>
                            <input type="number" name="loan_term" id="loan_term" value={formData.loan_term} onChange={handleInputChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>
                    </div>
                );
            case 2: // Farm Info
                return (
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="farm_name" className="block text-sm font-medium text-gray-700">农场/企业名称</label>
                            <input type="text" name="farm_name" id="farm_name" value={formData.farm_name} onChange={handleInputChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="farm_area" className="block text-sm font-medium text-gray-700">经营规模 (亩)</label>
                            <input type="number" name="farm_area" id="farm_area" value={formData.farm_area} onChange={handleInputChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>
                        {/* More fields can be added here */}
                    </div>
                );
            case 3: // Document Upload
                return (
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">上传证明材料</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadIcon/>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                        <span>上传文件</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                                    </label>
                                    <p className="pl-1">或拖拽到此处</p>
                                </div>
                                <p className="text-xs text-gray-500">支持 JPG, PNG, PDF, 单个文件不超过 10MB</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">* 请上传身份证正反面、土地承包合同等</p>
                    </div>
                );
             case 4: // Review
                return (
                    <div className="space-y-3">
                         <h3 className="text-lg font-medium leading-6 text-gray-900">请确认您的申请信息</h3>
                         <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-3 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4"><dt className="text-sm font-medium text-gray-500">姓名</dt><dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.personal_name}</dd></div>
                                <div className="py-3 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4"><dt className="text-sm font-medium text-gray-500">贷款类型</dt><dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{loanProducts.find(p=>p.id === formData.loan_type)?.name}</dd></div>
                                <div className="py-3 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4"><dt className="text-sm font-medium text-gray-500">贷款金额</dt><dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">¥ {Number(formData.loan_amount).toLocaleString()}</dd></div>
                                <div className="py-3 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4"><dt className="text-sm font-medium text-gray-500">贷款期限</dt><dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.loan_term} 个月</dd></div>
                            </dl>
                         </div>
                    </div>
                );
        }
    };
    
    const stepTitles = ["贷款信息", "经营信息", "材料上传", "信息总览"];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">贷款申请</h2>
                <p className="text-center text-gray-500 mb-8">当前步骤: {stepTitles[step-1]}</p>

                {/* Progress Bar */}
                 <div className="mb-8">
                    <div className="flex items-center">
                        {[1, 2, 3, 4].map(i => (
                           <React.Fragment key={i}>
                             <div className={`flex items-center ${i <= step ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${i <= step ? 'bg-green-600 text-white border-green-600' : 'border-gray-400'}`}>
                                    {i}
                                </div>
                            </div>
                            {i < 4 && <div className={`flex-auto border-t-2 transition-colors duration-500 ${i < step ? 'border-green-600' : 'border-gray-300'}`}></div>}
                           </React.Fragment>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="min-h-[250px]">
                        {renderStepContent()}
                    </div>
                    <div className="mt-8 flex justify-between items-center">
                        <button type="button" onClick={step === 1 ? onBack : prevStep} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition">
                           {step === 1 ? '返回' : '上一步'}
                        </button>
                        {step < 4 ? (
                            <button type="button" onClick={nextStep} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition">
                                下一步
                            </button>
                        ) : (
                             <button type="submit" className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition">
                                确认提交
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoanApplicationForm;