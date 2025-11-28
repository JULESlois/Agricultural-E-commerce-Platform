import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Select, InputNumber, Button, Statistic, Tabs, message } from 'antd';
import { RiseOutlined, FallOutlined, LineChartOutlined, BarChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import CompareChart from './components/CompareChart';
import './App.css';

const { Header, Content } = Layout;
const { Option } = Select;

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [region, setRegion] = useState('national');
  const [dataType, setDataType] = useState('annual');
  const [model, setModel] = useState('arima');
  const [periods, setPeriods] = useState(3);
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  
  // 月度数据筛选
  const [categories, setCategories] = useState({});
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);

  // 加载类别列表
  useEffect(() => {
    loadCategories();
  }, []);

  // 加载产品列表
  useEffect(() => {
    if (category) {
      loadProducts(category);
    } else {
      setProducts([]);
      setProduct(null);
    }
  }, [category]);

  // 加载统计数据
  useEffect(() => {
    loadStatistics();
  }, [region, dataType, category, product]);

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('加载类别失败:', error);
    }
  };

  const loadProducts = async (cat) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${cat}`);
      setProducts(response.data.products || []);
      setProduct(null);
    } catch (error) {
      console.error('加载产品列表失败:', error);
      setProducts([]);
    }
  };

  const loadStatistics = async () => {
    try {
      let url = `${API_BASE_URL}/statistics/${region}/${dataType}`;
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (product) params.append('product', product);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url);
      setStatistics(response.data);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const requestData = {
        region,
        data_type: dataType,
        model,
        periods
      };
      
      if (dataType === 'monthly' && category) {
        requestData.category = category;
        if (product) requestData.product = product;
      }
      
      const response = await axios.post(`${API_BASE_URL}/predict`, requestData);
      setPredictionData(response.data);
      message.success('预测成功！');
    } catch (error) {
      message.error('预测失败: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    setLoading(true);
    try {
      const requestData = {
        region,
        data_type: dataType,
        periods
      };
      
      if (dataType === 'monthly' && category) {
        requestData.category = category;
        if (product) requestData.product = product;
      }
      
      const response = await axios.post(`${API_BASE_URL}/compare`, requestData);
      setCompareData(response.data);
      message.success('模型对比完成！');
    } catch (error) {
      message.error('对比失败: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = (value) => {
    setRegion(value);
    if (value === 'beijing') {
      setDataType('annual');
      setCategory(null);
      setProduct(null);
    }
  };

  const handleDataTypeChange = (value) => {
    setDataType(value);
    if (value === 'annual') {
      setCategory(null);
      setProduct(null);
    }
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setProduct(null);
  };

  return (
    <Layout className="layout">
      <Header className="header">
        <div className="logo">
          <LineChartOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
          <span>农产品价格预测系统</span>
        </div>
      </Header>
      
      <Content className="content">
        <div className="container">
          {/* 统计卡片 */}
          {statistics && (
            <>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="平均值"
                      value={statistics.mean}
                      precision={2}
                      valueStyle={{ color: '#5a7a6f' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="中位数"
                      value={statistics.median}
                      precision={2}
                      valueStyle={{ color: '#7d9d8f' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="标准差"
                      value={statistics.std}
                      precision={2}
                      valueStyle={{ color: '#d4a88b' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="极差"
                      value={statistics.range}
                      precision={2}
                      valueStyle={{ color: '#c98b8b' }}
                    />
                  </Card>
                </Col>
              </Row>
              
              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="最小值"
                      value={statistics.min}
                      precision={2}
                      valueStyle={{ color: '#8ba3b5' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="最大值"
                      value={statistics.max}
                      precision={2}
                      valueStyle={{ color: '#d9c5a1' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="数据点数"
                      value={statistics.count}
                      suffix="个"
                      valueStyle={{ color: '#b8a8a0' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="变化率"
                      value={statistics.change_rate}
                      precision={2}
                      valueStyle={{ color: statistics.trend === 'up' ? '#5a7a6f' : '#c98b8b' }}
                      prefix={statistics.trend === 'up' ? <RiseOutlined /> : <FallOutlined />}
                      suffix="%"
                    />
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {/* 控制面板 */}
          <Card title="预测参数设置" style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              <Col span={6}>
                <div className="form-item">
                  <label>区域选择</label>
                  <Select
                    value={region}
                    onChange={handleRegionChange}
                    style={{ width: '100%' }}
                  >
                    <Option value="national">全国</Option>
                    <Option value="beijing">北京</Option>
                  </Select>
                </div>
              </Col>
              
              <Col span={6}>
                <div className="form-item">
                  <label>数据类型</label>
                  <Select
                    value={dataType}
                    onChange={handleDataTypeChange}
                    style={{ width: '100%' }}
                    disabled={region === 'beijing'}
                  >
                    <Option value="annual">年度数据</Option>
                    <Option value="monthly" disabled={region === 'beijing'}>月度数据</Option>
                  </Select>
                </div>
              </Col>
              
              <Col span={6}>
                <div className="form-item">
                  <label>预测模型</label>
                  <Select
                    value={model}
                    onChange={setModel}
                    style={{ width: '100%' }}
                  >
                    <Option value="arima">ARIMA</Option>
                    <Option value="lstm">LSTM</Option>
                  </Select>
                </div>
              </Col>
              
              <Col span={6}>
                <div className="form-item">
                  <label>预测期数</label>
                  <InputNumber
                    min={1}
                    max={12}
                    value={periods}
                    onChange={setPeriods}
                    style={{ width: '100%' }}
                  />
                </div>
              </Col>
            </Row>
            
            {/* 月度数据筛选 */}
            {dataType === 'monthly' && (
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <div className="form-item">
                    <label>产品类别（可选）</label>
                    <Select
                      value={category}
                      onChange={handleCategoryChange}
                      style={{ width: '100%' }}
                      placeholder="选择类别或留空查看全部"
                      allowClear
                    >
                      {Object.entries(categories).map(([key, value]) => (
                        <Option key={key} value={key}>{value}</Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                
                <Col span={12}>
                  <div className="form-item">
                    <label>具体产品（可选）</label>
                    <Select
                      value={product}
                      onChange={setProduct}
                      style={{ width: '100%' }}
                      placeholder="选择产品或留空查看类别平均"
                      allowClear
                      disabled={!category || products.length === 0}
                    >
                      {products.map((prod) => (
                        <Option key={prod} value={prod}>{prod}</Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            )}
            
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={loading}
                  onClick={handlePredict}
                  icon={<LineChartOutlined />}
                >
                  开始预测
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  size="large"
                  block
                  loading={loading}
                  onClick={handleCompare}
                  icon={<BarChartOutlined />}
                >
                  模型对比
                </Button>
              </Col>
            </Row>
          </Card>

          {/* 图表展示 */}
          {predictionData && (
            <Card title="预测结果">
              <Tabs
                items={[
                  {
                    key: '1',
                    label: '折线图',
                    children: <LineChart data={predictionData} />
                  },
                  {
                    key: '2',
                    label: '柱状图',
                    children: <BarChart data={predictionData} />
                  }
                ]}
              />
            </Card>
          )}

          {/* 模型对比 */}
          {compareData && (
            <Card title="模型对比" style={{ marginTop: 24 }}>
              <CompareChart data={compareData} />
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default App;
