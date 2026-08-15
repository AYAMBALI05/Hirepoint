import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getJobs } from "../../services/api";

import "./Jobs.css";


function Jobs() {

    /*
     * Stores all jobs returned by the API.
     */
    const [jobs, setJobs] = useState([]);


    /*
     * Search text entered by the user.
     */
    const [searchTerm, setSearchTerm] = useState("");


    /*
     * Selected location.
     */
    const [locationFilter, setLocationFilter] = useState("");


    /*
     * Selected employment type.
     */
    const [employmentFilter, setEmploymentFilter] = useState("");


    /*
     * Loading state.
     */
    const [loading, setLoading] = useState(true);


    /*
     * Error message.
     */
    const [error, setError] = useState("");


    /*
     * Load jobs when the page opens.
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
     * Create a list of unique locations.
     *
     * This allows us to populate the
     * Location dropdown dynamically.
     */
    const locations = [
        ...new Set(
            jobs
                .map((job) => job.cityName)
                .filter(Boolean)
        )
    ];


    /*
     * Create a list of unique employment types.
     */
    const employmentTypes = [
        ...new Set(
            jobs
                .map((job) => job.employmentType)
                .filter(Boolean)
        )
    ];


    /*
     * Filter the jobs.
     */
    const filteredJobs = jobs.filter((job) => {

        const search = searchTerm
            .toLowerCase()
            .trim();


        /*
         * Search by:
         * - Job title
         * - Company
         * - Location
         */
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


        /*
         * Location filter.
         */
        const matchesLocation =
            !locationFilter ||
            job.cityName === locationFilter;


        /*
         * Employment type filter.
         */
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
     * Reset all filters.
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
                        Search thousands of opportunities
                        and find the right job for you.
                    </p>

                </div>

            </section>


            {/* =================================
                SEARCH & FILTERS
            ================================== */}

            <section className="jobs-search-section">

                <div className="jobs-search-container">


                    {/* Search */}

                    <div className="jobs-search-box">

                        <label>
                            Search
                        </label>

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


                    {/* Location */}

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


                    {/* Employment type */}

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


                    {/* Clear */}

                    <button
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

                    <h2>
                        Available Jobs
                    </h2>

                    {!loading && !error && (

                        <span>
                            {filteredJobs.length}{" "}
                            {filteredJobs.length === 1
                                ? "job"
                                : "jobs"} found
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
                                onClick={clearFilters}
                                className="clear-results-button"
                            >
                                Clear Filters
                            </button>

                        </div>

                    )}


                {/* Job cards */}

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

                                                    {
                                                        job.employmentType
                                                    }

                                                </span>

                                            )}

                                        </div>


                                        <div className="job-card-details">

                                            <span>
                                                📍{" "}
                                                {job.cityName ||
                                                    "Location not specified"}
                                            </span>

                                            <span>
                                                💰{" "}
                                                {job.salary
                                                    ? `R${job.salary}`
                                                    : "Salary not specified"}
                                            </span>

                                            {job.experienceRequired && (

                                                <span>
                                                    💼{" "}
                                                    {
                                                        job.experienceRequired
                                                    }
                                                </span>

                                            )}

                                        </div>


                                        <p className="job-description">

                                            {job.description?.length > 150
                                                ? `${job.description.substring(
                                                    0,
                                                    150
                                                )}...`
                                                : job.description}

                                        </p>


                                        <div className="job-card-footer">

                                            <Link
                                                to={`/jobs/${job.jobID}`}
                                                className="view-job-button"
                                            >
                                                View Job
                                            </Link>

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    )}

            </main>

        </div>
    );
}


export default Jobs;