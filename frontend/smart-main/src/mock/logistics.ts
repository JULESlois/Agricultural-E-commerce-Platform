import { LogisticsInfo } from '../../types';
import { MOCK_LOGISTICS } from '../../constants';

export const logisticsByTracking: Record<string, LogisticsInfo> = {
  [MOCK_LOGISTICS.trackingNo]: MOCK_LOGISTICS,
  SF0000000001: {
    trackingNo: 'SF0000000001',
    company: '顺丰速运',
    status: '已签收',
    steps: [
      { time: '2025-09-21 10:00', location: '杭州滨江', status: '派送中', description: '快递员正在派送' },
      { time: '2025-09-21 12:20', location: '杭州滨江', status: '已签收', description: '客户本人签收' },
    ],
    coldChainData: [
      { time: '10:00', temp: 3.9 },
      { time: '12:00', temp: 4.1 },
    ],
  },
};
