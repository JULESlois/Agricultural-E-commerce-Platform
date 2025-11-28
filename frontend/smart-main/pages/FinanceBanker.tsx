import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Badge, SectionTitle } from '../components/Common';
import { PieChart, CheckCircle2, XCircle, FileText, AlertTriangle, Users, TrendingUp, Search, ArrowLeft, BarChart as BarChartIcon, Shield } from 'lucide-react';
import { MOCK_APPLICATIONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Components ---

// BK-01: Workspace
export const BankerDashboard: React.FC = () => {
   const navigate = useNavigate();

   const stats = [
      { label: '待审批', value: '12', color: 'text-orange-500', bg: 'bg-orange-50', icon: FileText },
      { label: '今日放款 (万)', value: '350.0', color: 'text-green-600', bg: 'bg-green-50', icon: TrendingUp },
      { label: '逾期客户', value: '3', color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle },
      { label: '总授信户数', value: '1,240', color: 'text-blue-600', bg: 'bg-blue-50', icon: Users },
   ];

   return (
      <div className="space-y-6 animate-fade-in">
         <h1 className="text-2xl font-bold text-[#212121]">信贷工作台</h1>
         
         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
               <Card key={i} className="p-6 flex items-center justify-between">
                  <div>
                     <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                     <h2 className="text-2xl font-bold text-[#212121]">{s.value}</h2>
                  </div>
                  <div className={`p-3 rounded-full ${s.bg} ${s.color}`}>
                     <s.icon size={24} />
                  </div>
               </Card>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Tasks (BK-02 Preview) */}
            <Card className="p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">待办审批</h3>
                  <Button variant="text" size="sm" onClick={() => navigate('/finance/banker/approvals')}>查看全部</Button>
               </div>
               <div className="space-y-4">
                  {MOCK_APPLICATIONS.filter(a => a.status === 'AUDITING').map(app => (
                     <div key={app.id} className="flex justify-between items-center p-3 border border-gray-100 rounded hover:bg-gray-50">
                        <div>
                           <div className="font-bold text-sm mb-1">{app.applicant.name} - {app.productName}</div>
                           <div className="text-xs text-gray-400">{app.id} | 申请金额: ¥{app.amount.toLocaleString()}</div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/finance/banker/approval/${app.id}`)}>
                           审批
                        </Button>
                     </div>
                  ))}
               </div>
            </Card>

            {/* Risk Monitoring (BK-05 Preview) */}
            <Card className="p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">贷后风险预警</h3>
                  <Badge color="red">3 条高风险</Badge>
               </div>
               <div className="space-y-4">
                  {[
                     { name: '赵六', issue: '还款逾期 3 天', level: 'high' },
                     { name: '钱七', issue: '经营地气象灾害预警', level: 'medium' },
                     { name: '孙八', issue: '大额异常资金流出', level: 'high' },
                  ].map((risk, i) => (
                     <div key={i} className="flex items-center gap-3 p-3 bg-red-50/50 rounded">
                        <AlertTriangle size={18} className={risk.level === 'high' ? 'text-red-500' : 'text-orange-500'} />
                        <span className="flex-1 text-sm font-medium">{risk.name}: {risk.issue}</span>
                        <Button size="sm" variant="text" className="text-blue-600">查看</Button>
                     </div>
                  ))}
               </div>
            </Card>
         </div>
      </div>
   );
};

// BK-02: Approval List
export const BankerApprovalList: React.FC = () => {
   const navigate = useNavigate();
   return (
      <div className="space-y-6 animate-fade-in">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#212121]">贷款审批</h1>
            <div className="relative w-64">
               <input type="text" placeholder="搜索申请编号/客户名" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1976D2]" />
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
         </div>
         <Card className="p-0">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500">
                  <tr>
                     <th className="p-4">申请编号</th>
                     <th className="p-4">申请人</th>
                     <th className="p-4">产品</th>
                     <th className="p-4">金额</th>
                     <th className="p-4">信用分</th>
                     <th className="p-4">状态</th>
                     <th className="p-4 text-right">操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {MOCK_APPLICATIONS.map(app => (
                     <tr key={app.id} className="hover:bg-gray-50">
                        <td className="p-4 font-mono text-gray-600">{app.id}</td>
                        <td className="p-4 font-bold">{app.applicant.name}</td>
                        <td className="p-4">{app.productName}</td>
                        <td className="p-4">¥{app.amount.toLocaleString()}</td>
                        <td className="p-4">
                           <span className={app.applicant.creditScore > 700 ? 'text-green-600 font-bold' : 'text-orange-600'}>
                              {app.applicant.creditScore}
                           </span>
                        </td>
                        <td className="p-4">
                           <Badge color={app.status === 'AUDITING' ? 'blue' : app.status === 'APPROVED' ? 'green' : 'gray'}>
                              {app.status === 'AUDITING' ? '待审批' : app.status}
                           </Badge>
                        </td>
                        <td className="p-4 text-right">
                           <Button size="sm" variant="ghost" onClick={() => navigate(`/finance/banker/approval/${app.id}`)}>
                              详情
                           </Button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </Card>
      </div>
   );
};

// BK-03: Approval Detail
export const BankerApprovalDetail: React.FC = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const app = MOCK_APPLICATIONS.find(a => a.id === id) || MOCK_APPLICATIONS[0];

   return (
      <div className="space-y-6 animate-fade-in">
         <Button variant="text" size="sm" onClick={() => navigate('/finance/banker/approvals')}>
            <ArrowLeft size={16} className="mr-1" /> 返回列表
         </Button>
         
         <div className="flex justify-between items-start">
            <div>
               <h1 className="text-2xl font-bold mb-1">审批详情</h1>
               <p className="text-gray-500 text-sm font-mono">{app.id}</p>
            </div>
            <div className="flex gap-3">
               <Button variant="ghost" className="text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle size={18} className="mr-2" /> 拒绝
               </Button>
               <Button className="bg-[#1976D2] hover:bg-[#1565C0] text-white">
                  <CheckCircle2 size={18} className="mr-2" /> 批准放款
               </Button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Applicant Info */}
            <div className="lg:col-span-2 space-y-6">
               <Card className="p-6">
                  <SectionTitle title="申请信息" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                     <div>
                        <span className="text-gray-500 block mb-1">申请人姓名</span>
                        <span className="font-bold text-lg">{app.applicant.name}</span>
                     </div>
                     <div>
                        <span className="text-gray-500 block mb-1">身份证号</span>
                        <span>{app.applicant.idCard}</span>
                     </div>
                     <div>
                        <span className="text-gray-500 block mb-1">申请产品</span>
                        <span className="text-[#1976D2]">{app.productName}</span>
                     </div>
                     <div>
                        <span className="text-gray-500 block mb-1">申请金额</span>
                        <span className="font-bold text-lg">¥{app.amount.toLocaleString()}</span>
                     </div>
                     <div>
                        <span className="text-gray-500 block mb-1">借款期限</span>
                        <span>{app.period} 个月</span>
                     </div>
                     <div>
                        <span className="text-gray-500 block mb-1">申请时间</span>
                        <span>{app.applyDate}</span>
                     </div>
                  </div>
               </Card>

               <Card className="p-6">
                  <SectionTitle title="经营数据分析" />
                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="bg-gray-50 p-4 rounded">
                        <span className="text-gray-500 text-xs">种植规模</span>
                        <div className="font-bold text-lg">{app.applicant.farmSize}</div>
                     </div>
                     <div className="bg-gray-50 p-4 rounded">
                        <span className="text-gray-500 text-xs">主要作物</span>
                        <div className="font-bold text-lg">{app.applicant.cropType}</div>
                     </div>
                  </div>
                  <div className="h-64 bg-gray-50 rounded flex items-center justify-center border border-dashed border-gray-300">
                     <div className="text-center text-gray-400">
                        <BarChartIcon size={48} className="mx-auto mb-2" />
                        <p>历史产量与销售额走势图</p>
                     </div>
                  </div>
               </Card>
            </div>

            {/* Right: Risk Report */}
            <div className="space-y-6">
               <Card className="p-6 bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                     <Shield size={24} className="text-[#1976D2]" />
                     <h3 className="font-bold text-[#1976D2]">智能风控报告</h3>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <div className="flex justify-between mb-1 text-sm">
                           <span>信用评分</span>
                           <span className="font-bold">{app.applicant.creditScore} / 900</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                           <div className="bg-[#1976D2] h-2 rounded-full" style={{ width: `${(app.applicant.creditScore/900)*100}%` }}></div>
                        </div>
                     </div>
                     <div className="p-3 bg-white rounded border border-blue-100 text-sm">
                        <p className="font-bold mb-2">风险提示：</p>
                        <ul className="list-disc pl-4 space-y-1 text-gray-600">
                           <li>过往还款记录良好</li>
                           <li>该地区苹果近期市场价格波动较大</li>
                           <li>负债率低于行业平均水平</li>
                        </ul>
                     </div>
                     <div className="text-center pt-2">
                        <span className="text-sm text-gray-500">系统建议：</span>
                        <span className="font-bold text-green-600 ml-2">通过 (85% 信心)</span>
                     </div>
                  </div>
               </Card>
            </div>
         </div>
      </div>
   );
};

// BK-04: Loan Records
export const BankerLoanRecords: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ keyword: '', date: '', status: 'all' });
  const records = [
    { id: 'LN202511280001', name: '李四', product: '农资周转贷', amount: 200000, date: '2025-11-26', status: '已放款' },
    { id: 'LN202511270011', name: '王五', product: '订单预售贷', amount: 120000, date: '2025-11-25', status: '已放款' },
    { id: 'LN202511250021', name: '赵六', product: '设备购置贷', amount: 350000, date: '2025-11-23', status: '已结清' },
  ];

  const filtered = records.filter(r =>
    (filter.status === 'all' || r.status === filter.status) &&
    (filter.keyword === '' || r.name.includes(filter.keyword) || r.id.includes(filter.keyword)) &&
    (filter.date === '' || r.date === filter.date)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#212121]">放款记录</h1>
        <Button variant="text" size="sm" onClick={() => navigate('/finance/banker/dashboard')}>返回工作台</Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input 
            className="border border-gray-300 rounded px-3 py-2 text-sm" 
            placeholder="按记录号/姓名搜索"
            value={filter.keyword}
            onChange={(e) => setFilter({ ...filter, keyword: e.target.value })}
          />
          <input 
            type="date" 
            className="border border-gray-300 rounded px-3 py-2 text-sm" 
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          />
          <select 
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="all">全部状态</option>
            <option value="已放款">已放款</option>
            <option value="已结清">已结清</option>
          </select>
          <Button variant="solid-green">查询</Button>
        </div>
      </Card>

      <Card className="p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-4">记录号</th>
              <th className="p-4">客户</th>
              <th className="p-4">产品</th>
              <th className="p-4">放款金额</th>
              <th className="p-4">放款日期</th>
              <th className="p-4">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-gray-600">{r.id}</td>
                <td className="p-4 font-bold">{r.name}</td>
                <td className="p-4">{r.product}</td>
                <td className="p-4">¥{r.amount.toLocaleString()}</td>
                <td className="p-4">{r.date}</td>
                <td className="p-4">
                  <Badge color={r.status === '已放款' ? 'blue' : 'green'}>{r.status}</Badge>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-400" colSpan={6}>无匹配记录</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
