import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../components/Common';
import { MOCK_PRODUCTS } from '../constants';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export const SellerProduct: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-[#212121]">货源管理</h1>
         <Button 
            variant="solid-green" 
            icon={<Plus size={16} />}
            onClick={() => navigate('/mall/seller/product/new')}
         >
            发布新商品
         </Button>
      </div>

      <Card className="p-0">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                     <th className="p-4 rounded-tl-lg">商品信息</th>
                     <th className="p-4">价格</th>
                     <th className="p-4">库存</th>
                     <th className="p-4">状态</th>
                     <th className="p-4">销量</th>
                     <th className="p-4 rounded-tr-lg text-right">操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {MOCK_PRODUCTS.map((product) => (
                     <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="p-4">
                           <div className="flex items-center gap-3">
                              <img src={product.imageUrl} className="w-12 h-12 rounded object-cover bg-gray-100" alt={product.title} />
                              <div>
                                 <div className="font-bold text-[#212121]">{product.title}</div>
                                 <div className="text-xs text-gray-400">ID: {product.id}</div>
                              </div>
                           </div>
                        </td>
                        <td className="p-4 text-[#FF9800] font-bold">¥{product.price.toFixed(2)}</td>
                        <td className="p-4">{product.stock}</td>
                        <td className="p-4">
                           <Badge color="green">销售中</Badge>
                        </td>
                        <td className="p-4">1,204</td>
                        <td className="p-4 text-right">
                           <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                 className="p-2 text-blue-600 hover:bg-blue-50 rounded" 
                                 title="编辑"
                                 onClick={() => navigate(`/mall/seller/product/edit/${product.id}`)}
                              >
                                 <Edit size={16} />
                              </button>
                              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="下架">
                                 <Eye size={16} />
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded" title="删除">
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {/* Pagination Mock */}
         <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
            <Button variant="ghost" size="sm" disabled>上一页</Button>
            <Button variant="ghost" size="sm">下一页</Button>
         </div>
      </Card>
    </div>
  );
};