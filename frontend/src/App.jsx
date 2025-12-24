import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { DestinationProvider } from "./Context/PlaceContext.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import MyAccount from "./components/MyAccount.jsx"
import Layout from "./components/Layout.jsx";
import Home from "./components/Home.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import AiPlanner from "./components/AiPlanner.jsx";
import VendorDashboard from "./components/VendorDashboard.jsx";
import ManualExplorer from "./components/ManualExplorer.jsx";
import SmartRoutePlanner from "./components/SmartRoutePlanner.jsx";

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
        element: <UserDashboard />,
      },
      {
        path: "ai-planner",
        element: <AiPlanner />,
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
        path: "MyAccount",
        element: <MyAccount />,
      },
      {
        path: "vendor-dashboard",
        element: <VendorDashboard />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;