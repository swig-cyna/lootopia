import ProtectedRoute from "@lootopia/mobile/features/auth/components/ProtectedRoute"
import AccountPage from "@lootopia/mobile/pages/(tabs)/account"
import ExplorePage from "@lootopia/mobile/pages/(tabs)/explore/index"
import IndexPage from "@lootopia/mobile/pages/(tabs)/index"
import ErrorPage from "@lootopia/mobile/pages/error"
import NotFoundPage from "@lootopia/mobile/pages/not-found"
import ExploreDetailPage from "@lootopia/mobile/pages/explore/[huntId]"
import ARGamePage from "@lootopia/mobile/pages/hunts/[id]/ar/[pointId]"
import HuntPage from "@lootopia/mobile/pages/hunts/[id]"
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
                path: "/explore",
                element: <ExplorePage />,
              },
              {
                path: "/account",
                element: <AccountPage />,
              },
            ],
          },
          {
            path: "/explore/:huntId",
            element: <ExploreDetailPage />,
          },
          {
            path: "/hunts/:id",
            element: <HuntPage />,
          },
          {
            path: "/hunts/:id/ar/:pointId",
            element: <ARGamePage />,
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
