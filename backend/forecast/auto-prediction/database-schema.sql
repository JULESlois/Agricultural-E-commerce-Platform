-- 价格预测结果表
CREATE TABLE IF NOT EXISTS price_predictions (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_category VARCHAR(50),
    region VARCHAR(50) DEFAULT 'national',
    prediction_type VARCHAR(20) DEFAULT 'monthly',
    prediction_date DATE NOT NULL,
    period_number INTEGER NOT NULL,
    predicted_price DECIMAL(10, 2) NOT NULL,
    confidence_lower DECIMAL(10, 2),
    confidence_upper DECIMAL(10, 2),
    model_type VARCHAR(20) DEFAULT 'arima',
    accuracy_score DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_name, region, prediction_type, prediction_date, period_number, model_type)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_product_name ON price_predictions(product_name);
CREATE INDEX IF NOT EXISTS idx_prediction_date ON price_predictions(prediction_date);
CREATE INDEX IF NOT EXISTS idx_region ON price_predictions(region);
CREATE INDEX IF NOT EXISTS idx_created_at ON price_predictions(created_at);

-- 预测任务执行日志表
CREATE TABLE IF NOT EXISTS prediction_logs (
    id SERIAL PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    products_count INTEGER DEFAULT 0,
    predictions_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_task_name ON prediction_logs(task_name);
CREATE INDEX IF NOT EXISTS idx_status ON prediction_logs(status);
CREATE INDEX IF NOT EXISTS idx_start_time ON prediction_logs(start_time);

-- 添加表注释
COMMENT ON TABLE price_predictions IS '价格预测结果表';
COMMENT ON TABLE prediction_logs IS '预测任务执行日志表';

-- 添加列注释
COMMENT ON COLUMN price_predictions.product_name IS '农产品名称';
COMMENT ON COLUMN price_predictions.product_category IS '产品类别';
COMMENT ON COLUMN price_predictions.region IS '区域（全国/地区）';
COMMENT ON COLUMN price_predictions.prediction_type IS '预测类型（monthly/annual）';
COMMENT ON COLUMN price_predictions.prediction_date IS '预测日期';
COMMENT ON COLUMN price_predictions.period_number IS '预测期数（1/2/3）';
COMMENT ON COLUMN price_predictions.predicted_price IS '预测价格';
COMMENT ON COLUMN price_predictions.confidence_lower IS '置信区间下限';
COMMENT ON COLUMN price_predictions.confidence_upper IS '置信区间上限';
COMMENT ON COLUMN price_predictions.model_type IS '模型类型（arima/lstm）';
COMMENT ON COLUMN price_predictions.accuracy_score IS '准确度评分';
COMMENT ON COLUMN price_predictions.created_at IS '创建时间';
COMMENT ON COLUMN price_predictions.updated_at IS '更新时间';

COMMENT ON COLUMN prediction_logs.task_name IS '任务名称';
COMMENT ON COLUMN prediction_logs.start_time IS '开始时间';
COMMENT ON COLUMN prediction_logs.end_time IS '结束时间';
COMMENT ON COLUMN prediction_logs.status IS '状态（running/success/failed）';
COMMENT ON COLUMN prediction_logs.products_count IS '处理的产品数量';
COMMENT ON COLUMN prediction_logs.predictions_count IS '生成的预测数量';
COMMENT ON COLUMN prediction_logs.error_message IS '错误信息';
COMMENT ON COLUMN prediction_logs.created_at IS '创建时间';
