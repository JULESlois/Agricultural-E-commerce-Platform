import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, SectionTitle, Badge } from '../components/Common';
import { User, Lock, Phone, ShieldCheck, Camera, Save, Mail, LogOut, Store, CheckCircle2 } from 'lucide-react';

export const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: '张三',
    phone: '138****0000',
    email: 'zhangsan@example.com'
  });

  const handleLogout = () => {
    // In a real app, clear tokens/session here
    navigate('/auth/login');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <h1 className="text-2xl font-bold text-[#212121]">账号设置</h1>

      {/* Profile Section */}
      <Card className="p-8">
        <SectionTitle title="个人资料" />
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-2">
             <div className="w-24 h-24 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md relative">
                <User size={40} />
                <button className="absolute bottom-0 right-0 bg-white text-gray-600 rounded-full p-1.5 shadow-sm border border-gray-200 hover:text-[#4CAF50] transition-colors">
                   <Camera size={14} />
                </button>
             </div>
             <span className="text-xs text-gray-400 cursor-pointer hover:text-[#4CAF50]">点击更换头像</span>
          </div>
          
          <div className="flex-1 w-full space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
                   <input 
                     type="text" 
                     className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none transition-colors"
                     value={formData.nickname}
                     onChange={e => setFormData({...formData, nickname: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">用户ID</label>
                   <input type="text" disabled className="w-full p-2 border border-gray-200 bg-gray-50 rounded text-gray-500 cursor-not-allowed" value="88392019" />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">个性签名</label>
                   <textarea className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none h-20" placeholder="介绍一下自己..." />
                </div>
             </div>
             <div className="pt-2">
                <Button variant="solid-green" icon={<Save size={16}/>}>保存修改</Button>
             </div>
          </div>
        </div>
      </Card>

      {/* Security Section */}
      <Card className="p-8">
         <SectionTitle title="账号安全" />
         <div className="space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                     <Phone size={20} />
                  </div>
                  <div>
                     <div className="font-bold text-[#212121]">绑定手机</div>
                     <div className="text-sm text-gray-500">已绑定：{formData.phone}</div>
                  </div>
               </div>
               <Button variant="ghost" size="sm">更换手机</Button>
            </div>

            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                     <Mail size={20} />
                  </div>
                  <div>
                     <div className="font-bold text-[#212121]">绑定邮箱</div>
                     <div className="text-sm text-gray-500">未绑定</div>
                  </div>
               </div>
               <Button variant="ghost" size="sm">立即绑定</Button>
            </div>

            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                     <Lock size={20} />
                  </div>
                  <div>
                     <div className="font-bold text-[#212121]">登录密码</div>
                     <div className="text-sm text-gray-500">建议定期更换密码以保障账号安全</div>
                  </div>
               </div>
               <Button variant="ghost" size="sm">修改密码</Button>
            </div>
         </div>
      </Card>

      {/* My Authentication */}
      <Card className="p-8">
         <SectionTitle title="我的认证" />
         <div className="space-y-6">
            {/* Buyer Authentication */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
               <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                     <ShieldCheck size={20} />
                  </div>
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#212121]">买家认证</span>
                        <Badge color="green">已认证</Badge>
                     </div>
                     <p className="text-sm text-gray-500 max-w-lg">
                        您已完成个人实名认证，真实姓名：*三，身份证号：110***********001X。
                        <br/>享有平台商品采购、在线支付及售后保障权益。
                     </p>
                  </div>
               </div>
               <Button variant="text" size="sm" className="text-gray-400" disabled>查看详情</Button>
            </div>

            {/* Seller Authentication */}
            <div className="flex items-center justify-between">
               <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                     <Store size={20} />
                  </div>
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#212121]">卖家认证</span>
                        <Badge color="gray">未认证</Badge>
                     </div>
                     <p className="text-sm text-gray-500 max-w-lg">
                        认证成为农户或企业商家，发布货源，开启销售之旅。
                        <br/>支持 个人农户、农民专业合作社、涉农企业 等多种主体类型。
                     </p>
                  </div>
               </div>
               <Button variant="ghost" size="sm" className="text-[#4CAF50] border-[#4CAF50] hover:bg-green-50">立即申请</Button>
            </div>
         </div>
      </Card>

      {/* Logout Zone */}
      <Card className="p-8 border-red-100 bg-red-50/10">
         <div className="flex items-center justify-between">
            <div>
               <h3 className="text-lg font-bold text-red-600">退出登录</h3>
               <p className="text-sm text-gray-500">退出后将无法接收实时消息通知</p>
            </div>
            <Button 
               variant="ghost" 
               className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" 
               icon={<LogOut size={16}/>}
               onClick={handleLogout}
            >
               确认退出
            </Button>
         </div>
      </Card>
    </div>
  );
};