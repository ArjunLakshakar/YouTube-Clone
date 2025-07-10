import React from 'react'
import MiniSidebar from '../Components/Header/MiniSidebar'
import Channel from '../Components/Channel/Channel'
import Sidebar from '../Components/Channel/Sidebar'

const ChannelPage = () => {
  return (
    <div className='bg-white dark:bg-black'>
      <MiniSidebar />
      <Channel />

    </div>
  )
}

export default ChannelPage