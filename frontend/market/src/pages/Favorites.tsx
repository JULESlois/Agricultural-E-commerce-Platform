import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import ProductCard from '@/components/ProductCard'
import { collectionAPI } from '@/api'

export default function Favorites() {
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const response: any = await collectionAPI.getList({ type: 1 })
      setCollections(response.data || [])
    } catch (error) {
      console.error('获取收藏失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (id: number) => {
    if (confirm('确定要取消收藏吗？')) {
      try {
        await collectionAPI.remove(id)
        setCollections(collections.filter((item) => item.collection_id !== id))
      } catch (error) {
        console.error('取消收藏失败:', error)
      }
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">我的收藏</h1>
        <p className="text-gray-600">共 {collections.length} 件商品</p>
      </div>

      {collections.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-500 text-lg">暂无收藏</p>
        </div>
      ) : (
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 4, 1200: 5 }}
        >
          <Masonry gutter="1.5rem">
            {collections.map((item) => (
              <div key={item.collection_id} className="relative group">
                <ProductCard
                  product={{
                    source_id: item.source_id,
                    product_name: item.collection_name,
                    unit_price: 0,
                    min_order_quantity: 1,
                    main_image: '',
                  }}
                />
                <button
                  onClick={() => handleRemove(item.collection_id)}
                  className="absolute top-2 right-2 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </div>
  )
}
