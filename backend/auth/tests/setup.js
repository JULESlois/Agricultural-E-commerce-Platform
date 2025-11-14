// Jest测试设置文件
process.env.NODE_ENV = 'test';

// 模拟数据库连接
jest.mock('../models/userModel');
jest.mock('../models/AddressModel');
jest.mock('../models/BuyerModel');
jest.mock('../models/FarmerModel');
jest.mock('../models/CertApplyModel');
jest.mock('../models/CertMaterialModel');
jest.mock('../models/CertTypeModel');
jest.mock('../services/CertificationService');