import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    isLoggedIn,
    getCurrentUser,
    logout
} from "../services/auth";


function Navbar() {

    const navigate = useNavigate();


    /*
     * Check whether a user is currently logged in.
     */
    const [loggedIn, setLoggedIn] = useState(
        isLoggedIn()
    );


    /*
     * Get the currently logged-in user's
     * information from localStorage.
     */
    const user = getCurrentUser();


    /*
     * Handle logout.
     */
    const handleLogout = () => {

        /*
         * Remove the JWT and user information
         * from localStorage.
         */
        logout();


        /*
         * Update the Navbar immediately.
         */
        setLoggedIn(false);


        /*
         * Return the user to the login page.
         */
        navigate("/login");
    };


    /*
     * Convert the stored role ID into
     * something easier to understand.
     *
     * 1 = Admin
     * 2 = Recruiter
     * 3 = Job Seeker
     */
    const roleID = user?.roleID;


    return (

        <nav className="navbar">

            {/* =================================
                HIREPOINT LOGO
            ================================== */}

            <Link
                to="/"
                className="navbar-logo"
            >
                HirePoint
            </Link>


            {/* =================================
                MAIN NAVIGATION
            ================================== */}

            <div className="navbar-links">

                {/* -----------------------------
                    LOGGED OUT
                ------------------------------ */}

                {!loggedIn && (

                    <>
                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/jobs">
                            Jobs
                        </Link>
                    </>
                )}


                {/* -----------------------------
                    JOB SEEKER
                    Role ID = 3
                ------------------------------ */}

                {loggedIn && roleID === "3" && (

                    <>
                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/jobs">
                            Jobs
                        </Link>

                        <Link to="/saved-jobs">
                            Saved Jobs
                        </Link>

                        <Link to="/my-applications">
                            My Applications
                        </Link>
                    </>
                )}


                {/* -----------------------------
                    RECRUITER
                    Role ID = 2
                ------------------------------ */}

                {loggedIn && roleID === "2" && (

                    <>
                        <Link to="/recruiter-dashboard">
                            Dashboard
                        </Link>

                        <Link to="/recruiter/jobs">
                            My Jobs
                        </Link>

                        <Link to="/recruiter/applications">
                            Applications
                        </Link>
                    </>
                )}


                {/* -----------------------------
                    ADMIN
                    Role ID = 1
                ------------------------------ */}

                {loggedIn && roleID === "1" && (

                    <>
                        <Link to="/admin-dashboard">
                            Dashboard
                        </Link>

                        <Link to="/admin/users">
                            Users
                        </Link>

                        <Link to="/admin/reports">
                            Reports
                        </Link>
                    </>
                )}

            </div>


            {/* =================================
                AUTHENTICATION SECTION
            ================================== */}

            <div className="navbar-auth">

                {loggedIn && user ? (

                    <>

                        {/* User's name */}

                        <span className="navbar-user">
                            Welcome, {user.firstName}
                        </span>


                        {/* Logout */}

                        <button
                            className="navbar-logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </>

                ) : (

                    <>

                        {/* Login */}

                        <Link to="/login">
                            Login
                        </Link>


                        {/* Register */}

                        <Link to="/register">
                            Register
                        </Link>

                    </>
                )}

            </div>

        </nav>
    );
}


export default Navbar;