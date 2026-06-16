import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import { Mail, Lock, User, Zap, ArrowRight, CheckCircle } from 'lucide-react'

const schema = z.object({
  fullName: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
})

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      const res = await authApi.register(data)
      login(res.data)
      navigate('/advertiser')
    } catch (e) {
      setError('root', { message: e.response?.data?.error || 'Registration failed' })
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-700 via-indigo-600 to-indigo-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.1),_transparent_60%)]" />
        <div className="flex items-center gap-3 relative">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AdSphere</span>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Start monetizing your traffic today
          </h2>
          <p className="text-indigo-200 text-base mb-10">
            Join thousands of publishers and advertisers on the AdSphere network.
          </p>
          <div className="space-y-4">
            {[
              'Free to register — no credit card needed',
              'Default Advertiser role, upgrade anytime',
              'Real-time analytics and revenue tracking',
              'Transparent 70/20/10 revenue split',
            ].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                <span className="text-indigo-100 text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-indigo-300 text-xs relative">© 2024 AdSphere. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AdSphere</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">You'll start as an Advertiser by default</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input {...register('fullName')} placeholder="John Doe" className="input-icon" />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName.message}</p>}
            </div>

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
                <input {...register('password')} type="password" placeholder="Min. 6 characters" className="input-icon" />
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
                <>Create Account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4 text-center">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>

          <p className="text-sm text-gray-500 mt-5 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
