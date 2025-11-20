import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, User, Bell, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useCartStore } from '@/store/useCartStore'
import { useState } from 'react'

export default function TopBar() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { items } = useCartStore()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?keyword=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-border z-50 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">农</span>
          </div>
          <span className="text-xl font-bold text-gray-800">农产品商城</span>
        </Link>

        {/* 搜索栏 */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索农产品..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-neutral-border focus:outline-none focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </form>

        {/* 右侧操作区 */}
        <div className="flex items-center space-x-6">
          {/* 消息 */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* 购物车 */}
          <Link
            to="/cart"
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          {/* 用户信息 */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.user_name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="text-sm text-gray-700">{user?.user_name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="退出登录"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition"
              >
                登录
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition"
              >
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
