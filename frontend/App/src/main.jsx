import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider } from 'react-router'
import './index.css'
import App from './components/App.jsx'
import Dashboard from './components/Dashboard.jsx'
import SignupForm from './components/SignupForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import CreatePost from './components/CreatePost.jsx'
import PostPage from './components/PostPage.jsx'
import { getToken } from './lib/auth.js'

function requireAuthLoader() {
  const token = getToken()
  if (!token) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/login' },
    })
  }
  return null
}
const router = createBrowserRouter([
  {
    path: "/",
    element:<App/>,
    children:[
      {
        path:"/",
        element: <Dashboard></Dashboard>
      },
      {path:"/signup",
        element: <SignupForm></SignupForm>
      },
      {path:"/login",
        element: <LoginForm></LoginForm>
      },
      {
        path: '/create',
        loader: requireAuthLoader,
        element: <CreatePost />,
      },
      {
        path: '/posts/:postId',
        element: <PostPage />,
      }
    ]
  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
