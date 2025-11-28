import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/Common';
import { User, Lock, Phone, ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Role-based redirect
      if (formData.username.trim() === 'seller') {
        navigate('/mall/seller/dashboard');
      } else {
        // Redirect to orders by default for buyers
        navigate('/mall/buyer/orders');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8 animate-fade-in relative">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-[#4CAF50] transition-colors font-medium z-10"
      >
        <ArrowLeft size={20} />
        返回上一级
      </button>

      <Card className="w-full max-w-md p-8 space-y-8 shadow-lg">
        <div className="text-center">
          <div className="h-12 w-12 bg-[#4CAF50] rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            智
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? '欢迎回来' : '创建账号'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? '登录您的智农链账号 (测试卖家账号请输入: seller)' : '注册成为智农链会员，享受融销一体化服务'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isLogin ? <User className="h-5 w-5 text-gray-400" /> : <Phone className="h-5 w-5 text-gray-400" />}
              </div>
              <input
                required
                type="text"
                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50] sm:text-sm"
                placeholder={isLogin ? "用户名 (输入 seller 进入卖家后台)" : "手机号码"}
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isLogin ? <User className="h-5 w-5 text-gray-400" /> : <Phone className="h-5 w-5 text-gray-400" />}
              </div>
              <input
                required
                type="password"
                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50] sm:text-sm"
                placeholder="密码 (任意)"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            {!isLogin && (
               <div className="relative flex gap-2">
                 <input
                    required
                    type="text"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50] sm:text-sm"
                    placeholder="验证码"
                  />
                  <Button type="button" variant="ghost" className="whitespace-nowrap">获取验证码</Button>
               </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-[#4CAF50] hover:text-[#43A047]">
                忘记密码?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            variant="solid-green"
            className="w-full"
            size="lg"
            isLoading={isLoading}
          >
            {isLogin ? '登录' : '立即注册'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? '还没有账号? ' : '已有账号? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-[#4CAF50] hover:text-[#43A047] focus:outline-none"
            >
              {isLogin ? '立即注册' : '直接登录'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};