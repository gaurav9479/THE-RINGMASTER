import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { DestinationProvider } from "./Context/PlaceContext.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ErrorBoundary from "./components/ErrorBoundary.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MyAccount from "./components/MyAccount.jsx"
import Layout from "./components/Layout.jsx";
import Home from "./components/Home.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import AiPlanner from "./components/AiPlanner.jsx";
import VendorDashboard from "./components/VendorDashboard.jsx";
import ManualExplorer from "./components/ManualExplorer.jsx";
import SmartRoutePlanner from "./components/SmartRoutePlanner.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "ai-planner",
        element: (
          <ProtectedRoute>
            <AiPlanner />
          </ProtectedRoute>
        ),
      },
      {
        path: "manual-explorer",
        element: <ManualExplorer />,
      },
      {
        path: "smart-route",
        element: <SmartRoutePlanner />,
      },
      {
        path: "my-account",
        element: (
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        ),
      },
      {
        // Keep old route for backward compatibility
        path: "MyAccount",
        element: (
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        ),
      },
      {
        path: "vendor-dashboard",
        element: (
          <ProtectedRoute allowedRoles={['hotel_owner', 'event_organizer', 'admin']}>
            <VendorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  // Note: AuthProvider is in main.jsx to avoid duplicate wrapping
  return (
    <ErrorBoundary>
      <DestinationProvider>
        <RouterProvider router={router} />

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          theme="light"
        />
      </DestinationProvider>
    </ErrorBoundary>
  );
}

export default App;