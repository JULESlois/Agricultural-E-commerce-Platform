import React from 'react';
import ReactECharts from 'echarts-for-react';

const CompareChart = ({ data }) => {
  const { arima, lstm } = data;

  const option = {
    title: {
      text: 'ARIMA vs LSTM 模型对比',
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
      data: ['历史数据', 'ARIMA预测', 'LSTM预测'],
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
      data: [...arima.historical.labels, ...arima.predicted.labels],
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
        type: 'line',
        data: [...arima.historical.values, ...Array(arima.predicted.labels.length).fill(null)],
        itemStyle: {
          color: '#5a7a6f'
        },
        lineStyle: {
          width: 3
        },
        symbol: 'circle',
        symbolSize: 8
      },
      {
        name: 'ARIMA预测',
        type: 'line',
        data: [...Array(arima.historical.labels.length).fill(null), ...arima.predicted.values],
        itemStyle: {
          color: '#c98b8b'
        },
        lineStyle: {
          width: 3,
          type: 'dashed'
        },
        symbol: 'diamond',
        symbolSize: 10
      },
      {
        name: 'LSTM预测',
        type: 'line',
        data: [...Array(lstm.historical.labels.length).fill(null), ...lstm.predicted.values],
        itemStyle: {
          color: '#8ba3b5'
        },
        lineStyle: {
          width: 3,
          type: 'dashed'
        },
        symbol: 'triangle',
        symbolSize: 10
      }
    ]
  };

  return (
    <div>
      <ReactECharts option={option} style={{ height: '500px' }} />
      
      {/* 模型信息对比 */}
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ textAlign: 'center', padding: 20, background: '#fef9f5', borderRadius: 8, flex: 1, margin: '0 10px', border: '1px solid #e8ddd0' }}>
          <h3 style={{ color: '#5a7a6f' }}>ARIMA 模型</h3>
          <p style={{ color: '#666' }}>参数: ({arima.order[0]}, {arima.order[1]}, {arima.order[2]})</p>
          <p style={{ color: '#666' }}>AIC: {arima.aic.toFixed(2)}</p>
          <p style={{ color: '#c98b8b', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
            预测均值: {(arima.predicted.values.reduce((a, b) => a + b, 0) / arima.predicted.values.length).toFixed(2)}
          </p>
        </div>
        
        <div style={{ textAlign: 'center', padding: 20, background: '#f5f8fa', borderRadius: 8, flex: 1, margin: '0 10px', border: '1px solid #d4dfe8' }}>
          <h3 style={{ color: '#5a7a6f' }}>LSTM 模型</h3>
          <p style={{ color: '#666' }}>回溯窗口: {lstm.lookback}</p>
          <p style={{ color: '#666' }}>训练轮数: {lstm.epochs}</p>
          <p style={{ color: '#8ba3b5', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
            预测均值: {(lstm.predicted.values.reduce((a, b) => a + b, 0) / lstm.predicted.values.length).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompareChart;
