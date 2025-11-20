import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import ProductCard from '@/components/ProductCard'
import { sourceAPI, categoryAPI } from '@/api'
import { ChevronRight } from 'lucide-react'

export default function Home() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [searchParams])

  const fetchCategories = async () => {
    try {
      const response: any = await categoryAPI.getTree()
      setCategories(response.data || [])
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const keyword = searchParams.get('keyword')
      const response: any = await sourceAPI.getList({
        keyword,
        page: 1,
        pageSize: 50,
      })
      setProducts(response.data?.list || [])
    } catch (error) {
      console.error('获取商品列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* 促销横幅 */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white p-8 rounded-2xl mx-6 mt-6">
        <h2 className="text-3xl font-bold mb-2">新鲜农产品 直达您家</h2>
        <p className="text-lg opacity-90">优质货源 · 产地直供 · 品质保证</p>
      </div>

      {/* 分类导航 */}
      <div className="mx-6 mt-6 bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">商品分类</h3>
          <button className="text-primary hover:text-primary-light flex items-center text-sm">
            查看全部
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {categories.slice(0, 8).map((category) => (
            <a
              key={category.category_id}
              href={`/category/${category.category_id}`}
              className="flex flex-col items-center p-4 rounded-xl hover:bg-primary/5 transition group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/20 transition">
                {category.category_icon ? (
                  <img
                    src={category.category_icon}
                    alt={category.category_name}
                    className="w-10 h-10"
                  />
                ) : (
                  <span className="text-2xl">🌾</span>
                )}
              </div>
              <span className="text-sm text-gray-700 text-center">
                {category.category_name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* 商品列表 */}
      <div className="mx-6 mt-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {searchParams.get('keyword') ? '搜索结果' : '热门商品'}
        </h3>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : products.length > 0 ? (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 4, 1200: 5 }}
          >
            <Masonry gutter="1.5rem">
              {products.map((product) => (
                <ProductCard key={product.source_id} product={product} />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">暂无商品</p>
          </div>
        )}
      </div>
    </div>
  )
}
