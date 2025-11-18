import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { colors } from '@/styles/colors';

interface UserStats {
  user_name: string;
  avatar?: string;
  following_count: number;
  follower_count: number;
  post_count: number;
}

const CONTENT_TYPES = [
  { value: 0, label: '全部', icon: '📋' },
  { value: 1, label: '经验分享', icon: '💡' },
  { value: 2, label: '求助', icon: '🆘' },
  { value: 3, label: '问题咨询', icon: '❓' },
];

export default function UserSidebar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userStats, setUserStats] = useState<UserStats>({
    user_name: '游客',
    following_count: 0,
    follower_count: 0,
    post_count: 0,
  });
  const [activeType, setActiveType] = useState<number>(0);

  useEffect(() => {
    // TODO: 从 localStorage 或 API 获取用户信息
    const token = localStorage.getItem('token');
    if (token) {
      // 这里应该调用 API 获取用户统计信息
      // 暂时使用模拟数据
      setUserStats({
        user_name: '用户名',
        avatar: undefined,
        following_count: 0,
        follower_count: 0,
        post_count: 0,
      });
    }
  }, []);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    setActiveType(typeParam ? Number(typeParam) : 0);
  }, [searchParams]);

  const handleTypeClick = (type: number) => {
    setActiveType(type);
    if (type === 0) {
      navigate('/');
    } else {
      navigate(`/?type=${type}`);
    }
  };

  return (
    <aside style={styles.sidebar}>
      {/* 用户信息卡片 */}
      <div style={styles.userCard}>
        <div style={styles.avatarWrapper}>
          {userStats.avatar ? (
            <img src={userStats.avatar} alt="avatar" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {userStats.user_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <h3 style={styles.userName}>{userStats.user_name}</h3>
        
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{userStats.following_count}</div>
            <div style={styles.statLabel}>关注</div>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <div style={styles.statValue}>{userStats.follower_count}</div>
            <div style={styles.statLabel}>粉丝</div>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <div style={styles.statValue}>{userStats.post_count}</div>
            <div style={styles.statLabel}>帖子</div>
          </div>
        </div>
      </div>

      {/* 帖子分区筛选 */}
      <div style={styles.filterCard}>
        <h4 style={styles.filterTitle}>帖子分区</h4>
        <div style={styles.typeList}>
          {CONTENT_TYPES.map((type) => (
            <div
              key={type.value}
              style={{
                ...styles.typeItem,
                ...(activeType === type.value ? styles.typeItemActive : {}),
              }}
              onClick={() => handleTypeClick(type.value)}
            >
              <span style={styles.typeIcon}>{type.icon}</span>
              <span style={styles.typeLabel}>{type.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '240px',
    flexShrink: 0,
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  avatarWrapper: {
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: colors.primary.main,
    color: colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 600,
  },
  userName: {
    fontSize: '18px',
    fontWeight: 600,
    color: colors.neutral.text,
    marginBottom: '20px',
  },
  statsGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 600,
    color: colors.neutral.text,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '13px',
    color: colors.neutral.textLight,
  },
  statDivider: {
    width: '1px',
    height: '30px',
    backgroundColor: colors.neutral.border,
  },
  filterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '20px',
    position: 'sticky',
    top: '80px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  filterTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.neutral.text,
    marginBottom: '12px',
  },
  typeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  typeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  typeItemActive: {
    backgroundColor: colors.primary.bg,
  },
  typeIcon: {
    fontSize: '18px',
  },
  typeLabel: {
    fontSize: '14px',
    color: colors.neutral.text,
    fontWeight: 500,
  },
};
