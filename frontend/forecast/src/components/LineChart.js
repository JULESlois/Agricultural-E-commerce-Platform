import React from 'react';
import ReactECharts from 'echarts-for-react';

const LineChart = ({ data }) => {
  // 准备置信区间的可视化区域数据
  const confidenceAreaData = [];
  for (let i = 0; i < data.historical.labels.length; i++) {
    confidenceAreaData.push([i, null, null]);
  }
  for (let i = 0; i < data.predicted.labels.length; i++) {
    const idx = data.historical.labels.length + i;
    confidenceAreaData.push([
      idx,
      data.predicted.lower_bound[i],
      data.predicted.upper_bound[i]
    ]);
  }

  // 莫兰迪色系紫色
  const morandiPurple = '#9b7eae';
  const morandiPurpleTransparent = 'rgba(155, 126, 174, 0.3)';

  const option = {
    title: {
      text: `${data.model} 模型预测结果`,
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5a7a6f'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['历史数据', '预测数据', '置信区间上界', '置信区间下界'],
      top: 40
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [...data.historical.labels, ...data.predicted.labels],
      axisLabel: {
        rotate: 45,
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      name: '价格指数/价格',
      nameTextStyle: {
        color: '#5a7a6f'
      },
      axisLabel: {
        formatter: '{value}',
        color: '#666'
      }
    },
    series: [
      // 置信区间填充 - 使用正确的区域图实现，确保半透明效果
      {
        name: '置信区间',
        type: 'line',
        data: confidenceAreaData.map(item => item[1]), // 下界数据
        lineStyle: {
          opacity: 0
        },
        stack: 'confidence',
        symbol: 'none',
        areaStyle: {
          color: 'transparent'
        },
        z: 0
      },
      {
        type: 'line',
        data: confidenceAreaData.map(item => item[2] && item[1] ? item[2] - item[1] : null), // 区间高度
        lineStyle: {
          opacity: 0
        },
        stack: 'confidence',
        symbol: 'none',
        areaStyle: {
          color: morandiPurpleTransparent
        },
        z: 1
      },
      // 历史数据 - 保持不变
      {
        name: '历史数据',
        type: 'line',
        data: [...data.historical.values, ...Array(data.predicted.labels.length).fill(null)],
        itemStyle: {
          color: '#5a7a6f'
        },
        lineStyle: {
          width: 3
        },
        symbol: 'circle',
        symbolSize: 8,
        z: 3
      },
      // 预测数据 - 保持不变
      {
        name: '预测数据',
        type: 'line',
        data: [...Array(data.historical.labels.length).fill(null), ...data.predicted.values],
        itemStyle: {
          color: '#c98b8b'
        },
        lineStyle: {
          width: 3,
          type: 'dashed'
        },
        symbol: 'diamond',
        symbolSize: 10,
        z: 3
      },
      // 置信区间上界 - 更改为莫兰迪色系紫色
      {
        name: '置信区间上界',
        type: 'line',
        data: [...Array(data.historical.labels.length).fill(null), ...data.predicted.upper_bound],
        lineStyle: {
          color: morandiPurple,
          width: 2,
          type: 'dotted'
        },
        itemStyle: {
          color: morandiPurple
        },
        symbol: 'none',
        z: 2
      },
      // 置信区间下界 - 更改为莫兰迪色系紫色
      {
        name: '置信区间下界',
        type: 'line',
        data: [...Array(data.historical.labels.length).fill(null), ...data.predicted.lower_bound],
        lineStyle: {
          color: morandiPurple,
          width: 2,
          type: 'dotted'
        },
        itemStyle: {
          color: morandiPurple
        },
        symbol: 'none',
        z: 2
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '500px' }} />;
};

export default LineChart;