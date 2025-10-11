import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import Landing from './components/Landing.jsx'
import MyAccount from './components/MyAccount.jsx'
import MyTrip from './components/MyTrip.jsx'
import Search from './components/Search.jsx'
const router=createBrowserRouter([
  {
    path:'/',
    element:<Landing/>,
    children:[{
      index:true,
      element:<Search/>,
    }]
  },
  {
    path:'/MyAccount',
    element:<MyAccount/>
  },
  {
    path:'/MyTrip',
    element:<MyTrip/>
  }
])
function App() {
  return <RouterProvider router={router}/>
}

export default App
