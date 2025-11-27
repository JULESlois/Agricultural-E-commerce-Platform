import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, SectionTitle } from '../components/Common';
import { MOCK_ORDER_DETAIL } from '../constants';
import { ArrowLeft, MapPin, Truck, Package, MessageSquare, CreditCard, Clock, Receipt, RefreshCcw, Store } from 'lucide-react';

export const BuyerOrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = MOCK_ORDER_DETAIL; // Mock data

  const steps = [
    { label: '提交订单', time: order.createTime, active: true },
    { label: '付款成功', time: order.payTime, active: !!order.payTime },
    { label: '商家发货', time: order.shipTime, active: !!order.shipTime },
    { label: '确认收货', time: order.finishTime, active: !!order.finishTime },
    { label: '评价', time: '', active: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
       <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/mall/buyer/orders')}>
             <ArrowLeft size={16} className="mr-1" /> 返回订单列表
          </Button>
          <span className="text-gray-300">|</span>
          <h1 className="text-xl font-bold text-[#212121]">订单详情 <span className="text-base font-normal text-gray-500">#{order.id}</span></h1>
       </div>

       {/* Status Stepper */}
       <Card className="p-8">
          <div className="flex justify-between items-start relative">
             <div className="absolute left-0 top-[14px] w-full h-[2px] bg-gray-100 -z-10"></div>
             {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 border-4 border-white ${
                      step.active ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-500'
                   }`}>
                      {idx + 1}
                   </div>
                   <span className={`text-sm font-medium ${step.active ? 'text-[#212121]' : 'text-gray-400'}`}>{step.label}</span>
                   {step.time && <span className="text-xs text-gray-400 mt-1">{step.time}</span>}
                </div>
             ))}
          </div>
          <div className="mt-8 flex justify-center gap-4 border-t border-gray-100 pt-6">
             {order.status === 'pending_ship' && <Button variant="ghost">提醒发货</Button>}
             {order.status === 'shipped' && <Button variant="solid-green">确认收货</Button>}
             <Button variant="ghost" onClick={() => navigate(`/mall/buyer/refund/${order.id}`)}>申请售后</Button>
          </div>
       </Card>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-6">
             {/* Logistics */}
             <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold flex items-center gap-2"><Truck size={20} className="text-[#1976D2]"/> 物流信息</h3>
                   <Button variant="text" size="sm" className="text-blue-600" onClick={() => navigate(`/mall/buyer/logistics/${order.id}`)}>查看详情</Button>
                </div>
                <div className="pl-7 text-sm text-gray-600">
                   <p className="mb-1 text-[#4CAF50]">运输中 - 您的快件已到达【北京集散中心】</p>
                   <p className="text-gray-400 text-xs">2025-09-25 14:30:22</p>
                </div>
             </Card>

             {/* Address */}
             <Card className="p-6">
                <h3 className="font-bold flex items-center gap-2 mb-4"><MapPin size={20} className="text-orange-500"/> 收货信息</h3>
                <div className="pl-7 text-sm text-gray-600 space-y-2">
                   <div className="flex gap-4">
                      <span className="font-bold text-gray-800">{order.address.name}</span>
                      <span>{order.address.phone}</span>
                   </div>
                   <p>{order.address.province} {order.address.city} {order.address.district} {order.address.detail}</p>
                </div>
             </Card>

             {/* Products */}
             <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold flex items-center gap-2"><Package size={20} className="text-purple-500"/> 商品清单</h3>
                   <div className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-[#4CAF50]">
                      <Store size={14} /> {order.shopName}
                   </div>
                </div>
                <div className="space-y-4">
                   {order.items.map(item => (
                      <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg">
                         <img src={item.imageUrl} className="w-16 h-16 object-cover rounded border border-gray-200" alt={item.name} />
                         <div className="flex-1">
                            <h4 className="font-bold text-sm text-[#212121] mb-1">{item.name}</h4>
                            <div className="flex gap-2">
                               {order.status === 'completed' && <Button variant="text" size="sm" className="h-auto p-0 text-blue-600 text-xs" onClick={() => navigate(`/mall/buyer/review/publish/${order.id}`)}>去评价</Button>}
                               <Button variant="text" size="sm" className="h-auto p-0 text-gray-500 text-xs">申请退款</Button>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="font-bold">¥{item.price.toFixed(2)}</div>
                            <div className="text-gray-500 text-xs">x{item.quantity}</div>
                         </div>
                      </div>
                   ))}
                </div>
             </Card>
          </div>

          {/* Right: Payment Info */}
          <div className="space-y-6">
             <Card className="p-6">
                <h3 className="font-bold flex items-center gap-2 mb-4"><Receipt size={20} className="text-gray-700"/> 费用明细</h3>
                <div className="space-y-3 text-sm pb-4 border-b border-gray-100">
                   <div className="flex justify-between">
                      <span className="text-gray-500">商品总额</span>
                      <span>¥{order.totalAmount.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-gray-500">运费</span>
                      <span>¥{order.freight.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-gray-500">优惠</span>
                      <span className="text-red-500">-¥{order.discount.toFixed(2)}</span>
                   </div>
                </div>
                <div className="pt-4 flex justify-between items-end">
                   <span className="font-bold text-gray-700">实付款</span>
                   <span className="text-2xl font-bold text-[#FF9800]">¥{order.actualAmount.toFixed(2)}</span>
                </div>
             </Card>

             <Card className="p-6">
                 <h3 className="font-bold text-sm text-gray-700 mb-3">订单信息</h3>
                 <div className="text-xs text-gray-500 space-y-2">
                    <p>订单编号: {order.id}</p>
                    <p>创建时间: {order.createTime}</p>
                    {order.payTime && <p>付款时间: {order.payTime}</p>}
                    {order.shipTime && <p>发货时间: {order.shipTime}</p>}
                 </div>
             </Card>
          </div>
       </div>
    </div>
  );
};