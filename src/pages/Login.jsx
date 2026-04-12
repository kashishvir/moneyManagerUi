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
            setError("Please enter valid email address");
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

        <div className="h-screen w-full flex flex-col bg-slate-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>

            <Header />
            <div className="flex-grow w-full relative z-10 flex items-center justify-center pt-10">

                <div className="w-full max-w-md px-6">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-indigo-500/20 hover:-translate-y-1">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-indigo-600 bg-clip-text text-transparent text-center mb-2">
                            Welcome Back
                        </h3>
                        <p className="text-sm text-slate-500 text-center mb-8 font-medium">
                            Please enter your details to login
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                <div className="text-red-700 text-sm text-center bg-red-100/80 border border-red-200 p-2.5 rounded-lg animate-pulse">
                                    {error}
                                </div>
                            )}

                            <div className="pt-2">
                                <button disabled={isLoading} className={`btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed': ''}`} type="submit">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <LoaderCircle className="animate-spin w-5 h-5 text-white" />
                                            <span>Logging in...</span>
                                        </div>
                                    ) : (
                                        "Sign In to Your Account"
                                    )}
                                </button>
                            </div>

                            <p className="text-sm text-slate-600 text-center mt-6">
                                Don't have an account?{" "}
                                <Link to="/signup" className="font-semibold text-indigo-600 underline decoration-indigo-300 hover:text-indigo-800 hover:decoration-indigo-600 transition-all">Signup</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
}

export default Login;