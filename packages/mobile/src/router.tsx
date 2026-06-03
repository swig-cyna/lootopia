import ProtectedRoute from "@lootopia/mobile/features/auth/components/ProtectedRoute"
import AccountPage from "@lootopia/mobile/pages/(tabs)/account"
import ExplorePage from "@lootopia/mobile/pages/(tabs)/explore/index"
import IndexPage from "@lootopia/mobile/pages/(tabs)/index"
import TabsLayout from "@lootopia/mobile/pages/(tabs)/layout"
import ErrorPage from "@lootopia/mobile/pages/error"
import ExploreDetailPage from "@lootopia/mobile/pages/explore/[huntId]"
import HuntPage from "@lootopia/mobile/pages/hunts/[id]"
import ARGamePage from "@lootopia/mobile/pages/hunts/[id]/ar/[pointId]"
import LeaderboardPage from "@lootopia/mobile/pages/hunts/[id]/leaderboard"
import AppLayout from "@lootopia/mobile/pages/layout"
import NotFoundPage from "@lootopia/mobile/pages/not-found"
import SigninPage from "@lootopia/mobile/pages/signin"
import SignupPage from "@lootopia/mobile/pages/signup"
import { createBrowserRouter, RouterProvider } from "react-router"

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
          {
            path: "/hunts/:id/leaderboard",
            element: <LeaderboardPage />,
          },
        ],
      },
      {
        path: "/signin",
        element: <SigninPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
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
