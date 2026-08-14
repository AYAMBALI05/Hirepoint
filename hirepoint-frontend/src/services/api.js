import { getToken } from "./auth";

/*
 * Base URL of our HirePoint ASP.NET API.
 */
const API_URL = "https://localhost:7081/api";

/*
 * Creates the headers that will be sent with our API requests.
 */
const getHeaders = () => {

    /*
     * Get the JWT token that was stored
     * when the user logged in.
     */
    const token = getToken();

    /*
     * These headers are sent with the request.
     */
    const headers = {
        "Content-Type": "application/json"
    };

    /*
     * If the user is logged in and a token exists,
     * add the JWT to the Authorization header.
     *
     * ASP.NET expects:
     *
     * Authorization: Bearer TOKEN
     */
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

/*
 * GET ALL JOBS
 *
 * This function requests all available jobs
 * from our ASP.NET JobsController.
 */
export const getJobs = async () => {

    const response = await fetch(
        `${API_URL}/Jobs`,
        {
            method: "GET",

            /*
             * If the user is logged in, the JWT
             * will automatically be included.
             *
             * If the user is logged out, the request
             * still works because GetJobs() is public.
             */
            headers: getHeaders()
        }
    );

    /*
     * If ASP.NET returns an error, throw an error
     * so the React component can handle it.
     */
    if (!response.ok) {
        throw new Error(
            `Failed to load jobs. Status: ${response.status}`
        );
    }

    /*
     * Convert the JSON response from ASP.NET
     * into a JavaScript object/array.
     */
    return await response.json();
};