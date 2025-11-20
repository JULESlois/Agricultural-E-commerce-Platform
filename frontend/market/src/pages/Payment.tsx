import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { addressAPI, orderAPI } from '@/api'

export default function Payment() {
  const navigate = useNavigate()
  const { getSelectedItems, getTotalPrice, clearCart } = useCartStore()
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState('WECHAT_PAY')
  const [loading, setLoading] = useState(false)

  const selectedItems = getSelectedItems()
  const totalPrice = getTotalPrice()

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response: any = await addressAPI.getList()
      setAddresses(response.data || [])
      const defaultAddr = response.data?.find((addr: any) => addr.is_default)
      setSelectedAddress(defaultAddr || response.data?.[0])
    } catch (error) {
      console.error('获取地址失败:', error)
    }
  }

  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      alert('请选择收货地址')
      return
    }

    if (selectedItems.length === 0) {
      alert('购物车为空')
      return
    }

    try {
      setLoading(true)
      
      // 创建订单
      const orderData = {
        source_id: selectedItems[0].source_id,
        quantity: selectedItems[0].quantity,
        receiver_address_id: selectedAddress.address_id,
      }
      
      const orderResponse: any = await orderAPI.create(orderData)
      const orderId = orderResponse.data.order_id

      // 支付订单
      await orderAPI.pay(orderId, { payment_method: paymentMethod })

      alert('支付成功！')
      clearCart()
      navigate('/orders')
    } catch (error: any) {
      alert(error.response?.data?.message || '支付失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-bg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">确认订单</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 收货地址 */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-bold">收货地址</h2>
            </div>

            {addresses.length === 0 ? (
              <p className="text-gray-500">暂无收货地址</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.address_id}
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition ${
                      selectedAddress?.address_id === addr.address_id
                        ? 'border-primary bg-primary/5'
                        : 'border-neutral-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?.address_id === addr.address_id}
                      onChange={() => setSelectedAddress(addr)}
                      className="hidden"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {addr.receiver} {addr.phone}
                        </p>
                        <p className="text-gray-600 mt-1">{addr.full_address}</p>
                      </div>
                      {addr.is_default && (
                        <span className="px-2 py-1 bg-accent-red text-white text-xs rounded">
                          默认
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 商品列表 */}
          <div className="bg-white rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">商品清单</h2>
            <div className="space-y-4">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
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
                      ¥{item.unit_price}/斤 × {item.quantity}斤
                    </p>
                  </div>
                  <p className="font-bold text-gray-800">
                    ¥{(item.unit_price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 支付方式 */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-bold">支付方式</h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-neutral-border rounded-xl cursor-pointer hover:border-primary/50 transition">
                <input
                  type="radio"
                  name="payment"
                  value="WECHAT_PAY"
                  checked={paymentMethod === 'WECHAT_PAY'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="ml-3">微信支付</span>
              </label>

              <label className="flex items-center p-4 border-2 border-neutral-border rounded-xl cursor-pointer hover:border-primary/50 transition">
                <input
                  type="radio"
                  name="payment"
                  value="ALIPAY"
                  checked={paymentMethod === 'ALIPAY'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="ml-3">支付宝</span>
              </label>
            </div>
          </div>
        </div>

        {/* 订单摘要 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 sticky top-20">
            <h3 className="text-lg font-bold mb-4">订单摘要</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>商品总价</span>
                <span>¥{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>运费</span>
                <span>¥0.00</span>
              </div>
              <div className="border-t border-neutral-border pt-3 flex justify-between text-lg font-bold">
                <span>应付金额</span>
                <span className="text-accent-red">¥{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={loading || !selectedAddress}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-light transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? '提交中...' : '提交订单'}
            </button>

            <div className="mt-4 flex items-start text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <p>点击提交订单即表示您同意《用户协议》和《隐私政策》</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
