import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { collectionAPI } from '@/api'

interface ProductCardProps {
  product: {
    source_id: number
    product_name: string
    unit_price: number
    min_order_quantity: number
    main_image: string
    origin?: string
    is_discount?: boolean
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const { addItem } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: Date.now(),
      source_id: product.source_id,
      product_name: product.product_name,
      unit_price: product.unit_price,
      quantity: product.min_order_quantity || 1,
      main_image: product.main_image,
      selected: true,
    })
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      if (isFavorite) {
        // 取消收藏逻辑
        setIsFavorite(false)
      } else {
        await collectionAPI.add({
          collection_type: 1,
          source_id: product.source_id,
        })
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('收藏操作失败:', error)
    }
  }

  return (
    <Link
      to={`/product/${product.source_id}`}
      className="block bg-white rounded-2xl overflow-hidden border border-neutral-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* 商品图片 */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.main_image || '/placeholder.jpg'}
          alt={product.product_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.jpg'
          }}
        />
        
        {/* 折扣标签 */}
        {product.is_discount && (
          <div className="absolute top-2 left-2 bg-accent-red text-white px-3 py-1 rounded-full text-sm font-medium">
            限时优惠
          </div>
        )}

        {/* 收藏按钮 */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* 商品信息 */}
      <div className="p-4">
        <h3 className="text-base font-medium text-gray-800 line-clamp-2 mb-2 min-h-[3rem]">
          {product.product_name}
        </h3>

        {product.origin && (
          <p className="text-sm text-gray-500 mb-2">产地：{product.origin}</p>
        )}

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-accent-red">
                ¥{product.unit_price}
              </span>
              <span className="text-sm text-gray-500 ml-1">/斤</span>
            </div>
            {product.min_order_quantity && (
              <p className="text-xs text-gray-400 mt-1">
                起订：{product.min_order_quantity}斤
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-light transition"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  )
}
