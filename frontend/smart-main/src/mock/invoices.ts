import { Invoice } from '../../types';
import { MOCK_INVOICES } from '../../constants';

export const invoices: Invoice[] = [
  ...MOCK_INVOICES,
  { id: 'INV-20250903', orderId: '20250925003', amount: 268.0, title: '某餐饮有限公司', type: 'ELECTRONIC', status: 'ISSUED', date: '2025-09-27' },
];
