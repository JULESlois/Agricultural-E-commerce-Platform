import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Store, Star, Heart } from 'lucide-react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import ProductCard from '@/components/ProductCard'
import { sourceAPI, followAPI } from '@/api'

export default function StoreDetail() {
  const { id } = useParams()
  const [products, setProducts] = useState<any[]>([])
  const [storeInfo, setStoreInfo] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchStoreProducts()
    }
  }, [id])

  const fetchStoreProducts = async () => {
    try {
      setLoading(true)
      // 这里应该有一个获取店铺商品的API，暂时用货源列表代替
      const response: any = await sourceAPI.getList({ seller_id: id })
      setProducts(response.data?.list || [])
      
      // 模拟店铺信息
      setStoreInfo({
        seller_id: id,
        seller_name: '优质农场',
        avg_score: 4.8,
        source_count: response.data?.list?.length || 0,
      })
    } catch (error) {
      console.error('获取店铺商品失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        await followAPI.remove(Number(id))
        setIsFollowing(false)
      } else {
        await followAPI.add({ seller_id: Number(id) })
        setIsFollowing(true)
      }
    } catch (error) {
      console.error('关注操作失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-bg p-6">
      {/* 店铺信息 */}
      <div className="bg-white rounded-2xl p-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mr-6">
              <Store className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {storeInfo?.seller_name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-accent-yellow fill-accent-yellow mr-1" />
                  <span>{storeInfo?.avg_score}</span>
                </div>
                <span>商品：{storeInfo?.source_count}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleFollow}
            className={`px-6 py-3 rounded-xl font-medium transition flex items-center ${
              isFollowing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-primary text-white hover:bg-primary-light'
            }`}
          >
            <Heart
              className={`w-5 h-5 mr-2 ${
                isFollowing ? 'fill-current' : ''
              }`}
            />
            {isFollowing ? '已关注' : '关注店铺'}
          </button>
        </div>
      </div>

      {/* 商品列表 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">店铺商品</h2>
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500 text-lg">该店铺暂无商品</p>
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
    </div>
  )
}
