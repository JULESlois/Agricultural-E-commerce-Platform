import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-900 text-white">
      <div className="container mx-auto px-4 py-8 text-center text-gray-300">
        <div className="space-y-2">
            <p>地址：北京市海淀区中关村大街001号 邮编：100086</p>
            <p>联系电话：010-12345678 | 电子邮箱：contact@zhinonglian.gov.cn</p>
            <p>
                <span>&copy; 2023 智农链平台 版权所有</span>
                <span className="mx-2">|</span>
                <a href="#" className="hover:text-lime-300 transition-colors">京ICP备12345678号-1</a>
            </p>
             <p>技术支持：智慧农业技术有限公司</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;