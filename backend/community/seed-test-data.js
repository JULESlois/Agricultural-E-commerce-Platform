/**
 * 测试数据初始化脚本
 * 用于向数据库添加测试数据
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
  Report
} = require('./models');

async function seedData() {
  console.log('🌱 开始初始化测试数据...\n');

  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功\n');

    // 1. 检查并创建分类（如果不存在）
    console.log('1️⃣  初始化分类数据...');
    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      await Category.bulkCreate([
        { category_id: 1, parent_id: 0, category_name: '种植技术', category_desc: '农作物种植相关技术交流', sort_order: 1 },
        { category_id: 101, parent_id: 1, category_name: '小麦种植', category_desc: '小麦种植技术与经验分享', sort_order: 1 },
        { category_id: 102, parent_id: 1, category_name: '水稻种植', category_desc: '水稻种植技术与经验分享', sort_order: 2 },
        { category_id: 2, parent_id: 0, category_name: '养殖技术', category_desc: '畜牧养殖相关技术交流', sort_order: 2 },
        { category_id: 201, parent_id: 2, category_name: '家禽养殖', category_desc: '鸡鸭鹅等家禽养殖技术', sort_order: 1 },
        { category_id: 3, parent_id: 0, category_name: '市场行情', category_desc: '农产品市场价格与行情讨论', sort_order: 3 },
        { category_id: 301, parent_id: 3, category_name: '粮食价格', category_desc: '粮食作物价格行情', sort_order: 1 }
      ]);
      console.log('   ✅ 创建了 7 个分类');
    } else {
      console.log(`   ℹ️  已存在 ${categoryCount} 个分类，跳过`);
    }

    // 2. 检查并创建标签
    console.log('\n2️⃣  初始化标签数据...');
    const tagCount = await Tag.count();
    if (tagCount === 0) {
      await Tag.bulkCreate([
        { tag_name: '小麦种植' },
        { tag_name: '病虫害防治' },
        { tag_name: '施肥技术' },
        { tag_name: '灌溉管理' },
        { tag_name: '冬小麦' },
        { tag_name: '水稻' },
        { tag_name: '有机农业' },
        { tag_name: '智慧农业' }
      ]);
      console.log('   ✅ 创建了 8 个标签');
    } else {
      console.log(`   ℹ️  已存在 ${tagCount} 个标签，跳过`);
    }

    // 3. 创建测试内容
    console.log('\n3️⃣  初始化内容数据...');
    const contentCount = await Content.count();
    if (contentCount === 0) {
      const contents = await Content.bulkCreate([
        {
          author_id: 1,
          category_id: 101,
          content_type: 1,
          content_title: '冬小麦高产种植技术分享',
          content_text: '经过多年实践，总结了一套冬小麦高产种植技术。首先要选择优质品种，其次要注意播种时间和密度，最后要做好田间管理。',
          audit_status: 1
        },
        {
          author_id: 2,
          category_id: 101,
          content_type: 2,
          content_title: '小麦病虫害防治求助',
          content_text: '我的小麦地出现了一些病虫害，叶子发黄，有斑点，请问这是什么病？应该如何防治？',
          audit_status: 1
        },
        {
          author_id: 1,
          category_id: 102,
          content_type: 3,
          content_title: '水稻种植中如何提高产量？',
          content_text: '想请教各位老师，水稻种植过程中有哪些关键技术可以提高产量？',
          audit_status: 1
        },
        {
          author_id: 3,
          category_id: 201,
          content_type: 1,
          content_title: '家禽养殖经验分享',
          content_text: '养殖家禽多年，分享一些实用经验。饲料配比、疾病预防、环境管理都很重要。',
          audit_status: 1
        },
        {
          author_id: 2,
          category_id: 301,
          content_type: 1,
          content_title: '今年小麦价格行情分析',
          content_text: '根据市场调研，今年小麦价格整体稳定，局部地区有小幅上涨。',
          audit_status: 1
        }
      ]);
      console.log(`   ✅ 创建了 ${contents.length} 条内容`);

      // 4. 为内容添加标签
      console.log('\n4️⃣  关联内容和标签...');
      await ContentTag.bulkCreate([
        { content_id: 1, tag_id: 1 },
        { content_id: 1, tag_id: 5 },
        { content_id: 2, tag_id: 1 },
        { content_id: 2, tag_id: 2 },
        { content_id: 3, tag_id: 6 },
        { content_id: 4, tag_id: 7 }
      ]);
      console.log('   ✅ 创建了 6 个内容-标签关联');

      // 5. 创建评论
      console.log('\n5️⃣  初始化评论数据...');
      await Comment.bulkCreate([
        {
          content_id: 1,
          commenter_id: 2,
          parent_id: 0,
          comment_text: '写得很好，很实用！',
          audit_status: 1
        },
        {
          content_id: 1,
          commenter_id: 3,
          parent_id: 0,
          comment_text: '感谢分享，学习了！',
          audit_status: 1
        },
        {
          content_id: 2,
          commenter_id: 1,
          parent_id: 0,
          comment_text: '看起来像是小麦锈病，建议使用三唑酮防治。',
          audit_status: 1
        },
        {
          content_id: 3,
          commenter_id: 2,
          parent_id: 0,
          comment_text: '选择优质品种、合理密植、科学施肥是关键。',
          audit_status: 1
        },
        {
          content_id: 3,
          commenter_id: 3,
          parent_id: 0,
          comment_text: '水肥管理很重要，要根据生长期调整。',
          audit_status: 1
        }
      ]);
      console.log('   ✅ 创建了 5 条评论');

      // 6. 创建关注关系
      console.log('\n6️⃣  初始化关注关系...');
      await Follow.bulkCreate([
        { follower_id: 1, followed_id: 2 },
        { follower_id: 1, followed_id: 3 },
        { follower_id: 2, followed_id: 1 },
        { follower_id: 3, followed_id: 1 }
      ]);
      console.log('   ✅ 创建了 4 个关注关系');

      // 7. 创建点赞
      console.log('\n7️⃣  初始化点赞数据...');
      await Like.bulkCreate([
        { content_id: 1, user_id: 2 },
        { content_id: 1, user_id: 3 },
        { content_id: 2, user_id: 1 },
        { content_id: 3, user_id: 1 },
        { content_id: 3, user_id: 2 }
      ]);
      console.log('   ✅ 创建了 5 个点赞');

      // 8. 创建收藏
      console.log('\n8️⃣  初始化收藏数据...');
      await Collect.bulkCreate([
        { content_id: 1, user_id: 2 },
        { content_id: 1, user_id: 3 },
        { content_id: 3, user_id: 2 }
      ]);
      console.log('   ✅ 创建了 3 个收藏');

      // 9. 创建问答关系
      console.log('\n9️⃣  初始化问答关系...');
      await QARelation.create({
        content_id: 3,
        qa_status: 0,
        reward_amount: 10.00,
        reward_status: 0
      });
      console.log('   ✅ 创建了 1 个问答关系');

      // 10. 更新内容统计数据
      console.log('\n🔟 更新内容统计数据...');
      await Content.update(
        { like_count: 2, comment_count: 2 },
        { where: { content_id: 1 } }
      );
      await Content.update(
        { like_count: 1, comment_count: 1 },
        { where: { content_id: 2 } }
      );
      await Content.update(
        { like_count: 2, comment_count: 2, collect_count: 1 },
        { where: { content_id: 3 } }
      );
      console.log('   ✅ 更新了内容统计数据');

    } else {
      console.log(`   ℹ️  已存在 ${contentCount} 条内容，跳过内容初始化`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 测试数据初始化完成！');
    console.log('='.repeat(60));
    console.log('\n数据统计：');
    console.log(`- 分类: ${await Category.count()} 个`);
    console.log(`- 标签: ${await Tag.count()} 个`);
    console.log(`- 内容: ${await Content.count()} 条`);
    console.log(`- 评论: ${await Comment.count()} 条`);
    console.log(`- 关注: ${await Follow.count()} 个`);
    console.log(`- 点赞: ${await Like.count()} 个`);
    console.log(`- 收藏: ${await Collect.count()} 个`);
    console.log(`- 问答: ${await QARelation.count()} 个`);
    console.log('\n现在可以运行测试了：');
    console.log('  node test-models.js');
    console.log('  PORT=3004 node index.v2.js');
    console.log('='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ 初始化失败:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// 运行初始化
seedData();
