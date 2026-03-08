import IndexPage from "@lootopia/dashboard/pages/page"
import { createBrowserRouter, RouterProvider } from "react-router"

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
])

const Router = () => <RouterProvider router={router} />

export default Router
