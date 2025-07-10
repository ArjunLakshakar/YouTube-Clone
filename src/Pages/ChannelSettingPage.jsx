import React from 'react'
import Sidebar from '../Components/Channel/Sidebar'
import ChannelSettings from '../Components/Channel/ChannelSettings'

const ChannelSettingPage = () => {
  return (
    <div className='flex  '>
        <Sidebar/>
        <ChannelSettings/>
    </div>
  )
}

export default ChannelSettingPage