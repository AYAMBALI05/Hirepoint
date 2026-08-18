import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Forgot-Password.css";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // Check passwords before sending request
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "https://localhost:7081/api/Auth/ForgotPassword",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email: email,
                        newPassword: newPassword,
                        confirmPassword: confirmPassword,
                    }),
                }
            );


const data = await response.text();

            if (!response.ok) {

                throw new Error(
                    typeof data === "string"
                        ? data
                        : "Unable to change password."
                );

            }


            setSuccess(
                "Password changed successfully. Redirecting to login..."
            );


            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);


        }
        catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            setError(error.message);

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <div className="forgot-password-page">

            <div className="forgot-password-card">

                {/* Header */}

                <div className="forgot-password-header">

                    <h1>
                        Forgot Password
                    </h1>

                    <p>
                        Create a new password for your HirePoint account.
                    </p>

                </div>


                {/* Form */}

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


                    {/* New Password */}

                    <div className="form-group">

                        <label htmlFor="newPassword">
                            New Password
                        </label>

                        <input
                            id="newPassword"
                            type="password"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            required
                            minLength="6"
                        />

                    </div>


                    {/* Confirm Password */}

                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm New Password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                            minLength="6"
                        />

                    </div>


                    {/* Error */}

                    {error && (

                        <p className="forgot-password-error">
                            {error}
                        </p>

                    )}


                    {/* Success */}

                    {success && (

                        <p className="forgot-password-success">
                            {success}
                        </p>

                    )}


                    {/* Submit */}

                    <button
                        type="submit"
                        className="forgot-password-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Changing Password..."
                            : "Change Password"}

                    </button>

                </form>


                {/* Back to Login */}

                <div className="back-to-login">

                    <Link to="/login">
                        ← Back to Login
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default ForgotPassword;