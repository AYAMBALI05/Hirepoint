/*import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;*/

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Jobs from "./pages/Jobs/Jobs";
import JobDetails from "./pages/Jobs/JobDetails-Pages/JobDetails";
import Home from "./pages/Home-Pages/Home";
import Login from "./pages/Login-Pages/Login";
import Register from "./pages/Registration-Pages/Register";
import ApplyJob from "./pages/Jobs/Apply-Pages/Apply";
import MyApplications from "./pages/Applications-Pages/MyApplications";
import SavedJobs from "./pages/SavedJobs-Pages/SavedJobs";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
    
      <Routes>
<Route path="/" element={<Home/>} />
<Route
    path="/jobs"
    element={
        <ProtectedRoute>
            <Jobs />
        </ProtectedRoute>
    }
/>
<Route
    path="/jobs/:id/apply"
    element={<ApplyJob />}
/>
<Route
    path="/my-applications"
    element={<MyApplications />}
/>
<Route
    path="/saved-jobs"
    element={<SavedJobs />}
/>
       <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;