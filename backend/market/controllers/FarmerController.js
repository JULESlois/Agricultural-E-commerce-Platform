const FarmerModel = require('../models/FarmerModel');

class FarmerController {
  static async getFarmerInfo(req, res) {
    try {
      const farmerId = Number.parseInt(req.params.farmer_id, 10);
      
      const farmer = await FarmerModel.findById(farmerId);
      
      if (!farmer) {
        return res.status(404).json({
          code: 404,
          message: '农户不存在'
        });
      }
      
      res.json({
        code: 200,
        message: '查询成功。',
        data: farmer
      });
      
    } catch (err) {
      console.error('获取农户信息失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getFarmerProducts(req, res) {
    try {
      const farmerId = Number.parseInt(req.params.farmer_id, 10);
      const { page = 1, pageSize = 20 } = req.query;
      
      const products = await FarmerModel.findProductsByFarmer(
        farmerId,
        Number.parseInt(page, 10),
        Number.parseInt(pageSize, 10)
      );
      
      res.json({
        code: 200,
        message: '查询成功。',
        data: {
          list: products,
          total: products.length
        }
      });
      
    } catch (err) {
      console.error('获取农户商品失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getFarmerStats(req, res) {
    try {
      const farmerId = Number.parseInt(req.params.farmer_id, 10);
      
      const stats = await FarmerModel.getStats(farmerId);
      
      res.json({
        code: 200,
        message: '查询成功。',
        data: stats
      });
      
    } catch (err) {
      console.error('获取农户统计失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }

  static async updateMe(req, res) {
    try {
      // 更新当前登录农户的信息
      const userId = req.user.userId;
      
      if (req.user.userType !== 1) {
        return res.status(403).json({
          code: 403,
          message: '只有农户用户才能更新农户信息'
        });
      }
      
      // TODO: 实现更新逻辑
      res.json({
        code: 200,
        message: '更新成功。'
      });
      
    } catch (err) {
      console.error('更新农户信息失败:', err);
      res.status(500).json({
        code: 500,
        message: '更新失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = FarmerController;
