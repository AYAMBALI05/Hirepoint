import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import JobDetails from "./pages/Jobs/JobDetails-Pages/JobDetails";

import Home from "./pages/Home-Pages/Home";

import Login from "./pages/Login-Pages/Login";
import Register from "./pages/Registration-Pages/Register";

import ApplyJob from "./pages/Jobs/Apply-Pages/Apply";

import MyApplications from "./pages/Applications-Pages/MyApplications";


import SavedJobs from "./pages/Jobs/SavedJobs-Pages/SavedJobs";

import JobSeekerDashboard from "./pages/JobSeeker-Dashboard/Jobseeker_Dashboard";
import Profiles from "./pages/Profile-Pages/Profile";
import Messages from "./pages/Messages-Pages/Messages";


/*
 * Controls which pages should display
 * the normal HirePoint navigation.
 */
function AppLayout() {

    const location = useLocation();


    /*
     * Login and Register are standalone
     * authentication pages.
     *
     * They should NOT display the Navbar.
     */
   const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/jobs/");

    return (
        <>

            {/* 
             * Display Navbar on normal application pages.
             * Hide it on Login and Register.
             */}
            {!hideNavbar && <Navbar />}


            <Routes>

                {/* =====================================
                    MAIN LANDING PAGE
                ====================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* =====================================
                    AUTHENTICATION
                ====================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =====================================
                    JOB SEEKER DASHBOARD
                ====================================== */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <JobSeekerDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    JOBS
                ====================================== */}

               


                {/* =====================================
                    JOB DETAILS
                ====================================== */}

                <Route
                    path="/jobs/:id"
                    element={
                        <ProtectedRoute>
                            <JobDetails />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    APPLY FOR JOB
                ====================================== */}

                <Route
                    path="/jobs/:id/apply"
                    element={
                        <ProtectedRoute>
                            <ApplyJob />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    MY APPLICATIONS
                ====================================== */}

                <Route
                    path="/my-applications"
                    element={
                        <ProtectedRoute>
                            <MyApplications />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    SAVED JOBS
                ====================================== */}

                <Route
                    path="/saved-jobs"
                    element={
                        <ProtectedRoute>
                            <SavedJobs />
                        </ProtectedRoute>
                    }
                />

                    {/* =====================================
                        MESSAGES
                    ===================================== */}

                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute>
                                <Messages />
                            </ProtectedRoute>
                        }
                    />


                {/* =====================================
                    PROFILES
                ====================================== */}

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profiles />
                        </ProtectedRoute>
                    }
                />
                </Routes>

        </>
    );
}


function App() {

    return (
        <BrowserRouter>

            <AppLayout />

        </BrowserRouter>
    );
}


export default App;