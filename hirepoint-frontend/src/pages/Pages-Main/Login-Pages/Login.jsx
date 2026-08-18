import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const API_URL = "https://localhost:7081/api";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // =========================================
    // HANDLE INPUT
    // =========================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

    };


    // =========================================
    // CHECK RECRUITER COMPANY PROFILE
    // =========================================

    const checkRecruiterProfile = async (token) => {

        try {

            const response = await fetch(
                `${API_URL}/Companies/MyCompany`,
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            // =========================================
            // COMPANY PROFILE EXISTS
            // =========================================

            if (response.ok) {

                return true;

            }


            // =========================================
            // NO COMPANY PROFILE
            // =========================================

            if (response.status === 404) {

                return false;

            }


            // =========================================
            // OTHER ERROR
            // =========================================

            const errorText = await response.text();

            console.error(
                "Company profile check failed:",
                errorText
            );

            throw new Error(
                "Could not check your company profile."
            );

        }

        catch (error) {

            console.error(
                "Company profile check error:",
                error
            );

            throw error;

        }

    };


    // =========================================
    // LOGIN
    // =========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);


        try {

            // =========================================
            // LOGIN REQUEST
            // =========================================

            const response = await fetch(
                `${API_URL}/Auth/Login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                }
            );


            // =========================================
            // LOGIN FAILED
            // =========================================

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Login error:",
                    errorText
                );

                throw new Error(
                    errorText ||
                    "Invalid email or password."
                );

            }


            // =========================================
            // LOGIN SUCCESSFUL
            // =========================================

            const data =
                await response.json();


            console.log(
                "Login successful:",
                data
            );


            // =========================================
            // SAVE LOGIN INFORMATION
            // =========================================

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


            // =========================================
            // ROLE CHECK
            // =========================================

            const roleID =
                Number(data.roleID);


            // =========================================
            // RECRUITER
            // =========================================

            if (roleID === 2) {

                /*
                 * The recruiter has logged in.
                 *
                 * Now check whether they already
                 * have a company profile.
                 */

                const hasCompanyProfile =
                    await checkRecruiterProfile(
                        data.token
                    );


                // =========================================
                // NO COMPANY PROFILE
                // =========================================

                if (!hasCompanyProfile) {

                    /*
                     * Recruiters MUST create their
                     * company profile before accessing
                     * the dashboard.
                     */

                    navigate(
                        "/recruiter/profile/create",
                        {
                            replace: true
                        }
                    );

                    return;

                }


                // =========================================
                // COMPANY PROFILE EXISTS
                // =========================================

                navigate(
                    "/recruiter-dashboard",
                    {
                        replace: true
                    }
                );

                return;

            }


            // =========================================
            // ADMIN
            // =========================================

            if (roleID === 1) {

                navigate(
                    "/admin-dashboard",
                    {
                        replace: true
                    }
                );

                return;

            }


            // =========================================
            // JOB SEEKER
            // =========================================

            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );

        }

        catch (error) {

            console.error(
                "Login failed:",
                error
            );

            setError(
                error.message ||
                "Unable to login. Please try again."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =========================================
    // PAGE
    // =========================================

    return (

        <div className="login-page">

            <div className="login-container">

                <div className="login-card">

                    <div className="login-header">

                        <h1>
                            Welcome Back
                        </h1>

                        <p>
                            Login to your HirePoint account
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="login-error">

                            {error}

                        </div>

                    )}


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="login-form"
                    >

                        {/* EMAIL */}

                        <div className="login-form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="login-form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />

                        </div>


                        {/* FORGOT PASSWORD */}

                        <div className="login-forgot-password">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/forgot-password"
                                    )
                                }
                            >
                                Forgot Password?
                            </button>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Logging in..."
                                : "Login"
                            }

                        </button>

                    </form>


                    {/* REGISTER */}

                    <div className="login-register">

                        <p>
                            Don't have an account?
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Create an Account
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;