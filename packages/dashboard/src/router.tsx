import ProtectedRoute from "@lootopia/dashboard/features/auth/components/ProtectedRoute"
import IndexPage from "@lootopia/dashboard/pages/(dashboard)/index"
import DashboardLayout from "@lootopia/dashboard/pages/(dashboard)/layout"
import ErrorPage from "@lootopia/dashboard/pages/error"
import HuntPage from "@lootopia/dashboard/pages/hunt"
import HuntCreatePage from "@lootopia/dashboard/pages/hunt/create"
import HuntEditPage from "@lootopia/dashboard/pages/hunt/edit"
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
              {
                path: "/hunt",
                element: <HuntPage />,
              },
              {
                path: "/hunt/create",
                element: <HuntCreatePage />,
              },
              {
                path: "/hunt/:id/edit",
                element: <HuntEditPage />,
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
