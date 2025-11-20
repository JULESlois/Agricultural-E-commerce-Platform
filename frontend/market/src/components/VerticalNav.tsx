import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  ShoppingBag,
  Heart,
  Store,
  History,
  User,
  Package,
} from 'lucide-react'

const navItems = [
  { icon: Home, label: '首页', path: '/' },
  { icon: ShoppingBag, label: '全部分类', path: '/category/all' },
  { icon: Heart, label: '我的收藏', path: '/favorites' },
  { icon: Store, label: '关注店铺', path: '/stores' },
  { icon: History, label: '浏览历史', path: '/history' },
  { icon: Package, label: '我的订单', path: '/orders' },
  { icon: User, label: '个人中心', path: '/profile' },
]

export default function VerticalNav() {
  const location = useLocation()

  return (
    <nav className="fixed left-0 top-16 bottom-0 w-16 bg-white border-r border-neutral-border z-40 flex flex-col items-center py-4 space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.path

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`
              group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all
              ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
              }
            `}
            title={item.label}
          >
            <Icon className="w-6 h-6" />
            
            {/* 悬停提示 */}
            <div className="absolute left-full ml-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
              {item.label}
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
