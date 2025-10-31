const FinancingApplication = require('../models/applicationModel');
const CreditEvaluation = require('../models/creditModel');

// 2.1 触发信用评估
exports.triggerCreditEvaluate = async (req, res) => {
  try {
    const { application_id } = req.params;
    if (isNaN(application_id)) {
      return res.status(400).json({ code: 400, message: '申请ID必须为有效数字' });
    }

    // 验证申请是否存在
    const application = await FinancingApplication.findByPk(application_id);
    if (!application) {
      return res.status(404).json({ code: 404, message: '未找到该融资申请' });
    }

    // （实际项目中此处应调用信用评估系统接口，此处简化为返回任务启动成功）
    return res.status(202).json({
      code: 202,
      message: '信用评估任务已启动。'
    });
  } catch (error) {
    console.error('触发信用评估失败：', error);
    return res.status(500).json({ code: 500, message: '服务器异常，触发评估失败' });
  }
};

// 2.2 接收评估结果
exports.receiveEvaluationResult = async (req, res) => {
  try {
    const { application_id, credit_score, credit_level, score_detail, evaluation_result, evaluation_remark, credit_report_url } = req.body;

    // 1. 验证申请存在性
    const application = await FinancingApplication.findByPk(application_id);
    if (!application) {
      return res.status(404).json({ code: 404, message: '未找到该融资申请' });
    }

    // 2. 插入信用评估结果
    await CreditEvaluation.create({
      application_id,
      credit_score,
      credit_level,
      score_detail: typeof score_detail === 'string' ? JSON.parse(score_detail) : score_detail,
      evaluation_result,
      evaluation_remark,
      credit_report_url
    });

    // 3. 更新申请状态为“待银行审批”（状态码 2）
    await application.update({ application_status: 2 });

    return res.status(200).json({
      code: 200,
      message: '评估结果已记录，申请状态已更新为“待银行审批”。'
    });
  } catch (error) {
    console.error('接收评估结果失败：', error);
    return res.status(500).json({ code: 500, message: '服务器异常，记录评估结果失败' });
  }
};