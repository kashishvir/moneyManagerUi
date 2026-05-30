import {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {assets} from "../assets/assets.js";
import Input from "../components/Input.jsx";
import {validateEmail} from "../util/validation.js";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {AppContext} from "../context/AppContext.jsx";
import {LoaderCircle} from "lucide-react";
import Header from "../components/Header.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {setUser} = useContext(AppContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        //basic validation
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        if (!password.trim()) {
            setError("Please enter your password");
            setIsLoading(false);
            return;
        }

        setError("");

        //LOGIN API call
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
                email,
                password,
            });
            const {token, user} = response.data;
            if (token) {
                localStorage.setItem("token", token);
                setUser(user);
                navigate("/dashboard");
            }
        }catch(error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                console.error('Something went wrong', error);
                setError(error.message);
            }
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div className="h-screen w-full flex flex-col relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 -left-10 w-96 h-96 bg-purple-300 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-35 dark:opacity-30 animate-blob"></div>
            <div className="absolute top-0 -right-10 w-96 h-96 bg-indigo-300 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-35 dark:opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-16 left-20 w-96 h-96 bg-pink-300 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-4000"></div>

            <Header />
            <div className="flex-grow w-full relative z-10 flex items-center justify-center px-4 pt-4 pb-16">
                <div className="w-full max-w-md">
                    <div className="glass-panel border border-white/60 dark:border-white/5 rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-purple-500/10 hover:-translate-y-1">
                        <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-700 via-indigo-600 to-violet-800 dark:from-purple-400 dark:via-indigo-400 dark:to-violet-450 bg-clip-text text-transparent text-center mb-2 tracking-tight">
                            Welcome Back
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 dark:text-gray-400 text-center mb-6 font-medium">
                            Please enter your details to login
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email Address"
                                placeholder="name@example.com"
                                type="text"
                            />

                            <Input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                                placeholder="*********"
                                type="password"
                            />

                            {error && (
                                <div className="text-rose-700 dark:text-rose-450 text-xs text-center font-semibold bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 p-3 rounded-xl animate-pulse">
                                    {error}
                                </div>
                            )}

                            <div className="pt-2">
                                <button 
                                    disabled={isLoading} 
                                    className={`btn-primary flex items-center justify-center ${isLoading ? 'opacity-80 cursor-not-allowed': ''}`} 
                                    type="submit"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <LoaderCircle className="animate-spin w-4 h-4 text-white" />
                                            <span>Signing in...</span>
                                        </div>
                                    ) : (
                                        "Sign In to Your Account"
                                    )}
                                </button>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center mt-6 font-medium">
                                Don't have an account?{" "}
                                <Link to="/signup" className="font-bold text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-900/50 hover:text-indigo-800 dark:hover:text-indigo-300 hover:decoration-indigo-500 dark:hover:decoration-indigo-400 transition-all ml-1">Signup</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;