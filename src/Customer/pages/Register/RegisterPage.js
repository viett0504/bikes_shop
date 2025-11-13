import React from "react";
import { Link } from "react-router-dom";
import "./RegisterPage.css";    
export default function RegisterPage() {
  return (
    <>
      <div className="register-root">
        <div className="register-card">
          {/* Left visual */}
          <div className="visual">
            <div className="brand">BIKES</div>
            <img
              src="https://unsplash.com/photos/s6DiDMLK0jk/download?force=true&w=1800"
              alt="Sneakers on snow"
            />
          </div>

          {/* Right form */}
          <div className="form">
            <h1 className="title">Register</h1>
            <p className="subtitle">Sign up with</p>

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

            <div className="or">OR</div>

            <div className="field-group">
              <label className="section-label">Your Name</label>
              <div className="grid-2">
                <input className="input" placeholder="First Name" />
                <input className="input" placeholder="Last Name" />
              </div>
            </div>

            <div className="field-group">
              <label className="section-label">Login Details</label>
              <input className="input" placeholder="Email" type="email" />
              <input className="input" placeholder="Password" type="password" />
              <p className="hint">
                Minimum 8 characters with at least one uppercase, one lowercase, one special character and a number
              </p>
            </div>

            <label className="checkbox">
              <input type="checkbox" />
              <span>
                By clicking 'Log In' you agree to our website KicksClub <Link to="#">Terms & Conditions</Link>, Kicks <Link to="/privacy">Privacy Notice</Link> and <Link to="/terms">Terms & Conditions</Link>.
              </span>
            </label>

            <label className="checkbox">
              <input type="checkbox" />
              <span>
                Keep me logged in - applies to all log in options below. <Link to="#">More info</Link>
              </span>
            </label>

            <button className="primary-btn" type="button">
              REGISTER <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
