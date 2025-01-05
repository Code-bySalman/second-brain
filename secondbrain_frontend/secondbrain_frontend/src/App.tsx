import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import SharedContent from "./pages/SharedContent";
import Welcome from "./pages/Welcome";

function App() {
  return (
    <BrowserRouter> {/* BrowserRouter should wrap everything */}
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={
            !!localStorage.getItem("token") ? <Dashboard /> : <Navigate to="/signin" />
          }
        />
        <Route path="/share/:hash" element={<SharedContentWrapper />} />
        <Route path="/" element={<Welcome />} />
      </Routes>
    </AnimatePresence>
  );
}

function SharedContentWrapper() {
  const { hash } = useParams<{ hash: string }>();

  if (hash) {
    return <SharedContent hash={hash} />;
  } else {
    return <div>Invalid share link</div>;
  }
}

export default App;
