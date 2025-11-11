import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '@/styles/colors';
import { createContent, getCategoryTree, searchTags } from '@/api/content';
import type { Category, Tag } from '@/types';

// 背景图路径 - 与主页使用相同的背景图
const BACKGROUND_IMAGE = '/src/assets/background.jpg';

export default function Publish() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    category_id: 0,
    content_type: 1,
    content_title: '',
    content_text: '',
    content_cover: '',
    reward_amount: '',
  });
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagKeyword, setTagKeyword] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (tagKeyword) {
      searchTagsDebounced();
    } else {
      setTagSuggestions([]);
    }
  }, [tagKeyword]);

  const loadCategories = async () => {
    try {
      const res = await getCategoryTree();
      setCategories(res.data || []);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const searchTagsDebounced = async () => {
    try {
      const res = await searchTags(tagKeyword);
      setTagSuggestions(res.data || []);
    } catch (error) {
      console.error('搜索标签失败:', error);
    }
  };

  const handleAddTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.tag_id === tag.tag_id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagKeyword('');
    setTagSuggestions([]);
  };

  const handleRemoveTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter((t) => t.tag_id !== tagId));
  };

  const handleSubmit = async () => {
    if (!formData.content_title.trim() || !formData.content_text.trim()) {
      alert('请填写标题和内容');
      return;
    }
    if (!formData.category_id) {
      alert('请选择分类');
      return;
    }

    setLoading(true);
    try {
      const res = await createContent({
        ...formData,
        tag_ids: selectedTags.map((t) => t.tag_id),
      });
      alert('发布成功！');
      navigate(`/content/${res.data.content_id}`);
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryOptions = (cats: Category[], level = 0): JSX.Element[] => {
    const options: JSX.Element[] = [];
    cats.forEach((cat) => {
      options.push(
        <option key={cat.category_id} value={cat.category_id}>
          {'　'.repeat(level)}{cat.category_name}
        </option>
      );
      if (cat.children && cat.children.length > 0) {
        options.push(...renderCategoryOptions(cat.children, level + 1));
      }
    });
    return options;
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.title}>发布内容</h1>

        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>内容类型</label>
            <div style={styles.typeButtons}>
              {[
                { value: 1, label: '经验分享' },
                { value: 2, label: '求助' },
                { value: 3, label: '问题咨询' },
              ].map((type) => (
                <button
                  key={type.value}
                  style={{
                    ...styles.typeBtn,
                    ...(formData.content_type === type.value ? styles.typeBtnActive : {}),
                  }}
                  onClick={() => setFormData({ ...formData, content_type: type.value })}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>分类</label>
            <select
              style={styles.select}
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
            >
              <option value={0}>请选择分类</option>
              {renderCategoryOptions(categories)}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>标题</label>
            <input
              type="text"
              style={styles.input}
              placeholder="请输入标题"
              value={formData.content_title}
              onChange={(e) => setFormData({ ...formData, content_title: e.target.value })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>内容</label>
            <textarea
              style={styles.textarea}
              placeholder="请输入内容"
              value={formData.content_text}
              onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>封面图片（可选）</label>
            <input
              type="text"
              style={styles.input}
              placeholder="请输入图片URL"
              value={formData.content_cover}
              onChange={(e) => setFormData({ ...formData, content_cover: e.target.value })}
            />
          </div>

          {formData.content_type === 3 && (
            <div style={styles.formGroup}>
              <label style={styles.label}>悬赏金额（可选）</label>
              <input
                type="number"
                style={styles.input}
                placeholder="请输入悬赏金额"
                value={formData.reward_amount}
                onChange={(e) => setFormData({ ...formData, reward_amount: e.target.value })}
              />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>标签</label>
            <div style={styles.tagInput}>
              <input
                type="text"
                style={styles.input}
                placeholder="搜索或添加标签"
                value={tagKeyword}
                onChange={(e) => setTagKeyword(e.target.value)}
              />
              {tagSuggestions.length > 0 && (
                <div style={styles.tagSuggestions}>
                  {tagSuggestions.map((tag) => (
                    <div
                      key={tag.tag_id}
                      style={styles.tagSuggestion}
                      onClick={() => handleAddTag(tag)}
                    >
                      {tag.tag_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={styles.selectedTags}>
              {selectedTags.map((tag) => (
                <span key={tag.tag_id} style={styles.selectedTag}>
                  #{tag.tag_name}
                  <button
                    style={styles.removeTagBtn}
                    onClick={() => handleRemoveTag(tag.tag_id)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div style={styles.actions}>
            <button
              style={styles.cancelBtn}
              onClick={() => navigate(-1)}
            >
              取消
            </button>
            <button
              style={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '发布中...' : '发布'}
            </button>
          </div>
        </div>
        </div>
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
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: colors.neutral.text,
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: colors.neutral.text,
  },
  typeButtons: {
    display: 'flex',
    gap: '12px',
  },
  typeBtn: {
    padding: '10px 24px',
    backgroundColor: colors.neutral.bg,
    color: colors.neutral.text,
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  typeBtnActive: {
    backgroundColor: colors.primary.main,
    color: colors.neutral.white,
  },
  select: {
    padding: '12px',
    border: `1px solid ${colors.neutral.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: colors.neutral.white,
  },
  input: {
    padding: '12px',
    border: `1px solid ${colors.neutral.border}`,
    borderRadius: '8px',
    fontSize: '14px',
  },
  textarea: {
    padding: '12px',
    border: `1px solid ${colors.neutral.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    minHeight: '200px',
    resize: 'vertical',
  },
  tagInput: {
    position: 'relative',
  },
  tagSuggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.neutral.white,
    border: `1px solid ${colors.neutral.border}`,
    borderRadius: '8px',
    marginTop: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 10,
  },
  tagSuggestion: {
    padding: '10px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  selectedTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  selectedTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: colors.primary.bg,
    color: colors.primary.main,
    borderRadius: '6px',
    fontSize: '14px',
  },
  removeTagBtn: {
    background: 'none',
    color: colors.primary.main,
    fontSize: '18px',
    padding: '0 4px',
    lineHeight: 1,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '16px',
  },
  cancelBtn: {
    padding: '12px 32px',
    backgroundColor: colors.neutral.bg,
    color: colors.neutral.text,
    borderRadius: '8px',
    fontSize: '14px',
  },
  submitBtn: {
    padding: '12px 32px',
    backgroundColor: colors.primary.main,
    color: colors.neutral.white,
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
};
