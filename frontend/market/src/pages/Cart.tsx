import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'

export default function Cart() {
  const navigate = useNavigate()
  const {
    items,
    removeItem,
    updateQuantity,
    toggleSelect,
    toggleSelectAll,
    getTotalPrice,
    getSelectedItems,
  } = useCartStore()

  const allSelected = items.length > 0 && items.every((item) => item.selected)
  const selectedItems = getSelectedItems()
  const totalPrice = getTotalPrice()

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('请选择要结算的商品')
      return
    }
    navigate('/payment')
  }

  return (
    <div className="min-h-screen bg-neutral-bg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">购物车</h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">购物车是空的</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition"
          >
            去逛逛
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 商品列表 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 全选栏 */}
            <div className="bg-white rounded-xl p-4 flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 text-primary rounded"
                />
                <span className="ml-3 text-gray-700">全选</span>
              </label>
              <button
                onClick={() => {
                  if (confirm('确定要删除选中的商品吗？')) {
                    selectedItems.forEach((item) => removeItem(item.id))
                  }
                }}
                className="text-red-500 hover:text-red-600 flex items-center text-sm"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                删除选中
              </button>
            </div>

            {/* 商品项 */}
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 flex items-center gap-4"
              >
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelect(item.id)}
                  className="w-5 h-5 text-primary rounded"
                />

                <img
                  src={item.main_image || '/placeholder.jpg'}
                  alt={item.product_name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-2">
                    {item.product_name}
                  </h3>
                  <p className="text-accent-red font-bold">
                    ¥{item.unit_price}/斤
                  </p>
                </div>

                <div className="flex items-center border border-neutral-border rounded-lg">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-neutral-border">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">
                    ¥{(item.unit_price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* 结算区域 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sticky top-20">
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
                <div className="flex justify-between text-gray-600">
                  <span>优惠</span>
                  <span className="text-accent-red">-¥0.00</span>
                </div>
                <div className="border-t border-neutral-border pt-3 flex justify-between text-lg font-bold">
                  <span>合计</span>
                  <span className="text-accent-red">¥{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-light transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                结算（{selectedItems.length}）
              </button>

              <div className="mt-4 text-sm text-gray-500 space-y-1">
                <p>✓ 7天无理由退换</p>
                <p>✓ 48小时内发货</p>
                <p>✓ 品质保证</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
