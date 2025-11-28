import { Product, Shop } from '../../types';
import { MOCK_PRODUCTS, MOCK_SHOP } from '../../constants';

const base: Product[] = MOCK_PRODUCTS;

function makeVariant(id: string, p: Product, priceDelta: number, stockDelta: number): Product {
  return {
    ...p,
    id,
    price: parseFloat((p.price + priceDelta).toFixed(2)),
    stock: Math.max(0, p.stock + stockDelta),
    title: `${p.title} ${priceDelta > 0 ? '优选' : priceDelta < 0 ? '促销' : '标准'}`,
    imageUrl: p.imageUrl,
  };
}

export const products: Product[] = [
  ...base,
  ...base.map((p, i) => makeVariant(`pv-${i + 1}`, p, 3, -50)),
  ...base.map((p, i) => makeVariant(`pv-${i + 1 + base.length}`, p, -5, 200)),
];

export const shop: Shop = MOCK_SHOP;
