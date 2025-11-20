import { useNavigate } from 'react-router-dom';
import { colors } from '@/styles/colors';
import { useResponsive } from '@/hooks/useResponsive';
import type { Content } from '@/types';

interface ContentCardProps {
  content: Content;
}

export default function ContentCard({ content }: ContentCardProps) {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const getTypeLabel = (type: number) => {
    const labels = { 1: '经验分享', 2: '求助', 3: '问答' };
    return labels[type as keyof typeof labels] || '';
  };

  const getTypeColor = (type: number) => {
    const colorMap = {
      1: colors.primary.main,
      2: colors.secondary.blue,
      3: colors.secondary.gold,
    };
    return colorMap[type as keyof typeof colorMap] || colors.primary.main;
  };

  return (
    <div
      style={{
        ...styles.card,
        ...(isMobile ? styles.cardMobile : {}),
      }}
      onClick={() => navigate(`/content/${content.content_id}`)}
    >
      <div style={styles.header}>
        <div style={styles.author}>
          <div style={{
            ...styles.avatar,
            ...(isMobile ? styles.avatarMobile : {}),
          }}>
            {content.author.avatar ? (
              <img src={content.author.avatar} alt="" style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {content.author.user_name.charAt(0)}
              </div>
            )}
          </div>
          <span style={{
            ...styles.authorName,
            ...(isMobile ? styles.authorNameMobile : {}),
          }}>{content.author.user_name}</span>
        </div>
        <span style={{
          ...styles.typeTag,
          ...(isMobile ? styles.typeTagMobile : {}),
          backgroundColor: getTypeColor(content.content_type) + '20',
          color: getTypeColor(content.content_type),
        }}>
          {getTypeLabel(content.content_type)}
        </span>
      </div>

      <h3 style={{
        ...styles.title,
        ...(isMobile ? styles.titleMobile : {}),
      }}>{content.content_title}</h3>

      {content.content_cover && (
        <img src={content.content_cover} alt="" style={{
          ...styles.cover,
          ...(isMobile ? styles.coverMobile : {}),
        }} />
      )}

      {content.reward_amount && (
        <div style={{
          ...styles.reward,
          ...(isMobile ? styles.rewardMobile : {}),
        }}>
          <span style={styles.rewardIcon}>💰</span>
          <span style={styles.rewardText}>悬赏 ¥{content.reward_amount}</span>
          {content.qa_status === 1 && (
            <span style={styles.solvedTag}>已解决</span>
          )}
        </div>
      )}

      {content.tags && content.tags.length > 0 && (
        <div style={styles.tags}>
          {content.tags.map((tag) => (
            <span key={tag.tag_id} style={{
              ...styles.tag,
              ...(isMobile ? styles.tagMobile : {}),
            }}>
              #{tag.tag_name}
            </span>
          ))}
        </div>
      )}

      <div style={styles.footer}>
        <span style={{
          ...styles.stat,
          ...(isMobile ? styles.statMobile : {}),
        }}>👁 {content.view_count}</span>
        <span style={{
          ...styles.stat,
          ...(isMobile ? styles.statMobile : {}),
        }}>👍 {content.like_count}</span>
        <span style={{
          ...styles.stat,
          ...(isMobile ? styles.statMobile : {}),
        }}>💬 {content.comment_count}</span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: `1px solid ${colors.neutral.border}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  cardMobile: {
    borderRadius: '8px',
    padding: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  author: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarMobile: {
    width: '28px',
    height: '28px',
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
    fontSize: '14px',
    fontWeight: 600,
  },
  authorName: {
    fontSize: '14px',
    color: colors.neutral.text,
  },
  authorNameMobile: {
    fontSize: '13px',
  },
  typeTag: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 500,
    flexShrink: 0,
  },
  typeTagMobile: {
    padding: '3px 10px',
    fontSize: '11px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: colors.neutral.text,
    marginBottom: '12px',
    lineHeight: 1.4,
  },
  titleMobile: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  cover: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginBottom: '12px',
  },
  coverMobile: {
    height: '160px',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  reward: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: colors.secondary.gold + '15',
    borderRadius: '6px',
    marginBottom: '12px',
  },
  rewardMobile: {
    padding: '8px 10px',
    marginBottom: '10px',
  },
  rewardIcon: {
    fontSize: '16px',
  },
  rewardText: {
    fontSize: '14px',
    color: colors.secondary.gold,
    fontWeight: 600,
  },
  solvedTag: {
    marginLeft: 'auto',
    padding: '2px 8px',
    backgroundColor: colors.status.success,
    color: colors.neutral.white,
    borderRadius: '4px',
    fontSize: '12px',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  tag: {
    fontSize: '13px',
    color: colors.primary.main,
    backgroundColor: colors.primary.bg,
    padding: '4px 10px',
    borderRadius: '4px',
  },
  tagMobile: {
    fontSize: '12px',
    padding: '3px 8px',
  },
  footer: {
    display: 'flex',
    gap: '16px',
    paddingTop: '12px',
    borderTop: `1px solid ${colors.neutral.border}`,
  },
  stat: {
    fontSize: '13px',
    color: colors.neutral.textLight,
  },
  statMobile: {
    fontSize: '12px',
  },
};
