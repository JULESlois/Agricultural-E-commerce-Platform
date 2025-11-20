import { useEffect, useState } from 'react'
import { User, Mail, Phone, CreditCard, Edit } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export default function UserProfile() {
  const { user, fetchUserInfo } = useAuthStore()
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-bg p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">个人中心</h1>

        {/* 用户信息卡片 */}
        <div className="bg-white rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">基本信息</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center text-primary hover:text-primary-light"
            >
              <Edit className="w-4 h-4 mr-1" />
              {editing ? '取消编辑' : '编辑资料'}
            </button>
          </div>

          <div className="flex items-center mb-8">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.user_name}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            <div className="ml-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {user.real_name || user.user_name}
              </h3>
              <p className="text-gray-600 mt-1">
                {user.user_type === 1 ? '农户（卖家）' : '买家'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <User className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">用户名</p>
                <p className="font-medium text-gray-800">{user.user_name}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">手机号</p>
                <p className="font-medium text-gray-800">{user.phone || '未设置'}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">邮箱</p>
                <p className="font-medium text-gray-800">{user.email || '未设置'}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">认证状态</p>
                <p className="font-medium text-gray-800">
                  {user.cert_status === 1 ? '已认证' : '未认证'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 账户统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-primary mb-2">0</p>
            <p className="text-gray-600">待付款订单</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-primary mb-2">0</p>
            <p className="text-gray-600">待收货订单</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-primary mb-2">0</p>
            <p className="text-gray-600">已完成订单</p>
          </div>
        </div>
      </div>
    </div>
  )
}
