import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {getToken, getUserID} from "../../../services/auth";

import "./Apply.css";


function ApplyJob() {

    /*
     * Get the JobID from the URL.
     *
     * Example:
     * /jobs/123/apply
     *
     * id = 123
     */
    const { id } = useParams();

    const navigate = useNavigate();


    // Cover letter entered by the applicant.
    const [coverLetter, setCoverLetter] = useState("");


    // CV file selected by the applicant.
    const [cvFile, setCvFile] = useState(null);


    // Controls the submit button.
    const [loading, setLoading] = useState(false);


    // Displays success/error messages.
    const [message, setMessage] = useState("");


    /*
     * Runs when the applicant selects a CV.
     */
    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (!file) {
            setCvFile(null);
            return;
        }

        setCvFile(file);
    };


    /*
     * Submit the application.
     */
    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");


        /*
         * Get the JWT.
         */
        const token = getToken();


        /*
         * Get the currently logged-in user's ID.
         */
        const userID = getUserID();


        /*
         * The applicant must be logged in.
         */
        if (!token || !userID) {

            setMessage(
                "Please log in before applying."
            );

            return;
        }


        /*
         * A CV is required by the backend.
         */
        if (!cvFile) {

            setMessage(
                "Please upload your CV."
            );

            return;
        }


        /*
         * Check the CV file type before
         * sending it to the API.
         */
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];


        if (!allowedTypes.includes(cvFile.type)) {

            setMessage(
                "Only PDF, DOC and DOCX files are allowed."
            );

            return;
        }


        /*
         * The backend has a 5 MB file limit.
         */
        if (cvFile.size > 5 * 1024 * 1024) {

            setMessage(
                "CV file size cannot exceed 5 MB."
            );

            return;
        }


        setLoading(true);


        try {

            /*
             * IMPORTANT:
             *
             * ApplicationsController uses [FromForm].
             *
             * Therefore we MUST use FormData.
             */
            const formData = new FormData();


            /*
             * Add the logged-in user's ID.
             */
            formData.append(
                "UserID",
                userID
            );


            /*
             * Add the selected JobID.
             */
            formData.append(
                "JobID",
                id
            );


            /*
             * Add the CV file.
             *
             * This matches:
             *
             * CreateApplicationDto.CVFile
             */
            formData.append(
                "CVFile",
                cvFile
            );


            /*
             * Send the application to ASP.NET.
             */
            const response = await fetch(
                "https://localhost:7081/api/Applications",
                {
                    method: "POST",

                    headers: {
                        /*
                         * Do NOT add Content-Type here.
                         *
                         * The browser automatically creates
                         * the multipart/form-data boundary.
                         */
                        Authorization: `Bearer ${token}`
                    },

                    body: formData
                }
            );


            /*
             * Read the response.
             */
            const contentType =
                response.headers.get("content-type");


            let data;


            if (
                contentType &&
                contentType.includes("application/json")
            ) {

                data = await response.json();

            } else {

                data = await response.text();
            }


            /*
             * Handle API errors.
             */
            if (!response.ok) {

                const errorMessage =
                    typeof data === "string"
                        ? data
                        : data.message ||
                          "Could not submit application.";

                throw new Error(errorMessage);
            }


            /*
             * Application was successfully created.
             */
            setMessage(
                "Application submitted successfully!"
            );


            /*
             * Wait briefly so the user can see
             * the success message.
             */
            setTimeout(() => {

                navigate(`/jobs/${id}`);

            }, 1500);


        } catch (error) {

            console.error(
                "Application error:",
                error
            );

            setMessage(
                error.message ||
                "Could not submit application."
            );


        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="apply-page">

            <div className="apply-card">

                <h1>
                    Apply for Job
                </h1>


                <p className="apply-subtitle">
                    Complete your application below.
                </p>


                <form onSubmit={handleSubmit}>


                    {/* =========================
                        COVER LETTER
                    ========================== */}

                    <div className="form-group">

                        <label htmlFor="coverLetter">
                            Cover Letter
                        </label>


                        <textarea
                            id="coverLetter"
                            value={coverLetter}
                            onChange={(e) =>
                                setCoverLetter(
                                    e.target.value
                                )
                            }
                            placeholder="Write your cover letter..."
                            rows="10"
                        />

                    </div>


                    {/* =========================
                        CV UPLOAD
                    ========================== */}

                    <div className="form-group">

                        <label htmlFor="cvFile">
                            Upload CV
                        </label>


                        <input
                            id="cvFile"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                        />


                        <small>
                            Accepted formats: PDF, DOC, DOCX.
                            Maximum size: 5 MB.
                        </small>


                        {cvFile && (

                            <p className="selected-file">
                                Selected: {cvFile.name}
                            </p>

                        )}

                    </div>


                    {/* =========================
                        MESSAGE
                    ========================== */}

                    {message && (

                        <p className="apply-message">
                            {message}
                        </p>

                    )}


                    {/* =========================
                        BUTTONS
                    ========================== */}

                    <div className="apply-actions">


                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate(`/jobs/${id}`)
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="submit-application-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Submitting..."
                                : "Submit Application"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default ApplyJob;