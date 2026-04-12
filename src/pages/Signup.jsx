import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import Input from "../components/Input.jsx";
import { validateEmail } from "../util/validation.js";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector.jsx";
import uploadProfileImage from "../util/uploadProfileImage.js";
import Header from "../components/Header.jsx";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let profileImageUrl = "";
        setIsLoading(true);

        //basic validation
        if (!fullName.trim()) {
            setError("Please enter your fullname");
            setIsLoading(false);
            return;
        }

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

        //signup api call
        try {

            //upload image if present
            if (profilePhoto) {
                const imageUrl = await uploadProfileImage(profilePhoto);
                profileImageUrl = imageUrl || "";
            }
            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                fullName,
                email,
                password,
                profileImageUrl
            })
            if (response.status === 201) {
                toast.success(
                    "Account created successfully! You can now log in.",
                    { duration: 4000 }
                );
                navigate("/login");
            }
        } catch (err) {
            console.error('Something went wrong', err);
            if (err.response && err.response.status === 409) {
                setError("This email is already registered. Please login instead.");
            } else if (err.response && err.response.status === 500) {
                setError("This email is already registered, or a server error occurred. Please try logging in or contact support.");
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Registration failed. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-screen w-full flex flex-col bg-slate-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>

            <Header />
            <div className="flex-grow w-full relative z-10 flex items-center justify-center pt-8 pb-4">

                <div className="w-full max-w-lg px-6">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-8 max-h-[85vh] overflow-y-auto custom-scrollbar transform transition-all duration-500 hover:shadow-indigo-500/20">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-indigo-600 bg-clip-text text-transparent text-center mb-2">
                            Create An Account
                        </h3>
                        <p className="text-sm text-slate-500 text-center mb-8 font-medium">
                            Start tracking your spending by joining us today
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex justify-center mb-6">
                                <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <Input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        label="Full Name"
                                        placeholder="John Doe"
                                        type="text"
                                    />
                                </div>

                                <div className="col-span-2 sm:col-span-1">
                                    <Input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        label="Email Address"
                                        placeholder="name@example.com"
                                        type="text"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        label="Password"
                                        placeholder="*********"
                                        type="password"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-700 text-sm text-center bg-red-100/80 border border-red-200 p-2.5 rounded-lg animate-pulse mt-2">
                                    {error}
                                </div>
                            )}

                            <div className="pt-4">
                                <button disabled={isLoading} className={`btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} type="submit">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <LoaderCircle className="animate-spin w-5 h-5 text-white" />
                                            <span>Signing Up...</span>
                                        </div>
                                    ) : (
                                        "Create Your Account"
                                    )}
                                </button>
                            </div>

                            <p className="text-sm text-slate-600 text-center mt-6">
                                Already have an account?{" "}
                                <Link to="/login" className="font-semibold text-indigo-600 underline decoration-indigo-300 hover:text-indigo-800 hover:decoration-indigo-600 transition-all">Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;