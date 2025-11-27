from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
from models.arima_model import ARIMAPredictor
from models.lstm_model import LSTMPredictor
from utils.data_loader import DataLoader

app = Flask(__name__)
CORS(app)  # 启用CORS支持前后端分离

# 初始化数据加载器
data_loader = DataLoader()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    预测接口
    参数:
        - region: 'national' 或 'beijing'
        - data_type: 'annual' 或 'monthly'
        - model: 'arima' 或 'lstm'
        - periods: 预测期数
        - category: 月度数据类别（可选）
        - product: 具体产品（可选）
    """
    try:
        data = request.json
        region = data.get('region', 'national')
        data_type = data.get('data_type', 'annual')
        model_type = data.get('model', 'arima')
        periods = int(data.get('periods', 3))
        category = data.get('category')
        product = data.get('product')
        
        # 加载数据
        df = data_loader.load_data(region, data_type, category, product)
        
        if df is None or df.empty:
            return jsonify({'error': '数据加载失败'}), 400
        
        # 选择模型进行预测
        if model_type == 'arima':
            predictor = ARIMAPredictor()
        else:
            predictor = LSTMPredictor()
        
        result = predictor.predict(df, periods)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/<region>/<data_type>')
def get_data(region, data_type):
    """获取历史数据"""
    try:
        df = data_loader.load_data(region, data_type)
        if df is None:
            return jsonify({'error': '数据不存在'}), 404
        
        return jsonify(data_loader.format_data(df))
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/compare', methods=['POST'])
def compare_models():
    """对比ARIMA和LSTM模型"""
    try:
        data = request.json
        region = data.get('region', 'national')
        data_type = data.get('data_type', 'annual')
        periods = int(data.get('periods', 3))
        
        df = data_loader.load_data(region, data_type)
        if df is None or df.empty:
            return jsonify({'error': '数据加载失败'}), 400
        
        # ARIMA预测
        arima_predictor = ARIMAPredictor()
        arima_result = arima_predictor.predict(df, periods)
        
        # LSTM预测
        lstm_predictor = LSTMPredictor(epochs=30)
        lstm_result = lstm_predictor.predict(df, periods)
        
        return jsonify({
            'arima': arima_result,
            'lstm': lstm_result
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/statistics/<region>/<data_type>')
def get_statistics(region, data_type):
    """获取数据统计信息"""
    try:
        category = request.args.get('category')
        product = request.args.get('product')
        
        df = data_loader.load_data(region, data_type, category, product)
        if df is None or df.empty:
            return jsonify({'error': '数据不存在'}), 404
        
        values = df.iloc[:, 1].values
        
        # 计算更多统计指标
        stats = {
            'mean': float(np.mean(values)),
            'median': float(np.median(values)),
            'std': float(np.std(values)),
            'min': float(np.min(values)),
            'max': float(np.max(values)),
            'range': float(np.max(values) - np.min(values)),  # 极差
            'q1': float(np.percentile(values, 25)),  # 第一四分位数
            'q3': float(np.percentile(values, 75)),  # 第三四分位数
            'iqr': float(np.percentile(values, 75) - np.percentile(values, 25)),  # 四分位距
            'cv': float(np.std(values) / np.mean(values) * 100) if np.mean(values) != 0 else 0,  # 变异系数
            'count': int(len(values)),
            'trend': 'up' if values[-1] > values[0] else 'down',
            'change_rate': float((values[-1] - values[0]) / values[0] * 100)
        }
        
        return jsonify(stats)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories')
def get_categories():
    """获取月度数据类别列表"""
    try:
        categories = data_loader.get_monthly_categories()
        return jsonify(categories)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<category>')
def get_products(category):
    """获取指定类别下的产品列表"""
    try:
        products = data_loader.get_products_by_category(category)
        return jsonify({'products': products})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
