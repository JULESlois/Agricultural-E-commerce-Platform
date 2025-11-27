import pandas as pd
import numpy as np
import os

class DataLoader:
    def __init__(self):
        self.encoding = 'gb18030'
        # 添加数据目录路径
        self.data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
    
    def load_data(self, region, data_type, category=None, product=None):
        """
        加载数据 - 整合所有可用CSV数据
        region: 'national' 或 'beijing'
        data_type: 'annual' 或 'monthly'
        category: 月度数据类别 ('grain', 'vegetable', 'fruit', 'livestock', 'aquatic', 'economic')
        product: 具体产品名称（如 '大白菜'）
        """
        try:
            if region == 'national' and data_type == 'annual':
                return self._load_national_annual()
            elif region == 'national' and data_type == 'monthly':
                return self._load_national_monthly(category, product)
            elif region == 'beijing' and data_type == 'annual':
                return self._load_beijing_annual()
            else:
                return None
        except Exception as e:
            print(f"数据加载错误: {e}")
            return None
    
    def get_monthly_categories(self):
        """获取月度数据类别列表"""
        return {
            'grain': '粮食价格',
            'vegetable': '蔬菜价格',
            'fruit': '水果价格',
            'livestock': '畜产品价格',
            'aquatic': '水产品价格',
            'economic': '经济作物价格'
        }
    
    def get_products_by_category(self, category):
        """获取指定类别下的所有产品"""
        category_files = {
            'grain': '粮食价格-月度数据.csv',
            'vegetable': '蔬菜价格-月度数据.csv',
            'fruit': '水果价格-月度数据.csv',
            'livestock': '畜产品价格-月度数据.csv',
            'aquatic': '水产品价格-月度数据.csv',
            'economic': '经济作物价格-月度数据.csv'
        }
        
        filename = category_files.get(category)
        if not filename:
            return []
        
        # 添加数据目录路径
        full_path = os.path.join(self.data_dir, filename)
        if not os.path.exists(full_path):
            return []
        
        try:
            df = pd.read_csv(full_path, encoding=self.encoding, skiprows=2)
            products = []
            
            for idx in range(len(df)):
                indicator = df.iloc[idx, 0]
                if '当期值' in str(indicator) and '元' in str(indicator):
                    # 提取产品名称
                    product_name = str(indicator).split('（')[0]
                    products.append(product_name)
            
            return products
        except Exception as e:
            print(f"获取产品列表失败: {e}")
            return []
    
    def _load_national_annual(self):
        """加载全国年度数据 - 整合多个指标"""
        # 更新文件路径
        filename = os.path.join(self.data_dir, '农产品价格指数-年度数据.csv')
        df = pd.read_csv(filename, encoding=self.encoding, skiprows=2)
        
        # 提取所有有效的价格指数行（包含足够数据点的行）
        all_data = []
        
        for idx in range(len(df)):
            row_data = df.iloc[idx:idx+1].T
            row_data.columns = ['价格指数']
            row_data = row_data.iloc[1:]  # 跳过指标名称
            row_data['价格指数'] = pd.to_numeric(row_data['价格指数'], errors='coerce')
            row_data = row_data.dropna()
            
            # 只保留有足够数据点的指标（至少5个）
            if len(row_data) >= 5:
                all_data.append(row_data['价格指数'].values)
        
        # 计算所有指标的平均值作为综合指数
        if all_data:
            # 找到最长的数据序列长度
            max_len = max(len(d) for d in all_data)
            years = df.columns[1:max_len+1].tolist()
            
            # 对齐所有数据并计算平均值
            aligned_data = []
            for data in all_data:
                if len(data) == max_len:
                    aligned_data.append(data)
            
            if aligned_data:
                avg_values = np.mean(aligned_data, axis=0)
                result_df = pd.DataFrame({
                    '年份': years,
                    '价格指数': avg_values
                })
                result_df = result_df.sort_values('年份')
                return result_df
        
        # 如果整合失败，返回第一行数据
        df = pd.read_csv(filename, encoding=self.encoding, skiprows=2)
        df = df.iloc[0:1].T
        df.columns = ['价格指数']
        df = df.iloc[1:]
        df.index.name = '年份'
        df = df.reset_index()
        df['价格指数'] = pd.to_numeric(df['价格指数'], errors='coerce')
        df = df.dropna()
        df = df.sort_values('年份')
        return df
    
    def _load_national_monthly(self, category=None, product=None):
        """加载全国月度数据 - 支持按类别和产品筛选"""
        
        # 如果指定了类别和产品，加载特定产品数据
        if category and product:
            return self._load_specific_product(category, product)
        
        # 如果只指定了类别，加载该类别的平均数据
        if category:
            return self._load_category_average(category)
        
        # 否则加载所有类别的平均数据
        monthly_files = [
            '粮食价格-月度数据.csv',
            '蔬菜价格-月度数据.csv',
            '水果价格-月度数据.csv',
            '畜产品价格-月度数据.csv',
            '水产品价格-月度数据.csv',
            '经济作物价格-月度数据.csv'
        ]
        
        all_monthly_data = []
        
        for filename in monthly_files:
            # 更新文件路径
            full_path = os.path.join(self.data_dir, filename)
            if not os.path.exists(full_path):
                continue
                
            try:
                df = pd.read_csv(full_path, encoding=self.encoding, skiprows=2)
                
                # 提取所有"当期值"行（实际价格，非增长率）
                for idx in range(len(df)):
                    indicator = df.iloc[idx, 0]
                    if '当期值' in str(indicator) and '元' in str(indicator):
                        row_data = df.iloc[idx:idx+1].T
                        row_data.columns = ['价格']
                        row_data = row_data.iloc[1:]
                        row_data['价格'] = pd.to_numeric(row_data['价格'], errors='coerce')
                        row_data = row_data.dropna()
                        
                        if len(row_data) >= 10:  # 至少10个月的数据
                            all_monthly_data.append(row_data['价格'].values)
                        break  # 每个文件只取第一个当期值指标
                        
            except Exception as e:
                print(f"读取 {filename} 失败: {e}")
                continue
        
        if all_monthly_data:
            # 找到最长的数据序列
            max_len = max(len(d) for d in all_monthly_data)
            
            # 读取时间标签（从粮食价格文件）
            df_time_path = os.path.join(self.data_dir, '粮食价格-月度数据.csv')
            df_time = pd.read_csv(df_time_path, encoding=self.encoding, skiprows=2)
            time_labels = df_time.columns[1:max_len+1].tolist()
            
            # 对齐数据并计算平均值
            aligned_data = []
            for data in all_monthly_data:
                if len(data) == max_len:
                    aligned_data.append(data)
            
            if aligned_data:
                avg_values = np.mean(aligned_data, axis=0)
                result_df = pd.DataFrame({
                    '月份': time_labels,
                    '价格': avg_values
                })
                # 反转顺序，使时间从旧到新
                result_df = result_df.iloc[::-1].reset_index(drop=True)
                return result_df
        
        # 如果整合失败，返回粮食价格数据
        fallback_path = os.path.join(self.data_dir, '粮食价格-月度数据.csv')
        df = pd.read_csv(fallback_path, encoding=self.encoding, skiprows=2)
        df = df.iloc[0:1].T
        df.columns = ['价格']
        df = df.iloc[1:]
        df.index.name = '月份'
        df = df.reset_index()
        df['价格'] = pd.to_numeric(df['价格'], errors='coerce')
        df = df.dropna()
        df = df.iloc[::-1].reset_index(drop=True)
        return df
    
    def _load_category_average(self, category):
        """加载指定类别的平均数据"""
        category_files = {
            'grain': '粮食价格-月度数据.csv',
            'vegetable': '蔬菜价格-月度数据.csv',
            'fruit': '水果价格-月度数据.csv',
            'livestock': '畜产品价格-月度数据.csv',
            'aquatic': '水产品价格-月度数据.csv',
            'economic': '经济作物价格-月度数据.csv'
        }
        
        filename = category_files.get(category)
        if not filename:
            return None
        
        # 更新文件路径
        full_path = os.path.join(self.data_dir, filename)
        if not os.path.exists(full_path):
            return None
        
        try:
            df = pd.read_csv(full_path, encoding=self.encoding, skiprows=2)
            all_products_data = []
            
            # 提取所有产品的当期值数据
            for idx in range(len(df)):
                indicator = df.iloc[idx, 0]
                if '当期值' in str(indicator) and '元' in str(indicator):
                    row_data = df.iloc[idx:idx+1].T
                    row_data.columns = ['价格']
                    row_data = row_data.iloc[1:]
                    row_data['价格'] = pd.to_numeric(row_data['价格'], errors='coerce')
                    row_data = row_data.dropna()
                    
                    if len(row_data) >= 10:
                        all_products_data.append(row_data['价格'].values)
            
            if all_products_data:
                max_len = max(len(d) for d in all_products_data)
                time_labels = df.columns[1:max_len+1].tolist()
                
                aligned_data = [d for d in all_products_data if len(d) == max_len]
                
                if aligned_data:
                    avg_values = np.mean(aligned_data, axis=0)
                    result_df = pd.DataFrame({
                        '月份': time_labels,
                        '价格': avg_values
                    })
                    result_df = result_df.iloc[::-1].reset_index(drop=True)
                    return result_df
        
        except Exception as e:
            print(f"加载类别数据失败: {e}")
        
        return None
    
    def _load_specific_product(self, category, product):
        """加载特定产品的数据"""
        category_files = {
            'grain': '粮食价格-月度数据.csv',
            'vegetable': '蔬菜价格-月度数据.csv',
            'fruit': '水果价格-月度数据.csv',
            'livestock': '畜产品价格-月度数据.csv',
            'aquatic': '水产品价格-月度数据.csv',
            'economic': '经济作物价格-月度数据.csv'
        }
        
        filename = category_files.get(category)
        if not filename:
            return None
        
        # 更新文件路径
        full_path = os.path.join(self.data_dir, filename)
        if not os.path.exists(full_path):
            return None
        
        try:
            df = pd.read_csv(full_path, encoding=self.encoding, skiprows=2)
            
            # 查找指定产品的数据
            for idx in range(len(df)):
                indicator = df.iloc[idx, 0]
                if product in str(indicator) and '当期值' in str(indicator) and '元' in str(indicator):
                    row_data = df.iloc[idx:idx+1].T
                    row_data.columns = ['价格']
                    row_data = row_data.iloc[1:]
                    row_data.index.name = '月份'
                    row_data = row_data.reset_index()
                    row_data['价格'] = pd.to_numeric(row_data['价格'], errors='coerce')
                    row_data = row_data.dropna()
                    # 反转顺序
                    row_data = row_data.iloc[::-1].reset_index(drop=True)
                    return row_data
        
        except Exception as e:
            print(f"加载产品数据失败: {e}")
        
        return None
    
    def _load_beijing_annual(self):
        """加载北京年度数据 - 整合多个指标"""
        # 更新文件路径
        filename = os.path.join(self.data_dir, '北京农产品价格指数-年度数据.csv')
        df = pd.read_csv(filename, encoding=self.encoding, skiprows=3)
        
        # 提取所有有效的价格指数行
        all_data = []
        
        for idx in range(len(df)):
            row_data = df.iloc[idx:idx+1].T
            row_data.columns = ['价格指数']
            row_data = row_data.iloc[1:]  # 跳过指标名称
            row_data['价格指数'] = pd.to_numeric(row_data['价格指数'], errors='coerce')
            row_data = row_data.dropna()
            
            # 只保留有足够数据点的指标（至少5个）
            if len(row_data) >= 5:
                all_data.append(row_data['价格指数'].values)
        
        # 计算所有指标的平均值作为综合指数
        if all_data:
            # 找到最长的数据序列长度
            max_len = max(len(d) for d in all_data)
            years = df.columns[1:max_len+1].tolist()
            
            # 对齐所有数据并计算平均值
            aligned_data = []
            for data in all_data:
                if len(data) == max_len:
                    aligned_data.append(data)
            
            if aligned_data:
                avg_values = np.mean(aligned_data, axis=0)
                result_df = pd.DataFrame({
                    '年份': years,
                    '价格指数': avg_values
                })
                result_df = result_df.sort_values('年份')
                return result_df
        
        # 如果整合失败，返回第一行数据
        df = pd.read_csv(filename, encoding=self.encoding, skiprows=3)
        df = df.iloc[0:1].T
        df.columns = ['价格指数']
        df = df.iloc[1:]
        df.index.name = '年份'
        df = df.reset_index()
        df['价格指数'] = pd.to_numeric(df['价格指数'], errors='coerce')
        df = df.dropna()
        df = df.sort_values('年份')
        return df
    
    def format_data(self, df):
        """格式化数据为JSON"""
        return {
            'labels': df.iloc[:, 0].tolist(),
            'values': df.iloc[:, 1].tolist()
        }