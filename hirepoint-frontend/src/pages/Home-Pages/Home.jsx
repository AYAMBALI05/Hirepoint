import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getJobs } from "../../services/api";

import "./Home.css";


function Home() {

    /*
     * Stores all jobs returned by the API.
     */
    const [jobs, setJobs] = useState([]);


    /*
     * Stores the search text entered
     * by the Job Seeker.
     */
    const [searchTerm, setSearchTerm] = useState("");


    /*
     * Loading state.
     */
    const [loading, setLoading] = useState(true);


    /*
     * Error message.
     */
    const [error, setError] = useState("");


    /*
     * Load jobs when the Home page opens.
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
     * Filter jobs according to the
     * search term.
     *
     * We search by:
     * - Job title
     * - Company
     * - Location
     */
    const filteredJobs = jobs.filter((job) => {

        const search = searchTerm.toLowerCase();


        return (

            job.title?.toLowerCase().includes(search) ||

            job.companyName
                ?.toLowerCase()
                .includes(search) ||

            job.cityName
                ?.toLowerCase()
                .includes(search)

        );
    });


    return (

        <div className="home-page">


            {/* =================================
                HERO SECTION
            ================================== */}

            <section className="home-hero">

                <div className="home-hero-content">

                    <h1>
                        Find Your Next Opportunity
                    </h1>

                    <p>
                        Search for jobs, discover opportunities,
                        and build your future with HirePoint.
                    </p>


                    {/* Search */}

                    <div className="home-search">

                        <input
                            type="text"
                            placeholder="Search jobs, companies or locations..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />

                        <Link
                            to="/jobs"
                            className="search-button"
                        >
                            Browse Jobs
                        </Link>

                    </div>

                </div>

            </section>


            {/* =================================
                JOBS SECTION
            ================================== */}

            <section className="home-jobs-section">

                <div className="home-section-header">

                    <div>

                        <h2>
                            Latest Job Opportunities
                        </h2>

                        <p>
                            Explore the latest opportunities
                            available on HirePoint.
                        </p>

                    </div>


                    <Link
                        to="/jobs"
                        className="view-all-link"
                    >
                        View All Jobs →
                    </Link>

                </div>


                {/* Loading */}

                {loading && (

                    <div className="home-message">
                        Loading jobs...
                    </div>

                )}


                {/* Error */}

                {!loading && error && (

                    <div className="home-message error">
                        {error}
                    </div>

                )}


                {/* Jobs */}

                {!loading &&
                    !error &&
                    filteredJobs.length > 0 && (

                        <div className="home-jobs-grid">

                            {filteredJobs
                                .slice(0, 6)
                                .map((job) => (

                                    <div
                                        className="home-job-card"
                                        key={job.jobID}
                                    >

                                        <div className="home-job-card-top">

                                            <div>

                                                <h3>
                                                    {job.title}
                                                </h3>

                                                <p className="home-company">
                                                    {job.companyName}
                                                </p>

                                            </div>

                                            <span className="home-job-type">
                                                {job.employmentType}
                                            </span>

                                        </div>


                                        <div className="home-job-details">

                                            <span>
                                                📍 {job.cityName}
                                            </span>

                                            <span>
                                                💰 R{job.salary}
                                            </span>

                                        </div>


                                        <p className="home-job-description">

                                            {job.description?.length > 120
                                                ? `${job.description.substring(
                                                    0,
                                                    120
                                                )}...`
                                                : job.description}

                                        </p>


                                        <Link
                                            to={`/jobs/${job.jobID}`}
                                            className="home-view-job"
                                        >
                                            View Job
                                        </Link>

                                    </div>

                                ))}

                        </div>

                    )}


                {/* No results */}

                {!loading &&
                    !error &&
                    filteredJobs.length === 0 && (

                        <div className="home-message">

                            <h3>
                                No jobs found
                            </h3>

                            <p>
                                Try searching for another
                                job, company or location.
                            </p>

                        </div>

                    )}

            </section>


            {/* =================================
                JOB SEEKER FEATURES
            ================================== */}

            <section className="home-features">

                <h2>
                    Everything You Need to Find a Job
                </h2>


                <div className="home-features-grid">


                    <div className="home-feature-card">

                        <div className="feature-icon">
                            🔎
                        </div>

                        <h3>
                            Find Jobs
                        </h3>

                        <p>
                            Search and browse opportunities
                            that match your skills and goals.
                        </p>

                    </div>


                    <div className="home-feature-card">

                        <div className="feature-icon">
                            💾
                        </div>

                        <h3>
                            Save Jobs
                        </h3>

                        <p>
                            Save interesting opportunities
                            and come back to them later.
                        </p>

                    </div>


                    <div className="home-feature-card">

                        <div className="feature-icon">
                            📄
                        </div>

                        <h3>
                            Apply Online
                        </h3>

                        <p>
                            Submit your applications and
                            track their progress.
                        </p>

                    </div>


                    <div className="home-feature-card">

                        <div className="feature-icon">
                            📊
                        </div>

                        <h3>
                            Track Applications
                        </h3>

                        <p>
                            Keep track of the jobs you've
                            applied for from one place.
                        </p>

                    </div>

                </div>

            </section>

        </div>
    );
}


export default Home;