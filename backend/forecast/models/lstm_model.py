import pandas as pd
import numpy as np
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import warnings
warnings.filterwarnings('ignore')

class LSTMPredictor:
    def __init__(self, lookback=3, epochs=50):
        self.lookback = lookback
        self.epochs = epochs
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        
    def predict(self, df, periods=3):
        """
        使用LSTM模型进行预测
        df: DataFrame，包含时间和价格列
        periods: 预测期数
        """
        try:
            # 提取价格数据
            values = df.iloc[:, 1].values.reshape(-1, 1)
            
            # 数据标准化
            scaled_data = self.scaler.fit_transform(values)
            
            # 准备训练数据
            X, y = self._create_dataset(scaled_data, self.lookback)
            
            if len(X) < 3:
                raise Exception("数据量不足，至少需要4个数据点")
            
            # 重塑输入数据为 [samples, time steps, features]
            X = X.reshape((X.shape[0], X.shape[1], 1))
            
            # 构建LSTM模型
            model = Sequential([
                LSTM(50, activation='relu', return_sequences=True, input_shape=(self.lookback, 1)),
                Dropout(0.2),
                LSTM(50, activation='relu'),
                Dropout(0.2),
                Dense(1)
            ])
            
            model.compile(optimizer='adam', loss='mse')
            
            # 训练模型
            model.fit(X, y, epochs=self.epochs, batch_size=1, verbose=0)
            
            # 预测
            predictions = []
            current_batch = scaled_data[-self.lookback:].reshape(1, self.lookback, 1)
            
            for i in range(periods):
                pred = model.predict(current_batch, verbose=0)[0]
                predictions.append(pred[0])
                current_batch = np.append(current_batch[:, 1:, :], [[pred]], axis=1)
            
            # 反标准化
            predictions = self.scaler.inverse_transform(np.array(predictions).reshape(-1, 1))
            
            # 生成预测时间标签
            last_label = df.iloc[-1, 0]
            predicted_labels = self._generate_labels(last_label, periods)
            
            # 计算简单的置信区间（基于历史波动）
            std = np.std(values)
            lower_bound = predictions.flatten() - 1.96 * std
            upper_bound = predictions.flatten() + 1.96 * std
            
            return {
                'model': 'LSTM',
                'lookback': self.lookback,
                'epochs': self.epochs,
                'historical': {
                    'labels': df.iloc[:, 0].tolist(),
                    'values': values.flatten().tolist()
                },
                'predicted': {
                    'labels': predicted_labels,
                    'values': predictions.flatten().tolist(),
                    'lower_bound': lower_bound.tolist(),
                    'upper_bound': upper_bound.tolist()
                }
            }
        
        except Exception as e:
            raise Exception(f"LSTM预测失败: {str(e)}")
    
    def _create_dataset(self, data, lookback):
        """创建时间序列数据集"""
        X, y = [], []
        for i in range(len(data) - lookback):
            X.append(data[i:i + lookback, 0])
            y.append(data[i + lookback, 0])
        return np.array(X), np.array(y)
    
    def _generate_labels(self, last_label, periods):
        """生成预测标签"""
        labels = []
        label_str = str(last_label).strip()
        
        if '年' in label_str and '月' in label_str:
            # 月度数据，格式如 "2025年10月" 或 "202510月"
            try:
                # 移除所有空格
                label_str = label_str.replace(' ', '')
                
                # 尝试解析 "2025年10月" 格式
                if '年' in label_str:
                    year_part = label_str.split('年')[0]
                    month_part = label_str.split('年')[1].replace('月', '')
                    year = int(year_part)
                    month = int(month_part)
                else:
                    # 如果没有"年"字，尝试其他格式
                    raise ValueError("无法解析月份格式")
                
                for i in range(1, periods + 1):
                    month += 1
                    if month > 12:
                        month = 1
                        year += 1
                    labels.append(f"{year}年{month}月")
            except Exception as e:
                print(f"解析月度标签失败: {label_str}, 错误: {e}")
                # 使用简单的递增标签
                labels = [f"预测+{i}月" for i in range(1, periods + 1)]
        elif '年' in label_str:
            # 年度数据
            try:
                year = int(label_str.replace('年', ''))
                for i in range(1, periods + 1):
                    labels.append(f"{year + i}年")
            except:
                labels = [f"预测+{i}年" for i in range(1, periods + 1)]
        else:
            labels = [f"T+{i}" for i in range(1, periods + 1)]
        
        return labels
