import { useEffect, useState, useRef } from "react";
import {
    getToken,
    getFirstName,
    getLastName,
    getEmail
} from "../../../services/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

const API_BASE_URL = "https://localhost:7081/api";

function Profile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState(null);
    const [cvData, setCvData] = useState(null);
    const [hasProfile, setHasProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Modal & Action states
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteCVModal, setShowDeleteCVModal] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    /* =========================================
       FETCH PROFILE & CV DATA
    ========================================= */
    const loadProfileAndCV = async () => {
        try {
            const token = getToken();

            if (!token) {
                setError("Please log in to view your profile.");
                setLoading(false);
                return;
            }

            // 1. Fetch User Profile
            const profileRes = await fetch(
                `${API_BASE_URL}/UserProfiles/MyProfile`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (profileRes.status === 401) {
                throw new Error("Your session has expired. Please log in again.");
            }

            if (profileRes.status === 404) {
                setProfile(null);
                setHasProfile(false);
            } else if (profileRes.ok) {
                const profileJson = await profileRes.json();
                setProfile(profileJson);
                setHasProfile(true);
            }

            // 2. Fetch CV List to get the user's CVID
            const cvRes = await fetch(`${API_BASE_URL}/CVs/GetCVs`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (cvRes.ok) {
                const cvList = await cvRes.json();
                if (cvList && cvList.length > 0) {
                    setCvData(cvList[0]);
                } else {
                    setCvData(null);
                }
            }
        } catch (err) {
            console.error("Profile load error:", err);
            setError(err.message || "Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfileAndCV();
    }, []);

    /* =========================================
       FILE VALIDATION
    ========================================= */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = [".pdf", ".doc", ".docx"];
        const extension = "." + file.name.split(".").pop().toLowerCase();

        if (!allowedTypes.includes(extension)) {
            setError("Only PDF, DOC and DOCX files are allowed.");
            setSelectedFile(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("CV file size cannot exceed 5 MB.");
            setSelectedFile(null);
            return;
        }

        setError("");
        setSelectedFile(file);
    };

    /* =========================================
       UPDATE CV ACTION
    ========================================= */
    const handleUpdateCV = async () => {
        if (!selectedFile) {
            setError("Please select a new CV file.");
            return;
        }

        const token = getToken();
        const cvId = cvData?.cvid || cvData?.cvId || cvData?.cVID || cvData?.CVID;

        if (!cvId) {
            setError("Could not find CV ID to update.");
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            const formData = new FormData();
            formData.append("CVFile", selectedFile);

            const response = await fetch(`${API_BASE_URL}/CVs/UpdateCV/${cvId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Could not update CV.");
            }

            setShowUpdateModal(false);
            setSelectedFile(null);
            setSuccess("Your CV has been updated successfully.");
            await loadProfileAndCV();
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not update CV.");
        } finally {
            setActionLoading(false);
        }
    };

    /* =========================================
       DELETE CV ACTION
    ========================================= */
    const handleDeleteCV = async () => {
        const token = getToken();
        const cvId = cvData?.cvid || cvData?.cvId || cvData?.cVID || cvData?.CVID;

        if (!cvId) {
            setError("Could not find CV ID to delete.");
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            const response = await fetch(`${API_BASE_URL}/CVs/DeleteCV/${cvId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Could not delete CV.");
            }

            setShowDeleteCVModal(false);
            setSuccess("Your CV has been deleted successfully.");
            await loadProfileAndCV();
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not delete CV.");
        } finally {
            setActionLoading(false);
        }
    };

    /* =========================================
       DELETE ACCOUNT ACTION
    ========================================= */
    const handleDeleteAccount = async () => {
        const token = getToken();

        try {
            setActionLoading(true);
            setError("");

            const response = await fetch(`${API_BASE_URL}/UserProfiles/DeleteAccount`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Could not delete account.");
            }

            localStorage.clear();
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not delete account.");
        } finally {
            setActionLoading(false);
            setShowDeleteAccountModal(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-message">
                Loading your profile...
            </div>
        );
    }

    if (error && !profile && !cvData) {
        return (
            <div className="profile-message error">
                {error}
            </div>
        );
    }

    const currentCVPath = cvData?.filePath || profile?.cvPath;

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* PROFILE HEADER */}
                <div className="profile-header">
                    <h1>My Profile</h1>
                    <p>Manage your personal information and account details.</p>
                </div>

                {/* NOTIFICATIONS */}
                {error && <div className="profile-message error" style={{ minHeight: "auto", margin: "10px 0" }}>{error}</div>}
                {success && <div className="profile-message" style={{ minHeight: "auto", margin: "10px 0", color: "#2e7d32" }}>{success}</div>}

                {/* PERSONAL INFORMATION */}
                <section className="profile-section">
                    <div className="profile-section-header">
                        <h2>Personal Information</h2>
                    </div>

                    <div className="profile-details">
                        <div className="profile-detail">
                            <span className="profile-label">First Name</span>
                            <span className="profile-value">
                                {getFirstName() || "Not provided"}
                            </span>
                        </div>

                        <div className="profile-detail">
                            <span className="profile-label">Last Name</span>
                            <span className="profile-value">
                                {getLastName() || "Not provided"}
                            </span>
                        </div>

                        <div className="profile-detail">
                            <span className="profile-label">Email</span>
                            <span className="profile-value">
                                {getEmail() || "Not provided"}
                            </span>
                        </div>
                    </div>
                </section>

                {/* PROFESSIONAL PROFILE */}
                {hasProfile ? (
                    <section className="profile-section">
                        <div className="profile-section-header">
                            <h2>Professional Profile</h2>
                        </div>

                        <div className="profile-details">
                            <div className="profile-detail">
                                <span className="profile-label">Experience</span>
                                <span className="profile-value">
                                    {profile?.experience || "Not provided"}
                                </span>
                            </div>
                        </div>

                        {/* CV + ACTION BUTTONS */}
                        <div className="profile-bottom-row">
                            <div className="cv-information">
                                <span className="profile-label">CV</span>
                                <span className="profile-value">
                                    {currentCVPath ? "CV uploaded" : "No CV uploaded"}
                                </span>
                            </div>

                            <div className="profile-actions">
                                {currentCVPath && (
                                    <>
                                        <a
                                            href={`https://localhost:7081${currentCVPath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="view-cv-button"
                                        >
                                            View CV
                                        </a>

                                        <button
                                            type="button"
                                            className="update-cv-button"
                                            onClick={() => {
                                                setError("");
                                                setSelectedFile(null);
                                                setShowUpdateModal(true);
                                            }}
                                        >
                                            Update CV
                                        </button>

                                        <button
                                            type="button"
                                            className="delete-cv-button"
                                            onClick={() => {
                                                setError("");
                                                setShowDeleteCVModal(true);
                                            }}
                                        >
                                            Delete CV
                                        </button>
                                    </>
                                )}

                                <button
                                    type="button"
                                    className="profile-action-button"
                                    onClick={() => navigate("/profile/edit", { state: { profile } })}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="profile-section">
                        <div className="profile-section-header">
                            <h2>Professional Profile</h2>
                        </div>

                        <p className="no-profile-text">
                            You have not created your professional profile yet.
                        </p>

                        <p className="no-profile-description">
                            Create your profile to add your experience and CV information.
                        </p>

                        <div className="profile-actions">
                            <button
                                type="button"
                                className="profile-action-button"
                                onClick={() => navigate("/profile/create")}
                            >
                                Create Profile
                            </button>
                        </div>
                    </section>
                )}

                {/* ACCOUNT SECTION */}
                <section className="profile-section account-section">
                    <div className="profile-section-header">
                        <h2>Account</h2>
                    </div>

                    <div className="profile-actions">
                        <button
                            type="button"
                            className="delete-account-button"
                            onClick={() => setShowDeleteAccountModal(true)}
                        >
                            Delete Account
                        </button>
                    </div>
                </section>
            </div>

            {/* =========================================
                UPDATE CV MODAL
            ========================================= */}
            {showUpdateModal && (
                <div 
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999
                    }}
                >
                    <div 
                        style={{
                            background: "#ffffff",
                            padding: "25px",
                            borderRadius: "10px",
                            width: "90%",
                            maxWidth: "420px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                            <h3 style={{ margin: 0, fontSize: "18px" }}>Update CV</h3>
                            <button 
                                onClick={() => setShowUpdateModal(false)}
                                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}
                            >
                                ×
                            </button>
                        </div>

                        <p style={{ fontSize: "14px", color: "#555", marginBottom: "15px" }}>
                            Select the new CV file to replace your current CV.
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            style={{ marginBottom: "15px", width: "100%" }}
                        />

                        {selectedFile && (
                            <p style={{ fontSize: "13px", color: "#222", fontWeight: 600, marginBottom: "15px" }}>
                                Selected: {selectedFile.name}
                            </p>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button
                                type="button"
                                className="view-cv-button"
                                onClick={() => setShowUpdateModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="profile-action-button"
                                onClick={handleUpdateCV}
                                disabled={actionLoading || !selectedFile}
                            >
                                {actionLoading ? "Updating..." : "Confirm Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================
                DELETE CV MODAL
            ========================================= */}
            {showDeleteCVModal && (
                <div 
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999
                    }}
                >
                    <div 
                        style={{
                            background: "#ffffff",
                            padding: "25px",
                            borderRadius: "10px",
                            width: "90%",
                            maxWidth: "420px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                            <h3 style={{ margin: 0, fontSize: "18px" }}>Delete CV</h3>
                            <button 
                                onClick={() => setShowDeleteCVModal(false)}
                                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}
                            >
                                ×
                            </button>
                        </div>

                        <p style={{ fontSize: "14px", color: "#555", margin: "0 0 8px 0" }}>
                            Are you sure you want to delete your CV?
                        </p>
                        <p style={{ fontSize: "13px", color: "#c62828", margin: "0 0 20px 0" }}>
                            This action cannot be undone.
                        </p>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button
                                type="button"
                                className="view-cv-button"
                                onClick={() => setShowDeleteCVModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="delete-cv-button"
                                onClick={handleDeleteCV}
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Deleting..." : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================
                DELETE ACCOUNT MODAL
            ========================================= */}
            {showDeleteAccountModal && (
                <div 
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999
                    }}
                >
                    <div 
                        style={{
                            background: "#ffffff",
                            padding: "25px",
                            borderRadius: "10px",
                            width: "90%",
                            maxWidth: "420px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                            <h3 style={{ margin: 0, fontSize: "18px" }}>Delete Account</h3>
                            <button 
                                onClick={() => setShowDeleteAccountModal(false)}
                                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}
                            >
                                ×
                            </button>
                        </div>

                        <p style={{ fontSize: "14px", color: "#555", margin: "0 0 8px 0" }}>
                            Are you sure you want to permanently delete your account?
                        </p>
                        <p style={{ fontSize: "13px", color: "#c62828", margin: "0 0 20px 0" }}>
                            All your profile data and applications will be removed.
                        </p>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button
                                type="button"
                                className="view-cv-button"
                                onClick={() => setShowDeleteAccountModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="delete-account-button"
                                onClick={handleDeleteAccount}
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Deleting..." : "Delete Permanently"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* BOTTOM NAVIGATION */}
            <nav className="bottom-navigation">
                <Link to="/dashboard" className="bottom-nav-item">
                    <span className="bottom-nav-icon"></span>
                    <span>Dashboard</span>
                </Link>

                <Link to="/my-applications" className="bottom-nav-item">
                    <span className="bottom-nav-icon"></span>
                    <span>My Applications</span>
                </Link>

                <Link to="/saved-jobs" className="bottom-nav-item">
                    <span className="bottom-nav-icon"></span>
                    <span>Saved Jobs</span>
                </Link>

                <Link to="/messages" className="bottom-nav-item">
                    <span className="bottom-nav-icon"></span>
                    <span>Messages</span>
                </Link>

                <Link to="/settings" className="bottom-nav-item">
                    <span className="bottom-nav-icon"></span>
                    <span>Settings</span>
                </Link>

                <Link to="/profile" className="bottom-nav-item active">
                    <span className="bottom-nav-icon"></span>
                    <span>Profile</span>
                </Link>
            </nav>
        </div>
    );
}

export default Profile;