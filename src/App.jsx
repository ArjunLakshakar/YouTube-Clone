import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Header/Navbar'
import { Outlet } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import { Notifications } from '@mantine/notifications'
import { MantineProvider } from '@mantine/core'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Notifications className='fixed' limit={2} position="center" zIndex={1200} />
        <div className=' dark:bg-black bg-white'>
          <Provider store={store}>
            <Navbar />
            <div className='xs:pt-24 pt-20'>
              <Outlet />
            </div>
          </Provider>
        </div>
      </MantineProvider>
    </>
  )
}

export default App
