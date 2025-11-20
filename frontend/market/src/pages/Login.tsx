import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [formData, setFormData] = useState({
    login_identifier: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await login(formData)
      navigate('/')
    } catch (error: any) {
      alert(error.response?.data?.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">农</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">欢迎回来</h1>
            <p className="text-gray-600 mt-2">登录您的账户</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名/手机号
              </label>
              <input
                type="text"
                value={formData.login_identifier}
                onChange={(e) =>
                  setFormData({ ...formData, login_identifier: e.target.value })
                }
                className="w-full px-4 py-3 border border-neutral-border rounded-xl focus:outline-none focus:border-primary"
                placeholder="请输入用户名或手机号"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-neutral-border rounded-xl focus:outline-none focus:border-primary"
                placeholder="请输入密码"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-light transition disabled:bg-gray-300"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              还没有账户？
              <Link to="/register" className="text-primary hover:text-primary-light ml-1">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
