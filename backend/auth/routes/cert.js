const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const CertTypeController = require('../controllers/CertTypeController');
const CertApplyController = require('../controllers/CertApplyController');
const CertAdminController = require('../controllers/CertAdminController');
const authMiddleware = require('../middleware/authMiddleware');

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cert-materials/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传图片、PDF或Word文档'));
    }
  }
});

// 5.1 获取认证类型列表 - /api/cert-types
router.get('/cert-types', authMiddleware.verifyToken, CertTypeController.getCertTypes);

// 5.2 创建认证类型（管理员） - /api/admin/cert-types
router.post('/admin/cert-types', authMiddleware.verifyToken, authMiddleware.isAdmin, CertTypeController.createCertType);

// 5.3 创建认证申请 - /api/cert-apply
router.post('/cert-apply', authMiddleware.verifyToken, CertApplyController.createApplyDraft);

// 5.4 上传认证材料 - /api/cert-apply/{apply_id}/materials
router.post('/cert-apply/:apply_id/materials', authMiddleware.verifyToken, upload.single('file'), CertApplyController.uploadMaterial);

// 5.5 提交申请 - /api/cert-apply/{apply_id}/submit
router.post('/cert-apply/:apply_id/submit', authMiddleware.verifyToken, CertApplyController.submitApplication);

// 5.6 获取我的认证申请列表 - /api/cert-apply/my-list
router.get('/cert-apply/my-list', authMiddleware.verifyToken, CertApplyController.getMyApplyList);

// 5.7 获取待审核申请列表（管理员） - /api/admin/cert-apply
router.get('/admin/cert-apply', authMiddleware.verifyToken, authMiddleware.isAdmin, CertAdminController.getPendingApplyList);

// 5.8 获取申请详情（管理员） - /api/admin/cert-apply/{apply_id}
router.get('/admin/cert-apply/:apply_id', authMiddleware.verifyToken, authMiddleware.isAdmin, CertAdminController.getApplyDetail);

// 5.9 审核通过（管理员） - /api/admin/cert-apply/{apply_id}/approve
router.post('/admin/cert-apply/:apply_id/approve', authMiddleware.verifyToken, authMiddleware.isAdmin, CertAdminController.approveApplication);

// 5.10 驳回申请（管理员） - /api/admin/cert-apply/{apply_id}/reject
router.post('/admin/cert-apply/:apply_id/reject', authMiddleware.verifyToken, authMiddleware.isAdmin, CertAdminController.rejectApplication);

module.exports = router;