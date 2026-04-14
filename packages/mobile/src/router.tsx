import ProtectedRoute from "@lootopia/mobile/features/auth/components/ProtectedRoute"
import AccountPage from "@lootopia/mobile/pages/(tabs)/account"
import IndexPage from "@lootopia/mobile/pages/(tabs)/index"
import ErrorPage from "@lootopia/mobile/pages/error"
import NotFoundPage from "@lootopia/mobile/pages/not-found"
import SigninPage from "@lootopia/mobile/pages/signin"
import { createBrowserRouter, RouterProvider } from "react-router"
import TabsLayout from "./pages/(tabs)/layout"
import AppLayout from "./pages/layout"

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <TabsLayout />,
            children: [
              {
                path: "/",
                element: <IndexPage />,
              },
              {
                path: "/account",
                element: <AccountPage />,
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
