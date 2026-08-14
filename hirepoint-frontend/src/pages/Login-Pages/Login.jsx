import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

// Import the function that tells the rest of the application
// that the authentication state has changed.
import { notifyAuthChange } from "../../services/auth";


function Login() {

    // Allows us to redirect the user after successful login.
    const navigate = useNavigate();


    // Stores the value entered into the email field.
    const [email, setEmail] = useState("");

    // Stores the value entered into the password field.
    const [password, setPassword] = useState("");

    // Stores an error message if login fails.
    const [error, setError] = useState("");

    // Used to disable the login button while the request is processing.
    const [loading, setLoading] = useState(false);


    /*
     * Runs when the login form is submitted.
     */
    const handleSubmit = async (e) => {

        // Prevent the browser from refreshing the page.
        e.preventDefault();

        // Clear any previous error message.
        setError("");

        // Tell the UI that login is currently processing.
        setLoading(true);


        try {

            /*
             * Send the user's email and password
             * to the ASP.NET Core Login endpoint.
             */
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


            /*
             * Read the response returned by the API.
             */
            const data = await response.json();

            console.log("Login response:", data);


            /*
             * If ASP.NET returns an error,
             * display an appropriate message.
             */
            if (!response.ok) {

                throw new Error(
                    typeof data === "string"
                        ? data
                        : "Invalid email or password."
                );
            }


            /*
             * LOGIN WAS SUCCESSFUL
             *
             * Save the JWT token.
             */
            localStorage.setItem(
                "token",
                data.token
            );


            /*
             * Save the logged-in user's information.
             *
             * The AuthController returns these properties
             * through LoginResponseDto.
             */
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
             * Tell the Navbar and other components that
             * the user has successfully logged in.
             *
             * Without this, the Navbar may not update
             * until the page is refreshed.
             */
            notifyAuthChange();


            /*
             * Redirect the user based on their role.
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

                navigate("/");

            }
            else {

                // Fallback if the role is unknown.
                navigate("/");
            }


        } catch (error) {

            console.error("Login error:", error);

            // Display the error message on the login page.
            setError(error.message);

        } finally {

            // Allow the user to submit the form again.
            setLoading(false);
        }
    };


    return (

        <div className="login-page">

            <div className="login-card">

                <div className="login-header">

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Sign in to your HirePoint account
                    </p>

                </div>


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


                    {/* Error message */}
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


                {/* Registration link */}
                <div className="register-link">

                    <p>

                        Don't have an account?{" "}

                        <Link to="/register">
                            Create an account
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}


export default Login;