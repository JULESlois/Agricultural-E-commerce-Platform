import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '@/styles/colors';
import { getCategoryTree } from '@/api/content';
import type { Category } from '@/types';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategoryTree();
      setCategories(res.data || []);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    setActiveCategory(categoryId);
    navigate(`/?category=${categoryId}`);
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>内容分类</h3>
        <div style={styles.categoryList}>
          <div
            style={{
              ...styles.categoryItem,
              ...(activeCategory === null ? styles.categoryItemActive : {}),
            }}
            onClick={() => {
              setActiveCategory(null);
              navigate('/');
            }}
          >
            全部
          </div>
          {categories.map((category) => (
            <div key={category.category_id}>
              <div
                style={{
                  ...styles.categoryItem,
                  ...(activeCategory === category.category_id ? styles.categoryItemActive : {}),
                }}
                onClick={() => handleCategoryClick(category.category_id)}
              >
                {category.category_name}
              </div>
              {category.children && category.children.length > 0 && (
                <div style={styles.subCategories}>
                  {category.children.map((sub) => (
                    <div
                      key={sub.category_id}
                      style={{
                        ...styles.subCategoryItem,
                        ...(activeCategory === sub.category_id ? styles.categoryItemActive : {}),
                      }}
                      onClick={() => handleCategoryClick(sub.category_id)}
                    >
                      {sub.category_name}
                    </div>
                  ))}
                </div>
              )}
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
    backgroundColor: colors.neutral.white,
    borderRadius: '8px',
    padding: '20px',
    height: 'fit-content',
    position: 'sticky',
    top: '80px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.neutral.text,
    marginBottom: '12px',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  categoryItem: {
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    color: colors.neutral.text,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  categoryItemActive: {
    backgroundColor: colors.primary.bg,
    color: colors.primary.main,
    fontWeight: 500,
  },
  subCategories: {
    marginLeft: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  subCategoryItem: {
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    color: colors.neutral.textLight,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
