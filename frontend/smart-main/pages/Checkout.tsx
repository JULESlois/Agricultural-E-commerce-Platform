import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../components/Common';
import { MOCK_PRODUCTS } from '../constants';
import { MapPin, ChevronRight, CreditCard, ShieldCheck, Wallet } from 'lucide-react';
import { addressesList, createOrder, payOrder } from '../api/market';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressId, setAddressId] = useState<number | null>(null);
  const sourceId = Number(localStorage.getItem('checkout_source_id') || '1');
  const qty = Number(localStorage.getItem('checkout_quantity') || '1');
  
  const items = [
    { ...MOCK_PRODUCTS[0], quantity: qty }
  ];
  
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freight = 0;
  
  useEffect(() => {
      addressesList().then((r: any) => {
        const list = r?.data || [];
        const def = list.find((a: any) => a.is_default) || list[0];
        if (def?.address_id) setAddressId(Number(def.address_id));
      }).catch(() => setAddressId(1));
  }, []);

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
      const receiver_address_id = addressId || 1;
      createOrder({ source_id: sourceId, quantity: qty, receiver_address_id })
        .then((r: any) => {
          const orderId = r?.data?.order_id || r?.data?.orderId || r?.data?.order_id || r?.data?.id;
          return payOrder(orderId, 'WECHAT_PAY').then(() => orderId);
        })
        .then((orderId: any) => {
          setIsSubmitting(false);
          navigate(`/mall/payment/success?oid=${orderId}`);
        })
        .catch(() => {
          setIsSubmitting(false);
        });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold mb-6">确认订单</h1>

      {/* Address Section */}
      <Card className="p-6 cursor-pointer hover:border-green-400 border border-transparent transition-all relative group">
        <div className="flex items-start gap-4">
           <div className="p-3 bg-green-50 text-[#4CAF50] rounded-full">
              <MapPin size={24} />
           </div>
           <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                 <span className="font-bold text-lg text-[#212121]">张三</span>
                 <span className="text-gray-500">138****0000</span>
                 <Badge color="blue">默认</Badge>
              </div>
              <p className="text-gray-600">北京市 朝阳区 建国门外大街1号 国贸大厦A座 1001室</p>
           </div>
           <ChevronRight className="text-gray-400 group-hover:text-[#4CAF50]" />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[repeating-linear-gradient(-45deg,#4CAF50,#4CAF50_10px,#fff_10px,#fff_20px,#1976D2_20px,#1976D2_30px,#fff_30px,#fff_40px)] opacity-50"></div>
      </Card>

      {/* Order Items */}
      <Card className="p-6">
         <h3 className="font-bold mb-4">商品清单</h3>
         <div className="space-y-4">
            {items.map(item => (
               <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
                  <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded bg-white" />
                  <div className="flex-1">
                     <h4 className="font-medium text-[#212121]">{item.title}</h4>
                     <p className="text-xs text-gray-500">{item.farmerName}</p>
                  </div>
                  <div className="text-right">
                     <div className="font-bold">¥{item.price.toFixed(2)}</div>
                     <div className="text-gray-500 text-sm">x{item.quantity}</div>
                  </div>
               </div>
            ))}
         </div>
         <div className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-sm">
             <div className="flex justify-between">
                <span className="text-gray-500">配送方式</span>
                <span>快递免邮</span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500">发票信息</span>
                <span>个人 - 电子发票</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-gray-500">买家留言</span>
                <input type="text" placeholder="建议留言前先与商家沟通" className="text-right text-sm border-none focus:outline-none w-64 bg-transparent placeholder-gray-300" />
             </div>
         </div>
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
         <h3 className="font-bold mb-4">支付方式</h3>
         <div className="flex gap-4">
            <div className="flex-1 border-2 border-[#4CAF50] bg-green-50 p-4 rounded-lg flex items-center gap-3 cursor-pointer relative">
               <Wallet className="text-[#4CAF50]" />
               <span className="font-bold text-[#212121]">在线支付</span>
               <div className="absolute top-0 right-0 bg-[#4CAF50] text-white text-xs px-2 py-0.5 rounded-bl-lg rounded-tr-lg">推荐</div>
            </div>
            <div className="flex-1 border border-gray-200 p-4 rounded-lg flex items-center gap-3 cursor-pointer hover:border-gray-300 text-gray-500">
               <CreditCard />
               <span>对公转账</span>
            </div>
         </div>
      </Card>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-50">
         <div className="max-w-[1000px] mx-auto flex justify-end items-center gap-6">
            <div className="text-right">
               <span className="text-gray-500 text-sm mr-2">共 {items.length} 件,</span>
               <span className="text-gray-900">实付款:</span>
               <span className="text-3xl font-bold text-[#FF9800] ml-2">¥{totalAmount.toFixed(2)}</span>
            </div>
            <Button 
               variant="solid-green" 
               size="lg" 
               className="px-12 text-lg rounded-full"
               onClick={handlePlaceOrder}
               isLoading={isSubmitting}
            >
               提交订单
            </Button>
         </div>
      </div>
      
      {/* Spacer for fixed bottom bar */}
      <div className="h-20"></div>
    </div>
  );
};
