import { useEffect, useState } from "react";
import { useParams, Link, useNavigate} from "react-router-dom";

import { getToken } from "../../../services/auth";

import "./JobDetails.css";


function JobDetails() {

    /*
     * Get the job ID from the URL.
     *
     * Example:
     * /jobs/5
     *
     * id will contain "5".
     */
    const { id } = useParams();


    // Stores the job returned by the ASP.NET API.
    const [job, setJob] = useState(null);


    // Controls the loading message.
    const [loading, setLoading] = useState(true);


    // Stores an error if the job cannot be loaded.
    const [error, setError] = useState("");


    // Controls the Save Job button while a request is running.
    const [saving, setSaving] = useState(false);


    // Message displayed after attempting to save a job.
    const [saveMessage, setSaveMessage] = useState("");

    const navigate = useNavigate();
    /*
     * Load the selected job from the API.
     */
    useEffect(() => {

        fetch(
            `https://localhost:7081/api/Jobs/GetJobById/${id}`
        )

            .then((response) => {

                // Check whether the API request was successful.
                if (!response.ok) {
                    throw new Error("Job not found");
                }

                // Convert the API response into JSON.
                return response.json();
            })

            .then((data) => {

                // Store the job in React state.
                setJob(data);

                // Stop showing the loading message.
                setLoading(false);
            })

            .catch((error) => {

                console.error(error);

                // Display an error message to the user.
                setError("Could not load this job.");

                setLoading(false);
            });

    }, [id]);


    /*
     * Save Job
     *
     * This function sends a request to the
     * ASP.NET JobsController.
     */
    const handleSaveJob = async () => {

        /*
         * Get the JWT stored when the user logged in.
         */
        const token = getToken();


        /*
         * A user must be logged in before
         * they can save a job.
         */
        if (!token) {

            setSaveMessage(
                "Please log in to save jobs."
            );

            return;
        }


        // Disable the button while saving.
        setSaving(true);

        // Remove any previous message.
        setSaveMessage("");


        try {

            /*
             * Send the job ID to the ASP.NET API.
             *
             * The JWT is also sent so that ASP.NET
             * can identify the logged-in user.
             */
            const response = await fetch(
                `https://localhost:7081/api/Jobs/SaveJob/${id}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        /*
                         * JWT authentication.
                         *
                         * ASP.NET expects:
                         *
                         * Authorization: Bearer TOKEN
                         */
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            /*
             * The API returns a text response,
             * so we read it using response.text().
             */
            const data = await response.text();


            /*
             * If ASP.NET returns an error,
             * display that error.
             */
            if (!response.ok) {

                throw new Error(
                    data || "Could not save the job."
                );
            }


            /*
             * The job was successfully saved.
             */
            setSaveMessage(
                "Job saved successfully!"
            );

        } catch (error) {

            console.error(
                "Save job error:",
                error
            );

            setSaveMessage(
                error.message
            );

        } finally {

            /*
             * Allow the button to be clicked again.
             */
            setSaving(false);
        }
    };


    /*
     * Display this while the job is loading.
     */
    if (loading) {

        return (
            <div className="job-details-message">
                Loading job...
            </div>
        );
    }


    /*
     * Display this if the job could not be loaded.
     */
    if (error) {

        return (
            <div className="job-details-message error">
                {error}
            </div>
        );
    }


    /*
     * Display the job information.
     */
    return (

        <div className="job-details-page">


            {/* Back to Jobs */}

            <Link
                to="/jobs"
                className="back-link"
            >
                ← Back to Jobs
            </Link>


            <div className="job-details-card">


                {/* =================================
                    JOB HEADER
                ================================== */}

                <div className="job-details-header">

                    <div>

                        <h1>
                            {job.title}
                        </h1>

                        <h3>
                            {job.companyName}
                        </h3>

                    </div>


                    <span className="employment-badge">
                        {job.employmentType}
                    </span>

                </div>


                {/* =================================
                    JOB INFORMATION
                ================================== */}

                <div className="job-details-info">


                    {/* Location */}

                    <div>

                        <strong>
                            📍 Location
                        </strong>

                        <p>
                            {job.cityName ||
                                "Location not specified"}
                        </p>

                    </div>


                    {/* Salary */}

                    <div>

                        <strong>
                            💰 Salary
                        </strong>

                        <p>
                            R{job.salary}
                        </p>

                    </div>


                    {/* Vacancies */}

                    <div>

                        <strong>
                            👥 Vacancies
                        </strong>

                        <p>
                            {job.availableVacancies}
                        </p>

                    </div>


                    {/* Experience */}

                    <div>

                        <strong>
                            💼 Experience
                        </strong>

                        <p>
                            {job.experienceRequired}
                        </p>

                    </div>

                </div>


                <hr />


                {/* =================================
                    JOB DESCRIPTION
                ================================== */}

                <section className="job-section">

                    <h2>
                        Job Description
                    </h2>

                    <p>
                        {job.description}
                    </p>

                </section>


                {/* =================================
                    QUALIFICATION
                ================================== */}

                <section className="job-section">

                    <h2>
                        Qualification Required
                    </h2>


                    {job.qualificationRequired ? (

                        <p>
                            {job.qualificationRequired}
                        </p>

                    ) : (

                        <p>
                            No specific qualification listed.
                        </p>

                    )}

                </section>


                {/* =================================
                    APPLICATION DEADLINE
                ================================== */}

                <section className="job-section">

                    <h2>
                        Application Deadline
                    </h2>

                    <p>

                        {new Date(
                            job.closingDate
                        ).toLocaleDateString()}

                    </p>

                </section>


                {/* =================================
                    ACTION BUTTONS
                ================================== */}

                <div className="job-actions">


                    {/* Apply button */}

                  <button
                     className="apply-button"
                     onClick={() => navigate(`/jobs/${id}/apply`)}
                >
                     Apply Now
                    </button>


                    {/* Save Job button */}

                    <button
                        className="save-button"
                        onClick={handleSaveJob}
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : "Save Job"}

                    </button>

                </div>


                {/* =================================
                    SAVE MESSAGE
                ================================== */}

                {saveMessage && (

                    <p className="save-message">
                        {saveMessage}
                    </p>

                )}

            </div>

        </div>
    );
}


export default JobDetails;