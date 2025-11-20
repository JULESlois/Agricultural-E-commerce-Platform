import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import { orderAPI } from '@/api'

const statusConfig = {
  0: { label: '待付款', icon: Package, color: 'text-yellow-600' },
  1: { label: '待发货', icon: Package, color: 'text-blue-600' },
  2: { label: '待收货', icon: Truck, color: 'text-purple-600' },
  3: { label: '已取消', icon: XCircle, color: 'text-gray-600' },
  4: { label: '已完成', icon: CheckCircle, color: 'text-green-600' },
}

export default function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [activeTab])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (activeTab !== null) {
        params.status = activeTab
      }
      const response: any = await orderAPI.getList(params)
      setOrders(response.data || [])
    } catch (error) {
      console.error('获取订单列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmReceipt = async (orderId: string) => {
    if (confirm('确认收货吗？')) {
      try {
        await orderAPI.confirmReceipt(orderId)
        fetchOrders()
      } catch (error) {
        console.error('确认收货失败:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-neutral-bg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">我的订单</h1>

      {/* 状态标签 */}
      <div className="bg-white rounded-2xl p-4 mb-6">
        <div className="flex space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab(null)}
            className={`px-6 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === null
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            全部订单
          </button>
          {Object.entries(statusConfig).map(([status, config]) => (
            <button
              key={status}
              onClick={() => setActiveTab(Number(status))}
              className={`px-6 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === Number(status)
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* 订单列表 */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-500 text-lg">暂无订单</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.order_status as keyof typeof statusConfig].icon
            const statusColor = statusConfig[order.order_status as keyof typeof statusConfig].color

            return (
              <div
                key={order.order_id}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <StatusIcon className={`w-5 h-5 mr-2 ${statusColor}`} />
                    <span className={`font-medium ${statusColor}`}>
                      {statusConfig[order.order_status as keyof typeof statusConfig].label}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    订单号：{order.order_id}
                  </span>
                </div>

                {/* 商品信息 */}
                <div className="space-y-3 mb-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.main_image || '/placeholder.jpg'}
                        alt={item.product_name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {item.product_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ¥{item.unit_price}/斤 × {item.item_quantity}斤
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-border">
                  <div className="text-sm text-gray-600">
                    {order.seller_name && <span>卖家：{order.seller_name}</span>}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-accent-red">
                      ¥{order.pay_amount}
                    </span>
                    {order.order_status === 0 && (
                      <button
                        onClick={() => navigate(`/payment?order_id=${order.order_id}`)}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition"
                      >
                        去支付
                      </button>
                    )}
                    {order.order_status === 2 && (
                      <button
                        onClick={() => handleConfirmReceipt(order.order_id)}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition"
                      >
                        确认收货
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/orders/${order.order_id}`)}
                      className="px-6 py-2 border border-neutral-border rounded-lg hover:bg-gray-50 transition"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
