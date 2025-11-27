import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Badge, SectionTitle } from '../components/Common';
import { MOCK_INVOICES, MOCK_LOGISTICS } from '../constants';
import { FileText, Download, ArrowLeft, Truck, MapPin, Thermometer } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// B-05: Invoice List
export const InvoiceList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in space-y-6">
       <h1 className="text-2xl font-bold text-[#212121]">发票管理</h1>

       <Card className="p-0">
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-b border-gray-200 text-sm font-medium text-gray-500">
             <div className="w-1/4">订单号</div>
             <div className="w-1/4">发票抬头</div>
             <div className="w-1/6">金额</div>
             <div className="w-1/6">状态</div>
             <div className="w-1/6 text-right">操作</div>
          </div>
          <div className="divide-y divide-gray-100">
             {MOCK_INVOICES.map(inv => (
                <div key={inv.id} className="px-6 py-4 flex items-center text-sm">
                   <div className="w-1/4 text-gray-600">{inv.orderId}</div>
                   <div className="w-1/4 font-medium text-[#212121]">{inv.title}</div>
                   <div className="w-1/6 font-bold">¥{inv.amount.toFixed(2)}</div>
                   <div className="w-1/6">
                      <Badge color={inv.status === 'ISSUED' ? 'green' : 'orange'}>
                         {inv.status === 'ISSUED' ? '已开票' : '开票中'}
                      </Badge>
                   </div>
                   <div className="w-1/6 text-right">
                      {inv.status === 'ISSUED' ? (
                         <Button variant="ghost" size="sm" className="h-7" icon={<Download size={12}/>}>下载PDF</Button>
                      ) : (
                         <span className="text-gray-400">处理中</span>
                      )}
                   </div>
                </div>
             ))}
          </div>
       </Card>
       
       <div className="flex justify-end">
          <Button variant="solid-green">申请新发票</Button>
       </div>
    </div>
  );
};

// B-07: Logistics Detail
export const LogisticsDetail: React.FC = () => {
   const navigate = useNavigate();
   const { id } = useParams();
   const log = MOCK_LOGISTICS; // Mock data

   return (
      <div className="animate-fade-in space-y-6">
         <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
               <ArrowLeft size={16} className="mr-1" /> 返回订单
            </Button>
            <h1 className="text-2xl font-bold text-[#212121]">物流详情</h1>
         </div>

         {/* Header Info */}
         <Card className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#1976D2]">
                  <Truck size={24} />
               </div>
               <div>
                  <h3 className="font-bold text-lg">{log.company}</h3>
                  <p className="text-sm text-gray-500">运单号：{log.trackingNo}</p>
               </div>
            </div>
            <div className="text-right">
               <div className="text-lg font-bold text-[#4CAF50]">{log.status}</div>
               <div className="text-sm text-gray-400">预计明日送达</div>
            </div>
         </Card>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline */}
            <div className="lg:col-span-2 space-y-6">
               <Card className="p-6">
                  <SectionTitle title="运送轨迹" />
                  <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                     {log.steps.map((step, idx) => (
                        <div key={idx} className="relative">
                           <div className={`absolute -left-[21px] top-0 w-3 h-3 rounded-full border-2 ${idx === 0 ? 'bg-[#4CAF50] border-[#4CAF50] shadow-[0_0_0_4px_rgba(76,175,80,0.2)]' : 'bg-white border-gray-300'}`}></div>
                           <div className="mb-1 text-sm text-gray-500">{step.time}</div>
                           <div className="font-bold text-[#212121]">{step.status} - {step.location}</div>
                           <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        </div>
                     ))}
                  </div>
               </Card>
            </div>

            {/* Cold Chain Monitor */}
            <div className="space-y-6">
               <Card className="p-6">
                  <SectionTitle title="冷链监控" />
                  <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center gap-3">
                     <Thermometer className="text-[#1976D2]" />
                     <div>
                        <div className="text-xs text-gray-500">当前温度</div>
                        <div className="text-xl font-bold text-[#1976D2]">4.2°C</div>
                     </div>
                  </div>
                  <div className="h-48 w-full text-xs">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={log.coldChainData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} />
                           <XAxis dataKey="time" axisLine={false} tickLine={false} />
                           <YAxis domain={[0, 10]} axisLine={false} tickLine={false} unit="°C" />
                           <Tooltip contentStyle={{borderRadius: '8px'}} />
                           <Line type="monotone" dataKey="temp" stroke="#1976D2" strokeWidth={2} dot={false} />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">全程恒温运输，保障生鲜品质</p>
               </Card>

               <Card className="p-6">
                   <h4 className="font-bold mb-2">配送员</h4>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                         <div className="font-medium">王师傅</div>
                         <div className="text-sm text-gray-500">139****9999</div>
                      </div>
                      <Button size="sm" variant="ghost" className="ml-auto">联系</Button>
                   </div>
               </Card>
            </div>
         </div>
      </div>
   );
};
