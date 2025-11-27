/**
 * Windows 服务卸载脚本
 * 
 * 注意: 需要管理员权限运行
 */

const Service = require('node-windows').Service;
const path = require('path');

// 创建服务对象（需要与安装时相同的配置）
const svc = new Service({
  name: 'AgriPricePrediction',
  script: path.join(__dirname, 'auto-predict.js')
});

// 监听卸载事件
svc.on('uninstall', () => {
  console.log('服务卸载成功！');
});

svc.on('alreadyuninstalled', () => {
  console.log('服务未安装');
});

svc.on('error', (err) => {
  console.error('卸载错误:', err);
});

// 卸载服务
console.log('正在卸载 Windows 服务...');
console.log('注意: 需要管理员权限');
svc.uninstall();
