import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

import { notifyAuthChange } from "../../services/auth";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                "https://localhost:7081/api/Auth/Login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                }
            );


            const data = await response.json();

            console.log("Login response:", data);


            if (!response.ok) {

                throw new Error(
                    typeof data === "string"
                        ? data
                        : "Invalid email or password."
                );

            }


            /*
             * =====================================
             * SAVE LOGIN INFORMATION
             * =====================================
             */

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "userID",
                data.userID
            );

            localStorage.setItem(
                "firstName",
                data.firstName
            );

            localStorage.setItem(
                "lastName",
                data.lastName
            );

            localStorage.setItem(
                "email",
                data.email
            );

            localStorage.setItem(
                "roleID",
                data.roleID
            );


            /*
             * Tell the rest of the application
             * that the user has logged in.
             */
            notifyAuthChange();


            /*
             * =====================================
             * REDIRECT BASED ON ROLE
             * =====================================
             *
             * 1 = Admin
             * 2 = Recruiter
             * 3 = Job Seeker
             */

            if (Number(data.roleID) === 1) {

                navigate("/admin-dashboard");

            }
            else if (Number(data.roleID) === 2) {

                navigate("/recruiter-dashboard");

            }
            else if (Number(data.roleID) === 3) {

                navigate("/dashboard");

            }
            else {

                /*
                 * Fallback if the role is unknown.
                 */
                navigate("/dashboard");

            }


        }
        catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(error.message);

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-page">

            <div className="login-card">

                {/* =====================================
                    HEADER
                ====================================== */}

                <div className="login-header">

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Sign in to your HirePoint account
                    </p>

                </div>


                {/* =====================================
                    LOGIN FORM
                ====================================== */}

                <form onSubmit={handleSubmit}>

                    {/* Email */}

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* Password */}

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* Error */}

                    {error && (

                        <p className="login-error">
                            {error}
                        </p>

                    )}


                    {/* Login button */}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign In"}

                    </button>

                </form>


                {/* =====================================
                    REGISTER LINK
                ====================================== */}

                <div className="register-link">

                    <p>

                        Don't have an account?{" "}

                        <Link to="/register">
                            Create an account
                        </Link>

                    </p>

                </div>


                {/* =====================================
                    BACK TO HOME
                ====================================== */}

                <div className="login-home-link">

                    <Link to="/">
                        Back to HirePoint
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Login;