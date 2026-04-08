

import React from 'react'
import ChatList from '../components/chat/ChatList'
import ChatWindow from '../components/chat/ChatWindow'
import UserProfile from '../components/chat/UserProfile'

function ChatPage() {
  return (
    
    <div className='border-2 w-full h-screen flex '>
           <ChatList/>
           <ChatWindow />
           <UserProfile/>
            
         
    </div>
  )
}

export default ChatPage
