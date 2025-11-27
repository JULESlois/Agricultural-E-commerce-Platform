import React from 'react';
import { Card, SectionTitle, Button } from '../components/Common';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, Package, DollarSign, ShoppingCart } from 'lucide-react';

// Mock Data for Charts
const salesData = [
  { name: '1月', value: 4000 },
  { name: '2月', value: 3000 },
  { name: '3月', value: 2000 },
  { name: '4月', value: 2780 },
  { name: '5月', value: 1890 },
  { name: '6月', value: 2390 },
  { name: '7月', value: 3490 },
];

const priceTrendData = [
  { name: '周一', price: 10.5 },
  { name: '周二', price: 11.2 },
  { name: '周三', price: 10.8 },
  { name: '周四', price: 12.1 },
  { name: '周五', price: 11.9 },
  { name: '周六', price: 12.5 },
  { name: '周日', price: 13.0 },
];

export const SellerDashboardHome: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[#212121]">经营概览</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { title: '今日销售额', value: '¥12,450', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
           { title: '待发货订单', value: '24', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
           { title: '库存预警', value: '3', icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
           { title: '总访客数', value: '1,203', icon: ArrowUpRight, color: 'text-purple-600', bg: 'bg-purple-50' },
         ].map((kpi, idx) => (
           <Card key={idx} className="p-6 flex items-center justify-between">
              <div>
                 <p className="text-sm text-gray-500 mb-1">{kpi.title}</p>
                 <p className="text-2xl font-bold text-[#212121]">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-full ${kpi.bg} ${kpi.color}`}>
                 <kpi.icon size={20} />
              </div>
           </Card>
         ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="p-6">
            <h3 className="font-bold mb-6">近半年销售趋势</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#757575', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#757575', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#F5F5F5'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" fill="#4CAF50" radius={[4, 4, 0, 0]} barSize={30} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold">核心产品价格走势 (预测)</h3>
               <Button size="sm" variant="ghost">查看AI报告</Button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#757575', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#757575', fontSize: 12}} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Line type="monotone" dataKey="price" stroke="#1976D2" strokeWidth={3} dot={{r: 4, fill: '#1976D2', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <SectionTitle title="最新订单" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
               <tr>
                 <th className="p-3 rounded-l">订单号</th>
                 <th className="p-3">商品</th>
                 <th className="p-3">买家</th>
                 <th className="p-3">金额</th>
                 <th className="p-3">状态</th>
                 <th className="p-3 rounded-r">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {[1, 2, 3, 4, 5].map((i) => (
                 <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3">#ORD-20250925-{i}</td>
                    <td className="p-3">有机红富士苹果 5kg</td>
                    <td className="p-3">李先生</td>
                    <td className="p-3 font-bold">¥85.00</td>
                    <td className="p-3">
                       <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">待发货</span>
                    </td>
                    <td className="p-3">
                       <Button variant="text" className="text-blue-600 hover:text-blue-800">发货</Button>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};