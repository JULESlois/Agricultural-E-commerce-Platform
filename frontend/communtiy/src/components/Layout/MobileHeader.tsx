import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { colors } from '@/styles/colors';
import { useUserStore } from '@/store/userStore';

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

export default function MobileHeader() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, isLoggedIn } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeType, setActiveType] = useState<number>(0);
  const [userStats, setUserStats] = useState<UserStats>({
    user_name: '游客',
    following_count: 0,
    follower_count: 0,
    post_count: 0,
  });

  useEffect(() => {
    // 获取用户信息
    const token = localStorage.getItem('token');
    if (token && currentUser) {
      setUserStats({
        user_name: currentUser.user_name || '用户',
        avatar: currentUser.avatar,
        following_count: 0,
        follower_count: 0,
        post_count: 0,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    setActiveType(typeParam ? Number(typeParam) : 0);
  }, [searchParams]);

  const handleTypeClick = (type: number) => {
    setActiveType(type);
    setMenuOpen(false);
    if (type === 0) {
      navigate('/');
    } else {
      navigate(`/?type=${type}`);
    }
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.container}>
          <button style={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
            <span style={styles.menuIcon}>{menuOpen ? '✕' : '☰'}</span>
          </button>
          
          <Link to="/" style={styles.logo}>
            智农链
          </Link>
          
          <button style={styles.publishBtn} onClick={() => navigate('/publish')}>
            <span style={styles.publishIcon}>✏️</span>
          </button>
        </div>
      </header>

      {/* 移动端菜单 */}
      {menuOpen && (
        <>
          <div style={styles.overlay} onClick={() => setMenuOpen(false)} />
          <nav style={styles.menu}>
            {/* 用户信息区域 */}
            <div style={styles.menuHeader}>
              <div style={styles.userCard}>
                <div style={styles.avatarWrapper}>
                  {userStats.avatar ? (
                    <img src={userStats.avatar} alt="" style={styles.avatarImg} />
                  ) : (
                    <div style={styles.avatarPlaceholder}>
                      {userStats.user_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={styles.userName}>{userStats.user_name}</div>
                
                {/* 用户统计 */}
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

                {/* 登录按钮 */}
                {!isLoggedIn() && (
                  <button style={styles.loginBtn} onClick={() => {
                    navigate('/login');
                    setMenuOpen(false);
                  }}>
                    登录 / 注册
                  </button>
                )}
              </div>
            </div>

            {/* 滚动内容区域 */}
            <div style={styles.menuContent}>
              {/* 导航菜单 */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>🧭 导航</div>
                <div style={styles.menuList}>
                  <Link to="/" style={styles.menuItem} onClick={() => setMenuOpen(false)}>
                    <span style={styles.menuItemIcon}>🏠</span>
                    <span>首页</span>
                  </Link>
                  <Link to="/publish" style={styles.menuItem} onClick={() => setMenuOpen(false)}>
                    <span style={styles.menuItemIcon}>✏️</span>
                    <span>发布</span>
                  </Link>
                  {isLoggedIn() && (
                    <>
                      <Link to="/my" style={styles.menuItem} onClick={() => setMenuOpen(false)}>
                        <span style={styles.menuItemIcon}>👤</span>
                        <span>我的</span>
                      </Link>
                      <Link to="/my/favorites" style={styles.menuItem} onClick={() => setMenuOpen(false)}>
                        <span style={styles.menuItemIcon}>⭐</span>
                        <span>收藏</span>
                      </Link>
                      <Link to="/my/following" style={styles.menuItem} onClick={() => setMenuOpen(false)}>
                        <span style={styles.menuItemIcon}>👥</span>
                        <span>关注</span>
                      </Link>
                    </>
                  )}
                  <Link to="/market" style={styles.menuItem} onClick={() => setMenuOpen(false)}>
                    <span style={styles.menuItemIcon}>🛒</span>
                    <span>商城</span>
                  </Link>
                </div>
              </div>

              {/* 帖子分区 */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>📋 帖子分区</div>
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
            </div>
          </nav>
        </>
      )}
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: colors.primary.main,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  container: {
    height: '56px',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuBtn: {
    width: '44px',
    height: '44px',
    backgroundColor: 'transparent',
    color: colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
  },
  menuIcon: {
    fontSize: '24px',
  },
  logo: {
    fontSize: '18px',
    fontWeight: 600,
    color: colors.neutral.white,
  },
  publishBtn: {
    width: '44px',
    height: '44px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
  },
  publishIcon: {
    fontSize: '20px',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  menu: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '300px',
    backgroundColor: colors.neutral.white,
    zIndex: 999,
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
  },
  menuHeader: {
    borderBottom: `1px solid ${colors.neutral.border}`,
    flexShrink: 0,
  },
  userCard: {
    padding: '24px 20px',
    textAlign: 'center',
  },
  avatarWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  avatarImg: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: colors.primary.main,
    color: colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 600,
  },
  userName: {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.neutral.text,
    marginBottom: '16px',
  },
  statsGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: '16px',
  },
  statItem: {
    flex: 1,
    cursor: 'pointer',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: 600,
    color: colors.neutral.text,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: colors.neutral.textLight,
  },
  statDivider: {
    width: '1px',
    height: '24px',
    backgroundColor: colors.neutral.border,
  },
  loginBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: colors.primary.main,
    color: colors.neutral.white,
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 500,
  },
  menuContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 0',
  },
  section: {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: `1px solid ${colors.neutral.border}`,
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: colors.neutral.text,
    padding: '0 20px',
    marginBottom: '12px',
  },
  typeList: {
    padding: '0 16px',
  },
  typeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '4px',
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
  menuList: {
    padding: '0 16px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 12px',
    color: colors.neutral.text,
    fontSize: '14px',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
    marginBottom: '4px',
  },
  menuItemIcon: {
    fontSize: '18px',
  },
};
