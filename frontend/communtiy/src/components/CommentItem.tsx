import { useState } from 'react';
import { colors } from '@/styles/colors';
import type { Comment } from '@/types';

interface CommentItemProps {
  comment: Comment;
  onReply?: (commentId: number) => void;
  onAdopt?: (commentId: number) => void;
  canAdopt?: boolean;
}

export default function CommentItem({ comment, onReply, onAdopt, canAdopt }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div style={styles.comment}>
      <div style={styles.avatar}>
        {comment.user_info.avatar ? (
          <img src={comment.user_info.avatar} alt="" style={styles.avatarImg} />
        ) : (
          <div style={styles.avatarPlaceholder}>
            {comment.user_info.user_name.charAt(0)}
          </div>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.userName}>{comment.user_info.user_name}</span>
          {comment.is_best_answer && (
            <span style={styles.bestAnswerTag}>✓ 最佳答案</span>
          )}
        </div>

        <p style={styles.text}>{comment.comment_text}</p>

        <div style={styles.footer}>
          <span style={styles.time}>{new Date(comment.create_time).toLocaleString()}</span>
          <div style={styles.actions}>
            <button style={styles.actionBtn}>
              👍 {comment.like_count || 0}
            </button>
            {onReply && (
              <button
                style={styles.actionBtn}
                onClick={() => onReply(comment.comment_id)}
              >
                回复
              </button>
            )}
            {canAdopt && !comment.is_best_answer && onAdopt && (
              <button
                style={{ ...styles.actionBtn, color: colors.secondary.gold }}
                onClick={() => onAdopt(comment.comment_id)}
              >
                采纳
              </button>
            )}
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div style={styles.replies}>
            <button
              style={styles.toggleReplies}
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? '收起' : '展开'} {comment.replies.length} 条回复
            </button>
            {showReplies && (
              <div style={styles.replyList}>
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.comment_id}
                    comment={reply}
                    onReply={onReply}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  comment: {
    display: 'flex',
    gap: '12px',
    padding: '16px 0',
    borderBottom: `1px solid ${colors.neutral.border}`,
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
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
  content: {
    flex: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 600,
    color: colors.neutral.text,
  },
  bestAnswerTag: {
    padding: '2px 8px',
    backgroundColor: colors.secondary.gold,
    color: colors.neutral.white,
    borderRadius: '4px',
    fontSize: '12px',
  },
  text: {
    fontSize: '14px',
    color: colors.neutral.text,
    lineHeight: 1.6,
    marginBottom: '8px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: '12px',
    color: colors.neutral.textLighter,
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  actionBtn: {
    background: 'none',
    fontSize: '13px',
    color: colors.neutral.textLight,
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  replies: {
    marginTop: '12px',
  },
  toggleReplies: {
    background: 'none',
    fontSize: '13px',
    color: colors.primary.main,
    padding: '4px 0',
  },
  replyList: {
    marginTop: '8px',
    paddingLeft: '12px',
    borderLeft: `2px solid ${colors.neutral.border}`,
  },
};
