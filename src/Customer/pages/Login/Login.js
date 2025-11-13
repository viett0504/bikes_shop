import React from "react";
import { Link } from "react-router-dom";
import "./Login.css"; // CSS tách file riêng

export default function LoginPage() {
  return (
    <div className="login-root">            
      <div className="login-card">
        {/* Left visual */}
        <div className="visual">
          <div className="brand">BIKES</div>
          <img
            src="https://unsplash.com/photos/s6DiDMLK0jk/download?force=true&w=1800"
            alt="Bicycle"
          />
        </div>

        {/* Right form */}
        <div className="form">
          <h1 className="title">Login</h1>

          <div className="top-links">
            <Link to="/forgot" className="muted underline">Forgot your password?</Link>
          </div>

          <input className="input" type="email" placeholder="Email" />
          <input className="input" type="password" placeholder="Password" />

          <label className="checkbox">
            <input type="checkbox" />
            <span>
              Keep me logged in - applies to all log in options below.{" "}
              <Link to="/info" className="underline">More info</Link>
            </span>
          </label>

          <button className="primary-btn" type="button">
            EMAIL LOGIN <span className="arrow">→</span>
          </button>

          <div className="socials">
            <button className="social-btn">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
            </button>
            <button className="social-btn">
              <img src="https://www.svgrepo.com/show/452210/apple.svg" alt="Apple" />
            </button>
            <button className="social-btn">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" />
            </button>
          </div>

          <p className="terms">
            By clicking 'Log In' you agree to our website KicksClub
            <Link to="/terms" className="underline"> Terms & Conditions</Link>, Kicks
            <Link to="/privacy" className="underline"> Privacy Notice</Link> and
            <Link to="/terms" className="underline"> Terms & Conditions</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
