import type { LoanProduct, LoanApplication } from '../types';
import React from 'react';

// FIX: Replaced JSX syntax with React.createElement to be compatible with a .ts file.
// JSX is not supported in .ts files without special compiler options, and this change
// avoids TypeScript parsing errors.
const PlantingIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-green-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 15s4 4 9 4 9-4 9-4V5s-4-4-9-4-9 4-9 4v10z" }), React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 19V5" }));
const BreedingIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-green-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { d: "M16.12,10.16A2.5,2.5,0,1,0,12,12.5a2.47,2.47,0,0,0,4.12-2.34Z" }), React.createElement('path', { d: "M18,12a4.46,4.46,0,0,1-3.18,4.24,4.46,4.46,0,0,1-3.18-4.24A4.5,4.5,0,1,1,18,12Z" }), React.createElement('path', { d: "M14,10.25a2,2,0,1,1-4,0" }), React.createElement('path', { d: "M12,2a10,10,0,1,0,10,10A10,10,0,0,0,12,2ZM7,12a5,5,0,0,1,10,0c0,2.12-1.16,3.69-2.2,4.64s-2,1.57-2.8,2.12c-.8-.55-1.72-1.17-2.8-2.12S7,14.12,7,12Z" }));
const EquipmentIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-green-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" }));
const ProcessingIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-green-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6" }));


export const loanProducts: LoanProduct[] = [
    {
        id: 'planting_loan',
        name: '种植贷',
        description: '用于购买种子、化肥、农药等生产资料，解决春耕秋收资金需求。',
        interestRate: '年化利率 3.85% 起',
        loanTerm: '3-12 个月',
        amountRange: '最高 30 万元',
        // FIX: Replaced JSX with React.createElement to correctly instantiate the component.
        icon: React.createElement(PlantingIcon),
    },
    {
        id: 'breeding_loan',
        name: '养殖贷',
        description: '支持禽畜、水产养殖规模化发展，用于购买饲料、疫苗、扩建场地。',
        interestRate: '年化利率 4.05% 起',
        loanTerm: '6-24 个月',
        amountRange: '最高 50 万元',
        // FIX: Replaced JSX with React.createElement to correctly instantiate the component.
        icon: React.createElement(BreedingIcon),
    },
    {
        id: 'equipment_loan',
        name: '设备贷',
        description: '专项用于购置拖拉机、收割机、无人机等现代化农业机械设备。',
        interestRate: '年化利率 3.95% 起',
        loanTerm: '12-36 个月',
        amountRange: '最高 100 万元',
        // FIX: Replaced JSX with React.createElement to correctly instantiate the component.
        icon: React.createElement(EquipmentIcon),
    },
    {
        id: 'processing_loan',
        name: '加工贷',
        description: '为农产品加工企业提供流动资金，支持产品研发、包装和市场推广。',
        interestRate: '年化利率 4.25% 起',
        loanTerm: '6-18 个月',
        amountRange: '最高 200 万元',
        // FIX: Replaced JSX with React.createElement to correctly instantiate the component.
        icon: React.createElement(ProcessingIcon),
    },
];

export const userLoanApplications: LoanApplication[] = [
    { id: 'LN20231101A', loanType: '种植贷', amount: 50000, date: '2023-11-01', status: 'Active' },
    { id: 'LN20230520B', loanType: '设备贷', amount: 150000, date: '2023-05-20', status: 'Paid Off' },
    { id: 'LN20221015C', loanType: '养殖贷', amount: 80000, date: '2022-10-15', status: 'Paid Off' },
    { id: 'LN20231201D', loanType: '加工贷', amount: 250000, date: '2023-12-01', status: 'Pending' },
];
