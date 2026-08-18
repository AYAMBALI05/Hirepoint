import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getToken } from "../../../services/auth";

import "./Joblisting.css";

const API_URL = "https://localhost:7081/api/Jobs";


function JobListings() {

    const [jobs, setJobs] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedJob, setSelectedJob] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =========================================
       LOAD JOBS
    ========================================= */

    const loadJobs = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await fetch(API_URL);


            if (!response.ok) {

                throw new Error(
                    "Could not load jobs."
                );

            }


            const data =
                await response.json();


            setJobs(data);

        }

        catch (err) {

            console.error(
                "Load jobs error:",
                err
            );


            setError(
                err.message ||
                "Could not load jobs."
            );

        }

        finally {

            setLoading(false);

        }

    };


    /* =========================================
       LOAD JOBS WHEN PAGE OPENS
    ========================================= */

    useEffect(() => {

        loadJobs();

    }, []);


    /* =========================================
       JOB STATUS
    ========================================= */

    const getJobStatus = (closingDate) => {

        if (!closingDate) {

            return "Closed";

        }


        const today =
            new Date();


        const closing =
            new Date(closingDate);


        if (closing >= today) {

            return "Active";

        }


        return "Closed";

    };


    /* =========================================
       FORMAT DATE
    ========================================= */

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


    /* =========================================
       SEARCH JOBS
    ========================================= */

    const filteredJobs =
        jobs.filter((job) => {

            const search =
                searchTerm
                    .toLowerCase()
                    .trim();


            if (!search) {

                return true;

            }


            return (

                job.title
                    ?.toLowerCase()
                    .includes(search)

                ||

                job.companyName
                    ?.toLowerCase()
                    .includes(search)

                ||

                job.cityName
                    ?.toLowerCase()
                    .includes(search)

                ||

                job.employmentType
                    ?.toLowerCase()
                    .includes(search)

            );

        });


    /* =========================================
       DELETE JOB
    ========================================= */

    const deleteJob = async (jobID) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this job? This action cannot be undone."
            );


        if (!confirmed) {

            return;

        }


        try {

            const token =
                getToken();


            if (!token) {

                throw new Error(
                    "Please log in again."
                );

            }


            const response =
                await fetch(
                    `${API_URL}/${jobID}`,
                    {
                        method: "DELETE",

                        headers: {
                            Authorization:
                                "Bearer " + token
                        }
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();


                console.error(
                    "Delete job error:",
                    errorText
                );


                if (response.status === 401) {

                    throw new Error(
                        "You are not authorized. Please log in again."
                    );

                }


                if (response.status === 403) {

                    throw new Error(
                        "Access denied. Only administrators can delete jobs."
                    );

                }


                throw new Error(
                    "Could not delete the job."
                );

            }


            /* =================================
               REMOVE JOB FROM SCREEN
            ================================= */

            setJobs(
                previousJobs =>
                    previousJobs.filter(
                        job =>
                            job.jobID !== jobID
                    )
            );


            /* =================================
               CLOSE MODAL
            ================================= */

            setSelectedJob(null);


            alert(
                "Job deleted successfully."
            );

        }

        catch (error) {

            console.error(
                "Delete job error:",
                error
            );


            alert(
                error.message ||
                "Could not delete the job."
            );

        }

    };


    /* =========================================
       LOADING
    ========================================= */

    if (loading) {

        return (

            <div className="jobs-message">

                <p>
                    Loading job listings...
                </p>

            </div>

        );

    }


    /* =========================================
       ERROR
    ========================================= */

    if (error) {

        return (

            <div className="jobs-message error">

                <h2>
                    Unable to Load Job Listings
                </h2>


                <p>
                    {error}
                </p>


                <button
                    type="button"
                    className="jobs-retry-button"
                    onClick={loadJobs}
                >
                    Try Again
                </button>


                <Link
                    to="/admin/dashboard"
                    className="jobs-back-button"
                >
                    Back to Dashboard
                </Link>

            </div>

        );

    }


    return (

        <div className="jobs-page">


            <div className="jobs-container">


                {/* =====================================
                    HEADER
                ====================================== */}

                <div className="jobs-header">

                    <h1>
                        Job Listings
                    </h1>


                    <p>
                        Manage and monitor all jobs posted on HirePoint.
                    </p>

                </div>


                {/* =====================================
                    SEARCH
                ====================================== */}

                <div className="jobs-search-section">

                    <input
                        type="text"
                        placeholder="Search by job title, company, location or employment type..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* =====================================
                    JOB LIST
                ====================================== */}

                <section className="jobs-list-section">


                    <div className="jobs-list-header">

                        <div>

                            <h2>
                                All Job Listings
                            </h2>


                            <p>
                                {filteredJobs.length} job
                                {filteredJobs.length !== 1
                                    ? "s"
                                    : ""}
                                {" "}displayed
                            </p>

                        </div>

                    </div>


                    <div className="jobs-list">


                        {filteredJobs.length === 0 ? (

                            <div className="no-jobs">

                                <h2>
                                    No Jobs Found
                                </h2>


                                <p>
                                    No job listings match your search.
                                </p>

                            </div>

                        ) : (

                            filteredJobs.map((job) => {

                                const status =
                                    getJobStatus(
                                        job.closingDate
                                    );


                                return (

                                    <div
                                        className="job-card"
                                        key={job.jobID}
                                    >


                                        {/* ICON SPACE */}

                                        <div className="job-card-icon-space">
                                            {/* Job icon goes here later */}
                                        </div>


                                        {/* INFORMATION */}

                                        <div className="job-card-information">

                                            <h3>
                                                {job.title}
                                            </h3>


                                            <p>
                                                {job.companyName ||
                                                    "Company not specified"}
                                            </p>


                                            <span>
                                                {job.cityName ||
                                                    "Location not specified"}
                                            </span>

                                        </div>


                                        {/* JOB META */}

                                        <div className="job-card-meta">

                                            <p>
                                                {job.employmentType ||
                                                    "N/A"}
                                            </p>


                                            <small>
                                                Closes:{" "}
                                                {formatDate(
                                                    job.closingDate
                                                )}
                                            </small>

                                        </div>


                                        {/* STATUS */}

                                        <div className="job-card-status">

                                            <span
                                                className={
                                                    status === "Active"
                                                        ? "job-status-active"
                                                        : "job-status-closed"
                                                }
                                            >
                                                {status}
                                            </span>

                                        </div>


                                        {/* VIEW */}

                                        <div className="job-card-action-space">

                                            <button
                                                type="button"
                                                className="job-view-button"
                                                onClick={() =>
                                                    setSelectedJob(
                                                        job
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                        </div>


                                    </div>

                                );

                            })

                        )}

                    </div>

                </section>


            </div>


            {/* =========================================
                JOB DETAILS MODAL
            ========================================= */}

            {selectedJob && (

                <div
                    className="job-modal-overlay"
                    onClick={() =>
                        setSelectedJob(null)
                    }
                >


                    <div
                        className="job-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="job-modal-header">

                            <h2>
                                Job Details
                            </h2>


                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedJob(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* JOB ICON */}

                        <div className="modal-job-icon-space">
                            {/* Job icon goes here later */}
                        </div>


                        {/* JOB TITLE */}

                        <div className="job-modal-title">

                            <h3>
                                {selectedJob.title}
                            </h3>


                            <p>
                                {selectedJob.companyName ||
                                    "Company not specified"}
                            </p>

                        </div>


                        {/* JOB DETAILS */}

                        <div className="job-details">


                            <p>

                                <strong>
                                    Location
                                </strong>


                                <span>
                                    {selectedJob.cityName ||
                                        "N/A"}
                                </span>

                            </p>


                            <p>

                                <strong>
                                    Employment Type
                                </strong>


                                <span>
                                    {selectedJob.employmentType ||
                                        "N/A"}
                                </span>

                            </p>


                            <p>

                                <strong>
                                    Salary
                                </strong>


                                <span>
                                    {selectedJob.salary ||
                                        "N/A"}
                                </span>

                            </p>


                            <p>

                                <strong>
                                    Experience
                                </strong>


                                <span>
                                    {selectedJob.experienceRequired ||
                                        "N/A"}
                                </span>

                            </p>


                            <p>

                                <strong>
                                    Vacancies
                                </strong>


                                <span>
                                    {selectedJob.availableVacancies ||
                                        0}
                                </span>

                            </p>


                            <p>

                                <strong>
                                    Posted
                                </strong>


                                <span>
                                    {formatDate(
                                        selectedJob.postDate
                                    )}
                                </span>

                            </p>


                            <p>

                                <strong>
                                    Closing Date
                                </strong>


                                <span>
                                    {formatDate(
                                        selectedJob.closingDate
                                    )}
                                </span>

                            </p>


                            <p>

                                <strong>
                                    Status
                                </strong>


                                <span
                                    className={
                                        getJobStatus(
                                            selectedJob.closingDate
                                        ) === "Active"
                                            ? "modal-status-active"
                                            : "modal-status-closed"
                                    }
                                >
                                    {getJobStatus(
                                        selectedJob.closingDate
                                    )}
                                </span>

                            </p>


                        </div>


                        {/* DESCRIPTION */}

                        <div className="job-description">

                            <strong>
                                Description
                            </strong>


                            <p>
                                {selectedJob.description ||
                                    "No description provided."}
                            </p>

                        </div>


                        {/* QUALIFICATION */}

                        <div className="job-qualification">

                            <strong>
                                Qualification Required
                            </strong>


                            <p>
                                {selectedJob.qualificationRequired ||
                                    "No qualification specified."}
                            </p>

                        </div>


                        {/* MODAL ACTIONS */}

                        <div className="job-modal-actions">


                            <button
                                type="button"
                                className="job-modal-close-button"
                                onClick={() =>
                                    setSelectedJob(null)
                                }
                            >
                                Close
                            </button>


                            <button
                                type="button"
                                className="job-modal-delete-button"
                                onClick={() =>
                                    deleteJob(
                                        selectedJob.jobID
                                    )
                                }
                            >
                                Delete Job
                            </button>


                        </div>


                    </div>

                </div>

            )}


            {/* =========================================
                BOTTOM NAVIGATION
            ========================================= */}

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


                <Link
                    to="/admin/jobs"
                    className="active"
                >

                    <span>
                        {/* Job Listings icon space */}
                    </span>


                    <small>
                        Job Listings
                    </small>

                </Link>


                <Link to="/admin/analytics">

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


export default JobListings;