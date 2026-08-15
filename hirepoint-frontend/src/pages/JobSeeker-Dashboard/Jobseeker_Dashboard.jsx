import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCurrentUser, logout } from "../../services/auth";
import { getJobs } from "../../services/api";

import "./Jobseeker_Dashboard.css";

import userIcon from "../../assets/user.png";
import briefcaseIcon from "../../assets/briefcase.png";



function JobSeekerDashboard() {

    const navigate = useNavigate();

    /*
     * Get the currently logged-in user.
     */
    const user = getCurrentUser();


    /*
     * Store all jobs returned by the API.
     */
    const [jobs, setJobs] = useState([]);


    /*
     * Store the jobs after search/filtering.
     */
    const [filteredJobs, setFilteredJobs] = useState([]);


    /*
     * Dashboard loading state.
     */
    const [loading, setLoading] = useState(true);


    /*
     * Error message if jobs cannot be loaded.
     */
    const [error, setError] = useState("");


    /*
     * Search field.
     */
    const [searchTerm, setSearchTerm] = useState("");


    /*
     * Filters.
     */
    const [locationFilter, setLocationFilter] = useState("");
    const [qualificationFilter, setQualificationFilter] = useState("");
    const [employmentTypeFilter, setEmploymentTypeFilter] = useState("");


    /*
     * Load jobs when the dashboard opens.
     */
    useEffect(() => {

        const loadJobs = async () => {

            try {

                setLoading(true);
                setError("");

                const data = await getJobs();

                setJobs(data);
                setFilteredJobs(data);

            }
            catch (error) {

                console.error(
                    "Could not load jobs:",
                    error
                );

                setError(
                    "Could not load available jobs."
                );

            }
            finally {

                setLoading(false);

            }
        };


        loadJobs();

    }, []);


    /*
     * Apply search and filters.
     */
    const handleFilter = () => {

        let results = [...jobs];


        /*
         * Search by:
         * - Job title
         * - Company name
         * - Description
         */
        if (searchTerm.trim() !== "") {

            const search = searchTerm
                .toLowerCase()
                .trim();

            results = results.filter((job) => {

                const title =
                    job.title?.toLowerCase() || "";

                const company =
                    job.companyName?.toLowerCase() || "";

                const description =
                    job.description?.toLowerCase() || "";


                return (
                    title.includes(search) ||
                    company.includes(search) ||
                    description.includes(search)
                );

            });
        }


        /*
         * Location filter.
         */
        if (locationFilter !== "") {

            results = results.filter((job) =>
                job.cityName === locationFilter
            );

        }


        /*
         * Qualification filter.
         */
        if (qualificationFilter !== "") {

            results = results.filter((job) =>
                job.qualificationRequired ===
                qualificationFilter
            );

        }


        /*
         * Employment type filter.
         */
        if (employmentTypeFilter !== "") {

            results = results.filter((job) =>
                job.employmentType ===
                employmentTypeFilter
            );

        }


        setFilteredJobs(results);

    };


    /*
     * Clear all filters.
     */
    const clearFilters = () => {

        setSearchTerm("");

        setLocationFilter("");

        setQualificationFilter("");

        setEmploymentTypeFilter("");

        setFilteredJobs(jobs);

    };


    /*
     * Logout the current user.
     */
    const handleLogout = () => {

        logout();

        navigate("/");

    };


    /*
     * Create unique filter options
     * from the jobs returned by the API.
     */
    const locations = [
        ...new Set(
            jobs
                .map((job) => job.cityName)
                .filter(Boolean)
        )
    ];


    const qualifications = [
        ...new Set(
            jobs
                .map(
                    (job) =>
                        job.qualificationRequired
                )
                .filter(Boolean)
        )
    ];


    const employmentTypes = [
        ...new Set(
            jobs
                .map(
                    (job) =>
                        job.employmentType
                )
                .filter(Boolean)
        )
    ];


    return (

        <div className="dashboard-layout">


            {/* =====================================
                SIDEBAR
            ====================================== */}

            <aside className="dashboard-sidebar">


                {/* Logo */}

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


                {/* User information */}

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
            Job Seeker
        </span>

    </div>

</div>

                {/* Navigation */}

                <nav className="dashboard-navigation">


                    <Link
                        to="/dashboard"
                        className="dashboard-nav-item active"
                    >

                        <span className="dashboard-nav-icon">
                            {/* ICON SPACE */}
                        </span>

                        <span>
                            Dashboard
                        </span>

                    </Link>


                    <Link
                        to="/my-applications"
                        className="dashboard-nav-item"
                    >

                       

                        <span>
                            My Applications
                        </span>

                    </Link>


                    <Link
                        to="/saved-jobs"
                        className="dashboard-nav-item"
                    >

                        

                        <span>
                            Saved Jobs
                        </span>

                    </Link>


                    <Link
                        to="/messages"
                        className="dashboard-nav-item"
                    >

                        
                        <span>
                            Messages
                        </span>

                    </Link>


                    <Link
                        to="/settings"
                        className="dashboard-nav-item"
                    >

                        <span>
                            Settings
                        </span>

                    </Link>

                    <Link
                        to="/profile"
                        className="dashboard-nav-item"
                    >

                    
                        <span>
                            Profile
                        </span>

                    </Link>


                </nav>


                {/* Logout */}

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
                MAIN DASHBOARD
            ====================================== */}

            <main className="dashboard-main">


                {/* Header */}

                <header className="dashboard-header">

                    <div>

                        <h1>
                            Welcome, {user?.firstName || "User"}
                        </h1>

                        <p>
                            Find your next career opportunity.
                        </p>

                    </div>


                    <div className="dashboard-header-profile">

                        <div className="dashboard-profile-icon">
                            {/* ICON SPACE */}
                        </div>

                    </div>

                </header>


                {/* =====================================
                    SEARCH
                ====================================== */}

                <section className="dashboard-search-section">

                    <div className="dashboard-search-box">

                        <span className="search-icon">
                            {/* ICON SPACE */}
                        </span>

                        <input
                            type="text"
                            placeholder="Search jobs, companies or keywords..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    handleFilter();
                                }

                            }}
                        />

                    </div>


                    <button
                        type="button"
                        className="search-button"
                        onClick={handleFilter}
                    >
                        Search
                    </button>

                </section>


                {/* =====================================
                    FILTERS
                ====================================== */}

                <section className="dashboard-filters">

                    <div className="filter-group">

                        <label>
                            Location
                        </label>

                        <select
                            value={locationFilter}
                            onChange={(e) =>
                                setLocationFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                All Locations
                            </option>

                            {locations.map(
                                (location) => (

                                    <option
                                        key={location}
                                        value={location}
                                    >
                                        {location}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    <div className="filter-group">

                        <label>
                            Qualification
                        </label>

                        <select
                            value={qualificationFilter}
                            onChange={(e) =>
                                setQualificationFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                All Qualifications
                            </option>

                            {qualifications.map(
                                (qualification) => (

                                    <option
                                        key={qualification}
                                        value={qualification}
                                    >
                                        {qualification}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    <div className="filter-group">

                        <label>
                            Employment Type
                        </label>

                        <select
                            value={employmentTypeFilter}
                            onChange={(e) =>
                                setEmploymentTypeFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                All Types
                            </option>

                            {employmentTypes.map(
                                (type) => (

                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    <div className="filter-actions">

                        <button
                            type="button"
                            onClick={handleFilter}
                            className="apply-filter-button"
                        >
                            Apply Filters
                        </button>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="clear-filter-button"
                        >
                            Clear
                        </button>

                    </div>

                </section>


              {/* =====================================
    JOBS
====================================== */}

<section className="dashboard-jobs">

    <div className="jobs-section-header">

        <div>

            <h2>
                Available Jobs
            </h2>

            <p>
                {filteredJobs.length} opportunities available
            </p>

        </div>

    </div>


    {/* Loading */}

    {loading && (

        <div className="dashboard-message">

            Loading jobs...

        </div>

    )}


    {/* Error */}

    {!loading && error && (

        <div className="dashboard-message error">

            {error}

        </div>

    )}


    {/* No jobs */}

    {!loading &&
        !error &&
        filteredJobs.length === 0 && (

            <div className="dashboard-message">

                No jobs match your search criteria.

            </div>

        )}


    {/* Job Cards */}

    {!loading &&
        !error &&
        filteredJobs.length > 0 && (

            <div className="dashboard-job-list">

                {filteredJobs.map((job) => (

                    <article
                        className="dashboard-job-card"
                        key={job.jobID}
                    >

                        {/* =================================
                            JOB CARD CONTENT
                        ================================= */}

                        <div className="job-card-content">


                            {/* JOB TITLE */}

                            <div className="job-card-header">

                                <h3>
                                    {job.title}
                                </h3>

                                <p className="job-company">
                                    {job.companyName}
                                </p>

                            </div>


                            {/* JOB DETAILS */}

                            <div className="job-card-details">


                                {/* Location */}

                                <div className="job-detail">

                                    <span className="job-detail-icon">
                                        {/* ICON SPACE */}
                                    </span>

                                    <div>

                                        <span className="job-detail-label">
                                            Location
                                        </span>

                                        <strong>
                                            {job.cityName || "Not specified"}
                                        </strong>

                                    </div>

                                </div>


                                {/* Salary */}

                                <div className="job-detail">

                                    <span className="job-detail-icon">
                                        {/* ICON SPACE */}
                                    </span>

                                    <div>

                                        <span className="job-detail-label">
                                            Salary
                                        </span>

                                        <strong>
                                            {job.salary
                                                ? `R${job.salary}`
                                                : "Not specified"}
                                        </strong>

                                    </div>

                                </div>


                                {/* Date Posted */}

                                <div className="job-detail">

                                    <span className="job-detail-icon">
                                        {/* ICON SPACE */}
                                    </span>

                                    <div>

                                        <span className="job-detail-label">
                                            Date Posted
                                        </span>

                                        <strong>

                                            {job.postDate
                                                ? new Date(
                                                    job.postDate
                                                ).toLocaleDateString()
                                                : "Not specified"}

                                        </strong>

                                    </div>

                                </div>


                                {/* Employment Type */}

                                <div className="job-detail">

                                    <span className="job-detail-icon">
                                        {/* ICON SPACE */}
                                    </span>

                                    <div>

                                        <span className="job-detail-label">
                                            Employment Type
                                        </span>

                                        <strong>
                                            {job.employmentType ||
                                                "Not specified"}
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* =================================
                                DESCRIPTION + ACTIONS
                            ================================= */}

                            <div className="job-card-bottom">


                                {/* DESCRIPTION */}

                                <div className="job-description">

                                    <span className="job-description-label">
                                        Job Description
                                    </span>

                                    <p>

                                        {job.description ||
                                            "No job description provided."}

                                    </p>

                                </div>


                                {/* BUTTONS */}

                                <div className="job-card-actions">

                                    <Link
                                        to={`/jobs/${job.jobID}`}
                                        className="view-job-button"
                                    >
                                        View Details
                                    </Link>


                                    <Link
                                        to={`/jobs/${job.jobID}/apply`}
                                        className="apply-job-button"
                                    >
                                        Apply
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </article>

                ))}

            </div>

        )}

</section>


            </main>

        </div>
    );
}


export default JobSeekerDashboard;