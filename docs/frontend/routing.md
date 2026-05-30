# Routing

Both apps use React Router's declarative config in `src/router.tsx` — not file-based routing.

## Dashboard

```tsx
createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        element: <ProtectedRoute />, // auth guard + role check
        children: [
          {
            element: <DashboardLayout />, // sidebar layout
            children: [
              { path: "/", element: <IndexPage /> },
              { path: "/hunt", element: <HuntPage /> },
              { path: "/hunt/create", element: <HuntCreatePage /> },
              { path: "/hunt/:id/edit", element: <HuntEditPage /> },
            ],
          },
        ],
      },
      { path: "/signin", element: <SigninPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
```

## Mobile

```tsx
createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <TabsLayout />, // bottom tab bar
            children: [
              { path: "/", element: <IndexPage /> },
              { path: "/explore", element: <ExplorePage /> },
              { path: "/account", element: <AccountPage /> },
            ],
          },
          { path: "/explore/:huntId", element: <ExploreDetailPage /> },
          { path: "/hunts/:id", element: <HuntPage /> },
          { path: "/hunts/:id/ar/:pointId", element: <ARGamePage /> },
        ],
      },
      { path: "/signin", element: <SigninPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
```

## ProtectedRoute

Both apps share the same guard pattern. The dashboard version additionally blocks players.

```tsx
// dashboard — blocks unauthenticated users AND players
const ProtectedRoute = () => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null
  if (!session) return <Navigate to="/signin" replace />
  if (session.user.role === ROLES.PLAYER)
    return <Navigate to="/signin" replace />

  return <Outlet />
}

// mobile — blocks only unauthenticated users
const ProtectedRoute = () => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null
  if (!session) return <Navigate to="/signin" replace />

  return <Outlet />
}
```

## Pages

Pages are thin entry points — they compose features and handle route params. No business logic.

```tsx
// pages/hunt/edit.tsx
const HuntEditPage = () => {
  const { id } = useParams<{ id: string }>()
  return <HuntEdit huntId={id!} />
}
```
