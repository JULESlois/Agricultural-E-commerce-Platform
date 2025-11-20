/**
 * 测试所有 Sequelize Models
 */

const {
  sequelize,
  Content,
  Comment,
  Category,
  Follow,
  Like,
  Collect,
  Tag,
  ContentTag,
  QARelation,
  Report,
  Violation,
  Blacklist
} = require('./models');

async function testModels() {
  console.log('🧪 开始测试 Sequelize Models...\n');

  try {
    // 1. 测试数据库连接
    console.log('1️⃣  测试数据库连接...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功\n');

    // 2. 测试所有模型是否正确定义
    console.log('2️⃣  测试模型定义...');
    const models = {
      Content,
      Comment,
      Category,
      Follow,
      Like,
      Collect,
      Tag,
      ContentTag,
      QARelation,
      Report,
      Violation,
      Blacklist
    };

    for (const [name, model] of Object.entries(models)) {
      if (!model) {
        throw new Error(`模型 ${name} 未定义`);
      }
      console.log(`   ✅ ${name} 模型已定义`);
    }
    console.log('✅ 所有模型定义正确\n');

    // 3. 测试模型关联
    console.log('3️⃣  测试模型关联...');
    
    // Content 关联
    if (!Content.associations.category) throw new Error('Content.category 关联缺失');
    if (!Content.associations.comments) throw new Error('Content.comments 关联缺失');
    if (!Content.associations.likes) throw new Error('Content.likes 关联缺失');
    if (!Content.associations.collects) throw new Error('Content.collects 关联缺失');
    if (!Content.associations.tags) throw new Error('Content.tags 关联缺失');
    if (!Content.associations.qaRelation) throw new Error('Content.qaRelation 关联缺失');
    console.log('   ✅ Content 关联正确');

    // Category 关联
    if (!Category.associations.contents) throw new Error('Category.contents 关联缺失');
    console.log('   ✅ Category 关联正确');

    // Comment 关联
    if (!Comment.associations.content) throw new Error('Comment.content 关联缺失');
    if (!Comment.associations.replies) throw new Error('Comment.replies 关联缺失');
    if (!Comment.associations.parent) throw new Error('Comment.parent 关联缺失');
    console.log('   ✅ Comment 关联正确');

    // Tag 关联
    if (!Tag.associations.contents) throw new Error('Tag.contents 关联缺失');
    console.log('   ✅ Tag 关联正确');

    // QARelation 关联
    if (!QARelation.associations.content) throw new Error('QARelation.content 关联缺失');
    if (!QARelation.associations.bestAnswer) throw new Error('QARelation.bestAnswer 关联缺失');
    console.log('   ✅ QARelation 关联正确');

    // Report 关联
    if (!Report.associations.violation) throw new Error('Report.violation 关联缺失');
    console.log('   ✅ Report 关联正确');

    // Violation 关联
    if (!Violation.associations.report) throw new Error('Violation.report 关联缺失');
    console.log('   ✅ Violation 关联正确');

    console.log('✅ 所有模型关联正确\n');

    // 4. 测试基本查询
    console.log('4️⃣  测试基本查询...');

    // 测试 Category 查询
    const categories = await Category.findAll({ limit: 5 });
    console.log(`   ✅ Category 查询成功，找到 ${categories.length} 条记录`);

    // 测试 Tag 查询
    const tags = await Tag.findAll({ limit: 5 });
    console.log(`   ✅ Tag 查询成功，找到 ${tags.length} 条记录`);

    // 测试 Content 查询（带关联）
    const contents = await Content.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: Comment, as: 'comments' }
      ],
      limit: 5
    });
    console.log(`   ✅ Content 查询成功（带关联），找到 ${contents.length} 条记录`);

    // 测试 Follow 查询
    const follows = await Follow.findAll({ limit: 5 });
    console.log(`   ✅ Follow 查询成功，找到 ${follows.length} 条记录`);

    // 测试 Like 查询
    const likes = await Like.findAll({ limit: 5 });
    console.log(`   ✅ Like 查询成功，找到 ${likes.length} 条记录`);

    // 测试 Collect 查询
    const collects = await Collect.findAll({ limit: 5 });
    console.log(`   ✅ Collect 查询成功，找到 ${collects.length} 条记录`);

    // 测试 QARelation 查询
    const qaRelations = await QARelation.findAll({ limit: 5 });
    console.log(`   ✅ QARelation 查询成功，找到 ${qaRelations.length} 条记录`);

    // 测试 Report 查询
    const reports = await Report.findAll({ limit: 5 });
    console.log(`   ✅ Report 查询成功，找到 ${reports.length} 条记录`);

    // 测试 Blacklist 查询
    const blacklist = await Blacklist.findAll({ limit: 5 });
    console.log(`   ✅ Blacklist 查询成功，找到 ${blacklist.length} 条记录`);

    console.log('✅ 所有基本查询测试通过\n');

    // 5. 测试复杂查询
    console.log('5️⃣  测试复杂查询...');

    // 测试内容与标签的多对多关联
    const contentWithTags = await Content.findOne({
      include: [
        { model: Tag, as: 'tags' }
      ]
    });
    if (contentWithTags) {
      console.log(`   ✅ 内容与标签多对多关联查询成功`);
    }

    // 测试问答关系查询
    const qaWithContent = await QARelation.findOne({
      include: [
        { model: Content, as: 'content' },
        { model: Comment, as: 'bestAnswer' }
      ]
    });
    if (qaWithContent) {
      console.log(`   ✅ 问答关系复杂查询成功`);
    }

    // 测试举报与违规记录关联
    const reportWithViolation = await Report.findOne({
      include: [
        { model: Violation, as: 'violation' }
      ]
    });
    console.log(`   ✅ 举报与违规记录关联查询成功`);

    console.log('✅ 所有复杂查询测试通过\n');

    // 测试总结
    console.log('=' .repeat(60));
    console.log('🎉 所有测试通过！');
    console.log('=' .repeat(60));
    console.log('✅ 数据库连接正常');
    console.log('✅ 所有模型定义正确');
    console.log('✅ 所有模型关联正确');
    console.log('✅ 基本查询功能正常');
    console.log('✅ 复杂查询功能正常');
    console.log('=' .repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// 运行测试
testModels();
