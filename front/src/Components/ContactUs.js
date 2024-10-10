import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../wallet/WalletDashboard.css"; // Reuse the CSS file for styling
import logo3 from "./logo3.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./Login"; // Import the Login component
import SignupModal from "./SignupModal"; // Import the SignupModal component
import axios from "axios";
import { useTheme } from "../ThemeContext"; // Import ThemeContext

export default function ContactUs() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef();
  const userId = localStorage.getItem("_id"); // Get the MongoDB userId
  const uid = localStorage.getItem("userId"); // Get the 7-digit uid
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const { isDarkMode, toggleTheme } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contactUrls, setContactUrls] = useState({});

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }

    const fetchContactUrls = async () => {
      try {
        const response = await axios.get("https://trcnfx.com/api/contact-urls");
        setContactUrls(response.data);
      } catch (error) {
        console.error("Error fetching contact URLs:", error);
      }
    };

    fetchContactUrls();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://trcnfx.com/api/contact", {
        title,
        description,
        userId,
        uid,
      });
      alert("Form submitted successfully");
      setTitle("");
      setDescription("");
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  const handleContactViaSystem = () => {
    setShowForm(true);
  };

  const handleContactViaTelegram = () => {
    if (contactUrls.telegram) {
      window.open(contactUrls.telegram, "_blank");
    } else {
      alert("Telegram contact is not available at the moment.");
    }
  };

  const handleContactViaWhatsApp = () => {
    if (contactUrls.whatsapp) {
      window.open(contactUrls.whatsapp, "_blank");
    } else {
      alert("WhatsApp contact is not available at the moment.");
    }
  };

  const handleContactViaEmail = () => {
    if (contactUrls.email) {
      window.location.href = `mailto:${contactUrls.email}`;
    } else {
      alert("Email contact is not available at the moment.");
    }
  };

  return (
    <div className="container">
      <header style={{ backgroundColor: "var(--primary-color)" }}>
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <h1>
            <Link to="/">TrustCoinFX</Link>
          </h1>
          <button className="menu-button" onClick={toggleMenu}>
            &#9776;
          </button>
        </div>
      </header>

      <div
        id="sidebar"
        className={`sidebar ${isMenuOpen ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="sidebar-header">
          <img src={logo3} alt="logo" />
          <p>
            <b>UID: {uid}</b>
          </p>
          {isLoggedIn && (
            <p>
              Verified{" "}
              <i className="fas fa-check-circle" style={{ color: "white" }}></i>
            </p>
          )}
        </div>

        <div className="functions">
          <ul>
            <li>
              <Link to="/wallet" className="link">
                <i className="fas fa-wallet"></i> Wallet
              </Link>
            </li>
            <li>
              <Link to="/tradepage">
                <i className="fas fa-exchange-alt"></i> Trade
              </Link>
            </li>
            <li>
              <Link to="/result">
                <i className="fas fa-chart-line"></i> Result
              </Link>
            </li>
            <li>
              <Link to="/transaction">
                <i className="fas fa-pen"></i> Transactions
              </Link>
            </li>
            <li>
              <Link to="/terms">
                <i className="fas fa-book"></i> Privacy Policy
              </Link>
            </li>
            <li>
              <button
                className="link"
                onClick={() => navigate("/profit-stats")}
              >
                <i className="fas fa-chart-bar"></i> Profit Statistics
              </button>
            </li>
            <li>
              <button className="link" onClick={() => navigate("/contactUs")}>
                <i className="fas fa-phone"></i> Contact Us
              </button>
            </li>
          </ul>
          <div className="more-options">
            <ul>
              {isLoggedIn ? (
                <li>
                  <Link to="/settings">
                    <i className="fa-solid fa-gear"></i> Settings
                  </Link>
                </li>
              ) : (
                <li>
                  <button onClick={() => setShowLoginModal(true)}>
                    <i className="fa-solid fa-person"></i> Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="banner">
          <h2>Contact Us</h2>
          <p>
            We're here to help! If you have any questions or need assistance,
            contact us through the options below.
          </p>
        </div>
        {!showForm ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={handleContactViaSystem}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="fas fa-laptop" style={{ marginRight: "8px" }}></i>
              Contact Us via System
            </button>
            <button
              onClick={handleContactViaTelegram}
              style={{
                backgroundColor: "#0088cc",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="fab fa-telegram-plane"
                style={{ marginRight: "8px" }}
              ></i>
              Contact Us via Telegram
            </button>
            <button
              onClick={handleContactViaWhatsApp}
              style={{
                backgroundColor: "#25d366",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="fab fa-whatsapp" style={{ marginRight: "8px" }}></i>
              Contact Us via WhatsApp
            </button>
            <button
              onClick={handleContactViaEmail}
              style={{
                backgroundColor: "#d14836",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="fas fa-envelope" style={{ marginRight: "8px" }}></i>
              Contact Us via Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="input-field"
                style={{ height: "100px" }}
              ></textarea>
            </div>
            <button
              type="submit"
              className="submit-button"
              style={{ backgroundColor: "#4caf50", color: "white" }}
            >
              Submit
            </button>
          </form>
        )}
      </div>

      {showLoginModal && <Login closeModal={() => setShowLoginModal(false)} />}
      {showSignupModal && (
        <SignupModal closeModal={() => setShowSignupModal(false)} />
      )}
    </div>
  );
}
