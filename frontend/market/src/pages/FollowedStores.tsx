import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Star } from 'lucide-react'
import { followAPI } from '@/api'

export default function FollowedStores() {
  const navigate = useNavigate()
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      setLoading(true)
      const response: any = await followAPI.getList()
      setStores(response.data || [])
    } catch (error) {
      console.error('获取关注店铺失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollow = async (sellerId: number) => {
    if (confirm('确定要取消关注吗？')) {
      try {
        await followAPI.remove(sellerId)
        setStores(stores.filter((store) => store.seller_id !== sellerId))
      } catch (error) {
        console.error('取消关注失败:', error)
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
        <h1 className="text-2xl font-bold text-gray-800">关注的店铺</h1>
        <p className="text-gray-600">共 {stores.length} 家店铺</p>
      </div>

      {stores.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-500 text-lg">暂无关注的店铺</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.follow_id}
              className="bg-white rounded-2xl p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Store className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {store.seller_name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-accent-yellow fill-accent-yellow" />
                      <span className="text-sm text-gray-600 ml-1">
                        {store.avg_score || '5.0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>商品数量：{store.source_count || 0}</span>
                <span>
                  关注时间：
                  {new Date(store.follow_time).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/store/${store.seller_id}`)}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-light transition"
                >
                  进入店铺
                </button>
                <button
                  onClick={() => handleUnfollow(store.seller_id)}
                  className="px-4 py-2 border border-neutral-border rounded-lg hover:bg-gray-50 transition"
                >
                  取消关注
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
