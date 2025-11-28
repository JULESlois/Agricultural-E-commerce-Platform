"""
查看CSV数据文件内容（使用GB编码）
"""
import pandas as pd
import os

def show_file_data(filename, encoding='gb18030'):
    """显示CSV文件内容"""
    if not os.path.exists(filename):
        print(f"文件不存在: {filename}")
        return
    
    print(f"\n{'='*60}")
    print(f"文件: {filename}")
    print('='*60)
    
    try:
        # 读取文件（跳过前2行）
        df = pd.read_csv(filename, encoding=encoding, skiprows=2)
        
        print(f"\n数据形状: {df.shape[0]} 行 × {df.shape[1]} 列")
        print(f"\n前10行数据:")
        print(df.head(10).to_string())
        
        print(f"\n列名:")
        for i, col in enumerate(df.columns, 1):
            print(f"  {i}. {col}")
        
    except Exception as e:
        print(f"读取失败: {e}")
        # 尝试不跳过行
        try:
            df = pd.read_csv(filename, encoding=encoding)
            print(f"\n原始数据（前5行）:")
            print(df.head())
        except:
            pass

def main():
    print("=" * 60)
    print("农产品价格数据查看工具")
    print("=" * 60)
    
    # 获取data目录路径
    data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    
    # 列出所有CSV文件
    csv_files = [f for f in os.listdir(data_dir) if f.endswith('.csv')]
    
    if not csv_files:
        print("\n未找到CSV文件")
        return
    
    print(f"\n找到 {len(csv_files)} 个CSV文件:\n")
    
    # 分类显示
    annual_files = [f for f in csv_files if '年度' in f]
    monthly_files = [f for f in csv_files if '月度' in f]
    
    if annual_files:
        print("年度数据文件:")
        for i, f in enumerate(annual_files, 1):
            print(f"  {i}. {f}")
    
    if monthly_files:
        print("\n月度数据文件:")
        for i, f in enumerate(monthly_files, 1):
            print(f"  {i}. {f}")
    
    # 显示关键文件的数据
    key_files = [
        '农产品价格指数-年度数据.csv',
        '北京农产品价格指数-年度数据.csv',
        '粮食价格-月度数据.csv'
    ]
    
    for filename in key_files:
        if filename in csv_files:
            # 构建完整路径
            full_path = os.path.join(data_dir, filename)
            show_file_data(full_path)
    
    print("\n" + "=" * 60)
    print("提示: 所有CSV文件使用GB18030编码")
    print("=" * 60)

if __name__ == '__main__':
    main()