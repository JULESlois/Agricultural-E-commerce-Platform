import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { colors } from '@/styles/colors';
import { getContentList } from '@/api/content';
import ContentCard from '@/components/ContentCard';
import UserSidebar from '@/components/Layout/UserSidebar';
import RightSidebar from '@/components/Layout/RightSidebar';
import type { Content } from '@/types';

// 背景图路径 - 请将背景图放到 src/assets/background.jpg
const BACKGROUND_IMAGE = '/src/assets/background.jpg';

export default function Home() {
  const [searchParams] = useSearchParams();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState<'hot' | 'latest'>('hot');

  useEffect(() => {
    loadContents();
  }, [searchParams, sortType]);

  const loadContents = async () => {
    setLoading(true);
    try {
      const categoryId = searchParams.get('category');
      const contentType = searchParams.get('type');
      const res = await getContentList({
        category_id: categoryId ? Number(categoryId) : undefined,
        content_type: contentType && Number(contentType) !== 0 ? Number(contentType) : undefined,
        sort: sortType,
      });
      
      setContents(res.data || []);
    } catch (error) {
      console.error('加载内容失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* 左侧：用户信息 */}
        <UserSidebar />
        
        {/* 中间：帖子列表 */}
        <main style={styles.main}>
          <div style={styles.toolbar}>
            <div style={styles.sortTabs}>
              {(['hot', 'latest'] as const).map((type) => (
                <button
                  key={type}
                  style={{
                    ...styles.sortTab,
                    ...(sortType === type ? styles.sortTabActive : {}),
                  }}
                  onClick={() => setSortType(type)}
                >
                  {type === 'hot' ? '🔥 热门' : '🆕 最新'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={styles.loading}>加载中...</div>
          ) : (
            <div style={styles.contentList}>
              {contents.map((content) => (
                <ContentCard key={content.content_id} content={content} />
              ))}
              {contents.length === 0 && (
                <div style={styles.empty}>暂无内容</div>
              )}
            </div>
          )}
        </main>

        {/* 右侧：热门话题和商城入口 */}
        <RightSidebar />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    minHeight: 'calc(100vh - 64px)',
    backgroundImage: `url(${BACKGROUND_IMAGE})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  toolbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  sortTabs: {
    display: 'flex',
    gap: '8px',
  },
  sortTab: {
    padding: '10px 24px',
    backgroundColor: 'transparent',
    color: colors.neutral.textLight,
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  sortTabActive: {
    backgroundColor: colors.primary.bg,
    color: colors.primary.main,
    fontWeight: 600,
  },
  contentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: colors.neutral.textLight,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    color: colors.neutral.textLight,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
  },
};
