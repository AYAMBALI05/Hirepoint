import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getToken } from "../../../services/auth";

import "./SavedJobs.css";


function SavedJobs() {

    /*
     * Stores the saved jobs returned
     * by the ASP.NET API.
     */
    const [savedJobs, setSavedJobs] = useState([]);


    /*
     * Controls the loading message.
     */
    const [loading, setLoading] = useState(true);


    /*
     * Stores an error message if the API fails.
     */
    const [error, setError] = useState("");


    /*
     * Load the logged-in user's saved jobs.
     */
    useEffect(() => {

        const loadSavedJobs = async () => {

            try {

                /*
                 * Get the JWT stored during login.
                 */
                const token = getToken();


                /*
                 * Make sure the user is logged in.
                 */
                if (!token) {

                    setError(
                        "Please log in to view your saved jobs."
                    );

                    setLoading(false);

                    return;
                }


                /*
                 * Get the saved jobs belonging
                 * to the logged-in job seeker.
                 */
                const response = await fetch(
                    "https://localhost:7081/api/SavedJobs",
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
                 * Check whether the API request
                 * was successful.
                 */
                if (!response.ok) {

                    throw new Error(
                        "Could not load your saved jobs."
                    );
                }


                /*
                 * Convert the response to JSON.
                 */
                const data = await response.json();


                /*
                 * Store the saved jobs.
                 */
                setSavedJobs(data);

            } catch (error) {

                console.error(
                    "Saved jobs error:",
                    error
                );

                setError(
                    error.message
                );

            } finally {

                setLoading(false);
            }
        };


        loadSavedJobs();

    }, []);


    /*
     * Remove a saved job.
     */
    const handleRemove = async (savedJobID) => {

        try {

            const token = getToken();


            if (!token) {

                setError(
                    "Please log in to continue."
                );

                return;
            }


            /*
             * Delete the saved job using
             * the SavedJobID supplied by the API.
             */
            const response = await fetch(
                `https://localhost:7081/api/SavedJobs/DeleteSavedJob/${savedJobID}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Could not remove saved job."
                );
            }


            /*
             * Remove it from the React state
             * so the page updates immediately.
             */
            setSavedJobs(
                previousJobs =>
                    previousJobs.filter(
                        job =>
                            job.savedJobID !== savedJobID
                    )
            );

        } catch (error) {

            console.error(
                "Remove saved job error:",
                error
            );

            setError(
                error.message
            );
        }
    };


    /*
     * Loading state.
     */
    if (loading) {

        return (
            <div className="saved-jobs-message">
                Loading your saved jobs...
            </div>
        );
    }


    /*
     * Error state.
     */
    if (error) {

        return (
            <div className="saved-jobs-message error">
            {error}
            </div>
        );
    }


    return (

        <div className="saved-jobs-page">

            <div className="saved-jobs-container">


                {/* =========================
                    PAGE HEADER
                ========================== */}

                <div className="saved-jobs-header">

                    <div>

                        <h1>
                            Saved Jobs
                        </h1>

                        <p>
                            Jobs you have saved for later.
                        </p>

                    </div>

                </div>


                {/* =========================
                    NO SAVED JOBS
                ========================== */}

                {savedJobs.length === 0 ? (

                    <div className="no-saved-jobs">

                        <h2>
                            No Saved Jobs Yet
                        </h2>

                        <p>
                            You haven't saved any jobs yet.
                        </p>

                        <Link
                            to="/jobs"
                            className="browse-jobs-button"
                        >
                            Browse Jobs
                        </Link>

                    </div>

                ) : (


                    /* =========================
                       SAVED JOB LIST
                    ========================== */

                    <div className="saved-jobs-list">

                        {savedJobs.map((savedJob) => (

                            <div
                                className="saved-job-card"
                                key={savedJob.savedJobID}
                            >

                                {/* Job information */}

                                <div className="saved-job-info">

                                    <h2>
                                        {savedJob.jobTitle}
                                    </h2>


                                    <p className="saved-job-company">
                                        {savedJob.companyName}
                                    </p>


                                    <p className="saved-job-location">
                                        {savedJob.cityName}
                                    </p>


                                    <p className="saved-job-date">
                                        Saved on:{" "}

                                        {new Date(
                                            savedJob.savedDate
                                        ).toLocaleDateString()}
                                    </p>

                                </div>


                                {/* Actions */}

                                <div className="saved-job-actions">

                                    <Link
                                        to={`/jobs/${savedJob.jobID}`}
                                        className="view-job-button"
                                    >
                                        View Job
                                    </Link>


                                    <button
                                        type="button"
                                        className="remove-job-button"
                                        onClick={() =>
                                            handleRemove(
                                                savedJob.savedJobID
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>


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


export default SavedJobs;