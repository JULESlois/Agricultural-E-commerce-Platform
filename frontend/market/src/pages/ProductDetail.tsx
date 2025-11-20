import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, ShoppingCart, Store } from 'lucide-react'
import { sourceAPI } from '@/api'
import { useCartStore } from '@/store/useCartStore'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem } = useCartStore()

  useEffect(() => {
    if (id) {
      fetchProductDetail()
    }
  }, [id])

  const fetchProductDetail = async () => {
    try {
      const response: any = await sourceAPI.getDetail(Number(id))
      setProduct(response.data)
      setQuantity(response.data.min_order_quantity || 1)
    } catch (error) {
      console.error('获取商品详情失败:', error)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: Date.now(),
        source_id: product.source_id,
        product_name: product.product_name,
        unit_price: product.unit_price,
        quantity,
        main_image: product.main_image,
        selected: true,
      })
      alert('已添加到购物车')
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const images = product.product_images
    ? JSON.parse(product.product_images)
    : [product.main_image]

  return (
    <div className="min-h-screen bg-neutral-bg p-6">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        返回
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：图片区域 */}
        <div>
          <div className="bg-white rounded-2xl p-6">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
              <img
                src={images[selectedImage] || '/placeholder.jpg'}
                alt={product.product_name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 缩略图 */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.product_name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右侧：商品信息 */}
        <div>
          <div className="bg-white rounded-2xl p-6 sticky top-20">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {product.product_name}
            </h1>

            {/* 价格 */}
            <div className="bg-accent-red/10 rounded-xl p-4 mb-6">
              <div className="flex items-baseline">
                <span className="text-sm text-gray-600 mr-2">价格：</span>
                <span className="text-4xl font-bold text-accent-red">
                  ¥{product.unit_price}
                </span>
                <span className="text-gray-600 ml-2">/斤</span>
              </div>
              {product.batch_price && (
                <p className="text-sm text-gray-600 mt-2">
                  批发价：¥{product.batch_price}/斤（≥{product.batch_quantity}斤）
                </p>
              )}
            </div>

            {/* 商品信息 */}
            <div className="space-y-3 mb-6">
              {product.origin && (
                <div className="flex">
                  <span className="text-gray-600 w-20">产地：</span>
                  <span className="text-gray-800">{product.origin}</span>
                </div>
              )}
              {product.product_spec && (
                <div className="flex">
                  <span className="text-gray-600 w-20">规格：</span>
                  <span className="text-gray-800">{product.product_spec}</span>
                </div>
              )}
              <div className="flex">
                <span className="text-gray-600 w-20">库存：</span>
                <span className="text-gray-800">
                  {product.surplus_quantity}斤
                </span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-20">起订量：</span>
                <span className="text-gray-800">
                  {product.min_order_quantity}斤
                </span>
              </div>
            </div>

            {/* 数量选择 */}
            <div className="flex items-center mb-6">
              <span className="text-gray-600 mr-4">数量：</span>
              <div className="flex items-center border border-neutral-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(product.min_order_quantity, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 text-center border-x border-neutral-border py-2"
                  min={product.min_order_quantity}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <span className="text-gray-600 ml-4">斤</span>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-accent-yellow text-gray-800 py-3 rounded-xl font-medium hover:bg-accent-yellow/80 transition flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                加入购物车
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-light transition"
              >
                立即购买
              </button>
            </div>

            {/* 辅助操作 */}
            <div className="flex gap-4">
              <button className="flex-1 border border-neutral-border py-2 rounded-xl hover:bg-gray-50 transition flex items-center justify-center">
                <Heart className="w-5 h-5 mr-2" />
                收藏
              </button>
              <button className="flex-1 border border-neutral-border py-2 rounded-xl hover:bg-gray-50 transition flex items-center justify-center">
                <Share2 className="w-5 h-5 mr-2" />
                分享
              </button>
            </div>

            {/* 店铺信息 */}
            {product.seller_info && (
              <div className="mt-6 pt-6 border-t border-neutral-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Store className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="font-medium">
                      {product.seller_info.farm_name}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/store/${product.seller_info.user_id}`)}
                    className="text-primary hover:text-primary-light text-sm"
                  >
                    进入店铺 →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 商品详情 */}
      {product.product_desc && (
        <div className="mt-8 bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">商品详情</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product.product_desc }}
          />
        </div>
      )}
    </div>
  )
}
