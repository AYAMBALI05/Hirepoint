import { useState } from "react";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    isLoggedIn,
    getCurrentUser,
    logout
} from "../services/auth";

import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [loggedIn, setLoggedIn] = useState(isLoggedIn());

    const user = getCurrentUser();

    /*
     * Check whether the current page is the
     * Job Seeker Dashboard.
     *
     * The dashboard gets the sidebar.
     * Other pages keep the normal top navbar.
     */
    const isDashboard =
        location.pathname === "/dashboard";


    /*
     * Handle logout.
     */
    const handleLogout = () => {

        logout();

        setLoggedIn(false);

        navigate("/login");
    };


    /*
     * =========================================
     * JOB SEEKER DASHBOARD SIDEBAR
     * =========================================
     */

    if (isDashboard && loggedIn) {

        return (

            <aside className="dashboard-sidebar">

                {/* Logo */}

                <div className="sidebar-logo">

                    <Link to="/dashboard">
                        HirePoint
                    </Link>

                </div>


                {/* User information */}

                <div className="sidebar-user">

                    <div className="sidebar-avatar">
                        {user?.firstName?.charAt(0)}
                    </div>

                    <div>

                        <strong>
                            {user?.firstName} {user?.lastName}
                        </strong>

                        <span>
                            Job Seeker
                        </span>

                    </div>

                </div>


                {/* Dashboard navigation */}

                <nav className="sidebar-navigation">

                    <Link
                        to="/dashboard"
                        className={
                            location.pathname === "/dashboard"
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                       
                        Dashboard
                    </Link>


                    <Link
                        to="/my-applications"
                        className="sidebar-link"
                    >
                       
                        My Applications
                    </Link>


                    <Link
                        to="/saved-jobs"
                        className="sidebar-link"
                    >
                        
                        Saved Jobs
                    </Link>


                    

                </nav>

                    <Link
                        to="/saved-jobs"
                        className="active"
                    >
                        <small>Saved</small>
                    </Link>

                    <Link to="/profile">
                        <small>Profile</small>
                    </Link>

                {/* Bottom section */}

                <div className="sidebar-bottom">

                    <button
                        onClick={handleLogout}
                        className="sidebar-logout"
                    >
                        
                        Logout
                    </button>

                </div>

            </aside>
        );
    }


    /*
 * =========================================
 * NORMAL TOP NAVBAR
 * =========================================
 */

return (

    <nav className="top-navbar">

        {/* HirePoint logo */}

        <Link
            to="/"
            className="navbar-logo"
        >
            HirePoint
        </Link>


        {/* Logout */}

        <div className="navbar-auth">

            {loggedIn && user ? (

                <button
                    onClick={handleLogout}
                    className="navbar-logout"
                >
                    Logout
                </button>

            ) : (

                <>
                    <Link to="/login">
                        Login
                    </Link>

                    <Link to="/register">
                        Register
                    </Link>
                </>

            )}

        </div>

    </nav>
);
};

export default Navbar;