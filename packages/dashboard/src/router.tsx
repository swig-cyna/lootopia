import ProtectedRoute from "@lootopia/dashboard/features/auth/components/ProtectedRoute"
import DashboardLayout from "@lootopia/dashboard/pages/(dashboard)/layout"
import IndexPage from "@lootopia/dashboard/pages/(dashboard)/index"
import ErrorPage from "@lootopia/dashboard/pages/error"
import NotFoundPage from "@lootopia/dashboard/pages/not-found"
import SigninPage from "@lootopia/dashboard/pages/signin"
import { createBrowserRouter, RouterProvider } from "react-router"

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: "/",
                element: <IndexPage />,
              },
            ],
          },
        ],
      },
      {
        path: "/signin",
        element: <SigninPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
])

const Router = () => <RouterProvider router={router} />

export default Router
