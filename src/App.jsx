import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import DashLayout from "./components/DashLayout"
import Layout from "./components/Layout"
import Login from "./features/auth/Login"
import Public from "./components/Public"
import Welcome from "./features/auth/Welcome"
import TasksList from "./features/tasks/TasksList"
import UsersList from "./features/users/UsersList"
import NewUserForm from './features/users/NewUserForm'
import EditUser from './features/users/EditUser'
import NewTask from './features/tasks/NewTask'
import EditTask from './features/tasks/EditTask'
import Prefetch from "./features/auth/Prefetch"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from "./config/roles"
import useTitle from "./hooks/useTitle"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      {/* Public Routes */}
      <Route index element={<Public />} />
      <Route path='login' element={<Login />} />

      {/* Protected Routes */}
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}>
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>
              <Route index element={<Welcome />} />
              
              <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]}/>}>
                <Route path="users">
                  <Route index element={<UsersList />} />
                  <Route path=":id" element={<EditUser />} />
                  <Route path="new" element={<NewUserForm />} />
                </Route>
              </Route>
              
              <Route path="tasks">
                <Route index element={<TasksList />} />
                <Route path=":id" element={<EditTask />} />
                <Route path="new" element={<NewTask />} />
              </Route>

            </Route>
          </Route>
        </Route>
      </Route>

      
    </Route>
  )
)

const App = () => {
  useTitle('Tech Garage')
return (
  <RouterProvider router={router} />
)
}

export default App