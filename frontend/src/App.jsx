import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { DestinationProvider } from "./Context/PlaceContext.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Landing from "./components/Landing.jsx";
import Home from "./components/Home.jsx";
import MyAccount from "./components/MyAccount.jsx"
import MyTrip from "./components/MyTrip.jsx";
import SearchPage from "./components/Search.jsx";
import Results from "./components/Result.jsx";
import LoginModal from "./components/LoginModal.jsx";
import RegisterModal from "./components/RegisterModal.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />, // This has Navbar and Outlet
    children: [
      {
        index: true, // Default route "/"
        element: <Home />, // Your home page content
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "results/:city",
        element: <Results />,
      },
      {
        path: "MyAccount",
        element: <MyAccount />,
      },
      {
        path: "MyTrip",
        element: <MyTrip />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <DestinationProvider>
        <RouterProvider router={router} />
        
        {/* Global Modals */}
        <LoginModal />
        <RegisterModal />
        
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