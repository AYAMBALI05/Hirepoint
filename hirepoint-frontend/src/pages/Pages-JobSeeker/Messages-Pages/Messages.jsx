import { Link } from "react-router-dom";

import "./Messages.css";


function Messages() {

    return (

        <div className="messages-page">

            <div className="messages-container">

                {/* =====================================
                    PAGE HEADER
                ====================================== */}

                <div className="messages-header">

                    <h1>
                        Messages
                    </h1>

                    <p>
                        Communicate with recruiters about your job applications.
                    </p>

                </div>


                {/* =====================================
                    MESSAGES CONTENT
                ====================================== */}

                <div className="messages-content">

                    <div className="messages-empty">

                        <h2>
                            No Messages
                        </h2>

                        <p>
                            You don't have any messages yet.
                        </p>

                    </div>

                </div>

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
                    className="bottom-nav-item active"
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
                    className="bottom-nav-item"
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


export default Messages;