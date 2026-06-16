import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import { Mail, Lock, Zap, ArrowRight } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

const ROLE_REDIRECT = {
  SUPER_ADMIN: '/admin',
  NETWORK_ADMIN: '/network/websites',
  PUBLISHER: '/publisher',
  ADVERTISER: '/advertiser',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      const res = await authApi.login(data)
      login(res.data)
      navigate(ROLE_REDIRECT[res.data.role] || '/advertiser')
    } catch (e) {
      setError('root', { message: e.response?.data?.error || 'Invalid email or password' })
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),_transparent_60%)]" />
        <div className="flex items-center gap-3 relative">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AdSphere</span>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            The complete ad management platform
          </h2>
          <p className="text-indigo-200 text-base leading-relaxed">
            Manage campaigns, track analytics, and grow your revenue — all in one place.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[['Publishers', '70% revenue share'], ['Advertisers', 'CPC-based campaigns'], ['Network Admins', 'Full approval control'], ['Super Admins', 'Platform-wide oversight']].map(([role, desc]) => (
              <div key={role} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-white font-semibold text-sm">{role}</p>
                <p className="text-indigo-200 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-indigo-300 text-xs relative">© 2024 AdSphere. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AdSphere</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input {...register('email')} placeholder="you@example.com" className="input-icon" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input {...register('password')} type="password" placeholder="••••••••" className="input-icon" />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">{errors.root.message}</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Create one</Link>
          </p>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-semibold text-amber-800 mb-2">Demo accounts</p>
            <div className="space-y-1 text-xs text-amber-700">
              <p>All new registrations default to <strong>Advertiser</strong></p>
              <p>Request role upgrade from your dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
