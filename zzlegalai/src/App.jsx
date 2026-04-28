import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import UploadPage from "./components/UploadPage";
import Signup from "./components/Signup";
import ExtractPage from "./components/ExtractPage";
import Summary from "./components/Summary";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Features from "./components/Features";

function Layout({ children }) {
  const location = useLocation();

  const showExtras = location.pathname === "/";

  return (
    <>
      <Navbar />
      {children}

      {showExtras && <Features />}
      {showExtras && <Testimonials />}
      {showExtras && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/extract/:documentId" element={<ExtractPage />} />
          <Route path="/summary/:documentId" element={<Summary />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
