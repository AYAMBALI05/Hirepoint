import { Navigate } from "react-router-dom";
import { isLoggedIn, getRoleID } from "../services/auth";
/*

 * ProtectedRoute is used to protect pages
 * that should only be accessible to logged-in users.
 *
 * Example:
 *
 * <Route
 *     path="/jobs"
 *     element={
 *         <ProtectedRoute>
 *             <Jobs />
 *         </ProtectedRoute>
 *     }
 * />
 *
function ProtectedRoute({ children, allowedRoles }) {

    /*
     * Check whether a JWT token exists.
     *
     * If there is no token, the user is not logged in.
     
    if (!isLoggedIn()) {

        /*
         * Redirect the unauthenticated user
         * to the login page.
         
        return <Navigate to="/login" replace />;
    }


    /*
     * Get the role of the currently logged-in user.
     *
     * localStorage stores roleID as a string,
     * so we convert it to a number.
     
    const roleID = Number(getRoleID());


    /*
     * If allowedRoles was supplied, check whether
     * the user's role is allowed to access this page.
     
    if (
        allowedRoles &&
        !allowedRoles.includes(roleID)
    ) {

        /*
         * The user is logged in, but they do not
         * have permission to access this page.
         *
         * For now, send them back to Home.
         
        return <Navigate to="/" replace />;
    }


    /*
     * The user is authenticated and has permission.
     *
     * Render the page that was passed into ProtectedRoute.
     
    return children;
}
*/



/*
 * ProtectedRoute
 *
 * This component protects routes that should only
 * be accessible to authenticated users.
 *
 * It can also restrict a page to specific roles.
 *
 * Role IDs:
 * 1 = Admin
 * 2 = Recruiter
 * 3 = Job Seeker
 */
function ProtectedRoute({ children, allowedRoles }) {

    /*
     * Check whether a JWT token exists in
     * localStorage.
     *
     * If there is no token, the user is
     * considered logged out.
     */
    const loggedIn = isLoggedIn();


    /*
     * If the user is NOT logged in,
     * redirect them to the Login page.
     */
    if (!loggedIn) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    /*
     * Get the role ID of the logged-in user.
     *
     * localStorage stores values as strings,
     * therefore Number() converts it into
     * a JavaScript number.
     */
    const roleID = Number(getRoleID());


    /*
     * If allowedRoles was provided,
     * check whether the user's role is allowed.
     *
     * Example:
     *
     * allowedRoles={[3]}
     *
     * means only Job Seekers can access
     * the page.
     */
    if (
        allowedRoles &&
        !allowedRoles.includes(roleID)
    ) {

        /*
         * The user is logged in, but their
         * role does not have permission.
         *
         * Send them back to Home.
         */
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    /*
     * The user is authenticated and,
     * if required, has the correct role.
     *
     * Render the protected page.
     */
    return children;
}


export default ProtectedRoute;