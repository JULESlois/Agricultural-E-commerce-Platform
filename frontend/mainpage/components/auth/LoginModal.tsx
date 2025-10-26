import React, { useState } from 'react';

// SVG Icons for the form
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5.002a12.053 12.053 0 01-1.12 4.33c-.334 1.185.06 2.38.625 3.344.59.98 1.48 1.758 2.5 2.255a10.02 10.02 0 004.815 1.424.996.996 0 01.616-.01.996.996 0 01.594.46c.224.36.4.78.48 1.229l.003.013.003.011a1.01 1.01 0 01-1.958.256l-.004-.012-.003-.013a.01.01 0 00-.004-.012l-.003-.012a.01.01 0 00-.003-.012l-.004-.013a.01.01 0 00-.003-.012l-.003-.012a.01.01 0 00-.003-.012l-.003-.013a.01.01 0 00-.002-.012l-.003-.012a.01.01 0 00-.003-.012l-.002-.012a1.009 1.009 0 01.256-1.958 10.02 10.02 0 004.815-1.424c1.02-.497 1.91-.1275 2.5-2.255.565-.964.958-2.159.625-3.344a12.053 12.053 0 01-1.12-4.33A11.954 11.954 0 0110 1.944zM8.5 6a1.5 1.5 0 113 0v2.5a1.5 1.5 0 11-3 0V6zM10 12a1 1 0 100 2h.01a1 1 0 100-2H10z" clipRule="evenodd" /></svg>;
const IdCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.33.67 2.67 1 4 1s2.67-.33 4-1m-8 0c-1.33.67-2.67 1-4 1s-2.67-.33-4-1" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;

interface InputFieldProps {
    id: string;
    type: string;
    placeholder: string;
    icon: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ id, type, placeholder, icon }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
        </div>
        <input 
            type={type} 
            id={id} 
            name={id}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500" 
            placeholder={placeholder}
            required
        />
    </div>
);


const LoginModal: React.FC<{ onClose: () => void, onLoginSuccess: () => void }> = ({ onClose, onLoginSuccess }) => {
    const [view, setView] = useState<'login' | 'register'>('login');
    const [loginMethod, setLoginMethod] = useState<'password' | 'code'>('password');
    const [registerAs, setRegisterAs] = useState<'buyer' | 'seller'>('buyer');
    
    const handleSendCode = () => {
        console.log('Sending verification code...');
        alert('验证码已发送（模拟）');
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onLoginSuccess();
    }

    const renderLoginForm = () => (
      <div>
        <div className="flex border-b mb-6">
          <button onClick={() => setLoginMethod('password')} className={`flex-1 py-2 text-center font-semibold ${loginMethod === 'password' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}>密码登录</button>
          <button onClick={() => setLoginMethod('code')} className={`flex-1 py-2 text-center font-semibold ${loginMethod === 'code' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}>验证码登录</button>
        </div>
        {loginMethod === 'password' ? (
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <InputField id="username" type="text" placeholder="用户名/邮箱/手机号" icon={<UserIcon />} />
            <InputField id="password" type="password" placeholder="密码" icon={<LockIcon />} />
             <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => alert('忘记密码功能开发中')} className="font-medium text-green-600 hover:text-green-500">忘记密码?</button>
                <span>没有账号? <button type="button" onClick={() => setView('register')} className="font-medium text-green-600 hover:text-green-500">立即注册</button></span>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors">登录</button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleFormSubmit}>
             <InputField id="phone_email" type="text" placeholder="邮箱/手机号" icon={<MailIcon />} />
             <div className="flex items-center space-x-2">
                <div className="flex-grow">
                    <InputField id="code" type="text" placeholder="验证码" icon={<ShieldIcon />} />
                </div>
                <button type="button" onClick={handleSendCode} className="flex-shrink-0 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">发送验证码</button>
             </div>
             <div className="text-sm">
                <span>已有账号? <button type="button" onClick={() => setLoginMethod('password')} className="font-medium text-green-600 hover:text-green-500">密码登录</button></span>
            </div>
             <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors">登录</button>
          </form>
        )}
      </div>
    );

    const renderRegisterForm = () => (
        <div>
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">注册新账号</h2>
            <div className="flex justify-center space-x-4 mb-6">
                <button onClick={() => setRegisterAs('buyer')} className={`px-6 py-2 rounded-full font-semibold transition-colors ${registerAs === 'buyer' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>我是买家</button>
                <button onClick={() => setRegisterAs('seller')} className={`px-6 py-2 rounded-full font-semibold transition-colors ${registerAs === 'seller' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>我是卖家</button>
            </div>
             <form className="space-y-4" onSubmit={handleFormSubmit}>
                <InputField id="real_name" type="text" placeholder="真实姓名" icon={<UserIcon />} />
                <InputField id="id_card" type="text" placeholder="身份证号" icon={<IdCardIcon />} />
                <InputField id="phone" type="text" placeholder="手机号" icon={<PhoneIcon />} />
                {/* Email is optional, so remove the required attribute from the base component for this one instance */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><MailIcon/></div>
                   <input type="email" id="email" name="email" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500" placeholder="邮箱 (可选)"/>
                </div>

                 <div className="flex items-center space-x-2">
                    <div className="flex-grow">
                        <InputField id="register_code" type="text" placeholder="验证码" icon={<ShieldIcon />} />
                    </div>
                    <button type="button" onClick={handleSendCode} className="flex-shrink-0 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">发送验证码</button>
                 </div>
                <InputField id="register_password" type="password" placeholder="密码" icon={<LockIcon />} />
                {registerAs === 'seller' && (
                    <InputField id="address" type="text" placeholder="地址" icon={<LocationIcon />} />
                )}
                <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors">注册账号</button>
                <div className="text-center text-sm">
                    <button type="button" onClick={() => setView('login')} className="font-medium text-green-600 hover:text-green-500">&larr; 返回登录</button>
                </div>
            </form>
        </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex overflow-hidden transform animate-scale-up">
            {/* Left Pane - QR Code */}
            <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-green-50 p-8">
                <h3 className="text-2xl font-bold text-green-800">使用App扫码登录</h3>
                <p className="text-gray-600 mt-2 mb-4">安全、快捷</p>
                <div className="w-48 h-48 bg-gray-300 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 8h16M4 16h16" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 4v16m8-16v16" /></svg>
                </div>
                 <p className="text-sm text-gray-500 mt-4">请使用 智农链APP 扫描</p>
            </div>
            {/* Right Pane - Form */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 relative">
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
                 {view === 'login' ? renderLoginForm() : renderRegisterForm()}
            </div>
        </div>
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scale-up {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default LoginModal;