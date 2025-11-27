import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components/Common';
import { CheckCircle2, Package, Home } from 'lucide-react';

export const PaymentResult: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
       <div className="text-center max-w-md w-full p-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#4CAF50]">
             <CheckCircle2 size={48} />
          </div>
          <h1 className="text-2xl font-bold text-[#212121] mb-2">支付成功</h1>
          <p className="text-gray-500 mb-8">我们将尽快为您发货，感谢您对助农事业的支持！</p>
          
          <Card className="bg-gray-50 mb-8 p-4 text-left">
             <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">订单编号</span>
                <span className="font-medium">202509250001</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-gray-500">支付金额</span>
                <span className="font-bold text-[#FF9800]">¥213.00</span>
             </div>
          </Card>

          <div className="flex gap-4 justify-center">
             <Link to="/mall/buyer/orders">
               <Button variant="ghost" icon={<Package size={16} />}>查看订单</Button>
             </Link>
             <Link to="/mall">
               <Button variant="solid-green" icon={<Home size={16} />}>继续购物</Button>
             </Link>
          </div>
       </div>
    </div>
  );
};