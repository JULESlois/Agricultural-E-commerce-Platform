import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '@/api'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    user_name: '',
    password: '',
    confirmPassword: '',
    real_name: '',
    user_type: 2, // 默认买家
    id_card: '',
    phone: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('两次密码输入不一致')
      return
    }

    try {
      setLoading(true)
      const { confirmPassword, ...data } = formData
      await authAPI.register(data)
      alert('注册成功，请等待管理员审核')
      navigate('/login')
    } catch (error: any) {
      alert(error.response?.data?.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">农</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">创建账户</h1>
            <p className="text-gray-600 mt-2">加入农产品商城</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用户名 *
                </label>
                <input
                  type="text"
                  value={formData.user_name}
                  onChange={(e) =>
                    setFormData({ ...formData, user_name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-border rounded-xl focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  真实姓名 *
                </label>
                <input
                  type="text"
                  value={formData.real_name}
                  onChange={(e) =>
                    setFormData({ ...formData, real_name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-border rounded-xl focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码 *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-border rounded-xl focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  确认密码 *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-border rounded-xl focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  手机号 *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-border rounded-xl focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  身份证号 *
                </label>
                <input
                  type="text"
                  value={formData.id_card}
                  onChange={(e) =>
                    setFormData({ ...formData, id_card: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-border rounded-xl focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-border rounded-xl focus:outline-none focus:border-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用户类型 *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={1}
                      checked={formData.user_type === 1}
                      onChange={(e) =>
                        setFormData({ ...formData, user_type: Number(e.target.value) })
                      }
                      className="w-4 h-4 text-primary"
                    />
                    <span className="ml-2">农户（卖家）</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={2}
                      checked={formData.user_type === 2}
                      onChange={(e) =>
                        setFormData({ ...formData, user_type: Number(e.target.value) })
                      }
                      className="w-4 h-4 text-primary"
                    />
                    <span className="ml-2">买家</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-light transition disabled:bg-gray-300 mt-6"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              已有账户？
              <Link to="/login" className="text-primary hover:text-primary-light ml-1">
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
