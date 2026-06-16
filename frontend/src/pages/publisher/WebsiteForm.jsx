import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { publisherApi } from '../../api'
import { ArrowLeft, Save } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Enter a valid URL (https://...)'),
  category: z.string().min(1, 'Category is required'),
})

const CATEGORIES = ['Technology', 'News', 'Entertainment', 'Sports', 'Finance', 'Health', 'Education', 'Lifestyle', 'Travel', 'Food', 'Other']

export default function WebsiteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setError } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (isEdit) publisherApi.getWebsite(id).then((r) => reset(r.data))
  }, [id])

  const onSubmit = async (data) => {
    try {
      if (isEdit) await publisherApi.updateWebsite(id, data)
      else await publisherApi.createWebsite(data)
      navigate('/publisher/websites')
    } catch (e) {
      setError('root', { message: e.response?.data?.error || 'Failed to save website' })
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer text-gray-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Website' : 'Register Website'}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? 'Update your website details' : 'Register your website to start displaying ads and earning revenue'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
        <div>
          <label className="label">Website Name *</label>
          <input {...register('name')} placeholder="e.g. My Tech Blog" className="input" />
          {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Website URL *</label>
          <input {...register('url')} placeholder="https://mysite.com" className="input" />
          {errors.url && <p className="text-red-500 text-xs mt-1.5">{errors.url.message}</p>}
        </div>

        <div>
          <label className="label">Category *</label>
          <select {...register('category')} className="input">
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1.5">{errors.category.message}</p>}
        </div>

        {!isEdit && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-amber-800 mb-1">After registration</p>
            <p className="text-amber-700 text-xs">Your website will be submitted for review by a Network Admin. Once approved, you can start adding ad placements.</p>
          </div>
        )}

        {errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm">{errors.root.message}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
            {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
            {isSubmitting ? 'Saving…' : isEdit ? 'Update Website' : 'Register Website'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  )
}
