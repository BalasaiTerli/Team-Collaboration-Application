import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const googleClientId = "79843472734-cl1a0gjvq5179v94hdva4g2re507sjd6.apps.googleusercontent.com";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const profileUrlPattern = /^(http|https):\/\/[^ "]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailPattern.test(email)) {
      setError("Invalid email format.");
      return;
    }

    if (!passwordPattern.test(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isLogin && profileUrl && !profileUrlPattern.test(profileUrl)) {
      setError("Invalid profile URL format.");
      return;
    }

    try {
      setLoading(true);
      const url = isLogin
        ? "http://localhost:8000/login"
        : "http://localhost:8000/register";
      const payload = isLogin
        ? { email, password }
        : { email, password, profileUrl };

      const response = await axios.post(url, payload, {
        withCredentials: true,
      });

      if (!isLogin && response.status === 201) {
        setIsLogin(true);
      }

      if (isLogin && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError(
          "You have exceeded the request limit. Please try again later."
        );
      } else {
        setError(
          err.response ? err.response.data : "Error occurred, please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/google-login",
        {
          token: credentialResponse.credential,
        },
        { withCredentials: true }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      }
    } catch (err) {
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
          <h2 className="mb-6 text-2xl font-bold text-center">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {error && <p className="mb-4 text-red-600">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isLogin && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="profileUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Profile URL
                  </label>
                  <input
                    type="url"
                    id="profileUrl"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className={`w-full p-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 focus:ring focus:ring-blue-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
          <div className="mt-6 text-center">
            <p className="mb-2 text-gray-500">or</p>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google login failed. Please try again.")}
              render={({ onClick }) => (
                <button
                  onClick={onClick}
                  className="flex items-center justify-center w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded shadow-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                    alt="Google Logo"
                    className="w-5 h-5 mr-2"
                  />
                  Login with Google
                </button>
              )}
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthForm;
