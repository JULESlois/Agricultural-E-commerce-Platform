/**
 * Windows 服务安装脚本
 * 
 * 使用 node-windows 将预测服务安装为 Windows 服务
 * 需要先安装: npm install -g node-windows
 * 
 * 注意: 需要管理员权限运行
 */

const Service = require('node-windows').Service;
const path = require('path');

// 创建服务对象
const svc = new Service({
  name: 'AgriPricePrediction',
  description: '农产品价格自动预测服务',
  script: path.join(__dirname, 'auto-predict.js'),
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ],
  env: [
    {
      name: "NODE_ENV",
      value: "production"
    }
  ]
});

// 监听安装事件
svc.on('install', () => {
  console.log('服务安装成功！');
  console.log('服务名称: AgriPricePrediction');
  console.log('');
  console.log('管理命令:');
  console.log('  启动服务: net start AgriPricePrediction');
  console.log('  停止服务: net stop AgriPricePrediction');
  console.log('  卸载服务: node uninstall-service.js');
  
  svc.start();
});

svc.on('alreadyinstalled', () => {
  console.log('服务已经安装');
});

svc.on('start', () => {
  console.log('服务已启动');
});

svc.on('error', (err) => {
  console.error('服务错误:', err);
});

// 安装服务
console.log('正在安装 Windows 服务...');
console.log('注意: 需要管理员权限');
svc.install();
