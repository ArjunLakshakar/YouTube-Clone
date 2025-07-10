import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ContextProvider from './Service/ModelContext.jsx'

const App = lazy(() => import('./App.jsx'))
const HomePage = lazy(() => import('./Pages/HomePage.jsx'))
const WatchPage = lazy(() => import('./Pages/WatchPage.jsx'))
const NotFound = lazy(() => import('./Pages/NotFound.jsx'))
const ChannelPage = lazy(() => import('./Pages/ChannelPage.jsx'))
const ChannelSettingPage = lazy(() => import('./Pages/ChannelSettingPage.jsx'))
const ChannelContent = lazy(() => import('./Components/Channel/ChannelContent.jsx'))
const SearchPage = lazy(() => import('./Components/Header/SearchPage.jsx'))
const ChannelDashboard = lazy(() => import('./Components/Channel/ChannelDashboard.jsx'))

const appRoutes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />, 
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/watch/:videoId', element: <WatchPage /> },
      { path: '/search/:query', element: <SearchPage /> },
      { path: '/channel', element: <ChannelPage /> },
      { path: '/channel/:channelId', element: <ChannelPage /> },
      { path: '/channelSettings', element: <ChannelSettingPage /> },
      { path: '/channelContent', element: <ChannelContent /> },
      { path: '/dashboard', element: <ChannelDashboard /> },

    ],
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <Suspense fallback={<div className="text-center text-white mt-20">Loading...</div>}>
        <RouterProvider router={appRoutes} />
      </Suspense>
    </ContextProvider>
  </StrictMode>
)
