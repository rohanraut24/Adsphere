import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { advertiserApi } from '../../api'
import { ArrowLeft, Save } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  budget: z.coerce.number().positive('Must be positive'),
  cpcBid: z.coerce.number().positive('Must be positive'),
  startDate: z.string().min(1, 'Required'),
  endDate: z.string().min(1, 'Required'),
})

export default function CampaignForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setError } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (isEdit) advertiserApi.getCampaign(id).then((r) => reset(r.data))
  }, [id])

  const onSubmit = async (data) => {
    try {
      if (isEdit) await advertiserApi.updateCampaign(id, data)
      else await advertiserApi.createCampaign(data)
      navigate('/advertiser/campaigns')
    } catch (e) {
      setError('root', { message: e.response?.data?.error || 'Failed to save campaign' })
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer text-gray-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Campaign' : 'New Campaign'}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{isEdit ? 'Update your campaign details' : 'Fill in the details to create a new campaign'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
        <div>
          <label className="label">Campaign Name *</label>
          <input {...register('name')} placeholder="e.g. Summer Sale 2024" className="input" />
          {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea {...register('description')} rows={3} placeholder="Brief description of this campaign…" className="input resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Budget ($) *</label>
            <input {...register('budget')} type="number" step="0.01" placeholder="100.00" className="input" />
            {errors.budget && <p className="text-red-500 text-xs mt-1.5">{errors.budget.message}</p>}
          </div>
          <div>
            <label className="label">CPC Bid ($) *</label>
            <input {...register('cpcBid')} type="number" step="0.001" placeholder="0.10" className="input" />
            {errors.cpcBid && <p className="text-red-500 text-xs mt-1.5">{errors.cpcBid.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date *</label>
            <input {...register('startDate')} type="date" className="input" />
            {errors.startDate && <p className="text-red-500 text-xs mt-1.5">{errors.startDate.message}</p>}
          </div>
          <div>
            <label className="label">End Date *</label>
            <input {...register('endDate')} type="date" className="input" />
            {errors.endDate && <p className="text-red-500 text-xs mt-1.5">{errors.endDate.message}</p>}
          </div>
        </div>

        {errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm">{errors.root.message}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
            {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
            {isSubmitting ? 'Saving…' : isEdit ? 'Update Campaign' : 'Create Campaign'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  )
}
