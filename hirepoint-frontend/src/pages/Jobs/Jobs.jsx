import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getJobs } from "../../services/api";

import "./Jobs.css";


function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [employmentFilter, setEmploymentFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /*
     * Load jobs from the ASP.NET API.
     */
    useEffect(() => {

        const loadJobs = async () => {

            try {

                setLoading(true);

                const data = await getJobs();

                setJobs(data);

            } catch (error) {

                console.error(
                    "Could not load jobs:",
                    error
                );

                setError(
                    "Could not load jobs. Please try again."
                );

            } finally {

                setLoading(false);
            }
        };

        loadJobs();

    }, []);


    /*
     * Create unique locations for the filter.
     */
    const locations = [
        ...new Set(
            jobs
                .map((job) => job.cityName)
                .filter(Boolean)
        )
    ];


    /*
     * Create unique employment types.
     */
    const employmentTypes = [
        ...new Set(
            jobs
                .map((job) => job.employmentType)
                .filter(Boolean)
        )
    ];


    /*
     * Filter jobs according to the
     * user's search and selections.
     */
    const filteredJobs = jobs.filter((job) => {

        const search = searchTerm
            .toLowerCase()
            .trim();


        const matchesSearch =
            !search ||
            job.title
                ?.toLowerCase()
                .includes(search) ||
            job.companyName
                ?.toLowerCase()
                .includes(search) ||
            job.cityName
                ?.toLowerCase()
                .includes(search);


        const matchesLocation =
            !locationFilter ||
            job.cityName === locationFilter;


        const matchesEmployment =
            !employmentFilter ||
            job.employmentType === employmentFilter;


        return (
            matchesSearch &&
            matchesLocation &&
            matchesEmployment
        );
    });


    /*
     * Clear all filters.
     */
    const clearFilters = () => {

        setSearchTerm("");
        setLocationFilter("");
        setEmploymentFilter("");

    };


    return (

        <div className="jobs-page">


            {/* =================================
                PAGE HEADER
            ================================== */}

            <section className="jobs-header">

                <div className="jobs-header-content">

                    <h1>
                        Find Your Next Job
                    </h1>

                    <p>
                        Search for opportunities that
                        match your skills and goals.
                    </p>

                </div>

            </section>


            {/* =================================
                SEARCH AND FILTERS
            ================================== */}

            <section className="jobs-search-section">

                <div className="jobs-search-container">


                    <div className="jobs-search-box">

                        <label>
                            Search
                        </label>

                        <div className="search-input-wrapper">

                            {/* Space reserved for search icon */}
                            <span className="search-icon"></span>

                            <input
                                type="text"
                                placeholder="Job title, company or keyword"
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    <div className="jobs-filter">

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


                    <div className="jobs-filter">

                        <label>
                            Employment Type
                        </label>

                        <select
                            value={employmentFilter}
                            onChange={(e) =>
                                setEmploymentFilter(
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


                    <button
                        type="button"
                        className="clear-filters-button"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>

                </div>

            </section>


            {/* =================================
                JOB RESULTS
            ================================== */}

            <main className="jobs-content">

                <div className="jobs-results-header">

                    <div>

                        <h2>
                            Available Jobs
                        </h2>

                        <p>
                            Find an opportunity that
                            suits you.
                        </p>

                    </div>


                    {!loading && !error && (

                        <span className="jobs-count">

                            {filteredJobs.length}{" "}

                            {filteredJobs.length === 1
                                ? "job"
                                : "jobs"}{" "}
                            found

                        </span>

                    )}

                </div>


                {/* Loading */}

                {loading && (

                    <div className="jobs-message">

                        Loading jobs...

                    </div>

                )}


                {/* Error */}

                {!loading && error && (

                    <div className="jobs-message error">

                        {error}

                    </div>

                )}


                {/* No results */}

                {!loading &&
                    !error &&
                    filteredJobs.length === 0 && (

                        <div className="jobs-message">

                            <h3>
                                No jobs found
                            </h3>

                            <p>
                                Try changing your search
                                or filters.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="clear-results-button"
                            >
                                Clear Filters
                            </button>

                        </div>

                    )}


                {/* =================================
                    JOB CARDS
                ================================== */}

                {!loading &&
                    !error &&
                    filteredJobs.length > 0 && (

                        <div className="jobs-grid">

                            {filteredJobs.map(
                                (job) => (

                                    <article
                                        className="job-card"
                                        key={job.jobID}
                                    >


                                        <div className="job-card-header">

                                            <div>

                                                <h3>
                                                    {job.title}
                                                </h3>

                                                <p className="job-company">
                                                    {job.companyName}
                                                </p>

                                            </div>


                                            {job.employmentType && (

                                                <span className="job-type">

                                                    {job.employmentType}

                                                </span>

                                            )}

                                        </div>


                                        {/* Job details */}

                                        <div className="job-card-details">


                                            <span className="job-detail-item">

                                                {/* Space reserved for location icon */}
                                                <span className="job-detail-icon"></span>

                                                <span>
                                                    {job.cityName ||
                                                        "Location not specified"}
                                                </span>

                                            </span>


                                            <span className="job-detail-item">

                                                {/* Space reserved for salary icon */}
                                                <span className="job-detail-icon"></span>

                                                <span>
                                                    {job.salary
                                                        ? `R${job.salary}`
                                                        : "Salary not specified"}
                                                </span>

                                            </span>


                                            {job.experienceRequired && (

                                                <span className="job-detail-item">

                                                    {/* Space reserved for experience icon */}
                                                    <span className="job-detail-icon"></span>

                                                    <span>
                                                        {job.experienceRequired}
                                                    </span>

                                                </span>

                                            )}

                                        </div>


                                        {/* Description */}

                                        <p className="job-description">

                                            {job.description?.length > 150
                                                ? `${job.description.substring(
                                                    0,
                                                    150
                                                )}...`
                                                : job.description}

                                        </p>


                                        {/* Card footer */}

                                        <div className="job-card-footer">

                                            <Link
                                                to={`/jobs/${job.jobID}`}
                                                className="view-job-button"
                                            >
                                                View Details
                                            </Link>

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    )}

            </main>


            {/* =================================
                BOTTOM NAVIGATION
            ================================== */}

            <nav className="bottom-navbar">


                <Link to="/dashboard">

                    {/* Space reserved for icon */}
                    <span className="nav-icon"></span>

                    <small>
                        Home
                    </small>

                </Link>


                <Link
                    to="/jobs"
                    className="active"
                >

                    {/* Space reserved for icon */}
                    <span className="nav-icon"></span>

                    <small>
                        Jobs
                    </small>

                </Link>


                <Link to="/my-applications">

                    {/* Space reserved for icon */}
                    <span className="nav-icon"></span>

                    <small>
                        Applications
                    </small>

                </Link>


                <Link to="/saved-jobs">

                    {/* Space reserved for icon */}
                    <span className="nav-icon"></span>

                    <small>
                        Saved
                    </small>

                </Link>


                <Link to="/profile">

                    {/* Space reserved for icon */}
                    <span className="nav-icon"></span>

                    <small>
                        Profile
                    </small>

                </Link>

            </nav>

        </div>
    );
}


export default Jobs;