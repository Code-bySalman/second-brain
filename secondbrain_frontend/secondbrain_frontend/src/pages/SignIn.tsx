// SignIn.tsx
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

const SignIn = () => {
  const usernameRef = useRef<any>();
  const passwordRef = useRef<any>();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function signin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error: any) { 
      if (error.response && error.response.status === 403) {
        setError("Wrong credentials");
      } else {
        console.error("Sign in error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="w-screen h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 w-96 relative">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Sign In
        </h2>
        <Input reference={usernameRef} placeholder="Username" />
        <Input reference={passwordRef} placeholder="Password" type="password" />
        {error && (
          <div className="text-white bg-black text-sm text-center mt-2 p-2 rounded">
            {error}
          </div>
        )}
        <div className="flex justify-center pt-4">
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            <Button onClick={signin} variant="primary" text="Sign In" />
          )}
        </div>
        <p className="text-center mt-4">Don't have an account?</p>
        <div
          onClick={handleSignUpClick}
          className="text-blue-500 hover:underline text-center block cursor-pointer"
        >
          Sign Up here
        </div>
      </div>
    </motion.div>
  );
};

export default SignIn;