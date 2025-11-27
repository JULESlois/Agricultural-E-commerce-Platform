import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../components/Common';
import { Search, Printer, Truck, ArrowLeft, MapPin, User, Phone, Package, CreditCard, X, FileText, Filter } from 'lucide-react';

// --- Types & Mock Data ---
interface Order {
  id: string;
  status: 'pending_pay' | 'pending_ship' | 'shipped' | 'completed';
  createTime: string;
  buyerName: string;
  phone: string;
  address: string;
  total: number;
  items: Array<{ name: string; qty: number; price: number; image: string }>;
  logistics?: { company: string; trackingNo: string };
}

const INITIAL_ORDERS: Order[] = [
  { 
    id: '202509250001', 
    status: 'pending_ship', 
    createTime: '2025-09-25 10:30', 
    buyerName: '张三', 
    phone: '138****0000',
    address: '北京市朝阳区建国门外大街1号',
    total: 85.00, 
    items: [{ name: '有机红富士苹果 (特级)', qty: 1, price: 85.00, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }] 
  },
  { 
    id: '202509250002', 
    status: 'shipped', 
    createTime: '2025-09-24 15:20', 
    buyerName: '李四', 
    phone: '139****1234',
    address: '上海市浦东新区陆家嘴环路1000号',
    total: 128.00,
    items: [{ name: '东北五常大米 10kg', qty: 1, price: 128.00, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }],
    logistics: { company: '顺丰速运', trackingNo: 'SF100020003000' }
  },
  { 
    id: '202509250003', 
    status: 'completed', 
    createTime: '2025-09-22 09:15', 
    buyerName: '王五', 
    phone: '137****5678',
    address: '广州市天河区珠江新城华夏路10号',
    total: 45.90, 
    items: [{ name: '赣南脐橙 5kg', qty: 1, price: 45.90, image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }],
    logistics: { company: '中通快递', trackingNo: '751000200030' }
  }
];

export const SellerOrderList: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal State
  const [shippingModal, setShippingModal] = useState<{ open: boolean; orderId: string | null }>({ open: false, orderId: null });
  const [logisticsForm, setLogisticsForm] = useState({ company: '顺丰速运', trackingNo: '' });

  const handleShipClick = (orderId: string) => {
    setShippingModal({ open: true, orderId });
    setLogisticsForm({ company: '顺丰速运', trackingNo: '' }); // Reset form
  };

  const confirmShip = () => {
    if (!logisticsForm.trackingNo) {
      alert('请输入运单号');
      return;
    }
    
    setOrders(prev => prev.map(order => {
      if (order.id === shippingModal.orderId) {
        return {
          ...order,
          status: 'shipped',
          logistics: { ...logisticsForm }
        };
      }
      return order;
    }));
    
    setShippingModal({ open: false, orderId: null });
    alert('发货成功！');
  };

  const handlePrint = (orderId: string) => {
    // Simulate printing functionality
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>打印电子面单 - ${orderId}</title></head><body><h1>电子面单预览</h1><p>订单号: ${orderId}</p><p>此处调用打印机接口...</p></body></html>`);
      printWindow.document.close();
      printWindow.print();
    } else {
       alert(`正在调用打印机打印订单 ${orderId} 的面单...`);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-[#212121]">订单管理</h1>
         <div className="flex gap-2">
            <Button variant="ghost" icon={<Printer size={16}/>}>批量打印</Button>
            <Button variant="ghost" icon={<FileText size={16}/>}>导出订单</Button>
         </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 flex flex-wrap gap-4 items-center justify-between">
         <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['all', 'pending_pay', 'pending_ship', 'shipped', 'completed'].map(status => (
               <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                     filterStatus === status 
                     ? 'bg-[#4CAF50] text-white' 
                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
               >
                  {status === 'all' ? '全部订单' : 
                   status === 'pending_pay' ? '待付款' :
                   status === 'pending_ship' ? '待发货' :
                   status === 'shipped' ? '已发货' : '已完成'}
               </button>
            ))}
         </div>
         <div className="relative">
            <input type="text" placeholder="搜索订单号/买家/手机号" className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#4CAF50] w-64" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
         </div>
      </Card>

      {/* Order List */}
      <div className="space-y-4">
         {filteredOrders.map(order => (
            <Card key={order.id} className="p-0 border border-gray-200">
               {/* Order Header */}
               <div className="bg-gray-50 px-6 py-3 flex justify-between items-center text-sm text-gray-500 border-b border-gray-200">
                  <div className="flex gap-4 items-center">
                     <span className="font-bold text-[#212121]">{order.createTime}</span>
                     <span>订单号: {order.id}</span>
                     <span className="flex items-center gap-1"><User size={14}/> {order.buyerName}</span>
                  </div>
                  <Badge color={
                     order.status === 'pending_ship' ? 'orange' :
                     order.status === 'shipped' ? 'blue' :
                     order.status === 'completed' ? 'green' : 'gray'
                  }>
                     {order.status === 'pending_ship' ? '待发货' :
                      order.status === 'shipped' ? '已发货' :
                      order.status === 'completed' ? '已完成' : '待付款'}
                  </Badge>
               </div>

               {/* Order Body */}
               <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
                  {/* Product Info */}
                  <div className="flex-1 w-full space-y-4">
                     {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                           <img src={item.image} className="w-16 h-16 rounded object-cover bg-gray-100" alt={item.name} />
                           <div>
                              <div className="font-bold text-[#212121] mb-1">{item.name}</div>
                              <div className="text-sm text-gray-500">¥{item.price} x {item.qty}</div>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Amount */}
                  <div className="w-full md:w-32 text-center border-l border-gray-100 pl-4">
                     <div className="text-sm text-gray-500">订单金额</div>
                     <div className="font-bold text-lg text-[#FF9800]">¥{order.total.toFixed(2)}</div>
                     <div className="text-xs text-gray-400">含运费 ¥0.00</div>
                  </div>

                  {/* Actions */}
                  <div className="w-full md:w-48 flex flex-col gap-2 border-l border-gray-100 pl-4">
                     {order.status === 'pending_ship' && (
                        <>
                           <Button variant="solid-green" size="sm" onClick={() => handleShipClick(order.id)}>立即发货</Button>
                           <Button variant="ghost" size="sm" onClick={() => handlePrint(order.id)}>打印电子面单</Button>
                        </>
                     )}
                     {order.status === 'shipped' && (
                        <>
                           <Button variant="ghost" size="sm" disabled>已发货</Button>
                           <div className="text-xs text-gray-500 text-center">
                              {order.logistics?.company}: <br/>{order.logistics?.trackingNo}
                           </div>
                        </>
                     )}
                     <Button variant="text" size="sm" className="text-blue-600" onClick={() => navigate(`/mall/seller/order/${order.id}`)}>查看详情</Button>
                  </div>
               </div>
            </Card>
         ))}
      </div>

      {/* Shipping Modal */}
      {shippingModal.open && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
            <Card className="w-[400px] p-6 space-y-6 relative">
               <button 
                  onClick={() => setShippingModal({ open: false, orderId: null })}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
               >
                  <X size={20} />
               </button>
               
               <h3 className="text-lg font-bold">订单发货</h3>
               
               <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                  正在为订单 <span className="font-mono font-bold">{shippingModal.orderId}</span> 发货
               </div>

               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">物流公司</label>
                     <select 
                        className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none"
                        value={logisticsForm.company}
                        onChange={(e) => setLogisticsForm({...logisticsForm, company: e.target.value})}
                     >
                        <option>顺丰速运</option>
                        <option>中通快递</option>
                        <option>圆通速递</option>
                        <option>韵达快递</option>
                        <option>邮政EMS</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">快递单号</label>
                     <input 
                        type="text" 
                        placeholder="请输入或扫描单号"
                        className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none"
                        value={logisticsForm.trackingNo}
                        onChange={(e) => setLogisticsForm({...logisticsForm, trackingNo: e.target.value})}
                     />
                  </div>
               </div>

               <div className="pt-2 flex gap-3">
                  <Button variant="ghost" className="flex-1" onClick={() => setShippingModal({ open: false, orderId: null })}>取消</Button>
                  <Button variant="solid-green" className="flex-1" onClick={confirmShip}>确认发货</Button>
               </div>
            </Card>
         </div>
      )}
    </div>
  );
};

export const SellerOrderDetail: React.FC = () => {
   const navigate = useNavigate();
   // Simplified detail view
   return (
      <div className="animate-fade-in">
         <Button variant="ghost" size="sm" onClick={() => navigate('/mall/seller/orders')} className="mb-4">
            <ArrowLeft size={16} className="mr-1" /> 返回订单列表
         </Button>
         <Card className="p-8 text-center text-gray-500">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p>订单详情页内容同买家视角，此处略...</p>
         </Card>
      </div>
   );
};