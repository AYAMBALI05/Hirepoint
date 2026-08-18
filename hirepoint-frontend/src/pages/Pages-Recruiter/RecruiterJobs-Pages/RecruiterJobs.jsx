import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getToken } from "../../../services/auth";

import "./RecruiterJobs.css";

const API_BASE_URL = "https://localhost:7081/api";

function RecruiterJobs() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================================
    // LOAD RECRUITER'S JOBS
    // =========================================

    useEffect(() => {

        const loadJobs = async () => {

            const token = getToken();

            if (!token) {

                setError(
                    "You are not logged in. Please log in again."
                );

                setLoading(false);

                return;
            }

            try {

                const response = await fetch(
                    `${API_BASE_URL}/Jobs/MyJobs`,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                "Bearer " + token
                        }
                    }
                );


                const responseText =
                    await response.text();


                if (!response.ok) {

                    console.error(
                        "MyJobs error:",
                        responseText
                    );

                    throw new Error(
                        responseText ||
                        "Could not load your jobs."
                    );
                }


                const data =
                    responseText
                        ? JSON.parse(responseText)
                        : [];


                setJobs(data);

            }

            catch (error) {

                console.error(
                    "Load jobs error:",
                    error
                );

                setError(
                    error.message ||
                    "Could not load your jobs."
                );

            }

            finally {

                setLoading(false);

            }

        };


        loadJobs();

    }, []);


    // =========================================
    // DELETE JOB
    // =========================================

    const handleDelete = async (jobID) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this job?"
            );


        if (!confirmDelete) {
            return;
        }


        const token = getToken();


        if (!token) {

            setError(
                "You are not logged in. Please log in again."
            );

            return;

        }


        try {

            const response = await fetch(
                `${API_BASE_URL}/Jobs/DeleteJob/${jobID}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );


            const responseText =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Could not delete the job."
                );

            }


            // Remove the deleted job from the page
            setJobs(
                previousJobs =>
                    previousJobs.filter(
                        job =>
                            job.jobID !== jobID
                    )
            );

        }

        catch (error) {

            console.error(
                "Delete job error:",
                error
            );

            setError(
                error.message ||
                "Could not delete the job."
            );

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="recruiter-jobs-page">

                <div className="recruiter-jobs-container">

                    <p>
                        Loading your jobs...
                    </p>

                </div>

            </div>

        );

    }


    // =========================================
    // PAGE
    // =========================================

    return (

        <div className="recruiter-jobs-page">

            <main className="recruiter-jobs-container">


                {/* =====================================
                    HEADER
                ====================================== */}

                <div className="recruiter-jobs-header">

                    <div>

                        <p className="recruiter-jobs-label">
                            RECRUITER
                        </p>

                        <h1>
                            My Job Listings
                        </h1>

                        <p>
                            View and manage the jobs
                            you have posted.
                        </p>

                    </div>


                    <Link
                        to="/recruiter/jobs/create"
                        className="recruiter-post-job-button"
                    >
                        Post New Job
                    </Link>

                </div>


                {/* =====================================
                    ERROR
                ====================================== */}

                {error && (

                    <div className="recruiter-jobs-error">

                        {error}

                    </div>

                )}


                {/* =====================================
                    NO JOBS
                ====================================== */}

                {!error && jobs.length === 0 && (

                    <div className="recruiter-no-jobs">

                        <h2>
                            No Jobs Posted Yet
                        </h2>

                        <p>
                            You have not posted any jobs.
                        </p>

                        <Link
                            to="/recruiter/jobs/create"
                            className="recruiter-post-job-button"
                        >
                            Post Your First Job
                        </Link>

                    </div>

                )}


                {/* =====================================
                    JOB LIST
                ====================================== */}

                {jobs.length > 0 && (

                    <div className="recruiter-job-list">

                        {jobs.map(job => (

                            <div
                                className="recruiter-job-card"
                                key={job.jobID}
                            >

                                <div className="recruiter-job-content">

                                    <h2>
                                        {job.title}
                                    </h2>

                                    <p className="recruiter-company-name">
                                        {job.companyName}
                                    </p>

                                    <p>
                                        {job.description}
                                    </p>


                                    <div className="recruiter-job-details">

                                        <span>
                                            {job.cityName}
                                        </span>

                                        <span>
                                            {job.employmentType}
                                        </span>

                                        <span>
                                            {job.availableVacancies}
                                            {" "}
                                            vacancy/vacancies
                                        </span>

                                        <span>
                                            Closing:
                                            {" "}
                                            {job.closingDate
                                                ? new Date(
                                                    job.closingDate
                                                ).toLocaleDateString()
                                                : "N/A"}
                                        </span>

                                    </div>

                                </div>


                                {/* =================================
                                    ACTIONS
                                ================================== */}

                                <div className="recruiter-job-actions">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/recruiter/jobs/edit/${job.jobID}`
                                            )
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        type="button"
                                        className="delete"
                                        onClick={() =>
                                            handleDelete(
                                                job.jobID
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>


            {/* =====================================
                BOTTOM NAVIGATION
            ====================================== */}

            <nav className="recruiter-bottom-navbar">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/recruiter-dashboard"
                        )
                    }
                >
                    Dashboard
                </button>


                <button
                    type="button"
                    className="active"
                >
                    My Jobs
                </button>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/recruiter/jobs/create"
                        )
                    }
                >
                    Post Job
                </button>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/recruiter/applications"
                        )
                    }
                >
                    Applications
                </button>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/recruiter/profile"
                        )
                    }
                >
                    Profile
                </button>

            </nav>

        </div>

    );

}

export default RecruiterJobs;