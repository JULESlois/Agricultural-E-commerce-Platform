import { useEffect, useState } from 'react';
import { colors } from '@/styles/colors';

interface HotTopic {
  id: number;
  title: string;
  heat: number;
}

export default function RightSidebar() {
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);

  useEffect(() => {
    // TODO: 从 API 获取热门话题
    // 暂时使用模拟数据
    setHotTopics([
      { id: 1, title: '如何提高投资收益率', heat: 12580 },
      { id: 2, title: '基金定投技巧分享', heat: 9876 },
      { id: 3, title: '股市行情分析', heat: 8543 },
      { id: 4, title: '理财新手入门指南', heat: 7234 },
      { id: 5, title: '保险配置建议', heat: 6521 },
    ]);
  }, []);

  const handleShopClick = () => {
    // TODO: 实现进入商城逻辑
    console.log('进入商城');
  };

  return (
    <aside style={styles.sidebar}>
      {/* 热门话题 */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>🔥 热门话题</h3>
        </div>
        <div style={styles.topicList}>
          {hotTopics.map((topic, index) => (
            <div key={topic.id} style={styles.topicItem}>
              <div style={styles.topicRank}>
                <span style={{
                  ...styles.rankNumber,
                  ...(index < 3 ? styles.rankNumberTop : {}),
                }}>
                  {index + 1}
                </span>
              </div>
              <div style={styles.topicContent}>
                <div style={styles.topicTitle}>{topic.title}</div>
                <div style={styles.topicHeat}>
                  {topic.heat > 10000 
                    ? `${(topic.heat / 10000).toFixed(1)}万` 
                    : topic.heat} 热度
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 商城入口 */}
      <div style={styles.section}>
        <button style={styles.shopButton} onClick={handleShopClick}>
          <span style={styles.shopIcon}>🛒</span>
          <span style={styles.shopText}>进入商城</span>
        </button>
      </div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '280px',
    flexShrink: 0,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    position: 'sticky',
    top: '80px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  sectionHeader: {
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.neutral.text,
    margin: 0,
  },
  topicList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  topicItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  topicRank: {
    flexShrink: 0,
    width: '24px',
    textAlign: 'center',
  },
  rankNumber: {
    fontSize: '14px',
    fontWeight: 600,
    color: colors.neutral.textLight,
  },
  rankNumberTop: {
    color: colors.primary.main,
  },
  topicContent: {
    flex: 1,
    minWidth: 0,
  },
  topicTitle: {
    fontSize: '14px',
    color: colors.neutral.text,
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.4',
  },
  topicHeat: {
    fontSize: '12px',
    color: colors.neutral.textLight,
  },
  shopButton: {
    width: '100%',
    padding: '14px 20px',
    backgroundColor: colors.primary.main,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
  shopIcon: {
    fontSize: '20px',
  },
  shopText: {
    fontSize: '16px',
  },
};
