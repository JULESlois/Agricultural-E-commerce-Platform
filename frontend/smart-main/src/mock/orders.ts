import { OrderDetail, Address } from '../../types';
import { MOCK_ADDRESSES, MOCK_ORDER_DETAIL, MOCK_PRODUCTS } from '../../constants';

const addr: Address = MOCK_ADDRESSES[0];

function makeOrder(id: string, status: OrderDetail['status'], pid: string, price: number): OrderDetail {
  return {
    id,
    status,
    createTime: '2025-09-20 10:00:00',
    payTime: status !== 'pending_pay' ? '2025-09-20 10:05:00' : undefined,
    shipTime: status === 'shipped' || status === 'completed' ? '2025-09-20 14:00:00' : undefined,
    finishTime: status === 'completed' ? '2025-09-22 12:00:00' : undefined,
    shopName: '绿源果蔬合作社',
    items: [
      {
        id: `oi-${id}`,
        productId: pid,
        name: MOCK_PRODUCTS.find(p => p.id === pid)?.title || '商品',
        imageUrl: MOCK_PRODUCTS.find(p => p.id === pid)?.imageUrl || '',
        price,
        quantity: 1,
      },
    ],
    totalAmount: price,
    freight: 0,
    discount: 0,
    actualAmount: price,
    address: addr,
    logisticsId: 'SF1234567890',
  };
}

const statuses: OrderDetail['status'][] = ['pending_pay', 'pending_ship', 'shipped', 'completed'];

export const buyerOrders: OrderDetail[] = Array.from({ length: 40 }).map((_, i) => {
  const pid = MOCK_PRODUCTS[i % MOCK_PRODUCTS.length].id;
  const price = MOCK_PRODUCTS[i % MOCK_PRODUCTS.length].price;
  const st = statuses[i % statuses.length];
  return makeOrder(`20250920${String(i).padStart(3, '0')}`, st, pid, price);
});

export const sampleOrder: OrderDetail = MOCK_ORDER_DETAIL;
