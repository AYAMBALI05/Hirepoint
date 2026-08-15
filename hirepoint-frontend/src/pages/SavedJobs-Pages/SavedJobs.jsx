import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getToken } from "../../services/auth";

import "./SavedJobs.css";


function SavedJobs() {

    /*
     * Stores the saved jobs returned
     * from the ASP.NET API.
     */
    const [savedJobs, setSavedJobs] = useState([]);


    /*
     * Controls the loading state.
     */
    const [loading, setLoading] = useState(true);


    /*
     * Stores an error message if
     * something goes wrong.
     */
    const [error, setError] = useState("");


    /*
     * Used to temporarily disable a
     * Remove button while deleting.
     */
    const [deletingID, setDeletingID] = useState(null);


    /*
     * Load the logged-in user's saved jobs.
     */
    useEffect(() => {

        const loadSavedJobs = async () => {

            try {

                /*
                 * Get the JWT that was saved
                 * during login.
                 */
                const token = getToken();


                /*
                 * The page requires authentication.
                 */
                if (!token) {

                    setError(
                        "Please log in to view your saved jobs."
                    );

                    setLoading(false);

                    return;
                }


                /*
                 * Request saved jobs from ASP.NET.
                 *
                 * The backend determines the user
                 * from the JWT.
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
                 * Check for an unsuccessful
                 * HTTP response.
                 */
                if (!response.ok) {

                    if (response.status === 401) {
                        throw new Error(
                            "Your session has expired. Please log in again."
                        );
                    }

                    if (response.status === 403) {
                        throw new Error(
                            "You do not have permission to view saved jobs."
                        );
                    }

                    throw new Error(
                        "Could not load your saved jobs."
                    );
                }


                /*
                 * Convert the API response
                 * into JavaScript data.
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

                setError(error.message);

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

            setDeletingID(savedJobID);


            /*
             * Get the JWT.
             */
            const token = getToken();


            /*
             * Send DELETE request to ASP.NET.
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


            /*
             * Check whether the delete
             * operation was successful.
             */
            if (!response.ok) {

                if (response.status === 401) {
                    throw new Error(
                        "Your session has expired. Please log in again."
                    );
                }

                if (response.status === 403) {
                    throw new Error(
                        "You cannot remove this saved job."
                    );
                }

                throw new Error(
                    "Could not remove the saved job."
                );
            }


            /*
             * Remove the deleted job from
             * the React state.
             *
             * This means we don't have to
             * reload the entire page.
             */
            setSavedJobs((currentJobs) =>
                currentJobs.filter(
                    (job) =>
                        job.savedJobID !== savedJobID
                )
            );

        } catch (error) {

            console.error(
                "Remove saved job error:",
                error
            );

            setError(error.message);

        } finally {

            setDeletingID(null);
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


                {/* =================================
                    PAGE HEADER
                ================================== */}

                <div className="saved-jobs-header">

                    <div>

                        <h1>
                            My Saved Jobs
                        </h1>

                        <p>
                            Jobs you've saved for later.
                        </p>

                    </div>


                    <Link
                        to="/jobs"
                        className="browse-jobs-button"
                    >
                        Browse Jobs
                    </Link>

                </div>


                {/* =================================
                    NO SAVED JOBS
                ================================== */}

                {savedJobs.length === 0 ? (

                    <div className="no-saved-jobs">

                        <h2>
                            No Saved Jobs
                        </h2>

                        <p>
                            You haven't saved any jobs yet.
                        </p>

                        <Link
                            to="/jobs"
                            className="browse-jobs-button"
                        >
                            Find Jobs
                        </Link>

                    </div>

                ) : (


                    /* =================================
                       SAVED JOB LIST
                    ================================== */

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


                                    <p className="company-name">
                                        {savedJob.companyName}
                                    </p>


                                    <p>
                                        📍 {savedJob.cityName}
                                    </p>


                                    <p className="saved-date">
                                        Saved on{" "}

                                        {new Date(
                                            savedJob.savedDate
                                        ).toLocaleDateString()}
                                    </p>

                                </div>


                                {/* Job actions */}

                                <div className="saved-job-actions">

                                    <Link
                                        to={`/jobs/${savedJob.jobID}`}
                                        className="view-job-button"
                                    >
                                        View Job
                                    </Link>


                                    <button
                                        className="remove-saved-button"
                                        onClick={() =>
                                            handleRemove(
                                                savedJob.savedJobID
                                            )
                                        }
                                        disabled={
                                            deletingID ===
                                            savedJob.savedJobID
                                        }
                                    >

                                        {deletingID ===
                                        savedJob.savedJobID
                                            ? "Removing..."
                                            : "Remove"}

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}


export default SavedJobs;