import React, { useState } from "react";
import "./Auth.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../Firebase.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signupSuccess } from "../../../redux/slices/authSlice.js";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: username });
      dispatch(signupSuccess(userCredential.user));
      toast.success("User Successfully created!");
      navigate("/dashboard");
      console.log("user created");
    } catch (err) {
      setError(err.message);
      toast.error("Signup failed");
    }
  };
  return (
    <div>
      <form onSubmit={handleSignup}>
        <div className="form-control">
          <label>User name:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>Email Address :</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p>
            Use 8 or more characters with a mix of letters, numbers & symbols
          </p>
        </div>
        <div className="form-control checkbox-container">
          <input type="checkbox" name="agree" id="agree" />
          <label>
            By creating an account, you agree to our
            <span> Terms of use</span> and <span>Privacy Policy</span>
          </label>
        </div>
        <input type="submit" value="Create an account" />
      </form>
    </div>
  );
};

export default SignupForm;
