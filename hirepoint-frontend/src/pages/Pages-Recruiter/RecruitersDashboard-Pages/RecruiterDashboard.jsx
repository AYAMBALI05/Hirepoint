import { Link, useNavigate } from "react-router-dom";

import {
    getCurrentUser,
    logout
} from "../../../services/auth";

import "./RecruiterDashboard.css";

import userIcon from "../../../assets/user.png";
import briefcaseIcon from "../../../assets/briefcase.png";


function RecruiterDashboard() {

    const navigate = useNavigate();

    const user = getCurrentUser();


    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = () => {

        logout();

        navigate("/");

    };


    return (

        <div className="dashboard-layout">


            {/* =====================================
                SIDEBAR
            ====================================== */}

            <aside className="dashboard-sidebar">


                {/* LOGO */}

                <div className="dashboard-logo">

                    <div className="dashboard-logo-icon">

                        <img
                            src={briefcaseIcon}
                            alt="Briefcase"
                        />

                    </div>

                    <span>
                        HirePoint
                    </span>

                </div>


                {/* USER */}

                <div className="dashboard-user">

                    <img
                        src={userIcon}
                        alt="User"
                        className="dashboard-user-icon"
                    />

                    <div>

                        <strong>
                            {user?.firstName} {user?.lastName}
                        </strong>

                        <span>
                            Recruiter
                        </span>

                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="dashboard-navigation">


                    <Link
                        to="/recruiter-dashboard"
                        className="dashboard-nav-item active"
                    >
                        <span>
                            Dashboard
                        </span>
                    </Link>


                    <Link
                        to="/recruiter/jobs"
                        className="dashboard-nav-item"
                    >
                        <span>
                            My Jobs
                        </span>
                    </Link>


                    <Link
                        to="/recruiter/jobs/create"
                        className="dashboard-nav-item"
                    >
                        <span>
                            Post New Job
                        </span>
                    </Link>


                    <Link
                        to="/recruiter/applications"
                        className="dashboard-nav-item"
                    >
                        <span>
                            Applications
                        </span>
                    </Link>


                    <Link
                        to="/recruiter/profile"
                        className="dashboard-nav-item"
                    >
                        <span>
                            Profile
                        </span>
                    </Link>


                    <Link
                        to="/recruiter/settings"
                        className="dashboard-nav-item"
                    >
                        <span>
                            Settings
                        </span>
                    </Link>


                </nav>


                {/* LOGOUT */}

                <button
                    type="button"
                    className="dashboard-logout"
                    onClick={handleLogout}
                >

                    <span>
                        Logout
                    </span>

                </button>


            </aside>


            {/* =====================================
                MAIN CONTENT
            ====================================== */}

            <main className="dashboard-main">


                {/* =====================================
                    HEADER
                ====================================== */}

                <header className="dashboard-header">

                    <div>

                        <h1>
                            Welcome,{" "}
                            {user?.firstName || "Recruiter"}
                        </h1>

                        <p>
                            Manage your recruitment activities.
                        </p>

                    </div>

                </header>


                {/* =====================================
                    RECRUITMENT OVERVIEW
                ====================================== */}

                <section className="dashboard-jobs">


                    <div className="jobs-section-header">

                        <div>

                            <h2>
                                Recruitment Overview
                            </h2>

                            <p>
                                Overview of your recruitment activity.
                            </p>

                        </div>

                    </div>


                    {/* STATISTICS */}

                    <div className="recruiter-stat-grid">


                        <div className="recruiter-stat-card">

                            <p>
                                My Job Listings
                            </p>

                            <h3>
                                0
                            </h3>

                        </div>


                        <div className="recruiter-stat-card">

                            <p>
                                Active Jobs
                            </p>

                            <h3>
                                0
                            </h3>

                        </div>


                        <div className="recruiter-stat-card">

                            <p>
                                Applications
                            </p>

                            <h3>
                                0
                            </h3>

                        </div>


                        <div className="recruiter-stat-card">

                            <p>
                                Candidates
                            </p>

                            <h3>
                                0
                            </h3>

                        </div>


                    </div>

                </section>


                {/* =====================================
                    QUICK ACTIONS
                ====================================== */}

                <section className="dashboard-jobs">


                    <div className="jobs-section-header">

                        <div>

                            <h2>
                                Quick Actions
                            </h2>

                            <p>
                                Manage your recruitment activities.
                            </p>

                        </div>

                    </div>


                    <div className="recruiter-actions-grid">


                        <Link
                            to="/recruiter/jobs"
                            className="recruiter-action-card"
                        >

                            <h3>
                                My Job Listings
                            </h3>

                            <p>
                                View and manage your company's jobs.
                            </p>

                        </Link>


                        <Link
                            to="/recruiter/applications"
                            className="recruiter-action-card"
                        >

                            <h3>
                                Applications
                            </h3>

                            <p>
                                Review applications from candidates.
                            </p>

                        </Link>


                        <Link
                            to="/recruiter/profile"
                            className="recruiter-action-card"
                        >

                            <h3>
                                Recruiter Profile
                            </h3>

                            <p>
                                Manage your recruiter information.
                            </p>

                        </Link>


                    </div>

                </section>


                {/* =====================================
                    RECENT APPLICATIONS
                ====================================== */}

                <section className="dashboard-jobs">


                    <div className="jobs-section-header">

                        <div>

                            <h2>
                                Recent Applications
                            </h2>

                            <p>
                                Review the latest candidate applications.
                            </p>

                        </div>

                    </div>


                    <div className="dashboard-message">

                        No applications yet.

                    </div>


                </section>


            </main>

        </div>

    );

}


export default RecruiterDashboard;