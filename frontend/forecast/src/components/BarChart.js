import React from 'react';
import ReactECharts from 'echarts-for-react';

const BarChart = ({ data }) => {
  const option = {
    title: {
      text: '预测值对比',
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
        type: 'shadow'
      }
    },
    legend: {
      data: ['历史数据', '预测数据'],
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
        color: '#666'
      }
    },
    series: [
      {
        name: '历史数据',
        type: 'bar',
        data: [...data.historical.values, ...Array(data.predicted.labels.length).fill(null)],
        itemStyle: {
          color: '#8ba3b5'
        },
        barWidth: '60%'
      },
      {
        name: '预测数据',
        type: 'bar',
        data: [...Array(data.historical.labels.length).fill(null), ...data.predicted.values],
        itemStyle: {
          color: '#d4a88b'
        },
        barWidth: '60%'
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '500px' }} />;
};

export default BarChart;
