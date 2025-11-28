import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../components/Common';
import { Search, Filter, Package } from 'lucide-react';
import { usePagingQuery } from '../src/hooks/usePagingQuery';
import { MockApi } from '../src/mock/mockApi';

const TABS = ['全部', '待付款', '待发货', '待收货', '待评价'];

export const BuyerOrders: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('全部');
  const [keyword, setKeyword] = useState('');

  const statusMap: Record<string, any> = {
    全部: undefined,
    待付款: 'pending_pay',
    待发货: 'pending_ship',
    待收货: 'shipped',
    待评价: 'completed',
  };

  const loadOrders = useCallback((p: any) => MockApi.getBuyerOrders(p), []);
  const { list, total, params, isLoading, isError, setPage, update } = usePagingQuery(
    loadOrders,
    { page: 1, pageSize: 10 }
  );

  useEffect(() => {
    update({ status: statusMap[activeTab], keyword });
  }, [activeTab, keyword]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-[#212121]">我的订单</h1>
         <div className="relative">
            <input 
              type="text" 
              placeholder="搜索订单号/商品" 
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#4CAF50]"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') update({ status: statusMap[activeTab], keyword }); }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
         </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
         {TABS.map(tab => (
            <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? 'text-[#4CAF50]' : 'text-gray-500 hover:text-gray-700'
               }`}
            >
               {tab}
               {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4CAF50]"></div>}
            </button>
         ))}
      </div>

      <div className="space-y-4">
        {isLoading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[140px] bg-white border border-gray-200 rounded animate-pulse" />
        ))}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">加载失败，请重试</div>
        )}
        {!isLoading && !isError && list.map((o) => (
          <Card key={o.id} className="p-0 overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center text-sm text-gray-500 border-b border-gray-200">
              <div className="flex gap-4">
                <span>{o.createTime}</span>
                <span className="font-mono">订单号: {o.id}</span>
                <span className="font-medium text-gray-700 hidden sm:inline">{o.shopName}</span>
              </div>
              <div className="text-[#FF9800] font-medium">
                {o.status === 'pending_ship' ? '待发货' : o.status === 'shipped' ? '运输中' : o.status === 'completed' ? '已完成' : '待付款'}
              </div>
            </div>
            <div className="p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-4 flex-1 w-full cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/mall/buyer/order/${o.id}`)}>
                <img src={o.items[0]?.imageUrl} className="w-20 h-20 object-cover rounded bg-gray-200" alt={o.items[0]?.name} />
                <div>
                  <h4 className="font-bold text-[#212121] mb-1">{o.items[0]?.name}</h4>
                  <p className="text-sm text-gray-500">规格: {o.items[0]?.quantity}件</p>
                </div>
              </div>
              <div className="text-center w-32 hidden md:block">
                <div className="text-gray-500">¥{o.items[0]?.price.toFixed(2)}</div>
                <div className="text-gray-400 text-xs">x{o.items[0]?.quantity}</div>
              </div>
              <div className="text-center w-32 border-l border-gray-100 pl-6 md:pl-0">
                <div className="font-bold text-[#212121]">¥{o.actualAmount.toFixed(2)}</div>
                <div className="text-xs text-gray-400">含运费 ¥{o.freight.toFixed(2)}</div>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-32">
                {o.status === 'pending_ship' && <Button variant="ghost" size="sm">提醒发货</Button>}
                {o.status === 'shipped' && (
                  <>
                    <Button variant="solid-green" size="sm">确认收货</Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/mall/buyer/logistics/${o.id}`)}>查看物流</Button>
                  </>
                )}
                {o.status === 'completed' && (
                  <>
                    <Button variant="ghost" size="sm" className="border-gray-300 text-gray-600" onClick={() => navigate(`/mall/buyer/review/publish/${o.id}`)}>评价晒单</Button>
                    <Button variant="text" size="sm" className="text-gray-500" onClick={() => navigate(`/mall/buyer/refund/${o.id}`)}>申请售后</Button>
                  </>
                )}
                <Button variant="text" size="sm" className="text-gray-500" onClick={() => navigate(`/mall/buyer/order/${o.id}`)}>订单详情</Button>
              </div>
            </div>
          </Card>
        ))}
        <div className="flex justify-center items-center gap-2 mt-2">
          <button onClick={() => setPage(Math.max(1, params.page - 1))} className="px-3 py-1 border border-gray-200 rounded hover:border-[#4CAF50] hover:text-[#4CAF50] disabled:opacity-50 text-sm bg-white" disabled={params.page === 1}>上一页</button>
          <span className="text-gray-500 text-sm">第 {params.page} 页 / 共 {Math.max(1, Math.ceil(total / params.pageSize))} 页</span>
          <button onClick={() => setPage(Math.min(Math.ceil(total / params.pageSize), params.page + 1))} className="px-3 py-1 border border-gray-200 rounded hover:border-[#4CAF50] hover:text-[#4CAF50] text-sm bg-white">下一页</button>
        </div>
      </div>
    </div>
  );
};
