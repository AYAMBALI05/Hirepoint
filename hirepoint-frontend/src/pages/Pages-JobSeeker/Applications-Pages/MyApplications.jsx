import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getToken } from "../../../services/auth";

import "./MyApplications.css";


function MyApplications() {

    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /*
     * Load the logged-in user's applications.
     */
    useEffect(() => {

        const loadApplications = async () => {

            try {

                const token = getToken();

                if (!token) {

                    setError(
                        "Please log in to view your applications."
                    );

                    setLoading(false);

                    return;
                }


                const response = await fetch(
                    "https://localhost:7081/api/Applications/MyApplications",
                    {
                        method: "GET",

                        headers: {
                            "Content-Type": "application/json",

                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                if (!response.ok) {

                    throw new Error(
                        "Could not load your applications."
                    );

                }


                const data = await response.json();

                setApplications(data);

            }
            catch (error) {

                console.error(
                    "Applications error:",
                    error
                );

                setError(error.message);

            }
            finally {

                setLoading(false);

            }

        };


        loadApplications();

    }, []);


    /*
     * Format application date.
     */
    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-ZA",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    /*
     * Loading state.
     */
    if (loading) {

        return (
            <div className="applications-page">

                <div className="applications-loading">
                    Loading your applications...
                </div>

            </div>
        );

    }


    /*
     * Error state.
     */
    if (error) {

        return (
            <div className="applications-page">

                <div className="applications-error">
                    {error}
                </div>

            </div>
        );

    }


    return (

        <div className="applications-page">


            {/* =====================================
                MAIN CONTENT
            ====================================== */}

            <main className="applications-content">


                {/* =====================================
                    PAGE HEADER
                ====================================== */}

                <header className="applications-header">

                    <div>

                        <h1>
                            My Applications
                        </h1>

                        <p>
                            Track the jobs you have applied for.
                        </p>

                    </div>

                </header>


              



                {/* =====================================
                    NO APPLICATIONS
                ====================================== */}

                {applications.length === 0 ? (

                    <section className="no-applications">

                        <div className="empty-icon">
                            {/* ICON SPACE */}
                        </div>

                        <h2>
                            No Applications Yet
                        </h2>

                        <p>
                            You haven't applied for any jobs yet.
                        </p>

                        <Link
                            to="/dashboard"
                            className="browse-jobs-button"
                        >
                            Browse Jobs
                        </Link>

                    </section>

                ) : (


                    /* =====================================
                       APPLICATIONS
                    ====================================== */

                    <section className="applications-section">

                        <div className="section-title">

                            <h2>
                                Your Applications
                            </h2>

                        </div>


                        <div className="applications-list">

                            {applications.map(
                                (application) => (

                                    <article
                                        className="application-card"
                                        key={
                                            application.applicationID
                                        }
                                    >


                                        {/* =========================
                                            LEFT SIDE
                                        ========================== */}

                                        <div className="application-main">


                                            


                                            <div className="application-info">

                                                <h3>
                                                    {
                                                        application.jobTitle ||
                                                        "Job Title"
                                                    }
                                                </h3>


                                                <div className="application-meta">

                                                    <span>
                                                        Applied
                                                    </span>

                                                    <strong>
                                                        {
                                                            formatDate(
                                                                application.applicationDate
                                                            )
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="application-meta">

                                                    <span>
                                                        CV
                                                    </span>

                                                    <strong>
                                                        {
                                                            application.cvPath
                                                                ? "Submitted"
                                                                : "Not available"
                                                        }
                                                    </strong>

                                                </div>


                                                {application.feedback && (

                                                    <div className="application-feedback">

                                                        <span>
                                                            Recruiter Feedback
                                                        </span>

                                                        <p>
                                                            {
                                                                application.feedback
                                                            }
                                                        </p>

                                                    </div>

                                                )}

                                            </div>

                                        </div>


                                        {/* =========================
                                            RIGHT SIDE
                                        ========================== */}

                                        <div className="application-actions">


                                            <span
                                                className={
                                                    `status-badge status-${String(
                                                        application.status
                                                    ).toLowerCase()}`
                                                }
                                            >
                                                {
                                                    application.status
                                                }
                                            </span>


                                            <Link
                                                to={
                                                    `/jobs/${application.jobID}`
                                                }
                                                className="view-job-button"
                                            >
                                                View Job
                                            </Link>

                                        </div>


                                    </article>

                                )
                            )}

                        </div>

                    </section>

                )}

            </main>


           {/* =====================================
    BOTTOM NAVIGATION
====================================== */}

<nav className="bottom-navigation">

    <Link
        to="/dashboard"
        className="bottom-nav-item"
            >
                <span className="bottom-nav-icon">
                    {/* ICON SPACE */}
                </span>

                <span>
                    Dashboard
                </span>
            </Link>


            <Link
                to="/my-applications"
                className="bottom-nav-item"
            >
                <span className="bottom-nav-icon">
                    {/* ICON SPACE */}
                </span>

                <span>
                    My Applications
                </span>
            </Link>


            <Link
                to="/saved-jobs"
                className="bottom-nav-item"
            >
                <span className="bottom-nav-icon">
                    {/* ICON SPACE */}
                </span>

                <span>
                    Saved Jobs
                </span>
            </Link>


           <Link
                to="/messages"
                className="bottom-nav-item "
            >
                <span className="bottom-nav-icon">
                    {/* ICON SPACE */}
                </span>

                <span>
                    Messages
                </span>
            </Link>


            <Link
                to="/settings"
                className="bottom-nav-item"
            >
                <span className="bottom-nav-icon">
                    {/* ICON SPACE */}
                </span>

                <span>
                    Settings
                </span>
            </Link>


            <Link
                to="/profile"
                className="bottom-nav-item"
            >
                <span className="bottom-nav-icon">
                    {/* ICON SPACE */}
                </span>

                <span>
                    Profile
                </span>
            </Link>

        </nav>      


        </div>
    );
}


export default MyApplications;