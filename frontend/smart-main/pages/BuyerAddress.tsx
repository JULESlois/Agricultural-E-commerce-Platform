import React, { useEffect, useState } from 'react';
import { Button, Card, Badge } from '../components/Common';
import { MOCK_ADDRESSES } from '../constants';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { addressesList, addressDelete, addressSetDefault, addressCreate } from '../api/market';

export const BuyerAddress: React.FC = () => {
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '张三', phone: '13800138000', province: '北京市', city: '北京市', district: '朝阳区', detail: '建国门外大街1号', isDefault: false });

  useEffect(() => {
      addressesList().then((r: any) => {
        const list = r?.data || [];
        const mapped = list.map((a: any) => ({ id: String(a.address_id || a.id), name: a.receiver_name || a.name, phone: a.receiver_phone || a.phone, province: a.province || '', city: a.city || '', district: a.district || '', detail: a.detail_address || a.detail || '', isDefault: !!a.is_default, tag: a.tag }));
        setAddresses(mapped.length > 0 ? mapped : MOCK_ADDRESSES);
      }).catch(() => setAddresses(MOCK_ADDRESSES));
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个地址吗？')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      addressDelete(Number(id)).catch(() => {});
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr.id === id })));
    addressSetDefault(Number(id)).catch(() => {});
  };

  // Mock Form Modal
  const AddressForm = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
       <Card className="w-[500px] p-6 space-y-4">
          <h2 className="text-xl font-bold mb-4">{isEditing ? '编辑地址' : '新增地址'}</h2>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">收货人</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">手机号码</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
             </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">省市区</label>
             <input type="text" className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none" value={`${form.province} ${form.city} ${form.district}`} onChange={(e) => setForm({ ...form, province: e.target.value })} />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
             <textarea className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none h-20" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
             <input type="checkbox" id="default" className="text-[#4CAF50] focus:ring-[#4CAF50] rounded" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
             <label htmlFor="default" className="text-sm text-gray-600">设为默认地址</label>
          </div>
          <div className="flex gap-2 pt-4 justify-end">
             <Button variant="ghost" onClick={() => setIsEditing(false)}>取消</Button>
             <Button variant="solid-green" onClick={() => {
                 const body: any = { receiver_name: form.name, receiver_phone: form.phone, province: form.province, city: form.city, district: form.district, detail_address: form.detail, is_default: form.isDefault };
                 addressCreate(body).then(() => {
                   setIsEditing(false);
                 }).catch(() => setIsEditing(false));
             }}>保存</Button>
          </div>
       </Card>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#212121]">收货地址</h1>
          <Button variant="solid-green" icon={<Plus size={16} />} onClick={() => setIsEditing(true)}>新增地址</Button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(addr => (
             <Card key={addr.id} className={`p-6 border-2 relative group ${addr.isDefault ? 'border-[#4CAF50]' : 'border-transparent hover:border-gray-200'}`}>
                {addr.isDefault && (
                   <div className="absolute top-0 right-0 bg-[#4CAF50] text-white text-xs px-2 py-1 rounded-bl-lg">默认</div>
                )}
                <div className="flex items-start gap-3 mb-4">
                   <div className="mt-1">
                      <MapPin size={20} className="text-gray-400" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="font-bold text-lg">{addr.name}</span>
                         <span className="text-gray-500">{addr.phone}</span>
                         {addr.tag && <Badge color="blue">{addr.tag}</Badge>}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                         {addr.province} {addr.city} {addr.district} <br/> {addr.detail}
                      </p>
                   </div>
                </div>
                
                <div className="flex justify-end gap-4 border-t border-gray-100 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   {!addr.isDefault && (
                      <button className="text-sm text-[#4CAF50] hover:underline" onClick={() => handleSetDefault(addr.id)}>设为默认</button>
                   )}
                   <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded" onClick={() => setIsEditing(true)}>
                      <Edit2 size={16} />
                   </button>
                   <button className="text-red-600 hover:bg-red-50 p-1.5 rounded" onClick={() => handleDelete(addr.id)}>
                      <Trash2 size={16} />
                   </button>
                </div>
             </Card>
          ))}
       </div>

       {isEditing && <AddressForm />}
    </div>
  );
};
