import React from 'react';
import type { Announcement } from '../types';

const announcementData: Announcement[] = [
    { id: 1, title: '关于平台系统维护升级的通知', date: '2023-11-01' },
    { id: 2, title: '“惠农贷”2023年第四季度申请指南', date: '2023-10-28' },
    { id: 3, title: '平台用户隐私政策更新声明', date: '2023-10-20' },
    { id: 4, title: '严厉打击虚假农产品信息的公告', date: '2023-10-15' },
    { id: 5, title: '国庆节期间平台服务安排通知', date: '2023-09-30' },
];

const Announcements: React.FC = () => {
  const handleAnnouncementClick = (title: string) => {
    console.log(`Navigating to announcement: ${title}`);
    // In a real app, you would navigate to the announcement's detail page.
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h3 className="text-2xl font-bold text-green-900 border-b-2 border-green-200 pb-2 mb-4 flex-shrink-0">公告栏</h3>
      <ul className="space-y-3 overflow-y-auto">
        {announcementData.map(item => (
          <li key={item.id}>
            <button 
              onClick={() => handleAnnouncementClick(item.title)} 
              className="w-full flex justify-between items-center group text-gray-700 hover:text-green-700 transition-colors text-left"
            >
                <span className="group-hover:underline truncate pr-4">{item.title}</span>
                <span className="text-gray-500 flex-shrink-0 text-sm">{item.date}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcements;