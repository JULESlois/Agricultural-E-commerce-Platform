import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { footprintAPI } from '@/api'

export default function BrowsingHistory() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const response: any = await footprintAPI.getList({ type: 1, page: 1, pageSize: 50 })
      setHistory(response.data?.list || [])
    } catch (error) {
      console.error('获取浏览历史失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (ids: number[]) => {
    try {
      await footprintAPI.remove(ids)
      setHistory(history.filter((item) => !ids.includes(item.footprint_id)))
    } catch (error) {
      console.error('删除浏览历史失败:', error)
    }
  }

  const handleClearAll = () => {
    if (confirm('确定要清空所有浏览历史吗？')) {
      const ids = history.map((item) => item.footprint_id)
      handleRemove(ids)
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
        <h1 className="text-2xl font-bold text-gray-800">浏览历史</h1>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-red-500 hover:text-red-600 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            清空历史
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-500 text-lg">暂无浏览历史</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6">
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.footprint_id}
                className="flex items-center justify-between p-4 border border-neutral-border rounded-xl hover:bg-gray-50 transition"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">
                    {item.view_obj_name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    浏览时间：{new Date(item.view_time).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove([item.footprint_id])}
                  className="text-gray-400 hover:text-red-500 ml-4"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
