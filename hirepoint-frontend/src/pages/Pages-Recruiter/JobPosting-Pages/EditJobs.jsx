import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getToken } from "../../../services/auth";

import "./EditJob.css";

const API_BASE_URL = "https://localhost:7081/api";

function EditJob() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        companyID: "",
        title: "",
        description: "",
        qualificationRequired: "",
        salary: "",
        experienceRequired: "",
        employmentType: "",
        availableVacancies: "",
        cityID: "",
        closingDate: ""
    });

    const [cities, setCities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =========================================
    // LOAD JOB
    // =========================================

    useEffect(() => {

        const loadJob = async () => {

            const token = getToken();

            if (!token) {
                setError("You are not logged in.");
                setLoading(false);
                return;
            }

            try {

                const response = await fetch(
                    `${API_BASE_URL}/Jobs/GetJobById/${id}`,
                    {
                        headers: {
                            Authorization:
                                "Bearer " + token
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Could not load job."
                    );
                }

                const job = await response.json();

                setFormData({
                    companyID: job.companyID,
                    title: job.title || "",
                    description: job.description || "",
                    qualificationRequired:
                        job.qualificationRequired || "",
                    salary: job.salary || "",
                    experienceRequired:
                        job.experienceRequired || "",
                    employmentType:
                        job.employmentType || "",
                    availableVacancies:
                        job.availableVacancies || "",
                    cityID: job.cityID || "",
                    closingDate: job.closingDate
                        ? job.closingDate.split("T")[0]
                        : ""
                });

            } catch (error) {

                console.error(
                    "Load job error:",
                    error
                );

                setError(
                    error.message ||
                    "Could not load job."
                );

            } finally {

                setLoading(false);

            }

        };

        loadJob();

    }, [id]);


    // =========================================
    // LOAD CITIES
    // =========================================

    useEffect(() => {

        const loadCities = async () => {

            try {

                const response = await fetch(
                    `${API_BASE_URL}/Cities`
                );

                if (!response.ok) {
                    throw new Error(
                        "Could not load cities."
                    );
                }

                const data = await response.json();

                setCities(data);

            } catch (error) {

                console.error(
                    "Cities error:",
                    error
                );

            }

        };

        loadCities();

    }, []);


    // =========================================
    // HANDLE INPUT
    // =========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");

    };


    // =========================================
    // UPDATE JOB
    // =========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        const token = getToken();

        if (!token) {

            setError(
                "You are not logged in."
            );

            return;

        }


        try {

            setSaving(true);

            const jobData = {

                CompanyID:
                    formData.companyID,

                Title:
                    formData.title.trim(),

                Description:
                    formData.description.trim(),

                QualificationRequired:
                    formData.qualificationRequired.trim(),

                Salary:
                    Number(formData.salary),

                ExperienceRequired:
                    formData.experienceRequired.trim(),

                EmploymentType:
                    formData.employmentType,

                AvailableVacancies:
                    Number(formData.availableVacancies),

                CityID:
                    Number(formData.cityID),

                ClosingDate:
                    formData.closingDate

            };


            const response = await fetch(
                `${API_BASE_URL}/Jobs/UpdateJob/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            "Bearer " + token
                    },

                    body:
                        JSON.stringify(jobData)
                }
            );


            const responseText =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Could not update job."
                );

            }


            setSuccess(
                "Job updated successfully."
            );


            setTimeout(() => {

                navigate(
                    "/recruiter/jobs"
                );

            }, 1000);


        } catch (error) {

            console.error(
                "Update job error:",
                error
            );

            setError(
                error.message ||
                "Could not update job."
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div className="edit-job-page">

                <div className="edit-job-container">

                    <p>
                        Loading job...
                    </p>

                </div>

            </div>
        );

    }


    // =========================================
    // PAGE
    // =========================================

    return (

        <div className="edit-job-page">

            <main className="edit-job-container">

                <button
                    type="button"
                    className="edit-job-back"
                    onClick={() =>
                        navigate(
                            "/recruiter/jobs"
                        )
                    }
                >
                    Back to My Jobs
                </button>


                <div className="edit-job-header">

                    <p>
                        RECRUITER
                    </p>

                    <h1>
                        Edit Job
                    </h1>

                    <span>
                        Update the information for this
                        job posting.
                    </span>

                </div>


                {error && (

                    <div className="edit-job-error">
                        {error}
                    </div>

                )}


                {success && (

                    <div className="edit-job-success">
                        {success}
                    </div>

                )}


                <form
                    className="edit-job-form"
                    onSubmit={handleSubmit}
                >

                    <div className="edit-form-group">

                        <label>
                            Job Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="edit-form-group">

                        <label>
                            Job Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="6"
                            required
                        />

                    </div>


                    <div className="edit-form-group">

                        <label>
                            Qualification Required
                        </label>

                        <input
                            type="text"
                            name="qualificationRequired"
                            value={
                                formData.qualificationRequired
                            }
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="edit-form-row">

                        <div className="edit-form-group">

                            <label>
                                Salary
                            </label>

                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                min="0"
                                required
                            />

                        </div>


                        <div className="edit-form-group">

                            <label>
                                Experience Required
                            </label>

                            <input
                                type="text"
                                name="experienceRequired"
                                value={
                                    formData.experienceRequired
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    <div className="edit-form-row">

                        <div className="edit-form-group">

                            <label>
                                Employment Type
                            </label>

                            <select
                                name="employmentType"
                                value={
                                    formData.employmentType
                                }
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select employment type
                                </option>

                                <option value="Full Time">
                                    Full Time
                                </option>

                                <option value="Part Time">
                                    Part Time
                                </option>

                                <option value="Contract">
                                    Contract
                                </option>

                                <option value="Temporary">
                                    Temporary
                                </option>

                                <option value="Internship">
                                    Internship
                                </option>

                            </select>

                        </div>


                        <div className="edit-form-group">

                            <label>
                                Available Vacancies
                            </label>

                            <input
                                type="number"
                                name="availableVacancies"
                                value={
                                    formData.availableVacancies
                                }
                                onChange={handleChange}
                                min="1"
                                required
                            />

                        </div>

                    </div>


                    <div className="edit-form-row">

                        <div className="edit-form-group">

                            <label>
                                City
                            </label>

                            <select
                                name="cityID"
                                value={formData.cityID}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select City
                                </option>

                                {cities.map(city => (

                                    <option
                                        key={city.cityID}
                                        value={city.cityID}
                                    >
                                        {city.cityName}
                                    </option>

                                ))}

                            </select>

                        </div>


                        <div className="edit-form-group">

                            <label>
                                Closing Date
                            </label>

                            <input
                                type="date"
                                name="closingDate"
                                value={
                                    formData.closingDate
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    <div className="edit-job-actions">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/recruiter/jobs"
                                )
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </main>


            {/* BOTTOM NAVIGATION */}

            <nav className="recruiter-bottom-navbar">

                <button
                    onClick={() =>
                        navigate(
                            "/recruiter-dashboard"
                        )
                    }
                >
                    Dashboard
                </button>

                <button
                    className="active"
                    onClick={() =>
                        navigate(
                            "/recruiter/jobs"
                        )
                    }
                >
                    My Jobs
                </button>

                <button
                    onClick={() =>
                        navigate(
                            "/recruiter/jobs/create"
                        )
                    }
                >
                    Post Job
                </button>

                <button
                    onClick={() =>
                        navigate(
                            "/recruiter/applications"
                        )
                    }
                >
                    Applications
                </button>

                <button
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

export default EditJob;