import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getToken } from "../../services/auth";

import "./MyApplications.css";


function MyApplications() {

    /*
     * Stores the applications returned
     * by the ASP.NET API.
     */
    const [applications, setApplications] = useState([]);


    /*
     * Controls the loading message.
     */
    const [loading, setLoading] = useState(true);


    /*
     * Stores an error message if the API fails.
     */
    const [error, setError] = useState("");


    /*
     * Load the logged-in user's applications.
     */
    useEffect(() => {

        const loadApplications = async () => {

            try {

                /*
                 * Get the JWT stored during login.
                 */
                const token = getToken();


                /*
                 * If there is no token, the user
                 * should not be accessing this page.
                 */
                if (!token) {

                    setError(
                        "Please log in to view your applications."
                    );

                    setLoading(false);

                    return;
                }


                /*
                 * Request the applications belonging
                 * to the currently logged-in job seeker.
                 */
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


                /*
                 * Check whether ASP.NET returned
                 * a successful response.
                 */
                if (!response.ok) {

                    throw new Error(
                        "Could not load your applications."
                    );
                }


                /*
                 * Convert the response to JSON.
                 */
                const data = await response.json();


                /*
                 * Store the applications in React state.
                 */
                setApplications(data);

            } catch (error) {

                console.error(
                    "Applications error:",
                    error
                );

                setError(
                    error.message
                );

            } finally {

                setLoading(false);
            }
        };


        loadApplications();

    }, []);


    /*
     * Loading state.
     */
    if (loading) {

        return (
            <div className="applications-message">
                Loading your applications...
            </div>
        );
    }


    /*
     * Error state.
     */
    if (error) {

        return (
            <div className="applications-message error">
                {error}
            </div>
        );
    }


    return (

        <div className="applications-page">

            <div className="applications-container">


                {/* =========================
                    PAGE HEADER
                ========================== */}

                <div className="applications-header">

                    <div>

                        <h1>
                            My Applications
                        </h1>

                        <p>
                            Track the jobs you have applied for.
                        </p>

                    </div>


                    <Link
                        to="/jobs"
                        className="browse-jobs-button"
                    >
                        Browse Jobs
                    </Link>

                </div>


                {/* =========================
                    NO APPLICATIONS
                ========================== */}

                {applications.length === 0 ? (

                    <div className="no-applications">

                        <h2>
                            No Applications Yet
                        </h2>

                        <p>
                            You haven't applied for any jobs yet.
                        </p>

                        <Link
                            to="/jobs"
                            className="browse-jobs-button"
                        >
                            Find a Job
                        </Link>

                    </div>

                ) : (


                    /* =========================
                       APPLICATION LIST
                    ========================== */

                    <div className="applications-list">

                        {applications.map((application) => (

                            <div
                                className="application-card"
                                key={application.applicationID}
                            >


                                {/* Job information */}

                                <div className="application-info">

                                    <h2>
                                        {application.jobTitle}
                                    </h2>


                                    <p>
                                        Applied on:{" "}

                                        {new Date(
                                            application.applicationDate
                                        ).toLocaleDateString()}
                                    </p>


                                    <p>
                                        CV submitted:{" "}

                                        {application.cvPath
                                            ? "Yes"
                                            : "No"}
                                    </p>

                                </div>


                                {/* Application status */}

                                <div className="application-status">

                                    <span
                                        className={
                                            `status-badge status-${String(
                                                application.status
                                            ).toLowerCase()}`
                                        }
                                    >
                                        {application.status}
                                    </span>


                                    <Link
                                        to={`/jobs/${application.jobID}`}
                                        className="view-job-button"
                                    >
                                        View Job
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}


export default MyApplications;