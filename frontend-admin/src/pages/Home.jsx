import {useState} from 'react';
import "../styles/home.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";


export default function SignupPage() {
const [showPassword, setShowPassword] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);
const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Create account:", form);
};

return (
    <div className="signup-page">
    <div className="signup-panel">
        <div className="signup-panel__brand">
        <span className="signup-panel__logo" aria-hidden="true">
            🌾
        </span>
        <span className="signup-panel__brand-name">AgriPrice</span>
        </div>

        <div className="signup-panel__body">
        <h1 className="signup-panel__headline">
            Plan every harvest with confidence.
        </h1>
        <p className="signup-panel__subtext">
            Create your free account to unlock crop price forecasting, market
            recommendations, and profit estimation tools built for Rizal
            Province.
        </p>
        </div>

        <blockquote className="signup-panel__quote">
        <p>
            &ldquo;Setting up took two minutes &mdash; now I check AgriPrice
            before every trip to the market.&rdquo;
        </p>
        <cite>&mdash; Rizal Farmers Cooperative</cite>
        </blockquote>
    </div>

    <div className="signup-form-panel">
        <div className="signup-form-card">
        <h2 className="signup-form-card__title">Create your account</h2>
        <p className="signup-form-card__subtitle">
            Start making data-backed selling decisions today.
        </p>

        <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
            <div className="form-field">
                <label htmlFor="firstName">First Name</label>
                <div className="input-wrapper">
                <span className="input-icon" aria-hidden="true">
                    <FaUser />
                </span>
                <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Juan"
                    value={form.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    />
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="lastName">Last Name</label>
                    <div className="input-wrapper">
                    <span className="input-icon" aria-hidden="true">
                        <FaUser />
                    </span>
                    <input
                        id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Dela Cruz"
                    value={form.lastName}
                    onChange={handleChange}
                        autoComplete="family-name"
                    />
                    </div>
                </div>
                </div>

                <div className="form-field">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                    <FaEnvelope className="signin-input-icon" size={16} />
                    <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    />
                </div>
                </div>

                <div className="form-field">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                    <FaLock className="signin-input-icon" size={16} />
                    <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    />
                    <button
                    type="button"
                    className="signin-input-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                    showPassword ? "Hide password" : "Show password"
                    }
                    >
                    <FaEye className="Icon" onClick={() => setShowPassword(!showPassword)} />
                    </button>
                </div>
                <span className="form-hint">Use at least 8 characters.</span>
                </div>

                <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                    <FaLock className="signin-input-icon" size={16} />
                    <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    />
                    <button
                    type="button"
                    className="signin-input-toggle"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={
                    showConfirm ? "Hide password" : "Show password"
                    }
                    >
                    <FaEye className="Icon" onClick={() => setShowConfirm(!showConfirm)} />
                    </button>
                </div>
                </div>

                <button type="submit" className="submit-button">
                Create Account
                </button>
            </form>

            <p className="signin-prompt">
                Already have an account? <a href="#signin">Sign in</a>
            </p>
            </div>
        </div>
        </div>
    );
    }