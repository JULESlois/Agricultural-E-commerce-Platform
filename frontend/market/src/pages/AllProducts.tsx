import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import ProductCard from '@/components/ProductCard'
import { sourceAPI, categoryAPI } from '@/api'
import { SlidersHorizontal } from 'lucide-react'

export default function AllProducts() {
  const { id } = useParams()
  const [products, setProducts] = useState<any[]>([])
  const [category, setCategory] = useState<any>(null)
  const [sortBy, setSortBy] = useState('default')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    fetchCategory()
  }, [id, sortBy])

  const fetchCategory = async () => {
    try {
      const response: any = await categoryAPI.getTree()
      const allCategories = response.data || []
      // 查找当前分类
      const findCategory = (cats: any[]): any => {
        for (const cat of cats) {
          if (cat.category_id === Number(id)) return cat
          if (cat.children) {
            const found = findCategory(cat.children)
            if (found) return found
          }
        }
        return null
      }
      setCategory(findCategory(allCategories))
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params: any = {
        page: 1,
        pageSize: 50,
      }

      if (id !== 'all') {
        params.category_id = id
      }

      if (sortBy === 'price_asc') {
        params.sort = 'price_asc'
      } else if (sortBy === 'price_desc') {
        params.sort = 'price_desc'
      }

      const response: any = await sourceAPI.getList(params)
      setProducts(response.data?.list || [])
    } catch (error) {
      console.error('获取商品列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-bg p-6">
      {/* 分类标题和筛选 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {category?.category_name || '全部商品'}
          </h1>
          <p className="text-gray-600 mt-1">共 {products.length} 件商品</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="default">综合排序</option>
              <option value="price_asc">价格从低到高</option>
              <option value="price_desc">价格从高到低</option>
            </select>
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-500 text-lg">该分类暂无商品</p>
        </div>
      ) : (
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 4, 1200: 5 }}
        >
          <Masonry gutter="1.5rem">
            {products.map((product) => (
              <ProductCard key={product.source_id} product={product} />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </div>
  )
}
