import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    getToken,
    getUserID
} from "../../../services/auth";

import "./JobPost.css";


const API_BASE_URL = "https://localhost:7081/api";


function JobPost() {

    const navigate = useNavigate();

    // =========================================
    // FORM DATA
    // =========================================

    const [formData, setFormData] = useState({
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


    // =========================================
    // LOCATION DATA
    // =========================================

    const [countries, setCountries] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);

    const [countryID, setCountryID] = useState("");
    const [provinceID, setProvinceID] = useState("");
    const [cityID, setCityID] = useState("");


    // =========================================
    // COMPANY
    // =========================================

    const [company, setCompany] = useState(null);

    const [checkingCompany, setCheckingCompany] =
        useState(true);


    // =========================================
    // PAGE STATE
    // =========================================

    const [loadingLocations, setLoadingLocations] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =========================================
    // CHECK COMPANY PROFILE
    // =========================================

    const checkCompany = async () => {

        try {

            const token = getToken();

            const userID = getUserID();

            if (!token || !userID) {

                setError(
                    "You are not logged in. Please log in again."
                );

                return;
            }


            const response = await fetch(
                `${API_BASE_URL}/Companies`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Could not check company profile."
                );

            }


            const companies =
                await response.json();


            // Find the company belonging
            // to the logged-in recruiter.

            const userCompany =
                companies.find(
                    company =>
                        String(company.userID) ===
                        String(userID)
                );


            if (!userCompany) {

                setCompany(null);

                setError(
                    "Please create your company profile before posting a job."
                );

                return;
            }


            // Company exists

            setCompany(userCompany);

            setError("");

        }

        catch (error) {

            console.error(
                "Company check error:",
                error
            );

            setError(
                "Could not check your company profile."
            );

        }

        finally {

            setCheckingCompany(false);

        }

    };


    // =========================================
    // LOAD COUNTRIES
    // =========================================

    const loadCountries = async () => {

        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/Countries`
                );

            if (!response.ok) {
                throw new Error(
                    "Could not load countries."
                );
            }

            const data =
                await response.json();

            setCountries(data);

        }
        catch (error) {

            console.error(error);

            setError(
                "Could not load countries."
            );

        }

    };


    // =========================================
    // LOAD PROVINCES
    // =========================================

    const loadProvinces = async () => {

        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/Provincies`
                );

            if (!response.ok) {
                throw new Error(
                    "Could not load provinces."
                );
            }

            const data =
                await response.json();

            setProvinces(data);

        }
        catch (error) {

            console.error(error);

            setError(
                "Could not load provinces."
            );

        }

    };


    // =========================================
    // LOAD CITIES
    // =========================================

    const loadCities = async () => {

        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/Cities`
                );

            if (!response.ok) {
                throw new Error(
                    "Could not load cities."
                );
            }

            const data =
                await response.json();

            setCities(data);

        }
        catch (error) {

            console.error(error);

            setError(
                "Could not load cities."
            );

        }

    };


    // =========================================
    // PAGE LOAD
    // =========================================

    useEffect(() => {

        const loadPage = async () => {

            setLoadingLocations(true);
            setCheckingCompany(true);

            await Promise.all([
                loadCountries(),
                loadProvinces(),
                loadCities(),
                checkCompany()
            ]);

            setLoadingLocations(false);

        };


        loadPage();

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

    };


    // =========================================
    // COUNTRY CHANGE
    // =========================================

    const handleCountryChange = (event) => {

        const value =
            event.target.value;

        setCountryID(value);

        setProvinceID("");
        setCityID("");

        setFormData(previous => ({
            ...previous,
            cityID: ""
        }));

    };


    // =========================================
    // PROVINCE CHANGE
    // =========================================

    const handleProvinceChange = (event) => {

        const value =
            event.target.value;

        setProvinceID(value);

        setCityID("");

        setFormData(previous => ({
            ...previous,
            cityID: ""
        }));

    };


    // =========================================
    // CITY CHANGE
    // =========================================

    const handleCityChange = (event) => {

        const value =
            event.target.value;

        setCityID(value);

        setFormData(previous => ({
            ...previous,
            cityID: value
        }));

    };


    // =========================================
    // FILTER LOCATIONS
    // =========================================

    const filteredProvinces =
        provinces.filter(
            province =>
                Number(province.countryID) ===
                Number(countryID)
        );


    const filteredCities =
        cities.filter(
            city =>
                Number(city.provinceID) ===
                Number(provinceID)
        );


    // =========================================
    // SUBMIT JOB
    // =========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        const token = getToken();


        if (!token) {

            setError(
                "You are not logged in. Please log in again."
            );

            return;

        }


        // =====================================
        // CHECK COMPANY
        // =====================================

        if (!company) {

            setError(
                "Please create your company profile before posting a job."
            );

            return;

        }


        // =====================================
        // VALIDATE LOCATION
        // =====================================

        if (!countryID) {

            setError(
                "Please select a country."
            );

            return;

        }


        if (!provinceID) {

            setError(
                "Please select a province."
            );

            return;

        }


        if (!cityID) {

            setError(
                "Please select a city."
            );

            return;

        }


        if (!formData.closingDate) {

            setError(
                "Please select a closing date."
            );

            return;

        }


        const selectedClosingDate =
            new Date(formData.closingDate);


        if (
            selectedClosingDate <=
            new Date()
        ) {

            setError(
                "Closing date must be in the future."
            );

            return;

        }


        try {

            setSubmitting(true);


            // =====================================
            // JOB DTO
            // =====================================

            const jobData = {

                CompanyID:
                    company.companyID,

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
                    Number(
                        formData.availableVacancies
                    ),

                CityID:
                    Number(cityID),

                ClosingDate:
                    formData.closingDate

            };


            console.log(
                "Creating job:",
                jobData
            );


            // =====================================
            // SEND TO BACKEND
            // =====================================

            const response =
                await fetch(
                    `${API_BASE_URL}/Jobs`,
                    {
                        method: "POST",

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

                console.error(
                    "Create job error:",
                    responseText
                );

                throw new Error(
                    responseText ||
                    "Could not create job."
                );

            }


            // =====================================
            // SUCCESS
            // =====================================

            setSuccess(
                "Job posted successfully!"
            );


            // Clear form

            setFormData({
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

            setCountryID("");
            setProvinceID("");
            setCityID("");

        }

        catch (error) {

            console.error(
                "Post job error:",
                error
            );

            setError(
                error.message ||
                "Could not post job."
            );

        }

        finally {

            setSubmitting(false);

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (
        loadingLocations ||
        checkingCompany
    ) {

        return (

            <div className="job-loading">

                <p>
                    Checking your company profile...
                </p>

            </div>

        );

    }


    // =========================================
    // NO COMPANY
    // =========================================

    if (!company) {

        return (

            <div className="job-post-page">

                <div className="job-post-container">

                    <div className="job-error-message">

                        {error ||
                            "Please create your company profile before posting a job."
                        }

                    </div>


                    <button
                        type="button"
                        className="job-submit-button"
                        onClick={() =>
                            navigate(
                                "/recruiter/profile"
                            )
                        }
                    >
                        Create Company Profile
                    </button>

                </div>

            </div>

        );

    }


    // =========================================
    // PAGE
    // =========================================

    return (

        <div className="job-post-page">

            <div className="job-post-container">

                <Link
                    to="/recruiter-dashboard"
                    className="job-back-button"
                >
                    Back to Dashboard
                </Link>


                <div className="job-post-header">

                    <h1>
                        Post a New Job
                    </h1>

                    <p>
                        Create a new job vacancy for
                        qualified candidates on HirePoint.
                    </p>

                </div>


                {success && (

                    <div className="job-success-message">

                        {success}

                    </div>

                )}


                {error && (

                    <div className="job-error-message">

                        {error}

                    </div>

                )}


                <form
                    className="job-post-form"
                    onSubmit={handleSubmit}
                >

                    {/* JOB INFORMATION */}

                    <section className="job-form-section">

                        <h2>
                            Job Information
                        </h2>


                        <div className="job-form-grid">

                            <div className="job-form-group">

                                <label>
                                    Job Title
                                    <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Software Developer"
                                    required
                                />

                            </div>


                            <div className="job-form-group">

                                <label>
                                    Employment Type
                                    <span className="required">*</span>
                                </label>

                                <select
                                    name="employmentType"
                                    value={formData.employmentType}
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


                            <div className="job-form-group full-width">

                                <label>
                                    Job Description
                                    <span className="required">*</span>
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the responsibilities and expectations..."
                                    required
                                />

                            </div>


                            <div className="job-form-group full-width">

                                <label>
                                    Qualification Required
                                    <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="qualificationRequired"
                                    value={
                                        formData.qualificationRequired
                                    }
                                    onChange={handleChange}
                                    placeholder="e.g. Diploma or Degree in IT"
                                    required
                                />

                            </div>

                        </div>

                    </section>


                    {/* REQUIREMENTS */}

                    <section className="job-form-section">

                        <h2>
                            Job Requirements
                        </h2>


                        <div className="job-form-grid">

                            <div className="job-form-group">

                                <label>
                                    Salary
                                    <span className="required">*</span>
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


                            <div className="job-form-group">

                                <label>
                                    Experience Required
                                    <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="experienceRequired"
                                    value={
                                        formData.experienceRequired
                                    }
                                    onChange={handleChange}
                                    placeholder="e.g. 2 years"
                                    required
                                />

                            </div>


                            <div className="job-form-group">

                                <label>
                                    Available Vacancies
                                    <span className="required">*</span>
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


                            <div className="job-form-group">

                                <label>
                                    Closing Date
                                    <span className="required">*</span>
                                </label>

                                <input
                                    type="date"
                                    name="closingDate"
                                    value={formData.closingDate}
                                    onChange={handleChange}
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    required
                                />

                            </div>

                        </div>

                    </section>


                    {/* LOCATION */}

                    <section className="job-location-section">

                        <h2>
                            Job Location
                        </h2>


                        <div className="job-location-grid">

                            <div className="job-location-group">

                                <label>
                                    Country
                                    <span className="required">*</span>
                                </label>

                                <select
                                    value={countryID}
                                    onChange={
                                        handleCountryChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Country
                                    </option>

                                    {countries.map(country => (

                                        <option
                                            key={country.countryID}
                                            value={country.countryID}
                                        >
                                            {country.countryName}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            <div className="job-location-group">

                                <label>
                                    Province
                                    <span className="required">*</span>
                                </label>

                                <select
                                    value={provinceID}
                                    onChange={
                                        handleProvinceChange
                                    }
                                    disabled={!countryID}
                                    required
                                >

                                    <option value="">
                                        Select Province
                                    </option>

                                    {filteredProvinces.map(province => (

                                        <option
                                            key={province.provinceID}
                                            value={province.provinceID}
                                        >
                                            {province.provinceName}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            <div className="job-location-group">

                                <label>
                                    City
                                    <span className="required">*</span>
                                </label>

                                <select
                                    value={cityID}
                                    onChange={
                                        handleCityChange
                                    }
                                    disabled={!provinceID}
                                    required
                                >

                                    <option value="">
                                        Select City
                                    </option>

                                    {filteredCities.map(city => (

                                        <option
                                            key={city.cityID}
                                            value={city.cityID}
                                        >
                                            {city.cityName}
                                        </option>

                                    ))}

                                </select>

                            </div>

                        </div>

                    </section>


                    {/* ACTIONS */}

                    <div className="job-form-actions">

                        <button
                            type="button"
                            className="job-cancel-button"
                            onClick={() =>
                                navigate(
                                    "/recruiter-dashboard"
                                )
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="job-submit-button"
                            disabled={submitting}
                        >

                            {submitting
                                ? "Posting Job..."
                                : "Post Job"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default JobPost;