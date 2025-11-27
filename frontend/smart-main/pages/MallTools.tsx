import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge, SectionTitle } from '../components/Common';
import { MOCK_PRODUCTS } from '../constants';
import { ArrowLeft, Trash2, ShoppingCart } from 'lucide-react';

export const ProductCompare: React.FC = () => {
  const navigate = useNavigate();
  // Mock: Assume first 2 products are selected for comparison
  const compareItems = MOCK_PRODUCTS.slice(0, 3);

  return (
    <div className="animate-fade-in space-y-6">
       <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/mall')}>
             <ArrowLeft size={16} className="mr-1" /> 返回商城
          </Button>
          <h1 className="text-2xl font-bold text-[#212121]">商品对比</h1>
       </div>

       <div className="overflow-x-auto pb-4">
          <table className="w-full text-left bg-white rounded-lg shadow-sm border border-gray-200">
             <thead>
                <tr className="border-b border-gray-200">
                   <th className="p-6 min-w-[150px] bg-gray-50 text-gray-500 font-medium">对比项</th>
                   {compareItems.map(item => (
                      <th key={item.id} className="p-6 min-w-[250px] align-top relative group">
                         <div className="flex flex-col items-center text-center">
                             <img src={item.imageUrl} className="w-32 h-32 object-cover rounded-lg mb-4 bg-gray-100" alt={item.title} />
                             <h3 className="font-bold text-[#212121] mb-2 line-clamp-2 h-10">{item.title}</h3>
                             <div className="text-[#FF9800] font-bold text-lg mb-2">¥{item.price}</div>
                             <div className="flex gap-2 w-full">
                                <Button size="sm" variant="solid-green" className="flex-1">加入购物车</Button>
                                <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                             </div>
                         </div>
                      </th>
                   ))}
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 text-sm">
                <tr>
                   <td className="p-4 pl-6 font-bold text-gray-700 bg-gray-50">产地</td>
                   {compareItems.map(item => <td key={item.id} className="p-4 text-center">{item.origin}</td>)}
                </tr>
                <tr>
                   <td className="p-4 pl-6 font-bold text-gray-700 bg-gray-50">供应商</td>
                   {compareItems.map(item => <td key={item.id} className="p-4 text-center text-[#4CAF50] underline cursor-pointer">{item.farmerName}</td>)}
                </tr>
                <tr>
                   <td className="p-4 pl-6 font-bold text-gray-700 bg-gray-50">规格</td>
                   {compareItems.map(item => <td key={item.id} className="p-4 text-center">{item.specs || '标准规格'}</td>)}
                </tr>
                <tr>
                   <td className="p-4 pl-6 font-bold text-gray-700 bg-gray-50">起订量</td>
                   {compareItems.map(item => <td key={item.id} className="p-4 text-center">{item.moq || 1} 件</td>)}
                </tr>
                <tr>
                   <td className="p-4 pl-6 font-bold text-gray-700 bg-gray-50">库存</td>
                   {compareItems.map(item => <td key={item.id} className="p-4 text-center">{item.stock}</td>)}
                </tr>
                <tr>
                   <td className="p-4 pl-6 font-bold text-gray-700 bg-gray-50">服务标签</td>
                   {compareItems.map(item => (
                      <td key={item.id} className="p-4">
                         <div className="flex flex-wrap justify-center gap-1">
                            {item.tags?.map(tag => <Badge key={tag} color="gray">{tag}</Badge>)}
                         </div>
                      </td>
                   ))}
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  );
};
