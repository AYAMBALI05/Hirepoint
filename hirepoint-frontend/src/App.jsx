import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// JOB SEEKER
import JobDetails from "./pages/Pages-JobSeeker/JobDetails-Pages/JobDetails";
import ApplyJob from "./pages/Pages-JobSeeker/Apply-Pages/Apply";
import MyApplications from "./pages/Pages-JobSeeker/Applications-Pages/MyApplications";
import SavedJobs from "./pages/Pages-JobSeeker/SavedJobs-Pages/SavedJobs";
import JobSeekerDashboard from "./pages/Pages-JobSeeker/JobSeeker-Dashboard/Jobseeker_Dashboard";
import Profiles from "./pages/Pages-JobSeeker/Profile-Pages/Profile";
import Messages from "./pages/Pages-JobSeeker/Messages-Pages/Messages";

// MAIN
import Home from "./pages/Pages-Main/Home-Pages/Home";
import Login from "./pages/Pages-Main/Login-Pages/Login";
import Register from "./pages/Pages-Main/Registration-Pages/Register";
import ForgotPassword from "./pages/Pages-Main/ForgotPassword-Pages/Forgot-Password";

// ADMIN
import AdminDashboard from "./pages/Pages-Admin/AdminDashboard-Pages/AdminDashboard";
import AdminUsers from "./pages/Pages-Admin/AdminUsers-Pages/Users";
import JobListing from "./pages/Pages-Admin/Joblistings-Pages/Joblisting";
import Analytics from "./pages/Pages-Admin/Analytics-Pages/Analytics";
import RecruiterDashboard from "./pages/Pages-Recruiter/RecruitersDashboard-Pages/RecruiterDashboard";
import JobPost from "./pages/Pages-Recruiter/JobPosting-Pages/JobPost";
import RecruiterJobs from "./pages/Pages-Recruiter/RecruiterJobs-Pages/RecruiterJobs";
import RecruiterProfile from "./pages/Pages-Recruiter/RecruiterProfile-Pages/RecruiterProfile";
import EditJob from "./pages/Pages-Recruiter/JobPosting-Pages/EditJobs";

function AppLayout() {

    const location = useLocation();

    const hideNavbar =
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname.startsWith("/jobs/");

    return (
        <>

            {!hideNavbar && <Navbar />}

            <Routes>

                {/* =====================================
                    MAIN
                ====================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
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
                ====================================== */}

                <Route
                    path="/messages"
                    element={
                        <ProtectedRoute>
                            <Messages />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    PROFILE
                ====================================== */}

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profiles />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    ADMIN INTERFACE
                ================================================= */}


                {/* =====================================
                    ADMIN DASHBOARD
                ====================================== */}

                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    ADMIN USERS
                ====================================== */}

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute>
                            <AdminUsers />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                     JOB LISTINGS
                ====================================== */}

                <Route
                    path="/admin/jobs"
                    element={
                        <ProtectedRoute>
                            <JobListing />
                        </ProtectedRoute>
                    }
                />
                {/* =====================================
                    ANALTICS
                ====================================== */}


                <Route
                    path="/admin/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />


                  {/* =================================================
                    RECRUITER'S INTERFACE
                ================================================= */}
                
                    {/* =====================================
                    RECRUITER DASHBOARD
                ====================================== */}


                <Route
                    path="/recruiter-dashboard"
                    element={
                        <ProtectedRoute>
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    }
                />

                 {/* =====================================
                  POST NEW JOB
                ====================================== */}

               <Route
                    path="/recruiter/jobs/create"
                    element={
                        <ProtectedRoute>
                            <JobPost />
                        </ProtectedRoute>
                    }
                />

                {/* =====================================
                    RECRUITER JOBS
                ====================================== */}

                <Route
                    path="/recruiter/jobs"
                    element={
                        <ProtectedRoute>
                            <RecruiterJobs />
                        </ProtectedRoute>
                    }
                />
                
             
                            <Route
                    path="/recruiter/profile/create"
                    element={
                        <ProtectedRoute>
                            <RecruiterProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recruiter/jobs/edit/:id"
                    element={
                        <ProtectedRoute>
                            <EditJob />
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