import { useEffect, useState } from "react";

import {
    getToken,
    getFirstName,
    getLastName,
    getEmail
} from "../../services/auth";

import { Link } from "react-router-dom";

import "./Profile.css";


function Profile() {

    const [profile, setProfile] = useState(null);

    const [hasProfile, setHasProfile] = useState(false);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const loadProfile = async () => {

            try {

                const token = getToken();

                if (!token) {

                    setError(
                        "Please log in to view your profile."
                    );

                    setLoading(false);

                    return;
                }


                const response = await fetch(
                    "https://localhost:7081/api/UserProfiles/MyProfile",
                    {
                        method: "GET",

                        headers: {
                            "Content-Type": "application/json",

                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                /*
                 * 404 means the user does not
                 * have a profile yet.
                 */
                if (response.status === 404) {

                    setProfile(null);

                    setHasProfile(false);

                    return;
                }


                if (response.status === 401) {

                    throw new Error(
                        "Your session has expired. Please log in again."
                    );
                }


                if (!response.ok) {

                    throw new Error(
                        "Could not load your profile."
                    );
                }


                const data = await response.json();

                setProfile(data);

                setHasProfile(true);

            } catch (error) {

                console.error(
                    "Profile error:",
                    error
                );

                setError(
                    error.message
                );

            } finally {

                setLoading(false);
            }
        };


        loadProfile();

    }, []);


    if (loading) {

        return (
            <div className="profile-message">

                Loading your profile...

            </div>
        );
    }


    if (error) {

        return (
            <div className="profile-message error">

                {error}

            </div>
        );
    }


    return (

        <div className="profile-page">

            <div className="profile-container">


                {/* =====================================
                    PROFILE HEADER
                ====================================== */}

                <div className="profile-header">

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Manage your personal information
                        and account details.
                    </p>

                </div>


                {/* =====================================
                    PERSONAL INFORMATION
                ====================================== */}

                <section className="profile-section">

                    <div className="profile-section-header">

                        <h2>
                            Personal Information
                        </h2>

                    </div>


                    <div className="profile-details">

                        <div className="profile-detail">

                            <span className="profile-label">
                                First Name
                            </span>

                            <span className="profile-value">
                                {getFirstName() ||
                                    "Not provided"}
                            </span>

                        </div>


                        <div className="profile-detail">

                            <span className="profile-label">
                                Last Name
                            </span>

                            <span className="profile-value">
                                {getLastName() ||
                                    "Not provided"}
                            </span>

                        </div>


                        <div className="profile-detail">

                            <span className="profile-label">
                                Email
                            </span>

                            <span className="profile-value">
                                {getEmail() ||
                                    "Not provided"}
                            </span>

                        </div>

                    </div>

                </section>


                {/* =====================================
                    PROFESSIONAL PROFILE
                ====================================== */}

                {hasProfile ? (

                    <section className="profile-section">

                        <div className="profile-section-header">

                            <h2>
                                Professional Profile
                            </h2>

                        </div>


                        <div className="profile-details">

                            <div className="profile-detail">

                                <span className="profile-label">
                                    Experience
                                </span>

                                <span className="profile-value">
                                    {profile?.experience ||
                                        "Not provided"}
                                </span>

                            </div>

                        </div>


                        {/* =================================
                            CV + ACTION BUTTONS
                        ================================== */}

                       <div className="profile-bottom-row">

    <div className="cv-information">

        <span className="profile-label">
            CV
        </span>

        <span className="profile-value">
            {profile?.cvPath
                ? "CV uploaded"
                : "No CV uploaded"}
        </span>

    </div>


    <div className="profile-actions">

        {profile?.cvPath && (
            <a
                href={`https://localhost:7081${profile.cvPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-cv-button"
            >
                View CV
            </a>
        )}

        <Link
            to="/profile/edit"
            className="profile-action-button"
        >
            Edit Profile
        </Link>

    </div>

</div>
                    </section>

                ) : (

                    /* =================================
                       NO PROFILE
                    ================================== */

                    <section className="profile-section">

                        <div className="profile-section-header">

                            <h2>
                                Professional Profile
                            </h2>

                        </div>


                        <p className="no-profile-text">

                            You have not created your
                            professional profile yet.

                        </p>


                        <p className="no-profile-description">

                            Create your profile to add your
                            experience and CV information.

                        </p>


                        <div className="profile-actions">

                            <Link
                                to="/profile/create"
                                className="profile-action-button"
                            >
                                Create Profile
                            </Link>

                        </div>

                    </section>

                )}


                {/* =====================================
                    ACCOUNT
                ====================================== */}

                <section className="profile-section account-section">

                    <div className="profile-section-header">

                        <h2>
                            Account
                        </h2>

                    </div>


                    <div className="profile-actions">

                        <button
                            type="button"
                            className="delete-account-button"
                        >
                            Delete Account
                        </button>

                    </div>

                </section>

            </div>


            {/* =====================================
                BOTTOM NAVIGATION
            ====================================== */}

            <nav className="bottom-navigation">

                <Link
                    to="/dashboard"
                    className="bottom-nav-item"
                >

                    <span className="bottom-nav-icon">
                        {/* ICON SPACE */}
                    </span>

                    <span>
                        Dashboard
                    </span>

                </Link>


                <Link
                    to="/my-applications"
                    className="bottom-nav-item"
                >

                    <span className="bottom-nav-icon">
                        {/* ICON SPACE */}
                    </span>

                    <span>
                        My Applications
                    </span>

                </Link>


                <Link
                    to="/saved-jobs"
                    className="bottom-nav-item"
                >

                    <span className="bottom-nav-icon">
                        {/* ICON SPACE */}
                    </span>

                    <span>
                        Saved Jobs
                    </span>

                </Link>


                <Link
                    to="/messages"
                    className="bottom-nav-item "
                >

                    <span className="bottom-nav-icon">
                        {/* ICON SPACE */}
                    </span>

                    <span>
                        Messages
                    </span>

                </Link>


                <Link
                    to="/settings"
                    className="bottom-nav-item"
                >

                    <span className="bottom-nav-icon">
                        {/* ICON SPACE */}
                    </span>

                    <span>
                        Settings
                    </span>

                </Link>


                <Link
                    to="/profile"
                    className="bottom-nav-item active"
                >

                    <span className="bottom-nav-icon">
                        {/* ICON SPACE */}
                    </span>

                    <span>
                        Profile
                    </span>

                </Link>

            </nav>

        </div>
    );
}


export default Profile;