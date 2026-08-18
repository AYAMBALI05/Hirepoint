import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getFirstName,
    getLastName,
    getToken
} from "../../../services/auth";

import "./AdminDashboard.css";

import briefcaseIcon from "../../../assets/briefcase.png";
import userIcon from "../../../assets/user.png";


function AdminDashboard() {

    // =====================================
    // ADMIN INFORMATION
    // =====================================

    const firstName = getFirstName();
    const lastName = getLastName();


    // =====================================
    // DASHBOARD DATA
    // =====================================

    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================
    // MOBILE SIDEBAR
    // =====================================

    const [sidebarOpen, setSidebarOpen] =
        useState(false);


    // =====================================
    // LOAD DASHBOARD DATA
    // =====================================

    const loadDashboardData = async () => {

        try {

            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {

                setError(
                    "Please log in to view the dashboard."
                );

                return;
            }


            // =================================
            // LOAD USERS
            // =================================

            const usersResponse =
                await fetch(
                    "https://localhost:7081/api/Users/GetUsers",
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                "Bearer " + token
                        }
                    }
                );


            if (!usersResponse.ok) {

                throw new Error(
                    "Could not load user information."
                );

            }


            const usersData =
                await usersResponse.json();


            // =================================
            // LOAD JOBS
            // =================================

            const jobsResponse =
                await fetch(
                    "https://localhost:7081/api/Jobs",
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                "Bearer " + token
                        }
                    }
                );


            if (!jobsResponse.ok) {

                throw new Error(
                    "Could not load job information."
                );

            }


            const jobsData =
                await jobsResponse.json();


            setUsers(
                Array.isArray(usersData)
                    ? usersData
                    : []
            );


            setJobs(
                Array.isArray(jobsData)
                    ? jobsData
                    : []
            );

        }

        catch (err) {

            console.error(
                "Dashboard error:",
                err
            );

            setError(
                err.message ||
                "Could not load dashboard data."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================
    // LOAD WHEN PAGE OPENS
    // =====================================

    useEffect(() => {

        loadDashboardData();

    }, []);


    // =====================================
    // USER STATISTICS
    // =====================================

    const totalUsers =
        users.length;


    const jobSeekers =
        users.filter(
            user =>
                Number(user.roleID) === 3
        ).length;


    const recruiters =
        users.filter(
            user =>
                Number(user.roleID) === 2
        ).length;


    // =====================================
    // JOB STATISTICS
    // =====================================

    const totalJobs =
        jobs.length;


    // =====================================
    // CLOSE SIDEBAR WHEN LINK CLICKED
    // =====================================

    const closeSidebar = () => {

        setSidebarOpen(false);

    };


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (

            <div className="admin-dashboard-message">

                <div className="dashboard-loader">

                    <p>
                        Loading dashboard...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================
    // ERROR
    // =====================================

    if (error) {

        return (

            <div className="admin-dashboard-message error">

                <h2>
                    Unable to Load Dashboard
                </h2>

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={loadDashboardData}
                >
                    Try Again
                </button>

            </div>

        );

    }


    return (

        <div className="admin-dashboard-page">


            {/* =====================================
                MOBILE HEADER
            ====================================== */}

            <header className="admin-mobile-header">

                <button
                    type="button"
                    className="admin-menu-button"
                    onClick={() =>
                        setSidebarOpen(!sidebarOpen)
                    }
                >
                    ☰
                </button>


                <div className="admin-mobile-brand">

                   

                    <span>
                        HirePoint
                    </span>

                </div>

            </header>


            {/* =====================================
                SIDEBAR OVERLAY
            ====================================== */}

            {sidebarOpen && (

                <div
                    className="admin-sidebar-overlay"
                    onClick={closeSidebar}
                />

            )}


            {/* =====================================
                SIDEBAR
            ====================================== */}

            <aside
                className={
                    sidebarOpen
                        ? "admin-sidebar open"
                        : "admin-sidebar"
                }
            >


                {/* BRAND */}

                <div className="admin-sidebar-brand">

                    <div className="admin-logo-space">

                        <img
                            src={briefcaseIcon}
                            alt="Briefcase"
                        />

                    </div>

                    <h2>
                        HirePoint
                    </h2>

                </div>


                {/* =====================================
                    ADMIN INFORMATION
                ====================================== */}

                <div className="admin-user-section">

                    <div className="admin-user-icon-space">

                        <img
                            src={userIcon}
                            alt="User"
                            className="dashboard-user-icon"
                        />

                    </div>


                    <div className="admin-user-details">

                        <h3>
                            {firstName} {lastName}
                        </h3>

                        <p>
                            Administrator
                        </p>

                    </div>

                </div>


                {/* =====================================
                    NAVIGATION
                ====================================== */}

                <nav className="admin-sidebar-navigation">


                    <Link
                        to="/admin-dashboard"
                        className="admin-sidebar-item active"
                        onClick={closeSidebar}
                    >
                        Dashboard
                    </Link>


                    <Link
                        to="/admin/users"
                        className="admin-sidebar-item"
                        onClick={closeSidebar}
                    >
                        Users
                    </Link>


                    <Link
                        to="/admin/jobs"
                        className="admin-sidebar-item"
                        onClick={closeSidebar}
                    >
                        Job Listings
                    </Link>


                    <Link
                        to="/admin/analytics"
                        className="admin-sidebar-item"
                        onClick={closeSidebar}
                    >
                        Analytics
                    </Link>


                    <Link
                        to="/admin/profile"
                        className="admin-sidebar-item"
                        onClick={closeSidebar}
                    >
                        Profile
                    </Link>


                    <Link
                        to="/admin/settings"
                        className="admin-sidebar-item"
                        onClick={closeSidebar}
                    >
                        Settings
                    </Link>


                </nav>


                {/* =====================================
                    LOGOUT
                ====================================== */}

                <div className="admin-sidebar-footer">

                    <Link
                        to="/login"
                        className="admin-logout-button"
                    >
                        Logout
                    </Link>

                </div>


            </aside>


            {/* =====================================
                MAIN CONTENT
            ====================================== */}

            <main className="admin-main-content">


                <div className="admin-dashboard-container">


                    {/* =====================================
                        WELCOME HEADER
                    ====================================== */}

                    <section className="admin-welcome-section">

                        <div>

                            <h1>
                                Welcome, {firstName}
                            </h1>

                            <p>
                                Manage and monitor the HirePoint platform.
                            </p>

                        </div>

                    </section>


                    {/* =====================================
                        PLATFORM OVERVIEW
                    ====================================== */}

                    <section className="admin-overview-section">

                        <div className="admin-section-title">

                            <h2>
                                Platform Overview
                            </h2>

                            <p>
                                Current HirePoint statistics.
                            </p>

                        </div>


                        <div className="admin-stat-grid">


                            {/* TOTAL USERS */}

                            <div className="admin-stat-card">

                                <p>
                                    Total Users
                                </p>

                                <h3>
                                    {totalUsers}
                                </h3>

                            </div>


                            {/* JOB SEEKERS */}

                            <div className="admin-stat-card">

                                <p>
                                    Job Seekers
                                </p>

                                <h3>
                                    {jobSeekers}
                                </h3>

                            </div>


                            {/* RECRUITERS */}

                            <div className="admin-stat-card">

                                <p>
                                    Recruiters
                                </p>

                                <h3>
                                    {recruiters}
                                </h3>

                            </div>


                            {/* JOB LISTINGS */}

                            <div className="admin-stat-card">

                                <p>
                                    Job Listings
                                </p>

                                <h3>
                                    {totalJobs}
                                </h3>

                            </div>


                        </div>

                    </section>


                    {/* =====================================
                        QUICK ADMINISTRATION
                    ====================================== */}

                    <section className="admin-management-section">


                        <div className="admin-section-title">

                            <h2>
                                Administration
                            </h2>

                            <p>
                                Manage the HirePoint platform.
                            </p>

                        </div>


                        <div className="admin-management-grid">


                            <Link
                                to="/admin/users"
                                className="admin-management-card"
                            >

                                <h3>
                                    User Management
                                </h3>

                                <p>
                                    View users, manage account
                                    status, and deactivate accounts.
                                </p>

                            </Link>


                            <Link
                                to="/admin/jobs"
                                className="admin-management-card"
                            >

                                <h3>
                                    Job Listings
                                </h3>

                                <p>
                                    Monitor and manage job listings
                                    posted by recruiters.
                                </p>

                            </Link>


                            <Link
                                to="/admin/analytics"
                                className="admin-management-card"
                            >

                                <h3>
                                    Platform Analytics
                                </h3>

                                <p>
                                    View platform statistics and
                                    monitor HirePoint activity.
                                </p>

                            </Link>


                            <Link
                                to="/admin/profile"
                                className="admin-management-card"
                            >

                                <h3>
                                    Admin Profile
                                </h3>

                                <p>
                                    View your administrator profile
                                    and account information.
                                </p>

                            </Link>


                        </div>


                    </section>


                </div>


            </main>


        </div>

    );

}


export default AdminDashboard;