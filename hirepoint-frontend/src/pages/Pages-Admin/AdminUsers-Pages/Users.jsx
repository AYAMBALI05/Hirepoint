import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getToken } from "../../../services/auth";

import "./Users.css";


function Users() {

    // =========================================
    // USERS
    // =========================================

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");


    // =========================================
    // SELECTED USER / MODALS
    // =========================================

    const [selectedUser, setSelectedUser] = useState(null);

    const [showUserDetails, setShowUserDetails] =
        useState(false);

    


    // =========================================
    // EDIT USER
    // =========================================

    


   

    const [deactivating, setDeactivating] =
        useState(false);


    // =========================================
    // LOAD USERS
    // =========================================

    const loadUsers = async () => {

        try {

            setLoading(true);

            setError("");

            const token = getToken();


            if (!token) {

                setError(
                    "Please log in to view users."
                );

                return;
            }


            const response = await window.fetch(
                "https://localhost:7081/api/Users/GetUsers",
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );


            console.log(
                "Users API status:",
                response.status
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Users API error:",
                    errorText
                );


                if (response.status === 401) {

                    throw new Error(
                        "You are not authorized. Please log in again."
                    );

                }


                if (response.status === 403) {

                    throw new Error(
                        "Access denied. Only administrators can view users."
                    );

                }


                throw new Error(
                    "Could not load users. Status: " +
                    response.status
                );

            }


            const data =
                await response.json();


            console.log(
                "Users:",
                data
            );


            setUsers(data);

        }

        catch (error) {

            console.error(
                "Load users error:",
                error
            );


            setError(
                error.message
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =========================================
    // LOAD USERS WHEN PAGE OPENS
    // =========================================

    useEffect(() => {

        loadUsers();

    }, []);


    // =========================================
    // SEARCH USERS
    // =========================================

    const filteredUsers =
        users.filter((user) => {

            const fullName =
                `${user.firstName || ""} ${user.lastName || ""}`
                    .toLowerCase();


            const email =
                (user.email || "")
                    .toLowerCase();


            const role =
                (user.roleName || "")
                    .toLowerCase();


            const search =
                searchTerm.toLowerCase();


            return (
                fullName.includes(search) ||
                email.includes(search) ||
                role.includes(search)
            );

        });


    // =========================================
    // VIEW USER
    // =========================================

    const viewUser = async (userID) => {

        try {

            const token = getToken();


            if (!token) {

                throw new Error(
                    "Please log in again."
                );

            }


            const response = await window.fetch(
                `https://localhost:7081/api/Users/GetUserById/${userID}`,
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
                    "Could not load user details."
                );

            }


            const data =
                await response.json();


            setSelectedUser(data);

            setShowUserDetails(true);

        }

        catch (error) {

            console.error(
                "View user error:",
                error
            );


            alert(
                error.message
            );

        }

    };


   

    // =========================================
    // SOFT DELETE / DEACTIVATE USER
    // =========================================

   const deactivateUser = async (userID) => {

    const confirmed = window.confirm(
        "Are you sure you want to deactivate this user?\n\n" +
        "The user's account will be soft deleted. " +
        "Their information will remain in the database."
    );

    if (!confirmed) {
        return;
    }

    try {

        setDeactivating(true);

        const token = getToken();

        if (!token) {
            throw new Error("Please log in again.");
        }

        const response = await window.fetch(
            `https://localhost:7081/api/Users/DeleteUser/${userID}`,
            {
                method: "DELETE",

                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        if (!response.ok) {

            const errorText = await response.text();

            console.error(
                "Deactivate user error:",
                errorText
            );

            throw new Error(
                "Could not deactivate user."
            );
        }

        // Close the modal
        setShowUserDetails(false);

        setSelectedUser(null);

        // Reload users
        await loadUsers();

        alert(
            "User has been deactivated successfully."
        );

    } catch (error) {

        console.error(
            "Deactivate user error:",
            error
        );

        alert(error.message);

    } finally {

        setDeactivating(false);

    }
};


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="users-message">

                Loading users...

            </div>

        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div className="users-message error">

                <h2>
                    Unable to Load Users
                </h2>


                <p>
                    {error}
                </p>


                <button
                    type="button"
                    className="users-retry-button"
                    onClick={loadUsers}
                >
                    Try Again
                </button>


                <Link
                    to="/admin/dashboard"
                    className="users-back-button"
                >
                    Back to Dashboard
                </Link>

            </div>

        );

    }


    // =========================================
    // MAIN PAGE
    // =========================================

    return (

        <div className="users-page">


            <div className="users-container">


                {/* =================================
                    PAGE HEADER
                ================================= */}

                <div className="users-header">

                    <h1>
                        Users
                    </h1>


                    <p>
                        Manage registered HirePoint users.
                    </p>

                </div>


                {/* =================================
                    SEARCH
                ================================= */}

                <div className="users-search-section">

                    <input
                        type="text"
                        placeholder="Search users by name, email or role..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* =================================
                    USER LIST
                ================================= */}

                <div className="users-list-section">


                    <div className="users-list-header">

                        <div>

                            <h2>
                                All Users
                            </h2>


                            <p>
                                {filteredUsers.length} user(s)
                            </p>

                        </div>

                    </div>


                    {filteredUsers.length === 0 ? (

                        <div className="no-users">

                            <h2>
                                No Users Found
                            </h2>


                            <p>
                                There are no users matching your search.
                            </p>

                        </div>

                    ) : (

                        <div className="users-list">

                            {filteredUsers.map(
                                (user) => (

                                    <div
                                        className="user-card"
                                        key={user.userID}
                                    >


                                        {/* =================================
                                            ICON SPACE
                                        ================================= */}

                                        <div className="user-card-icon-space">

                                            {/* USER ICON SPACE */}

                                        </div>


                                        {/* =================================
                                            USER INFORMATION
                                        ================================= */}

                                        <div className="user-card-information">

                                            <h3>

                                                {user.firstName}{" "}
                                                {user.lastName}

                                            </h3>


                                            <p>
                                                {user.email}
                                            </p>


                                            <span>
                                                {user.roleName}
                                            </span>

                                        </div>


                                        {/* =================================
                                            STATUS
                                        ================================= */}

                                        <div className="user-card-status">

                                            <span
                                                className={
                                                    user.isActive
                                                        ? "status-active"
                                                        : "status-inactive"
                                                }
                                            >

                                                {user.isActive
                                                    ? "Active"
                                                    : "Inactive"
                                                }

                                            </span>

                                        </div>


                                        {/* =================================
                                            VIEW BUTTON
                                        ================================= */}

                                        <div className="user-card-action-space">

                                            <button
                                                type="button"
                                                className="user-view-button"
                                                onClick={() =>
                                                    viewUser(
                                                        user.userID
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                        </div>


                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


            </div>


            {/* =====================================
                VIEW USER MODAL
            ====================================== */}

            {showUserDetails &&
                selectedUser && (

                    <div
                        className="user-modal-overlay"
                        onClick={() =>
                            setShowUserDetails(false)
                        }
                    >

                        <div
                            className="user-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >


                            {/* MODAL HEADER */}

                            <div className="user-modal-header">

                                <h2>
                                    User Details
                                </h2>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowUserDetails(false)
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            {/* USER ICON SPACE */}

                            <div className="modal-user-icon-space">

                                {/* USER ICON SPACE */}

                            </div>


                            {/* USER DETAILS */}

                            <div className="user-details">


                                <p>

                                    <strong>
                                        Name
                                    </strong>

                                    <span>
                                        {selectedUser.firstName}{" "}
                                        {selectedUser.lastName}
                                    </span>

                                </p>


                                <p>

                                    <strong>
                                        Email
                                    </strong>

                                    <span>
                                        {selectedUser.email}
                                    </span>

                                </p>


                                <p>

                                    <strong>
                                        Role
                                    </strong>

                                    <span>
                                        {selectedUser.roleName}
                                    </span>

                                </p>


                                <p>

                                    <strong>
                                        Status
                                    </strong>

                                    <span
                                        className={
                                            selectedUser.isActive
                                                ? "status-active"
                                                : "status-inactive"
                                        }
                                    >

                                        {selectedUser.isActive
                                            ? "Active"
                                            : "Inactive"
                                        }

                                    </span>

                                </p>


                            </div>


                            {/* MODAL ACTIONS */}

                           <div className="user-modal-actions">

                                <button
                                    type="button"
                                    className="modal-close-button"
                                    onClick={() =>
                                        setShowUserDetails(false)
                                    }
                                >
                                    Close
                                </button>


                                {selectedUser.isActive && (

                                    <button
                                        type="button"
                                        className="modal-delete-button"
                                        onClick={() =>
                                            deactivateUser(
                                                selectedUser.userID
                                            )
                                        }
                                        disabled={deactivating}
                                    >

                                        {deactivating
                                            ? "Deactivating..."
                                            : "Deactivate User"
                                        }

                                    </button>

                                )}

                            </div>


                        </div>

                    </div>

                )
            }


           



            {/* =====================================
                ADMIN BOTTOM NAVIGATION
            ====================================== */}

            <nav className="bottom-navbar">


                <Link
                    to="/admin-dashboard"
                >

                    <span>
                        {/* DASHBOARD ICON SPACE */}
                    </span>


                    <small>
                        Dashboard
                    </small>

                </Link>


                <Link
                    to="/admin/users"
                    className="active"
                >

                    <span>
                        {/* USERS ICON SPACE */}
                    </span>


                    <small>
                        Users
                    </small>

                </Link>


                <Link
                    to="/admin/jobs"
                >

                    <span>
                        {/* JOB LISTINGS ICON SPACE */}
                    </span>


                    <small>
                        Job Listings
                    </small>

                </Link>


                <Link
                    to="/admin/analytics"
                >

                    <span>
                        {/* ANALYTICS ICON SPACE */}
                    </span>


                    <small>
                        Analytics
                    </small>

                </Link>


                <Link
                    to="/admin/settings"
                >

                    <span>
                        {/* SETTINGS ICON SPACE */}
                    </span>


                    <small>
                        Settings
                    </small>

                </Link>


            </nav>


        </div>

    );

}


export default Users;