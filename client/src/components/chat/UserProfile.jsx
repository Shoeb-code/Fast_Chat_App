import React from 'react'
import { useChat } from '../../context/ChatContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, Phone, Info, Image as ImageIcon } from 'lucide-react'

export default function UserProfile() {
  const navigate = useNavigate()
  const { selectedUser } = useChat()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      const response = await logout()
      if (response.success) {
        navigate('/')
      }
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <div className='w-[22%] min-w-[300px] h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white border-l border-gray-800 flex flex-col shadow-2xl'>
      
      {/* Header */}
      <div className='p-6 border-b border-gray-800 flex items-center justify-between'>
        <h2 className='text-xl font-semibold tracking-wide'>Profile</h2>
        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-6 flex flex-col justify-between overflow-y-auto'>

        <div>
          {/* Avatar Section */}
          <div className='flex flex-col items-center text-center'>
            <div className='relative'>
              <img
                src={selectedUser?.photo || 'https://via.placeholder.com/100'}
                alt='profile'
                className='w-28 h-28 rounded-full object-cover border-4 border-violet-600 shadow-lg'
              />
              <div className='absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full'></div>
            </div>

            <h1 className='text-2xl font-bold mt-4'>
              {selectedUser?.fullname || 'Select User'}
            </h1>

            <p className='text-sm text-gray-400 mt-1 px-4'>
              {selectedUser?.status || 'No status available'}
            </p>
          </div>

          {/* Info Cards */}
          <div className='mt-10 space-y-4'>

            <div className='bg-gray-800/70 backdrop-blur-lg rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-800 transition-all shadow-md'>
              <Phone className='text-violet-400' />
              <div>
                <p className='text-xs text-gray-400'>Phone</p>
                <p className='text-sm font-medium'>{selectedUser?.phone || 'N/A'}</p>
              </div>
            </div>

            <div className='bg-gray-800/70 backdrop-blur-lg rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-800 transition-all shadow-md'>
              <Info className='text-blue-400' />
              <div>
                <p className='text-xs text-gray-400'>About</p>
                <p className='text-sm font-medium'>Available for chat</p>
              </div>
            </div>

          </div>

          {/* Media Section */}
          <div className='mt-10'>
            <div className='flex items-center gap-2 mb-4'>
              <ImageIcon className='text-violet-400' />
              <h3 className='text-lg font-semibold'>Media</h3>
            </div>

            <div className='grid grid-cols-3 gap-3'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className='h-20 bg-gray-800 rounded-xl hover:scale-105 hover:bg-gray-700 transition-all cursor-pointer flex items-center justify-center text-gray-500'
                >
                  +
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className='mt-10 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 px-4 py-3 rounded-xl font-semibold shadow-lg'
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )
}
