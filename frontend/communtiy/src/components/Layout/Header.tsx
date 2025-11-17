import { Link, useNavigate } from 'react-router-dom';
import { colors } from '@/styles/colors';
import { useUserStore } from '@/store/userStore';

export default function Header() {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn } = useUserStore();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          智农链社区
        </Link>
        
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>首页</Link>
          <Link to="/publish" style={styles.navLink}>发布</Link>
          {isLoggedIn() ? (
            <>
              <Link to="/my" style={styles.navLink}>我的</Link>
              <div style={styles.avatar}>
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="" style={styles.avatarImg} />
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    {currentUser?.user_name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </>
          ) : (
            <button style={styles.loginBtn} onClick={() => navigate('/login')}>
              登录
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: colors.primary.main,
    borderBottom: `1px solid ${colors.primary.dark}`,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 600,
    color: colors.neutral.white,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    color: colors.neutral.white,
    fontSize: '15px',
    transition: 'opacity 0.2s',
    opacity: 0.9,
  },
  loginBtn: {
    padding: '8px 20px',
    backgroundColor: colors.neutral.white,
    color: colors.primary.main,
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary.light,
    color: colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 600,
  },
};
