import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getToken } from "../../../services/auth";

import "./RecruiterProfile.css";

const API_URL = "https://localhost:7081/api/Companies";
const CITIES_API_URL = "https://localhost:7081/api/Cities";

function RecruiterProfile() {

    const navigate = useNavigate();

    // =========================================
    // FORM DATA
    // =========================================

    const [formData, setFormData] = useState({
        companyName: "",
        description: "",
        email: "",
        cityID: "",
        phoneNumber: "",
        website: "",
        logoPath: ""
    });

    // =========================================
    // CITIES
    // =========================================

    const [cities, setCities] = useState([]);

    const [loadingCities, setLoadingCities] = useState(true);

    // =========================================
    // FORM STATE
    // =========================================

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // =========================================
    // GET LOGGED-IN USER
    // =========================================

    const getLoggedInUser = () => {

        const possibleKeys = [
            "user",
            "currentUser",
            "loggedInUser"
        ];

        for (const key of possibleKeys) {

            const storedUser =
                localStorage.getItem(key);

            if (!storedUser) {
                continue;
            }

            try {

                const user =
                    JSON.parse(storedUser);

                if (user) {
                    return user;
                }

            } catch (error) {

                console.error(
                    `Could not read ${key}:`,
                    error
                );

            }
        }

        return null;
    };

    // =========================================
    // GET USER ID
    // =========================================

    const getUserID = () => {

        const user = getLoggedInUser();

        if (user) {

            return (
                user.userID ||
                user.UserID ||
                user.id ||
                user.Id
            );

        }

        return (
            localStorage.getItem("userID") ||
            localStorage.getItem("UserID")
        );
    };

    // =========================================
    // LOAD CITIES
    // =========================================

    const loadCities = async () => {

        try {

            setLoadingCities(true);
            setError("");

            const token = getToken();

            const response = await fetch(
                CITIES_API_URL,
                {
                    method: "GET",

                    headers: token
                        ? {
                            Authorization:
                                `Bearer ${token}`
                        }
                        : {}
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Could not load the available cities."
                );

            }

            const data = await response.json();

            setCities(data);

        } catch (error) {

            console.error(
                "Load cities error:",
                error
            );

            setError(
                error.message ||
                "Could not load the available cities."
            );

        } finally {

            setLoadingCities(false);

        }
    };

    // =========================================
    // PAGE LOAD
    // =========================================

    useEffect(() => {

        const token = getToken();

        if (!token) {

            navigate("/login");

            return;

        }

        loadCities();

    }, [navigate]);

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
    // CREATE COMPANY
    // =========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        const token = getToken();

        // =====================================
        // CHECK TOKEN
        // =====================================

        if (!token) {

            setError(
                "Your session has expired. Please log in again."
            );

            return;

        }

        // =====================================
        // GET USER ID
        // =====================================

        const userID = getUserID();

        if (!userID) {

            console.error(
                "No UserID found in localStorage."
            );

            setError(
                "Your user information could not be found. Please log in again."
            );

            return;

        }

        // =====================================
        // VALIDATION
        // =====================================

        if (!formData.companyName.trim()) {

            setError(
                "Please enter your company name."
            );

            return;

        }

        if (!formData.description.trim()) {

            setError(
                "Please enter a company description."
            );

            return;

        }

        if (!formData.email.trim()) {

            setError(
                "Please enter the company email."
            );

            return;

        }

        if (!formData.cityID) {

            setError(
                "Please select a city."
            );

            return;

        }

        if (!formData.phoneNumber.trim()) {

            setError(
                "Please enter the company phone number."
            );

            return;

        }

        try {

            setSaving(true);

            // =====================================
            // CREATE COMPANY DTO
            // =====================================

            const companyData = {

                userID: userID,

                companyName:
                    formData.companyName.trim(),

                description:
                    formData.description.trim(),

                email:
                    formData.email.trim(),

                cityID:
                    Number(formData.cityID),

                phoneNumber:
                    formData.phoneNumber.trim(),

                website:
                    formData.website.trim() || null,

                logoPath:
                    formData.logoPath.trim() || null

            };

            console.log(
                "Company data being sent:",
                companyData
            );

            // =====================================
            // API REQUEST
            // =====================================

            const response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(companyData)

                }
            );

            const responseText =
                await response.text();

            // =====================================
            // API ERROR
            // =====================================

            if (!response.ok) {

                console.error(
                    "Create company response:",
                    responseText
                );

                let message =
                    "Could not create company profile.";

                try {

                    const errorData =
                        JSON.parse(responseText);

                    if (typeof errorData === "string") {

                        message = errorData;

                    } else if (errorData.message) {

                        message =
                            errorData.message;

                    } else if (errorData.title) {

                        message =
                            errorData.title;

                    }

                } catch {

                    if (responseText) {

                        message =
                            responseText;

                    }

                }

                throw new Error(message);

            }

            // =====================================
            // SUCCESS
            // =====================================

            setSuccess(
                "Company profile created successfully!"
            );

            // =====================================
            // GO TO DASHBOARD
            // =====================================

            setTimeout(() => {

                navigate(
                    "/recruiter-dashboard"
                );

            }, 1000);

        } catch (error) {

            console.error(
                "Create company error:",
                error
            );

            setError(
                error.message ||
                "Could not create company profile."
            );

        } finally {

            setSaving(false);

        }

    };

    // =========================================
    // PAGE
    // =========================================

    return (

        <div className="recruiter-profile-page">

            <main className="recruiter-profile-container">

                {/* =====================================
                    HEADER
                ====================================== */}

                <section className="recruiter-profile-header">

                    <p className="recruiter-profile-label">
                        RECRUITER PROFILE
                    </p>

                    <h1>
                        Create Your Company Profile
                    </h1>

                    <p>
                        Before you can create and manage
                        job postings, you need to set up
                        your company profile.
                    </p>

                </section>


                {/* =====================================
                    FORM
                ====================================== */}

                <section className="recruiter-profile-card">

                    <form
                        className="recruiter-profile-form"
                        onSubmit={handleSubmit}
                    >

                        {/* =================================
                            COMPANY INFORMATION
                        ================================== */}

                        <div className="form-section">

                            <h2>
                                Company Information
                            </h2>

                            <p>
                                This information will be
                                displayed to job seekers
                                when they view your postings.
                            </p>

                        </div>


                        {/* COMPANY NAME */}

                        <div className="form-group">

                            <label htmlFor="companyName">
                                Company Name
                            </label>

                            <input
                                id="companyName"
                                type="text"
                                name="companyName"
                                value={
                                    formData.companyName
                                }
                                onChange={handleChange}
                                placeholder="Enter company name"
                                required
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="form-group">

                            <label htmlFor="description">
                                Company Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={handleChange}
                                placeholder="Tell job seekers about your company"
                                rows="5"
                                required
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Company Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={
                                    formData.email
                                }
                                onChange={handleChange}
                                placeholder="company@example.com"
                                required
                            />

                        </div>


                        {/* =================================
                            LOCATION
                        ================================== */}

                        <div className="form-section">

                            <h2>
                                Company Location
                            </h2>

                            <p>
                                Tell job seekers where your
                                company is located.
                            </p>

                        </div>


                        {/* CITY */}

                        <div className="form-group">

                            <label htmlFor="cityID">
                                City
                            </label>

                            <select
                                id="cityID"
                                name="cityID"
                                value={
                                    formData.cityID
                                }
                                onChange={handleChange}
                                required
                                disabled={loadingCities}
                            >

                                <option value="">

                                    {loadingCities
                                        ? "Loading cities..."
                                        : "Select your city"}

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


                        {/* PHONE */}

                        <div className="form-group">

                            <label htmlFor="phoneNumber">
                                Company Phone Number
                            </label>

                            <input
                                id="phoneNumber"
                                type="tel"
                                name="phoneNumber"
                                value={
                                    formData.phoneNumber
                                }
                                onChange={handleChange}
                                placeholder="Enter company phone number"
                                required
                            />

                        </div>


                        {/* =================================
                            ADDITIONAL INFORMATION
                        ================================== */}

                        <div className="form-section">

                            <h2>
                                Additional Information
                            </h2>

                            <p>
                                These fields are optional.
                            </p>

                        </div>


                        {/* WEBSITE */}

                        <div className="form-group">

                            <label htmlFor="website">
                                Company Website
                            </label>

                            <input
                                id="website"
                                type="url"
                                name="website"
                                value={
                                    formData.website
                                }
                                onChange={handleChange}
                                placeholder="https://www.example.com"
                            />

                        </div>


                        {/* LOGO */}

                        <div className="form-group">

                            <label htmlFor="logoPath">
                                Company Logo Path
                            </label>

                            <input
                                id="logoPath"
                                type="text"
                                name="logoPath"
                                value={
                                    formData.logoPath
                                }
                                onChange={handleChange}
                                placeholder="Enter logo path"
                            />

                            <small>
                                Logo upload can be added
                                later. This field is
                                optional.
                            </small>

                        </div>


                        {/* =================================
                            ERROR
                        ================================== */}

                        {error && (

                            <div className="recruiter-profile-error">
                                {error}
                            </div>

                        )}


                        {/* =================================
                            SUCCESS
                        ================================== */}

                        {success && (

                            <div className="recruiter-profile-success">
                                {success}
                            </div>

                        )}


                        {/* =================================
                            SUBMIT
                        ================================== */}

                        <div className="recruiter-profile-actions">

                            <button
                                type="submit"
                                className="recruiter-profile-submit"
                                disabled={
                                    saving ||
                                    loadingCities
                                }
                            >

                                {saving
                                    ? "Creating Profile..."
                                    : "Create Company Profile"}

                            </button>

                        </div>

                    </form>

                </section>

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
                    onClick={() =>
                        navigate(
                            "/recruiter/jobs"
                        )
                    }
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
                    className="active"
                >
                    Profile
                </button>

            </nav>

        </div>

    );

}

export default RecruiterProfile;