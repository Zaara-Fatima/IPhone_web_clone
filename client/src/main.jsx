import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { Home } from './pages/Home.jsx'
import { iPhone } from './pages/iPhone.jsx'
import { Mac } from './pages/Mac.jsx'
import { Store } from './pages/Store.jsx'
import { Support } from './pages/Support.jsx'
import { Product } from './pages/Product.jsx'
import { element } from 'three/src/nodes/tsl/TSLCore.js'

const route = createBrowserRouter([{
  path:'/',
  element: <Home/>,
  children:[
    {
      index: true,
      element:<Home/>
    },
    {
      path:'iPhones',
      element:<iPhone/>
    },
    {
      path:'Store',
      element:<Store/>,
      children:
        [{path:'product',
        element:<Product/>}]
      
    },
    {
      path:'Mac',
      element:<Mac/>,
      children:[{
        path:'product',
        element:<Product/>
      }]
    },
    {
      path:'Support',
      element:<Support/>,
      children:[{
        path:'product',
        element:<Product/>
      }]
    },
  ]
  }])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={route}>
    <App />
    </RouterProvider>
  </StrictMode>,
)
