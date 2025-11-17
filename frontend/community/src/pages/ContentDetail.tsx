import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { colors } from '@/styles/colors';
import { getContentDetail, getComments, createComment, toggleLike, toggleCollect } from '@/api/content';
import { adoptBestAnswer } from '@/api/qa';
import { submitReport } from '@/api/report';
import { useUserStore } from '@/store/userStore';
import CommentItem from '@/components/CommentItem';
import type { Content, Comment } from '@/types';

export default function ContentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const [content, setContent] = useState<Content | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadContent();
      loadComments();
    }
  }, [id]);

  const loadContent = async () => {
    try {
      const res = await getContentDetail(Number(id));
      setContent(res.data);
    } catch (error) {
      console.error('加载内容失败:', error);
    }
  };

  const loadComments = async () => {
    try {
      const res = await getComments(Number(id));
      setComments(res.data || []);
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  };

  const handleLike = async () => {
    if (!content) return;
    try {
      await toggleLike(content.content_id, !content.is_liked);
      setContent({
        ...content,
        is_liked: !content.is_liked,
        like_count: content.is_liked ? content.like_count - 1 : content.like_count + 1,
      });
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  const handleCollect = async () => {
    if (!content) return;
    try {
      await toggleCollect(content.content_id, !content.is_collected);
      setContent({
        ...content,
        is_collected: !content.is_collected,
      });
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !id) return;
    setLoading(true);
    try {
      await createComment(Number(id), {
        parent_id: 0,
        comment_text: commentText,
      });
      setCommentText('');
      loadComments();
    } catch (error) {
      console.error('评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptAnswer = async (commentId: number) => {
    if (!id || !window.confirm('确定采纳此答案吗？')) return;
    try {
      await adoptBestAnswer(Number(id), commentId);
      loadContent();
      loadComments();
    } catch (error) {
      console.error('采纳失败:', error);
    }
  };

  if (!content) {
    return <div style={styles.loading}>加载中...</div>;
  }

  const isAuthor = currentUser?.user_id === content.author.user_id;
  const canAdopt = isAuthor && content.content_type === 3 && content.qa_status === 0;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← 返回
        </button>

        <h1 style={styles.title}>{content.content_title}</h1>

        <div style={styles.meta}>
          <div style={styles.author}>
            <div style={styles.avatar}>
              {content.author.avatar ? (
                <img src={content.author.avatar} alt="" style={styles.avatarImg} />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  {content.author.user_name.charAt(0)}
                </div>
              )}
            </div>
            <span style={styles.authorName}>{content.author.user_name}</span>
          </div>
          <span style={styles.time}>
            {new Date(content.create_time).toLocaleString()}
          </span>
        </div>

        {content.reward_amount && (
          <div style={styles.reward}>
            <span style={styles.rewardIcon}>💰</span>
            <span style={styles.rewardText}>悬赏 ¥{content.reward_amount}</span>
            {content.qa_status === 1 && (
              <span style={styles.solvedTag}>已解决</span>
            )}
          </div>
        )}

        <div
          style={styles.body}
          dangerouslySetInnerHTML={{ __html: content.content_text || '' }}
        />

        {content.tags && content.tags.length > 0 && (
          <div style={styles.tags}>
            {content.tags.map((tag) => (
              <span key={tag.tag_id} style={styles.tag}>
                #{tag.tag_name}
              </span>
            ))}
          </div>
        )}

        <div style={styles.actions}>
          <button
            style={{
              ...styles.actionBtn,
              ...(content.is_liked ? styles.actionBtnActive : {}),
            }}
            onClick={handleLike}
          >
            👍 {content.like_count}
          </button>
          <button
            style={{
              ...styles.actionBtn,
              ...(content.is_collected ? styles.actionBtnActive : {}),
            }}
            onClick={handleCollect}
          >
            ⭐ 收藏
          </button>
          <button style={styles.actionBtn}>
            💬 {content.comment_count}
          </button>
        </div>

        <div style={styles.commentSection}>
          <h3 style={styles.commentTitle}>
            评论 ({comments.length})
          </h3>

          <div style={styles.commentInput}>
            <textarea
              style={styles.textarea}
              placeholder="写下你的评论..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              style={styles.submitBtn}
              onClick={handleSubmitComment}
              disabled={loading || !commentText.trim()}
            >
              发布评论
            </button>
          </div>

          <div style={styles.commentList}>
            {comments.map((comment) => (
              <CommentItem
                key={comment.comment_id}
                comment={comment}
                canAdopt={canAdopt}
                onAdopt={handleAdoptAnswer}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
  },
  content: {
    backgroundColor: colors.neutral.white,
    borderRadius: '8px',
    padding: '32px',
  },
  backBtn: {
    background: 'none',
    color: colors.primary.main,
    fontSize: '14px',
    marginBottom: '20px',
    padding: '8px 0',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: colors.neutral.text,
    marginBottom: '16px',
    lineHeight: 1.4,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${colors.neutral.border}`,
  },
  author: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
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
  authorName: {
    fontSize: '15px',
    fontWeight: 600,
    color: colors.neutral.text,
  },
  time: {
    fontSize: '13px',
    color: colors.neutral.textLighter,
  },
  reward: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: colors.secondary.gold + '15',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  rewardIcon: {
    fontSize: '20px',
  },
  rewardText: {
    fontSize: '16px',
    color: colors.secondary.gold,
    fontWeight: 600,
  },
  solvedTag: {
    marginLeft: 'auto',
    padding: '4px 12px',
    backgroundColor: colors.status.success,
    color: colors.neutral.white,
    borderRadius: '6px',
    fontSize: '13px',
  },
  body: {
    fontSize: '16px',
    lineHeight: 1.8,
    color: colors.neutral.text,
    marginBottom: '24px',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px',
  },
  tag: {
    fontSize: '14px',
    color: colors.primary.main,
    backgroundColor: colors.primary.bg,
    padding: '6px 14px',
    borderRadius: '6px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    paddingTop: '24px',
    borderTop: `1px solid ${colors.neutral.border}`,
    marginBottom: '32px',
  },
  actionBtn: {
    padding: '10px 24px',
    backgroundColor: colors.neutral.bg,
    color: colors.neutral.text,
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  actionBtnActive: {
    backgroundColor: colors.primary.bg,
    color: colors.primary.main,
  },
  commentSection: {
    marginTop: '32px',
  },
  commentTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: colors.neutral.text,
    marginBottom: '20px',
  },
  commentInput: {
    marginBottom: '24px',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '12px',
    border: `1px solid ${colors.neutral.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
    marginBottom: '12px',
  },
  submitBtn: {
    padding: '10px 24px',
    backgroundColor: colors.primary.main,
    color: colors.neutral.white,
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  commentList: {
    display: 'flex',
    flexDirection: 'column',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: colors.neutral.textLight,
  },
};
