import React, { useEffect, useState } from 'react'
import { Camera, Loader2, User, Phone, FileText } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axiosConfig'

function EditProfile({ onClose }) {
  const { user, setUser } = useAuth()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [userData, setUserData] = useState({
    fullname: user?.fullname || '',
    phone: user?.phone || '',
    bio: user?.status || '',
    photo: null
  })

  const [preview, setPreview] = useState(
    user?.photo ||
      `https://ui-avatars.com/api/?name=${user?.fullname || 'User'}`
  )

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleChange = (e) => {
    const { name, value } = e.target

    setUserData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Please upload a valid image')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage('Image should be less than 2MB')
      return
    }

    const imageUrl = URL.createObjectURL(file)

    setUserData((prev) => ({
      ...prev,
      photo: file
    }))

    setPreview(imageUrl)
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const formData = new FormData()

      formData.append('fullname', userData.fullname)
      formData.append('phone', userData.phone)
      formData.append('bio', userData.bio)

      if (userData.photo) {
        formData.append('photo', userData.photo)
      }

      const { data } = await axios.put(
        '/auth/edit-details',
        formData
      )

      if (data.success) {
        setUser(data.user)
        setMessage('Profile updated successfully ✨')

        setTimeout(() => {
          onClose?.()
        }, 1000)
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          'Update failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full max-w-lg mx-auto'>
      <form
        onSubmit={handleSubmit}
        className='space-y-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl'
      >
        <h1 className='text-white text-2xl font-bold text-center'>
          Edit Profile
        </h1>

        {message && (
          <p className='text-sm text-center text-violet-400'>
            {message}
          </p>
        )}

        {/* Avatar */}
        <div className='flex flex-col items-center gap-3'>
          <div className='relative group'>
            <img
              src={preview}
              alt='profile'
              className='w-28 h-28 rounded-full object-cover border-4 border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.4)]'
            />

            <label className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer'>
              <Camera size={22} className='text-white' />
              <input
                type='file'
                accept='image/*'
                onChange={handlePhotoChange}
                className='hidden'
              />
            </label>
          </div>

          <p className='text-xs text-gray-400'>
            Click image to update
          </p>
        </div>

        {/* Full Name */}
        <div className='space-y-2'>
          <label className='text-gray-300 text-sm flex items-center gap-2'>
            <User size={16} />
            Full Name
          </label>

          <input
            type='text'
            name='fullname'
            value={userData.fullname}
            onChange={handleChange}
            className='w-full p-3 rounded-2xl bg-white/5 text-white outline-none border border-white/10 focus:border-violet-500'
          />
        </div>

        {/* Phone */}
        <div className='space-y-2'>
          <label className='text-gray-300 text-sm flex items-center gap-2'>
            <Phone size={16} />
            Phone
          </label>

          <input
            type='text'
            name='phone'
            value={userData.phone}
            onChange={handleChange}
            className='w-full p-3 rounded-2xl bg-white/5 text-white outline-none border border-white/10 focus:border-violet-500'
          />
        </div>

        {/* Bio */}
        <div className='space-y-2'>
          <label className='text-gray-300 text-sm flex items-center gap-2'>
            <FileText size={16} />
            Bio
          </label>

          <textarea
            name='bio'
            rows='4'
            value={userData.bio}
            onChange={handleChange}
            className='w-full p-3 rounded-2xl bg-white/5 text-white outline-none border border-white/10 focus:border-violet-500 resize-none'
          />
        </div>

        {/* Button */}
        <button
          type='submit'
          disabled={loading}
          className='w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg'
        >
          {loading ? (
            <>
              <Loader2 size={18} className='animate-spin' />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  )
}

export default EditProfile