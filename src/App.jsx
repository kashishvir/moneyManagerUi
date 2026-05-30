import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Income from "./pages/Income.jsx";
import Expense from "./pages/Expense.jsx";
import Category from "./pages/Category.jsx";
import Filter from "./pages/Filter.jsx";
import AiCoach from "./pages/AiCoach.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import {Toaster} from "react-hot-toast";
import LandingPage from "./pages/LandingPage.jsx";

const App = () => {
    return (
        <>

            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Root />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
                    <Route path="/expense" element={<ProtectedRoute><Expense /></ProtectedRoute>} />
                    <Route path="/category" element={<ProtectedRoute><Category /></ProtectedRoute>} />
                    <Route path="/filter" element={<ProtectedRoute><Filter /></ProtectedRoute>} />
                    <Route path="/ai-coach" element={<ProtectedRoute><AiCoach /></ProtectedRoute>} />
                    
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

const Root = () => {
    const isAuthenticated = !!localStorage.getItem("token");
    return isAuthenticated ? (
        <Navigate to="/dashboard" />
    ) : (
      <Navigate to="/login" />
    );
}

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("token");
    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default App;