import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        roleID: 3,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "https://localhost:7081/api/Auth/Register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        password: formData.password,
                        confirmPassword: formData.confirmPassword,
                        roleID: Number(formData.roleID),
                    }),
                }
            );

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Registration failed.");
            }

            alert("Registration successful!");

            navigate("/login");

        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-card">

                <div className="register-header">
                    <h1>Create Your Account</h1>
                    <p>Join HirePoint and start building your future.</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="name-row">

                        <div className="form-group">
                            <label>First Name</label>

                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>

                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last name"
                                required
                            />
                        </div>

                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Account Type</label>

                        <select
                            name="roleID"
                            value={formData.roleID}
                            onChange={handleChange}
                        >
                            <option value="3">Job Seeker</option>
                            <option value="2">Recruiter</option>
                        </select>
                    </div>

                    {error && (
                        <p className="register-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="login-link">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login">
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>

        </div>
    );
}

export default Register;