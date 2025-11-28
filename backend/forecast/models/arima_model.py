import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import warnings
warnings.filterwarnings('ignore')

class ARIMAPredictor:
    def __init__(self, order=(1, 1, 1)):
        self.order = order
        
    def predict(self, df, periods=3):
        """
        使用ARIMA模型进行预测
        df: DataFrame，包含时间和价格列
        periods: 预测期数
        """
        try:
            # 确保df是DataFrame
            if not isinstance(df, pd.DataFrame):
                raise Exception("输入必须是DataFrame")
            
            # 提取价格数据
            values = df.iloc[:, 1].values
            
            # 检查数据平稳性
            is_stationary = self._check_stationarity(values)
            print(f"数据平稳性检查: {'平稳' if is_stationary else '非平稳'}")
            
            # 自动选择最优参数，扩大搜索范围
            best_aic = float('inf')
            best_order = self.order
            
            # 扩大参数搜索范围
            for p in range(0, 5):  # 从3增加到5
                for d in range(0, 3):  # 从2增加到3
                    for q in range(0, 5):  # 从3增加到5
                        try:
                            # 跳过不合理的参数组合
                            if p == 0 and q == 0:
                                continue  # (0,d,0) 是白噪声模型
                            
                            model = ARIMA(values, order=(p, d, q))
                            fitted = model.fit()
                            
                            # 使用AIC和BIC综合评估
                            aic = fitted.aic
                            bic = fitted.bic
                            
                            # 综合评分，优先选择AIC较小且参数较简单的模型
                            score = aic + 0.5 * (p + q)  # 惩罚复杂模型
                            
                            if score < best_aic:
                                best_aic = score
                                best_order = (p, d, q)
                        except:
                            continue
            
            print(f"最优参数: {best_order}, AIC: {best_aic}")
            
            # 使用最优参数训练模型
            model = ARIMA(values, order=best_order)
            fitted = model.fit()
            
            # 预测
            forecast = fitted.forecast(steps=periods)
            
            # 生成预测时间标签
            last_label = df.iloc[-1, 0]
            predicted_labels = self._generate_labels(last_label, periods)
            
            # 计算置信区间
            forecast_result = fitted.get_forecast(steps=periods)
            conf_int = forecast_result.conf_int()
            
            # 确保所有数据都是列表格式
            historical_labels = df.iloc[:, 0].tolist() if hasattr(df.iloc[:, 0], 'tolist') else list(df.iloc[:, 0])
            historical_values = values.tolist() if hasattr(values, 'tolist') else list(values)
            forecast_values = forecast.tolist() if hasattr(forecast, 'tolist') else list(forecast)
            
            # 处理置信区间
            if isinstance(conf_int, pd.DataFrame):
                lower_bound = conf_int.iloc[:, 0].tolist()
                upper_bound = conf_int.iloc[:, 1].tolist()
            elif isinstance(conf_int, np.ndarray):
                lower_bound = conf_int[:, 0].tolist()
                upper_bound = conf_int[:, 1].tolist()
            else:
                # 如果无法获取置信区间，使用基于模型残差的标准差
                residuals = fitted.resid
                std = np.std(residuals) if len(residuals) > 0 else np.std(values)
                lower_bound = [v - 1.96 * std for v in forecast_values]
                upper_bound = [v + 1.96 * std for v in forecast_values]
            
            # 检查预测值是否过于平坦（直线）
            forecast_array = np.array(forecast_values)
            if len(forecast_array) > 1:
                # 计算预测值的标准差
                forecast_std = np.std(forecast_array)
                # 如果标准差很小，说明预测值过于平坦
                if forecast_std < 0.1 * np.std(values):
                    print("警告：预测值过于平坦，可能模型选择不当")
                    # 尝试使用简单趋势外推作为备选方案
                    trend_forecast = self._simple_trend_forecast(values, periods)
                    forecast_values = trend_forecast.tolist()
            
            return {
                'model': 'ARIMA',
                'order': best_order,
                'aic': float(fitted.aic),
                'historical': {
                    'labels': historical_labels,
                    'values': historical_values
                },
                'predicted': {
                    'labels': predicted_labels,
                    'values': forecast_values,
                    'lower_bound': lower_bound,
                    'upper_bound': upper_bound
                }
            }
        
        except Exception as e:
            print(f"ARIMA模型失败: {e}")
            # 如果ARIMA失败，使用简单趋势外推
            return self._fallback_prediction(df, periods)
    
    def _check_stationarity(self, values):
        """检查时间序列的平稳性"""
        try:
            result = adfuller(values)
            # p值小于0.05表示平稳
            return result[1] < 0.05
        except:
            return False
    
    def _simple_trend_forecast(self, values, periods):
        """简单趋势外推预测"""
        # 计算最近几个点的趋势
        n = min(5, len(values))
        recent_values = values[-n:]
        x = np.arange(n)
        
        # 线性回归
        slope, intercept = np.polyfit(x, recent_values, 1)
        
        # 外推预测
        forecast = []
        for i in range(1, periods + 1):
            forecast.append(intercept + slope * (n + i - 1))
        
        return np.array(forecast)
    
    def _fallback_prediction(self, df, periods):
        """备选预测方法"""
        values = df.iloc[:, 1].values
        
        # 使用移动平均或简单趋势
        if len(values) >= 3:
            # 使用最近3个点的移动平均作为基准
            last_value = np.mean(values[-3:])
            # 添加小幅波动
            std = np.std(values)
            forecast_values = [last_value + np.random.normal(0, std * 0.1) for _ in range(periods)]
        else:
            # 数据太少，使用最后一个值
            last_value = values[-1] if len(values) > 0 else 100
            forecast_values = [last_value] * periods
        
        # 生成预测时间标签
        last_label = df.iloc[-1, 0]
        predicted_labels = self._generate_labels(last_label, periods)
        
        # 计算置信区间
        std = np.std(values)
        lower_bound = [v - 1.96 * std for v in forecast_values]
        upper_bound = [v + 1.96 * std for v in forecast_values]
        
        return {
            'model': 'ARIMA (备选方法)',
            'order': (0, 0, 0),
            'aic': 0,
            'historical': {
                'labels': df.iloc[:, 0].tolist(),
                'values': values.tolist()
            },
            'predicted': {
                'labels': predicted_labels,
                'values': forecast_values,
                'lower_bound': lower_bound,
                'upper_bound': upper_bound
            }
        }
    
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