import React, { useState } from "react";
import "./Signup.css";

function Signup({ onSignup }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Full name validation
    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    // Email validation
    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (password.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      );
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Terms
    if (!agree) {
      alert(
        "Please agree to the Terms & Conditions and Privacy Policy."
      );
      return;
    }

    // User object sent to App.jsx
    const newUser = {
      fullName: fullName.trim(),
      email: email.trim(),
      role,
      password,
    };

    // Send user to App.jsx
    if (onSignup) {
      onSignup(newUser);
    }
  };

  return (
    <div className="signup-page">

      {/* BACKGROUND DECORATION */}
      <div className="signup-bg-circle signup-circle-one"></div>
      <div className="signup-bg-circle signup-circle-two"></div>

      {/* MAIN CARD */}
      <div className="signup-card">

        {/* =================================================
            LEFT BRANDING PANEL
        ================================================= */}

        <div className="signup-left">

          <div className="signup-brand">

            <div className="signup-logo">
              🎓
            </div>

            <div>
              <h2>IMMS Pro</h2>

              <p>
                Academic Management
              </p>
            </div>

          </div>

          <div className="signup-welcome">

            <span>
              WELCOME TO IMMS PRO
            </span>

            <h1>
              Smarter Academic
              <br />

              <strong>
                Management.
              </strong>
            </h1>

            <p>
              Manage students, marks, attendance and
              academic performance from one powerful
              management system.
            </p>

          </div>

          {/* FEATURES */}

          <div className="signup-features">

            <div className="signup-feature">

              <div className="feature-check">
                ✓
              </div>

              <div>
                <strong>
                  Student Management
                </strong>

                <span>
                  Manage student records efficiently
                </span>
              </div>

            </div>

            <div className="signup-feature">

              <div className="feature-check">
                ✓
              </div>

              <div>
                <strong>
                  Marks & Grades
                </strong>

                <span>
                  Track academic performance
                </span>
              </div>

            </div>

            <div className="signup-feature">

              <div className="feature-check">
                ✓
              </div>

              <div>
                <strong>
                  Reports & Analytics
                </strong>

                <span>
                  Generate useful academic reports
                </span>
              </div>

            </div>

          </div>

          <div className="signup-copyright">
            © 2026 IMMS Pro
          </div>

          <div className="left-decoration"></div>

        </div>

        {/* =================================================
            RIGHT SIGNUP FORM
        ================================================= */}

        <div className="signup-right">

          <div className="signup-form-container">

            <div className="signup-heading">

              <h1>
                Create Account
              </h1>

              <p>
                Create your administrator account to get started.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* FULL NAME */}

              <div className="signup-field">

                <label>
                  Full Name
                </label>

                <div className="signup-input-wrapper">

                  <span className="input-icon">
                    ◉
                  </span>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="signup-field">

                <label>
                  Email Address
                </label>

                <div className="signup-input-wrapper">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                </div>

              </div>

              {/* ROLE */}

              <div className="signup-field">

                <label>
                  Account Role
                </label>

                <div className="signup-input-wrapper">

                  <span className="input-icon">
                    ♟
                  </span>

                  <select
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value)
                    }
                  >
                    <option value="Admin">
                      Admin
                    </option>

                    <option value="Super Admin">
                      Super Admin
                    </option>

                    <option value="Faculty">
                      Faculty
                    </option>
                  </select>

                  <span className="select-arrow">
                    ⌄
                  </span>

                </div>

              </div>

              {/* PASSWORD */}

              <div className="signup-field">

                <label>
                  Password
                </label>

                <div className="signup-input-wrapper">

                  <span className="input-icon">
                    ●
                  </span>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showPassword
                      ? "◉"
                      : "◌"}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="signup-field">

                <label>
                  Confirm Password
                </label>

                <div className="signup-input-wrapper">

                  <span className="input-icon">
                    ●
                  </span>

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showConfirmPassword
                      ? "◉"
                      : "◌"}
                  </button>

                </div>

              </div>

              {/* TERMS */}

              <div className="signup-terms">

                <label className="terms-label">

                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) =>
                      setAgree(e.target.checked)
                    }
                  />

                  <span className="custom-checkbox"></span>

                  <span>
                    I agree to the{" "}
                    <strong>
                      Terms & Conditions
                    </strong>{" "}
                    and Privacy Policy.
                  </span>

                </label>

              </div>

              {/* CREATE ACCOUNT */}

              <button
                type="submit"
                className="create-account-btn"
              >
                <span>
                  Create Account
                </span>

                <span className="button-arrow">
                  →
                </span>
              </button>

            </form>

            {/* LOGIN */}

            <div className="login-section">

              <span>
                Already have an account?
              </span>

              <button
                type="button"
                onClick={() => {
                  alert(
                    "Login functionality can be connected next."
                  );
                }}
              >
                Login
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;