import { Link } from "react-router-dom";
import "./Home.css";
import hirepointIcon from "../../assets/hirepoint-icon.png";

function Home() {

    return (
        <div className="home-page">

            {/* =====================================
                HIREPOINT ICON
            ====================================== */}

           <div className="home-logo">

              <img
                 src={hirepointIcon}
                 alt="HirePoint"
             />

          </div>


            {/* =====================================
                MAIN TITLE
            ====================================== */}

            <h1 className="home-title">
                HirePoint
            </h1>


            {/* =====================================
                TAGLINE
            ====================================== */}

            <p className="home-tagline">
                Your Gateway to Career Opportunities
            </p>


            {/* =====================================
                LOGIN AND REGISTER BUTTONS
            ====================================== */}

            <div className="home-auth-buttons">

                <Link
                    to="/login"
                    className="home-login-button"
                >
                    Login
                </Link>


                <Link
                    to="/register"
                    className="home-register-button"
                >
                    Register
                </Link>

            </div>

        </div>
    );
}

export default Home;