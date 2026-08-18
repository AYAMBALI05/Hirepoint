import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Analytics.css";

const USERS_API = "https://localhost:7081/api/Users/GetUsers";
const JOBS_API = "https://localhost:7081/api/Jobs";
const APPLICATIONS_API = "https://localhost:7081/api/Applications";

function Analytics() {

    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAnalytics = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const headers = {
                "Content-Type": "application/json"
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const [usersResponse, jobsResponse, applicationsResponse] =
                await Promise.all([
                    fetch(USERS_API, {
                        method: "GET",
                        headers
                    }),

                    fetch(JOBS_API, {
                        method: "GET",
                        headers
                    }),

                    fetch(APPLICATIONS_API, {
                        method: "GET",
                        headers
                    })
                ]);


            if (!usersResponse.ok) {
                throw new Error("Could not load users.");
            }

            if (!jobsResponse.ok) {
                throw new Error("Could not load jobs.");
            }

            if (!applicationsResponse.ok) {
                throw new Error("Could not load applications.");
            }


            const usersData = await usersResponse.json();
            const jobsData = await jobsResponse.json();
            const applicationsData =
                await applicationsResponse.json();


            setUsers(usersData);
            setJobs(jobsData);
            setApplications(applicationsData);

        } catch (err) {

            console.error("Analytics error:", err);

            setError(
                err.message || "Could not load analytics."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadAnalytics();

    }, []);


    /* =========================================
       STATISTICS
    ========================================= */

    const totalUsers = users.length;

    const activeUsers = users.filter(
        user => user.isActive === true
    ).length;

    const totalJobs = jobs.length;

    const totalApplications = applications.length;


    /* =========================================
       LOADING
    ========================================= */

    if (loading) {

        return (
            <div className="analytics-message">

                <p>
                    Loading analytics...
                </p>

            </div>
        );

    }


    /* =========================================
       ERROR
    ========================================= */

    if (error) {

        return (
            <div className="analytics-message error">

                <h2>
                    Unable to Load Analytics
                </h2>

                <p>
                    {error}
                </p>

                <button
                    className="analytics-retry-button"
                    onClick={loadAnalytics}
                >
                    Try Again
                </button>

                <Link
                    to="/admin-dashboard"
                    className="analytics-back-button"
                >
                    Back to Dashboard
                </Link>

            </div>
        );

    }


    return (

        <div className="analytics-page">

            <div className="analytics-container">


                {/* =====================================
                    HEADER
                ====================================== */}

                <div className="analytics-header">

                    <h1>
                        Analytics
                    </h1>

                    <p>
                        Monitor HirePoint platform activity.
                    </p>

                </div>


                {/* =====================================
                    STATISTICS
                ====================================== */}

                <div className="analytics-statistics">


                    <div className="analytics-stat-card">

                        <span>
                            Total Users
                        </span>

                        <strong>
                            {totalUsers}
                        </strong>

                    </div>


                    <div className="analytics-stat-card">

                        <span>
                            Active Users
                        </span>

                        <strong>
                            {activeUsers}
                        </strong>

                    </div>


                    <div className="analytics-stat-card">

                        <span>
                            Total Job Listings
                        </span>

                        <strong>
                            {totalJobs}
                        </strong>

                    </div>


                    <div className="analytics-stat-card">

                        <span>
                            Total Applications
                        </span>

                        <strong>
                            {totalApplications}
                        </strong>

                    </div>

                </div>


                {/* =====================================
                    PLATFORM OVERVIEW
                ====================================== */}

                <section className="analytics-section">

                    <div className="analytics-section-header">

                        <div>

                            <h2>
                                Platform Overview
                            </h2>

                            <p>
                                Current HirePoint activity.
                            </p>

                        </div>

                    </div>


                    <div className="analytics-overview">


                        <div className="analytics-overview-card">

                            <span>
                                Registered Users
                            </span>

                            <strong>
                                {totalUsers}
                            </strong>

                            <small>
                                Users registered on HirePoint
                            </small>

                        </div>


                        <div className="analytics-overview-card">

                            <span>
                                Job Listings
                            </span>

                            <strong>
                                {totalJobs}
                            </strong>

                            <small>
                                Jobs posted on the platform
                            </small>

                        </div>


                        <div className="analytics-overview-card">

                            <span>
                                Applications
                            </span>

                            <strong>
                                {totalApplications}
                            </strong>

                            <small>
                                Applications submitted
                            </small>

                        </div>

                    </div>

                </section>


                {/* =====================================
                    USER ACTIVITY
                ====================================== */}

                <section className="analytics-section">

                    <div className="analytics-section-header">

                        <div>

                            <h2>
                                User Activity
                            </h2>

                            <p>
                                Current user activity across HirePoint.
                            </p>

                        </div>

                    </div>


                    <div className="analytics-activity">


                        <div className="activity-item">

                            <div>
                                <strong>
                                    Active Users
                                </strong>

                                <small>
                                    Currently active accounts
                                </small>
                            </div>

                            <span>
                                {activeUsers}
                            </span>

                        </div>


                        <div className="activity-item">

                            <div>
                                <strong>
                                    Inactive Users
                                </strong>

                                <small>
                                    Deactivated accounts
                                </small>
                            </div>

                            <span>
                                {totalUsers - activeUsers}
                            </span>

                        </div>

                    </div>

                </section>


            </div>


            {/* =====================================
                BOTTOM NAVIGATION
            ====================================== */}

            <nav className="bottom-navbar">


                <Link to="/admin-dashboard">

                    <span>
                        {/* Dashboard icon space */}
                    </span>

                    <small>
                        Dashboard
                    </small>

                </Link>


                <Link to="/admin/users">

                    <span>
                        {/* Users icon space */}
                    </span>

                    <small>
                        Users
                    </small>

                </Link>


                <Link to="/admin/jobs">

                    <span>
                        {/* Job Listings icon space */}
                    </span>

                    <small>
                        Job Listings
                    </small>

                </Link>


                <Link
                    to="/admin/analytics"
                    className="active"
                >

                    <span>
                        {/* Analytics icon space */}
                    </span>

                    <small>
                        Analytics
                    </small>

                </Link>


                <Link to="/admin/settings">

                    <span>
                        {/* Settings icon space */}
                    </span>

                    <small>
                        Settings
                    </small>

                </Link>


            </nav>

        </div>
    );
}

export default Analytics;