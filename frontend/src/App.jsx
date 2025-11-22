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
import HotelOwnerDashboard from "./components/HotelOwnerDashboard.jsx";
import EventOrganizerDashboard from "./components/EventOrganizerDashboard.jsx";
import AIHelp from "./components/AIHelp.jsx";

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
      {
        path: "dashboard/hotel-owner",
        element: <HotelOwnerDashboard />,
      },
      {
        path: "dashboard/event-organizer",
        element: <EventOrganizerDashboard />,
      },
      {
        path: "ai-help",
        element: <AIHelp />,
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