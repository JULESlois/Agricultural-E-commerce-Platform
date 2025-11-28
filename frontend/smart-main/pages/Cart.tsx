import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/Common';
import { MOCK_PRODUCTS } from '../constants';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
import { cartList, cartUpdate, cartDelete } from '../api/market';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
      cartList().then((r: any) => {
        const list = r?.data || [];
        const mapped = Array.isArray(list) && list.length > 0 ? list.map((it: any) => ({
          id: String(it.source_id),
          title: it.product_name,
          price: Number(it.unit_price || 0),
          origin: '产地',
          imageUrl: it.product_image || 'https://picsum.photos/100',
          quantity: Number(it.quantity || 1),
          selected: true,
          cart_id: it.cart_id
        })) : [ { ...MOCK_PRODUCTS[0], quantity: 2, selected: true }, { ...MOCK_PRODUCTS[2], quantity: 1, selected: true } ];
        setItems(mapped);
      }).catch(() => {
        setItems([ { ...MOCK_PRODUCTS[0], quantity: 2, selected: true }, { ...MOCK_PRODUCTS[2], quantity: 1, selected: true } ]);
      });
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const target = items.find(i => i.id === id);
    const newQty = Math.max(1, (target?.quantity || 1) + delta);
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    if (target?.cart_id) cartUpdate(Number(target.cart_id), newQty).catch(() => {});
  };

  const removeItem = (id: string) => {
    const target = items.find(i => i.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    if (target?.cart_id) cartDelete(Number(target.cart_id)).catch(() => {});
  };

  const toggleSelect = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const toggleAll = () => {
    const allSelected = items.every(i => i.selected);
    setItems(prev => prev.map(item => ({ ...item, selected: !allSelected })));
  };

  const totalAmount = items
    .filter(i => i.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const selectedCount = items.filter(i => i.selected).length;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6 animate-fade-in">
         <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <ShoppingCart size={48} />
         </div>
         <h2 className="text-xl font-bold text-gray-700">购物车空空如也</h2>
         <Link to="/mall">
            <Button variant="solid-green">去逛逛</Button>
         </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to="/mall" className="text-sm text-gray-500 hover:text-[#4CAF50] flex items-center gap-1">
           <ArrowLeft size={16} /> 继续购物
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">购物车 ({items.length})</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
           {/* Header */}
           <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center text-sm text-gray-500">
              <div className="w-10 text-center">
                <input type="checkbox" checked={items.every(i => i.selected)} onChange={toggleAll} className="h-4 w-4 rounded text-[#4CAF50] focus:ring-[#4CAF50]" />
              </div>
              <div className="flex-grow">全选</div>
              <div className="w-24 text-center hidden sm:block">单价</div>
              <div className="w-32 text-center hidden sm:block">数量</div>
              <div className="w-24 text-center hidden sm:block">小计</div>
              <div className="w-16 text-center">操作</div>
           </div>

           {/* Items */}
           {items.map(item => (
             <Card key={item.id} className="p-4 flex items-center gap-4 border border-gray-100">
                <div className="w-10 text-center">
                   <input 
                      type="checkbox" 
                      checked={item.selected} 
                      onChange={() => toggleSelect(item.id)} 
                      className="h-4 w-4 rounded text-[#4CAF50] focus:ring-[#4CAF50]" 
                   />
                </div>
                <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                   <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                   <h3 className="font-medium text-[#212121] line-clamp-2 mb-1">{item.title}</h3>
                   <p className="text-xs text-gray-500">{item.origin}</p>
                   <div className="sm:hidden mt-2 text-[#FF9800] font-bold">¥{item.price}</div>
                </div>
                <div className="w-24 text-center hidden sm:block font-bold text-[#212121]">
                   ¥{item.price}
                </div>
                <div className="w-32 flex justify-center">
                   <div className="flex items-center border border-gray-200 rounded">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-50 text-gray-500"><Minus size={14}/></button>
                      <div className="w-10 text-center text-sm">{item.quantity}</div>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-50 text-gray-500"><Plus size={14}/></button>
                   </div>
                </div>
                <div className="w-24 text-center hidden sm:block font-bold text-[#FF9800]">
                   ¥{(item.price * item.quantity).toFixed(2)}
                </div>
                <div className="w-16 text-center">
                   <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                   </button>
                </div>
             </Card>
           ))}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80">
           <Card className="p-6 sticky top-24 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg mb-4">订单结算</h3>
              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-gray-100">
                 <div className="flex justify-between">
                    <span className="text-gray-500">商品总价</span>
                    <span className="font-medium">¥{totalAmount.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500">运费</span>
                    <span className="font-medium">¥0.00</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500">优惠</span>
                    <span className="font-medium text-[#FF9800]">-¥0.00</span>
                 </div>
              </div>
              
              <div className="flex justify-between items-end mb-6">
                 <span className="text-gray-700 font-medium">合计:</span>
                 <span className="text-2xl font-bold text-[#FF9800]">¥{totalAmount.toFixed(2)}</span>
              </div>

              <Button 
                variant="solid-green" 
                className="w-full py-3 text-lg"
                disabled={selectedCount === 0}
                onClick={() => {
                  const first = items.find(i => i.selected);
                  if (first) {
                    localStorage.setItem('checkout_source_id', String(first.id));
                    localStorage.setItem('checkout_quantity', String(first.quantity));
                  }
                  navigate('/mall/checkout');
                }}
              >
                去结算 ({selectedCount})
              </Button>
              
              <p className="text-xs text-gray-400 text-center mt-4">
                 平台保障 · 售后无忧 · 极速退款
              </p>
           </Card>
        </div>
      </div>
    </div>
  );
};
