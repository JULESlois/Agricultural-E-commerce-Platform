import React from 'react';
import { Button, Card, SectionTitle } from '../components/Common';
import { Save, Camera } from 'lucide-react';

export const SellerSettings: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
       <h1 className="text-2xl font-bold text-[#212121]">店铺设置</h1>

       <Card className="p-8 space-y-8">
          {/* Avatar & Banner */}
          <div className="space-y-4">
             <SectionTitle title="店铺形象" />
             <div className="flex gap-8 items-start">
                <div className="text-center">
                   <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 mb-2 cursor-pointer hover:bg-gray-50">
                      <Camera size={24} />
                   </div>
                   <span className="text-sm text-gray-500">店铺头像</span>
                </div>
                <div className="flex-1">
                   <div className="w-full h-24 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 mb-2 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                         <Camera size={24} />
                         <span>点击上传店铺招牌 (建议尺寸 1920x400)</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* Basic Info */}
          <div className="space-y-4">
             <SectionTitle title="基本信息" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">店铺名称</label>
                   <input type="text" className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none" defaultValue="绿源果蔬合作社" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                   <input type="text" className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none" defaultValue="13800138000" />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">店铺简介</label>
                   <textarea className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none h-24" defaultValue="专注生态种植，提供绿色健康的农产品。" />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">发货地址</label>
                   <input type="text" className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none" defaultValue="山东省 烟台市 栖霞市 桃村镇 绿源基地" />
                </div>
             </div>
          </div>

          <div className="pt-4">
             <Button variant="solid-green" icon={<Save size={16} />}>保存设置</Button>
          </div>
       </Card>
    </div>
  );
};