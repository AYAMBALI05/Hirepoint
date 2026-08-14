// Gets the JWT token that was saved when the user logged in.
export const getToken = () => {
    return localStorage.getItem("token");
};

// Checks whether a JWT currently exists.
//
// true  = user is logged in
// false = user is not logged in
export const isLoggedIn = () => {
    return !!getToken();
};


// Gets the logged-in user's ID.
export const getUserID = () => {
    return localStorage.getItem("userID");
};


// Gets the logged-in user's first name.
export const getFirstName = () => {
    return localStorage.getItem("firstName");
};


// Gets the logged-in user's last name.
export const getLastName = () => {
    return localStorage.getItem("lastName");
};


// Gets the logged-in user's email.
export const getEmail = () => {
    return localStorage.getItem("email");
};


// Gets the logged-in user's role ID.
//
// 1 = Admin
// 2 = Recruiter
// 3 = Job Seeker
export const getRoleID = () => {
    return localStorage.getItem("roleID");
};


// Returns all the currently logged-in user's
// stored information as one object.
export const getCurrentUser = () => {

    // If there is no token, there is no logged-in user.
    if (!isLoggedIn()) {
        return null;
    }

    return {
        userID: getUserID(),
        firstName: getFirstName(),
        lastName: getLastName(),
        email: getEmail(),
        roleID: getRoleID()
    };
};


// Logs the user out.
//
// We remove everything that was saved during login.
export const logout = () => {

    // Remove all authentication information
    // that was saved during login.
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    localStorage.removeItem("roleID");

    // Tell the application that the authentication
    // state has changed.
    window.dispatchEvent(
        new Event("authChange")
    );

};
// Tells the application that authentication information changed.
//
// We will call this after a successful login.
export const notifyAuthChange = () => {
    window.dispatchEvent(new Event("authChange"));
};