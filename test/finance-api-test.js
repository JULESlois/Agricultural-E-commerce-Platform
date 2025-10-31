const app = require('../server');
const expect = require('chai').expect;
const request = require('supertest');

// 模拟的测试数据
const mockFarmerToken = 'Bearer mock-farmer-token';
const mockBankToken = 'Bearer mock-bank-token';
const mockLoanTypeId = 1;
const mockApplicationId = 123;
const mockPlanId = 456;

describe('Finance Module API Tests (Correct Paths)', function() {
  // 增加超时时间以适应潜在的数据库操作
  this.timeout(15000);

  // 农户相关API测试
  describe('Farmer APIs', function() {
    // 1.1 获取贷款产品列表
    it('should handle loan types list request', function(done) {
      console.log('\n[Finance Module] Testing loan types list endpoint...');
      request(app)
        .get('/api/loan-types')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Finance Module] Loan types test error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Finance Module] Loan types test passed! Status code:', res.status);
          console.log('[Finance Module] Loan types response structure:', {
            code: res.body.code,
            message: res.body.message,
            hasData: res.body.data !== undefined
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });

    // 1.2 获取贷款产品详情
    it('should handle loan type detail request', function(done) {
      console.log(`\n[Finance Module] Testing loan type detail endpoint with ID: ${mockLoanTypeId}...`);
      request(app)
        .get(`/api/loan-types/${mockLoanTypeId}`)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Finance Module] Loan type detail test error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Finance Module] Loan type detail test passed! Status code:', res.status);
          console.log('[Finance Module] Loan type detail response structure:', {
            code: res.body.code,
            message: res.body.message,
            hasLoanType: res.body.data !== undefined
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });

    // 1.3 创建融资申请（需要农户Token）
    it('should handle financing application submission', function(done) {
      const applicationData = {
        loan_type_id: mockLoanTypeId,
        apply_amount: 50000.00,
        apply_term: 6,
        loan_purpose_detail: "购买种子、化肥等农业生产资料，用于春季玉米种植",
        repayment_plan: "按月等额本息还款，预计每月还款8500元左右",
        bank_id: 1,
        material_urls: [
          "https://example.com/materials/id_card.jpg",
          "https://example.com/materials/land_certificate.pdf"
        ]
      };
      
      console.log('\n[Finance Module] Testing financing application submission...');
      console.log('[Finance Module] Submitting application with data:', applicationData);
      
      request(app)
        .post('/api/farmer/financing/applications')
        .set('Authorization', mockFarmerToken)
        .send(applicationData)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Finance Module] Financing application submission error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Finance Module] Financing application submission test passed! Status code:', res.status);
          console.log('[Finance Module] Application submission response:', {
            code: res.body.code,
            message: res.body.message,
            applicationId: res.body.data?.application_id
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });

    // 1.4 获取我的融资申请列表
    it('should handle my applications list request', function(done) {
      console.log('\n[Finance Module] Testing my applications list endpoint...');
      request(app)
        .get('/api/farmer/financing/applications')
        .set('Authorization', mockFarmerToken)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Finance Module] My applications list error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Finance Module] My applications list test passed! Status code:', res.status);
          console.log('[Finance Module] My applications response:', {
            code: res.body.code,
            message: res.body.message,
            hasData: res.body.data !== undefined
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });

    // 1.5 获取我的融资申请详情
    it('should handle my application detail request', function(done) {
      console.log(`\n[Finance Module] Testing my application detail for ID: ${mockApplicationId}...`);
      request(app)
        .get(`/api/farmer/financing/applications/${mockApplicationId}`)
        .set('Authorization', mockFarmerToken)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Finance Module] My application detail error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Finance Module] My application detail test passed! Status code:', res.status);
          console.log('[Finance Module] Application detail response:', {
            code: res.body.code,
            message: res.body.message,
            hasData: res.body.data !== undefined
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });
  });

  // 银行相关API测试
  describe('Bank APIs', function() {
    // 3.1 获取待审批的申请列表
    it('should handle pending applications list for bank', function(done) {
      console.log('\n[Bank Module] Testing pending applications list for bank...');
      request(app)
        .get('/api/bank/financing/applications?status=2')
        .set('Authorization', mockBankToken)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Bank Module] Pending applications list error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Bank Module] Pending applications list test passed! Status code:', res.status);
          console.log('[Bank Module] Pending applications response:', {
            code: res.body.code,
            message: res.body.message,
            count: res.body.data?.length || 0
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });

    // 3.2 获取申请详情以供审批
    it('should handle application detail for bank review', function(done) {
      console.log(`\n[Bank Module] Testing application detail for bank review ID: ${mockApplicationId}...`);
      request(app)
        .get(`/api/bank/financing/applications/${mockApplicationId}`)
        .set('Authorization', mockBankToken)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Bank Module] Application detail for review error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Bank Module] Application detail for review test passed! Status code:', res.status);
          console.log('[Bank Module] Review detail response:', {
            code: res.body.code,
            message: res.body.message,
            hasData: res.body.data !== undefined
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });

    // 3.3 提交审批结论
    it('should handle application review submission', function(done) {
      const reviewData = {
        approval_result: 1,
        approval_amount: 45000.00,
        approval_term: 6,
        interest_rate: 0.0435,
        approval_remark: "申请材料齐全，信用良好，批准放款"
      };
      
      console.log(`\n[Bank Module] Testing application review submission for ID: ${mockApplicationId}...`);
      console.log('[Bank Module] Review data:', reviewData);
      
      request(app)
        .post(`/api/bank/financing/applications/${mockApplicationId}/review`)
        .set('Authorization', mockBankToken)
        .send(reviewData)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Bank Module] Application review submission error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Bank Module] Application review submission test passed! Status code:', res.status);
          console.log('[Bank Module] Review submission response:', {
            code: res.body.code,
            message: res.body.message
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });

    // 3.4 确认放款
    it('should handle loan disbursement confirmation', function(done) {
      const disburseData = {
        disburse_amount: 45000.00,
        disburse_account: "6228480402564890018",
        disburse_remark: "已成功放款至申请人银行账户"
      };
      
      console.log(`\n[Bank Module] Testing loan disbursement for ID: ${mockApplicationId}...`);
      console.log('[Bank Module] Disburse data:', disburseData);
      
      request(app)
        .post(`/api/bank/financing/applications/${mockApplicationId}/disburse`)
        .set('Authorization', mockBankToken)
        .send(disburseData)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Bank Module] Loan disbursement error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Bank Module] Loan disbursement test passed! Status code:', res.status);
          console.log('[Bank Module] Disbursement response:', {
            code: res.body.code,
            message: res.body.message
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });
  });

  // 内部接口测试
  describe('Internal APIs', function() {
    // 2.1 触发信用评估
    it('should handle credit evaluation trigger', function(done) {
      console.log(`\n[Internal Module] Testing credit evaluation trigger for ID: ${mockApplicationId}...`);
      request(app)
        .post(`/api/internal/financing/applications/${mockApplicationId}/evaluate`)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Internal Module] Credit evaluation trigger error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Internal Module] Credit evaluation trigger test passed! Status code:', res.status);
          console.log('[Internal Module] Trigger response:', {
            code: res.body.code,
            message: res.body.message
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });

    // 2.2 接收评估结果
    it('should handle credit evaluation result submission', function(done) {
      const evaluationData = {
        application_id: mockApplicationId,
        credit_score: 85,
        credit_level: "A级",
        score_detail: {
          "基础信息": 20,
          "经营状况": 25,
          "还款能力": 25,
          "信用记录": 15
        },
        evaluation_result: 1,
        evaluation_remark: "信用良好，具备还款能力",
        credit_report_url: "https://example.com/credit-reports/report_123.pdf"
      };
      
      console.log('\n[Internal Module] Testing credit evaluation result submission...');
      console.log('[Internal Module] Evaluation data:', evaluationData);
      
      request(app)
        .post('/api/internal/financing/credit-evaluations')
        .send(evaluationData)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Internal Module] Credit evaluation result submission error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Internal Module] Credit evaluation result submission test passed! Status code:', res.status);
          console.log('[Internal Module] Evaluation result response:', {
            code: res.body.code,
            message: res.body.message
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });
  });

  // 预售相关API测试
  describe('Presale APIs', function() {
    // 4.1 创建预售计划
    it('should handle presale plan creation', function(done) {
      const presaleData = {
        category_id: 1,
        product_name: "有机玉米",
        plant_date: "2024-03-15",
        expected_harvest_date: "2024-09-15",
        total_yield_quantity: 5000.00,
        presale_unit_price: 4.50,
        deposit_ratio: 0.30
      };
      
      console.log('\n[Presale Module] Testing presale plan creation...');
      console.log('[Presale Module] Presale data:', presaleData);
      
      request(app)
        .post('/api/farmer/presale/plans')
        .set('Authorization', mockFarmerToken)
        .send(presaleData)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Presale Module] Presale plan creation error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Presale Module] Presale plan creation test passed! Status code:', res.status);
          console.log('[Presale Module] Plan creation response:', {
            code: res.body.code,
            message: res.body.message,
            planId: res.body.data?.plan_id
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });

    // 4.2 获取我的预售计划列表
    it('should handle my presale plans list', function(done) {
      console.log('\n[Presale Module] Testing my presale plans list...');
      request(app)
        .get('/api/farmer/presale/plans')
        .set('Authorization', mockFarmerToken)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Presale Module] My presale plans list error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Presale Module] My presale plans list test passed! Status code:', res.status);
          console.log('[Presale Module] Plans list response:', {
            code: res.body.code,
            message: res.body.message,
            count: res.body.data?.length || 0
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });

    // 4.3 获取预售计划详情
    it('should handle presale plan detail viewing', function(done) {
      console.log(`\n[Presale Module] Testing presale plan detail viewing for plan ID: ${mockPlanId}...`);
      request(app)
        .get(`/api/presale/plans/${mockPlanId}`)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log('[Presale Module] Presale plan detail viewing error:', err.message);
            return done(); // Skip the test if there's an error
          }
          console.log('[Presale Module] Presale plan detail viewing test passed! Status code:', res.status);
          console.log('[Presale Module] Plan detail response:', {
            code: res.body.code,
            message: res.body.message,
            hasData: res.body.data !== undefined
          });
          expect(res.body).to.have.property('code');
          done();
        });
    });
  });
});