import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { publisherApi } from '../api'
import { ShieldCheck, X, ChevronDown } from 'lucide-react'

const schema = z.object({
  reason: z.string().min(20, 'Please provide at least 20 characters explaining your request'),
})

export default function UpgradeRequestModal({ currentRole, onClose }) {
  const targetRole = currentRole === 'ADVERTISER' ? 'PUBLISHER' : 'NETWORK_ADMIN'
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      await publisherApi.createUpgradeRequest({ requestedRole: targetRole, reason: data.reason })
      setSuccess(true)
    } catch (e) {
      setError('root', { message: e.response?.data?.error || 'Failed to submit request' })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer">
          <X size={16} />
        </button>

        {success ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <ShieldCheck size={28} className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Request Submitted!</h2>
            <p className="text-sm text-gray-500 mb-6">
              Your upgrade request to <strong>{targetRole.replace('_', ' ')}</strong> has been sent to the Super Admin for review. You'll be notified once a decision is made.
            </p>
            <button onClick={onClose} className="btn-primary px-6">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <ShieldCheck size={20} className="text-violet-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Request Role Upgrade</h2>
                <p className="text-xs text-gray-500">Current: <strong>{currentRole}</strong> → Requesting: <strong>{targetRole.replace('_', ' ')}</strong></p>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5 text-sm text-indigo-700">
              {targetRole === 'PUBLISHER' ? (
                <p>As a <strong>Publisher</strong> you can register websites, create ad placements, and earn <strong>70% revenue</strong> on every click.</p>
              ) : (
                <p>As a <strong>Network Admin</strong> you can approve/reject publisher websites and advertiser campaigns across the network.</p>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Why do you want this role? *</label>
                <textarea
                  {...register('reason')}
                  rows={4}
                  placeholder={targetRole === 'PUBLISHER'
                    ? 'e.g. I own a tech blog at example.com with 10k monthly visitors and want to monetize it through AdSphere...'
                    : 'e.g. I have 3 years of experience managing ad networks and want to help grow the AdSphere ecosystem...'
                  }
                  className="input resize-none"
                />
                {errors.reason && <p className="text-red-500 text-xs mt-1.5">{errors.reason.message}</p>}
              </div>

              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-red-600 text-sm">{errors.root.message}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {isSubmitting
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <ShieldCheck size={14} />}
                  {isSubmitting ? 'Submitting…' : 'Submit Request'}
                </button>
                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
