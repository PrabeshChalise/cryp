import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./WalletDashboard.css"; // Import the CSS file for styling
import image from "./qr.png";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo3 from "../Components/logo3.png";
import Login from "../Components/Login";
import SignupModal from "../Components/SignupModal";
import walletInfos from "./wallet-info.json"; // Make sure the path is correct

const WalletDashboard = () => {
  const [walletData, setWalletData] = useState(null);
  const [cryptos, setCryptos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Receive");
  const [amount, setAmount] = useState("");
  const [usdtValue, setUsdtValue] = useState("");
  const [address, setAddress] = useState("");
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [proof, setProof] = useState(null);
  const userId = localStorage.getItem("_id");
  const uid = localStorage.getItem("userId");
  const [frozenAmounts, setFrozenAmounts] = useState({});

  const navigate = useNavigate();
  const sidebarRef = useRef();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usdDepositAmount, setUsdDepositAmount] = useState("");
  const [cryptoDepositAmount, setCryptoDepositAmount] = useState("");
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState("Copy address");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIconColor, setModalIconColor] = useState("green");
  const [redirectAfterModal, setRedirectAfterModal] = useState(false);
  const [kycStatus, setKycStatus] = useState(""); // State to manage KYC status
  const id1 = localStorage.getItem("_id");
  // const [walletInfo, setWalletInfo] = useState(null);
  const [isLoadingWalletInfo, setIsLoadingWalletInfo] = useState(true);
  const [isLoadingRecharge, setIsLoadingRecharge] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  // const [modalIconColor, setModalIconColor] = useState("green");
  // const [modalMessage, setModalMessage] = useState("");
  const [walletLogos, setWalletLogos] = useState({});
  const [rechargeSuccessMessage, setRechargeSuccessMessage] = useState(""); // New state

  const [walletInfo, setWalletInfo] = useState({
    qrCodeUrl: "",
    walletAddress: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [primaryWallets, setPrimaryWallets] = useState([]);
  const [secondaryWallets, setSecondaryWallets] = useState([]);
  const cryptoShortNames = {
    BITCOIN: "BTC",
    ETHEREUM: "ETH",
    TETHER: "USDT",
    BINANCECOIN: "BNB",
    SOLANA: "SOL",
    "USD-COIN": "USDC",
    XRP: "XRP",
    "LIDO STAKED ETHER": "STETH",
    DOGECOIN: "DOGE",
    CARDANO: "ADA",
    TRON: "TRX",
    TONCOIN: "TON",
    "WRAPPED STETH": "WSTETH",
    AVALANCHE: "AVAX",
    "WRAPPED BITCOIN": "WBTC",
    "SHIBA INU": "SHIB",
    WETH: "WETH",
    POLKADOT: "DOT",
    CHAINLINK: "LINK",
    "BITCOIN CASH": "BCH",
    "LEO TOKEN": "LEO",
    "NEAR PROTOCOL": "NEAR",
    LITECOIN: "LTC",
    DAI: "DAI",
    UNISWAP: "UNI",
    "WRAPPED EETH": "WEETH",
    KASPA: "KAS",
    POLYGON: "MATIC",
    "INTERNET COMPUTER": "ICP",
    APTOS: "APT",
    PEPE: "PEPE",
    MONERO: "XMR",
    "ETHENA USDE": "USDE",
    // Add other mappings as needed
  };

  // useEffect(() => {
  //   const fetchWalletInfo = async () => {
  //     try {
  //       const response = await axios.get("https://trcnfx.com/api/wallet-info");
  //       const walletInfos = response.data;

  //       // Separate primary and secondary wallets
  //       const primarySymbols = walletInfos.map((info) =>
  //         info.symbol.toLowerCase()
  //       );
  //       const primary = Object.keys(walletData.balances).filter((symbol) =>
  //         primarySymbols.includes(symbol)
  //       );
  //       const secondary = Object.keys(walletData.balances).filter(
  //         (symbol) => !primarySymbols.includes(symbol)
  //       );

  //       setPrimaryWallets(primary);
  //       setSecondaryWallets(secondary);
  //     } catch (error) {
  //       console.error("Error fetching wallet info:", error);
  //     }
  //   };

  //   fetchWalletInfo();
  // }, [walletData]);
  useEffect(() => {
    const fetchWalletInfo = () => {
      try {
        // Map wallet symbols from JSON (walletInfos) to lowercase
        const primarySymbols = walletInfos.map((info) =>
          info.symbol.toLowerCase()
        );

        // Filter primary wallets based on the JSON symbols
        const primary = Object.keys(walletData?.balances || {}).filter(
          (symbol) => primarySymbols.includes(symbol.toLowerCase())
        );

        // Filter secondary wallets (those not in the JSON list)
        const secondary = Object.keys(walletData?.balances || {}).filter(
          (symbol) => !primarySymbols.includes(symbol.toLowerCase())
        );

        // Set the state for primary and secondary wallets
        setPrimaryWallets(primary);
        setSecondaryWallets(secondary);
      } catch (error) {
        console.error("Error fetching wallet info from JSON:", error);
      }
    };

    // Ensure walletData is available before processing
    if (walletData) {
      fetchWalletInfo();
    }
  }, [walletData]);
  const fetchFrozenAmounts = async () => {
    try {
      const response = await axios.get(
        `https://trcnfx.com/api/frozen/${userId}`
      );
      const frozenData = response.data.reduce((acc, item) => {
        acc[item.symbol.toLowerCase()] = item.amount; // Ensure symbols are lowercase
        return acc;
      }, {});
      console.log(frozenData); // Debug to check the data structure
      setFrozenAmounts(frozenData);
    } catch (error) {
      console.error("Error fetching frozen amounts:", error);
    }
  };

  // useEffect(() => {
  //   const fetchWalletInfo = async () => {
  //     try {
  //       const symbol =
  //         selectedSymbol === "usd" ? "TETHER" : selectedSymbol.toUpperCase();
  //       const response = await axios.get(
  //         `https://trcnfx.com/api/wallet-info/${symbol}`
  //       );
  //       setWalletInfo(response.data);
  //       setIsLoadingWalletInfo(false);
  //     } catch (error) {
  //       console.error("Error fetching wallet info:", error);
  //       setIsLoadingWalletInfo(false);
  //     }
  //   };

  //   fetchWalletInfo();
  // }, [selectedSymbol]);
  // useEffect(() => {
  //   const fetchWalletInfo = async () => {
  //     try {
  //       let symbol = selectedSymbol.toUpperCase();

  //       // Handle USDT (Tether) wallet info
  //       if (symbol === "USDT") {
  //         symbol = "TETHER"; // Use the actual identifier for Tether
  //       }

  //       const response = await axios.get(
  //         `https://trcnfx.com/api/wallet-info/${symbol}`
  //       );

  //       setWalletInfo(response.data);
  //       setIsLoadingWalletInfo(false);
  //     } catch (error) {
  //       console.error("Error fetching wallet info:", error);
  //       setIsLoadingWalletInfo(false);
  //     }
  //   };

  //   fetchWalletInfo();
  // }, [selectedSymbol]);
  useEffect(() => {
    const fetchWalletInfo = () => {
      try {
        let symbol = selectedSymbol.toUpperCase();

        // Handle USDT (Tether) wallet info
        if (symbol === "USDT") {
          symbol = "TETHER"; // Use the actual identifier for Tether
        }

        // Find the wallet info for the selected symbol from the JSON data
        const walletInfoData = walletInfos.find(
          (wallet) => wallet.symbol.toUpperCase() === symbol
        );

        if (walletInfoData) {
          setWalletInfo(walletInfoData); // Set wallet info from the JSON
        } else {
          // Set to empty if no matching data is found
          setWalletInfo({ qrCodeUrl: "", walletAddress: "" });
        }

        setIsLoadingWalletInfo(false);
      } catch (error) {
        console.error("Error fetching wallet info from JSON:", error);
        setIsLoadingWalletInfo(false);
      }
    };

    fetchWalletInfo(); // Call the function
  }, [selectedSymbol]);

  const cryptoFullNames = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    USDT: "Tether",
    BNB: "Binance Coin",
    SOL: "Solana",
    USDC: "USD Coin",
    ADA: "Cardano",
    TRX: "Tron",
    DOT: "Polkadot",
    LINK: "Chainlink",
    LTC: "Litecoin",
    DAI: "Dai",
    // Add other mappings as needed
  };
  const handleCryptoClick = (symbol) => {
    const fullName = cryptoFullNames[symbol.toUpperCase()] || symbol;
    setSelectedSymbol(fullName); // Pass the full name
    setSelectedTab("Receive");
    setShowCryptoModal(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const fetchWalletLogos = async () => {
      try {
        const logos = {};
        for (const symbol of primaryWallets) {
          const lowerSymbol = symbol.toLowerCase();
          const logoResponse = await axios.get(
            `https://pro-api.coingecko.com/api/v3/coins/${lowerSymbol}`,
            {
              headers: {
                "X-Cg-Pro-Api-Key": "CG-abdEKxm7HXgBnnG2D2eexnmq",
              },
            }
          );
          const imageUrl = logoResponse.data.image.large;
          const imageResponse = await axios.get(
            "https://trcnfx.com/api/fetch-image",
            {
              params: { imageUrl },
            }
          );
          logos[symbol] = `data:image/jpeg;base64,${imageResponse.data.image}`;
        }
        setWalletLogos(logos);
      } catch (error) {
        console.error("Error fetching wallet logos:", error);
      }
    };

    if (primaryWallets.length > 0) {
      fetchWalletLogos();
    }
  }, [primaryWallets]);

  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }

    const fetchKycStatus = async () => {
      try {
        const response = await axios.get(`https://trcnfx.com/api/kyc/${id1}`);
        setKycStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };

    if (uid) {
      fetchKycStatus();
    }
  }, [uid]);

  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const formatBalance = (balance) => {
    const threshold = 1e-8; // Set a reasonable threshold
    return balance < threshold ? 0 : balance.toFixed(8);
  };
  useEffect(() => {
    if (userId) {
      fetchFrozenAmounts(); // Call to fetch frozen amounts once the userId is available
    }
  }, [userId]);
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await axios.get(
          `https://trcnfx.com/api/wallet/${userId}/balances`
        );
        const data = response.data;

        // Convert "USD" to "USDT" in the fetched data
        // if (data.balances["USD"]) {
        //   data.balances["USDT"] = data.balances["USD"];
        //   delete data.balances["USD"];
        // }
        // if (data.prices["USD"]) {
        //   data.prices["USDT"] = data.prices["USD"];
        //   delete data.prices["USD"];
        // }

        setWalletData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        setIsLoading(false);
      }
    };

    const fetchCryptos = async () => {
      try {
        const response = await axios.get("https://trcnfx.com/api/cryptos");
        setCryptos(response.data);
      } catch (error) {
        console.error("Error fetching cryptocurrencies:", error);
      }
    };

    fetchWalletData();
    fetchCryptos();
  }, [userId]);

  const handleConvertAmountChange = (e) => {
    const value = e.target.value;
    setUsdtValue(value);
    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      const cryptoValue = value / walletData.prices[selectedSymbol].usd;
      setAmount(cryptoValue < 1e-8 ? "0.00" : cryptoValue.toFixed(8));
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  // const handleCryptoClick = (symbol) => {
  //   setSelectedSymbol(symbol);
  //   setSelectedTab("Receive"); // Default to the "Receive" tab
  //   setShowCryptoModal(true); // Show the crypto modal
  // };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setAddress(text);
  };

  const handleMax = () => {
    const maxCryptoAmount = walletData?.balances[selectedSymbol] || 0;
    setAmount(maxCryptoAmount);
    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      setUsdAmount(
        (maxCryptoAmount * walletData.prices[selectedSymbol].usd).toFixed(2)
      );
    }
  };
  const handleMaxConvertAssetValue = () => {
    const maxCryptoAmount = walletData?.balances[selectedSymbol] || 0;
    setAmount(maxCryptoAmount); // Set the asset value

    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol]?.usd
    ) {
      const usdValue = maxCryptoAmount * walletData.prices[selectedSymbol].usd;
      setUsdtValue(usdValue.toFixed(2)); // Automatically fill the USD amount
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredCryptos([]);
    } else {
      setFilteredCryptos(
        cryptos.filter(
          (crypto) =>
            crypto.name.toLowerCase().includes(term) ||
            crypto.symbol.toLowerCase().includes(term)
        )
      );
    }
  };

  const handleMaxConvert = () => {
    const maxCryptoAmount = walletData?.balances[selectedSymbol] || 0;
    setAmount(maxCryptoAmount);
    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      setUsdtValue(
        (maxCryptoAmount * walletData.prices[selectedSymbol].usd).toFixed(2)
      );
    }
  };

  const handleMaxConvertUSD = () => {
    if (
      walletData &&
      walletData.balances &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      const maxUsdAmount =
        (walletData.balances[selectedSymbol] || 0) *
        (walletData.prices[selectedSymbol]?.usd || 0);
      setUsdtValue(maxUsdAmount.toFixed(2));
      setAmount(
        (maxUsdAmount / (walletData.prices[selectedSymbol]?.usd || 1)).toFixed(
          8
        )
      );
    }
  };

  const [usdAmount, setUsdAmount] = useState("");
  // const handleSendSubmit = async (e) => {
  //   e.preventDefault();

  //   const cryptoPrice = walletData.prices[selectedSymbol]?.usd;
  //   const cryptoAmount = parseFloat(usdAmount) / cryptoPrice;

  //   if (cryptoAmount > walletData.balances[selectedSymbol]) {
  //     setModalMessage("Insufficient balance.");
  //     setModalIconColor("red");
  //     setShowSuccessPopup(true);
  //     return;
  //   }

  //   if (cryptoAmount <= 0 || usdAmount === "") {
  //     setModalMessage("Amount should be greater than 0.");
  //     setModalIconColor("red");
  //     setShowSuccessPopup(true);
  //     return;
  //   }

  //   try {
  //     await axios.post("https://trcnfx.com/api/send", {
  //       userId,
  //       symbol: selectedSymbol,
  //       amount: parseFloat(cryptoAmount.toFixed(8)),
  //       address,
  //     });

  //     setModalMessage("Send request submitted successfully");
  //     setModalIconColor("green");
  //     setShowSuccessPopup(true);
  //     setUsdAmount("");
  //     setAmount("");
  //     setAddress("");
  //   } catch (error) {
  //     console.error("Error submitting send request:", error);
  //     setModalMessage("Failed to submit send request");
  //     setModalIconColor("red");
  //     setShowSuccessPopup(true);
  //   }
  // };
  const handleSendSubmit = async (e) => {
    e.preventDefault();

    const cryptoPrice = walletData.prices[selectedSymbol]?.usd;
    const cryptoAmount = parseFloat(usdAmount) / cryptoPrice;

    // Check if the balance is sufficient
    if (cryptoAmount > walletData.balances[selectedSymbol]) {
      setModalMessage("Insufficient balance.");
      setModalIconColor("red");
      setShowSuccessPopup(true);
      return;
    }

    if (cryptoAmount <= 0 || usdAmount === "") {
      setModalMessage("Amount should be greater than 0.");
      setModalIconColor("red");
      setShowSuccessPopup(true);
      return;
    }

    try {
      // Make a request to the API to process the send request
      const response = await axios.post("https://trcnfx.com/api/send", {
        userId,
        symbol: selectedSymbol,
        amount: parseFloat(cryptoAmount.toFixed(8)),
        address,
      });

      // Display success message after the send request is processed
      setModalMessage("Send request submitted successfully. Amount frozen.");
      setModalIconColor("green");
      setShowSuccessPopup(true);

      // Fetch the updated wallet data (which will now reflect the frozen amount)
      const walletResponse = await axios.get(
        `https://trcnfx.com/api/wallet/${userId}/balances`
      );
      setWalletData(walletResponse.data); // Update the wallet data with the new balances and frozen amounts

      // Clear form fields
      setUsdAmount("");
      setAmount("");
      setAddress("");
    } catch (error) {
      console.error("Error submitting send request:", error);
      setModalMessage("Failed to submit send request.");
      setModalIconColor("red");
      setShowSuccessPopup(true);
    }
  };

  const handleConvertSubmit = async (e) => {
    e.preventDefault();

    if (
      walletData &&
      parseFloat(amount) > walletData.balances[selectedSymbol]
    ) {
      alert("Insufficient balance.");
      return;
    }

    if (parseFloat(amount) <= 0 || amount === "") {
      alert("Amount should be greater than 0.");
      return;
    }

    try {
      await axios.post("https://trcnfx.com/api/convert", {
        userId,
        fromSymbol: selectedSymbol, // The crypto being converted from
        toSymbol: "tether", // Converting to Tether/USDT
        amount: parseFloat(amount),
      });

      alert("Conversion request submitted successfully");
      setAmount("");
      setUsdtValue("");
    } catch (error) {
      console.error("Error submitting conversion request:", error);
      alert("Failed to submit conversion request");
    }
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    if (selectedCrypto) {
      try {
        const usdAmount = parseFloat(usdtValue);
        if (!isNaN(usdAmount) && usdAmount > 0) {
          const response = await axios.post("https://trcnfx.com/api/convert", {
            userId,
            fromSymbol: "tether",
            toSymbol: selectedCrypto.id,
            amount: usdAmount,
          });
          setModalMessage("Conversion successful");
          setModalIconColor("green");
          setShowMessageModal(true);
          setAmount("");
          setUsdtValue("");
          setSelectedCrypto(null);

          // Update walletData safely
          if (response.data && response.data.balances && response.data.prices) {
            setWalletData(response.data);
          }
          setRedirectAfterModal(true); // Set redirectAfterModal to true
        } else {
          alert("Invalid USD amount");
        }
      } catch (error) {
        console.error("Error during conversion:", error);
        setModalMessage("Conversion failed");
        setModalIconColor("red");
        setShowMessageModal(true);
      }
    }
  };

  const handleUsdAmountChange = (value, setCryptoAmount, setUsdAmount) => {
    setUsdAmount(value);
    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      const cryptoValue = value / walletData.prices[selectedSymbol].usd;
      setCryptoAmount(cryptoValue < 1e-8 ? "0.00" : cryptoValue.toFixed(8));
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleRechargeSubmit = async (e) => {
    e.preventDefault();

    setIsLoadingRecharge(true); // Start loading

    if (parseFloat(usdDepositAmount) <= 0 || usdDepositAmount === "") {
      alert("Amount should be greater than 0.");
      setIsLoadingRecharge(false); // Stop loading in case of error
      return;
    }

    const formData = new FormData();
    formData.append("amount", cryptoDepositAmount);
    formData.append("proof", proof);
    formData.append("userId", userId);
    formData.append("selectedSymbol", selectedSymbol);
    formData.append("uid", uid); // Add this line to include the UID in the form data

    try {
      await axios.post("https://trcnfx.com/api/deposit", formData);

      // Set success message and show the success popup
      setRechargeSuccessMessage("Recharge request submitted successfully");
      setModalMessage("Recharge request submitted successfully");
      setModalIconColor("green");
      setShowSuccessPopup(true);

      // Clear form data and close the recharge modal
      setUsdDepositAmount("");
      setCryptoDepositAmount("");
      setProof(null);
      // setShowRechargeModal(false); // Close the recharge modal
    } catch (error) {
      console.error("Error submitting deposit request:", {
        message: error.message,
        stack: error.stack,
        response: error.response ? error.response.data : null,
      });
      setModalMessage("Failed to submit deposit request");
      setModalIconColor("red");
      setShowSuccessPopup(true); // Show error popup
    } finally {
      setIsLoadingRecharge(false); // Stop loading
    }
  };

  const handleUsdDepositAmountChange = (e) => {
    const value = e.target.value;
    setUsdDepositAmount(value);
    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      const cryptoValue = value / walletData.prices[selectedSymbol].usd;
      setCryptoDepositAmount(
        cryptoValue < 1e-8 ? "0.00" : cryptoValue.toFixed(8)
      );
    }
  };

  const handleCryptoDepositAmountChange = (e) => {
    const value = e.target.value;
    setCryptoDepositAmount(value);
    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      const usdValue = value * walletData.prices[selectedSymbol].usd;
      setUsdDepositAmount(usdValue < 1e-8 ? "0.00" : usdValue.toFixed(2));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!walletData) {
    return <div>Error fetching wallet data.</div>;
  }

  const { balances, prices } = walletData || { balances: {}, prices: {} };
  const totalBalance = Object.keys(balances).reduce((acc, symbol) => {
    const price = prices[symbol]?.usd;
    if (price !== undefined) {
      return acc + balances[symbol] * price;
    }
    return acc;
  }, 0);

  const renderKycStatus = () => {
    if (kycStatus === "approved") {
      return (
        <p className="kyc-status">
          Verified{" "}
          <i className="fas fa-check-circle" style={{ color: "white" }}></i>
        </p>
      );
    }
    return null;
  };

  return (
    <div className="container">
      <header>
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            style={{
              marginRight: "10px",
              fontSize: "24px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "white",
            }}
          >
            &#8592;
          </button>
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
          {renderKycStatus()}
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
            {/* <li>
              <button className="link" onClick={() => navigate("/helpLoan")}>
                <i className="fas fa-book"></i> Help Loan
              </button>
            </li> */}
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
          <h2>Discover Seamless Crypto Trading</h2>
          <h2>With TrustCoinFX</h2>
          <p>Where Your Trust is Our Currency</p>
        </div>
        <div className="market-tabs">
          <button className="active">Wallet</button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a crypto wallet..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="market-list">
          {searchTerm ? (
            filteredCryptos.map((crypto) => (
              <div
                key={crypto.id}
                className="market-item"
                onClick={() => handleCryptoClick(crypto.symbol)}
              >
                <img
                  src={crypto.logo}
                  alt={crypto.name}
                  className="crypto-logo"
                />
                <div className="market-info">
                  <h3>{crypto.name}</h3>
                  <p>{crypto.symbol.toUpperCase()}</p>
                </div>
              </div>
            ))
          ) : (
            <>
              {primaryWallets.map((symbol) => {
                // Check if the symbol is Tether (USDT) and override the balance with the USD value
                const isTether =
                  symbol.toLowerCase() === "tether" ||
                  symbol.toLowerCase() === "usdt";
                const displayBalance = isTether
                  ? walletData.balances["tether"] // Use USD balance instead of Tether balance
                  : walletData.balances[symbol];

                const displayPrice =
                  walletData.prices[symbol]?.usd !== undefined
                    ? walletData.prices[symbol].usd
                    : 0;

                return (
                  <div
                    key={symbol}
                    className="market-item"
                    onClick={() => handleCryptoClick(symbol)}
                  >
                    <div className="market-info">
                      <div style={{ display: "flex" }}>
                        <img
                          style={{ height: "30px", width: "30px" }}
                          src={
                            walletLogos[symbol] ||
                            "https://via.placeholder.com/30"
                          }
                          alt={symbol}
                          className="crypto-logo"
                        />
                        <div>
                          <h3>
                            {cryptoShortNames[symbol.toUpperCase()] || symbol}
                          </h3>
                          <p>{isTether ? "USD" : symbol.toUpperCase()}</p>{" "}
                          {/* Show USD if it's Tether */}
                        </div>
                      </div>
                    </div>
                    <div className="market-stats">
                      <p>
                        {formatBalance(displayBalance || 0)}{" "}
                        {cryptoShortNames[symbol.toUpperCase()] || symbol}
                      </p>
                      <p>
                        USD${" "}
                        {displayPrice !== undefined
                          ? (displayBalance * displayPrice).toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                );
              })}

              <hr />
              {secondaryWallets.map((symbol) => (
                <div
                  key={symbol}
                  className="market-item"
                  style={{ display: searchTerm ? "block" : "none" }} // Show only if searched
                  onClick={() => handleCryptoClick(symbol)}
                >
                  <div className="market-info">
                    <h3>{cryptoFullNames[symbol.toUpperCase()] || symbol}</h3>{" "}
                    {/* Display full name */}
                    <p>{symbol.toUpperCase()}</p>
                  </div>
                  <div className="market-stats">
                    <p>
                      {formatBalance(walletData.balances[symbol] || 0)}{" "}
                      {symbol.toUpperCase()}
                    </p>
                    <p>
                      USD${" "}
                      {walletData.prices[symbol]?.usd !== undefined
                        ? (
                            walletData.balances[symbol] *
                            walletData.prices[symbol].usd
                          ).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {showCryptoModal && (
        <div className="modal show" id="crypto-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowCryptoModal(false)}>
              &times;
            </span>

            <div className="wallet">
              <div className="wallet-header">
                <h1>
                  {selectedSymbol === "tether"
                    ? "USDT"
                    : selectedSymbol.toUpperCase()}{" "}
                  Wallet
                </h1>
              </div>

              <div className="wallet-balance">
                <p>
                  USDT${" "}
                  {(
                    (balances[selectedSymbol] || 0) *
                    (prices[selectedSymbol]?.usd || 0)
                  ).toFixed(4)}
                </p>
                <p>
                  Available Coins: {balances[selectedSymbol] || 0}{" "}
                  {selectedSymbol.toUpperCase()}
                </p>
                <p>
                  {" "}
                  <p>
                    {frozenAmounts[selectedSymbol] && (
                      <span>
                        (Frozen: {frozenAmounts[selectedSymbol].toFixed(8)}{" "}
                        {selectedSymbol.toUpperCase()})
                      </span>
                    )}
                  </p>
                </p>
              </div>
              <div className="wallet-tabs">
                <button
                  data-tab="Receive"
                  className={selectedTab === "Receive" ? "active" : ""}
                  onClick={() => handleTabClick("Receive")}
                >
                  Receive
                </button>
                <button
                  data-tab="Send"
                  className={selectedTab === "Send" ? "active" : ""}
                  onClick={() => handleTabClick("Send")}
                >
                  Send
                </button>
                <button
                  data-tab="Convert"
                  className={selectedTab === "Convert" ? "active" : ""}
                  onClick={() => handleTabClick("Convert")}
                >
                  Convert
                </button>
              </div>
              {selectedTab === "Receive" && (
                <div id="Receive" className="tab-content active">
                  <p style={{ marginTop: "20px", marginBottom: "10px" }}>
                    Deposit Funds
                  </p>
                  <div className="wallet-buttons">
                    <span
                      className="recharge-link"
                      onClick={() => setShowRechargeModal(true)}
                      style={{ marginTop: "5px" }}
                    >
                      Recharge
                    </span>
                  </div>
                  <div
                    className="wallet-qr"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      textAlign: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    {isLoadingWalletInfo ? (
                      <p>Loading...</p>
                    ) : (
                      <>
                        <img src={walletInfo.qrCodeUrl} alt="QR Code" />
                        <p id="btc-address" style={{ marginTop: "30px" }}>
                          {walletInfo.walletAddress}
                        </p>
                        <h3
                          style={{ marginBottom: "20px" }}
                          className="copy-address"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(
                                walletInfo.walletAddress
                              );
                              setCopyButtonText("Copied!");
                              setShowCopiedMessage(true);
                              setTimeout(() => {
                                setCopyButtonText("Copy address");
                                setShowCopiedMessage(false);
                              }, 5000); // Change the text back after 5 seconds
                            } catch (error) {
                              console.error("Failed to copy address:", error);
                              alert(
                                "Failed to copy address. Please try again."
                              );
                            }
                          }}
                        >
                          {copyButtonText}
                        </h3>
                      </>
                    )}
                  </div>
                </div>
              )}

              {selectedTab === "Send" && (
                <div id="Send" className="tab-content active">
                  <p>Send Cryptocurrency</p>
                  <form onSubmit={handleSendSubmit}>
                    <div className="form-group">
                      {showSuccessPopup && (
                        <div
                          className="modal show"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "fixed",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                            zIndex: "1000",
                          }}
                        >
                          <div
                            className="modal-content"
                            style={{
                              backgroundColor: "#fefefe",
                              margin: "5% auto",
                              padding: "20px",
                              border: "1px solid #888",
                              width: "80%",
                              maxWidth: "400px",
                              borderRadius: "10px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              textAlign: "center",
                            }}
                          >
                            <span
                              className="close"
                              onClick={() => setShowSuccessPopup(false)}
                              style={{
                                color: "#aaa",
                                float: "right",
                                fontSize: "28px",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                            >
                              &times;
                            </span>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                className="success-animation"
                                style={{ marginBottom: "20px" }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill={modalIconColor}
                                  width="80px"
                                  height="80px"
                                >
                                  <path d="M0 0h24v24H0z" fill="none" />
                                  <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12s12-5.37 12-12C24 5.37 18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM10 17.2l-5.3-5.3 1.4-1.4 3.9 3.9 7.9-7.9 1.4 1.4L10 17.2z" />
                                  {modalIconColor === "red" && (
                                    <path
                                      d="M15.41 8.59L12 12l-3.41-3.41L7 10l5 5 5-5z"
                                      fill="red"
                                    />
                                  )}
                                </svg>
                              </div>
                            </div>
                            <h2>{modalMessage}</h2>
                            <button
                              onClick={() => setShowSuccessPopup(false)}
                              style={{
                                display: "block",
                                width: "100%",
                                padding: "10px",
                                background:
                                  "linear-gradient(to right, #4caf50, #81c784)",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                                marginTop: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              OK
                            </button>
                          </div>
                        </div>
                      )}
                      <label>USD Amount:</label>{" "}
                      <div
                        style={{
                          display: "flex",
                          padding: "10px 10px 10px 10px",
                        }}
                      >
                        <input
                          type="number"
                          value={usdAmount}
                          style={{ marginRight: "15px", marginLeft: "10px" }}
                          onChange={(e) => {
                            const value = e.target.value;
                            setUsdAmount(value);
                            if (
                              walletData &&
                              walletData.prices &&
                              walletData.prices[selectedSymbol]?.usd !==
                                undefined
                            ) {
                              const cryptoValue =
                                value / walletData.prices[selectedSymbol].usd;
                              setAmount(
                                cryptoValue < 1e-8 ? 0 : cryptoValue.toFixed(8)
                              );
                            }
                          }}
                          required
                        />
                        <button
                          type="button"
                          onClick={handleMax}
                          style={{ marginRight: "10px" }}
                        >
                          Max
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>{selectedSymbol.toUpperCase()} Value:</label>
                      <div
                        style={{
                          display: "flex",
                          padding: "10px 10px 10px 10px",
                        }}
                      >
                        <input
                          type="number"
                          value={amount}
                          style={{ marginRight: "15px", marginLeft: "10px" }}
                          onChange={(e) => {
                            const value = e.target.value;
                            setAmount(value);
                            if (
                              walletData &&
                              walletData.prices &&
                              walletData.prices[selectedSymbol]?.usd !==
                                undefined
                            ) {
                              const usdValue =
                                value * walletData.prices[selectedSymbol].usd;
                              setUsdAmount(
                                usdValue < 1e-8 ? "0.00" : usdValue.toFixed(2)
                              );
                            }
                          }}
                          required
                        />
                        <button
                          type="button"
                          onClick={handleMax}
                          style={{ marginRight: "10px" }}
                        >
                          Max
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Wallet Address:</label>
                      <input
                        type="text"
                        value={address}
                        style={{ width: "300px" }}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                      <button type="button" onClick={handlePaste}>
                        Paste
                      </button>
                    </div>
                    <button type="submit" className="send-button">
                      Submit
                    </button>
                  </form>
                </div>
              )}

              {selectedTab === "Convert" && (
                <div id="Convert" className="tab-content active">
                  <div className="wallet">
                    {console.log(selectedSymbol)}
                    {selectedSymbol === "tether" ? (
                      <form onSubmit={handleConvert}>
                        <p>Convert USD to Another Cryptocurrency</p>
                        {showMessageModal && (
                          <div
                            className="modal show"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "fixed",
                              top: "0",
                              left: "0",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0, 0, 0, 0.4)",
                              zIndex: "1000",
                            }}
                          >
                            <div
                              className="modal-content"
                              style={{
                                backgroundColor: "#fefefe",
                                margin: "5% auto",
                                padding: "20px",
                                border: "1px solid #888",
                                width: "80%",
                                maxWidth: "400px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                textAlign: "center",
                              }}
                            >
                              <span
                                className="close"
                                onClick={() => setShowMessageModal(false)}
                                style={{
                                  color: "#aaa",
                                  float: "right",
                                  fontSize: "28px",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                }}
                              >
                                &times;
                              </span>
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  className="success-animation"
                                  style={{ marginBottom: "20px" }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={modalIconColor} // Use the modalIconColor
                                    width="80px"
                                    height="80px"
                                  >
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12s12-5.37 12-12C24 5.37 18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM10 17.2l-5.3-5.3 1.4-1.4 3.9 3.9 7.9-7.9 1.4 1.4L10 17.2z" />
                                    {modalIconColor === "red" && (
                                      <path
                                        d="M15.41 8.59L12 12l-3.41-3.41L7 10l5 5 5-5z"
                                        fill="red"
                                      />
                                    )}
                                  </svg>
                                </div>
                              </div>
                              <h2>{modalMessage}</h2>
                              <p>
                                {modalIconColor === "green"
                                  ? "Your order has been successfully submitted."
                                  : "There was an error with your submission."}
                              </p>
                              <button
                                onClick={() => setShowMessageModal(false)}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  padding: "10px",
                                  background:
                                    "linear-gradient(to right, #4caf50, #81c784)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  marginTop: "10px",
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                OK
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="form-group">
                          <label>USD Amount:</label>
                          <div
                            style={{
                              padding: "10px 10px 10px 10px",
                              display: "flex",
                            }}
                          >
                            <input
                              type="number"
                              value={usdtValue}
                              style={{ marginRight: "10px" }}
                              onChange={(e) => handleConvertAmountChange(e)}
                              required
                            />
                            <button type="button" onClick={handleMaxConvertUSD}>
                              Max
                            </button>
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Select Cryptocurrency:</label>
                          <select
                            style={{ width: "100%", height: "50px" }}
                            value={selectedCrypto?.id || ""}
                            onChange={(e) =>
                              setSelectedCrypto(
                                cryptos.find(
                                  (crypto) => crypto.id === e.target.value
                                )
                              )
                            }
                            required
                          >
                            <option value="">Select...</option>
                            {cryptos.map((crypto) => (
                              <option key={crypto.id} value={crypto.id}>
                                {crypto.symbol.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button type="submit" className="convert-button">
                          Convert
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleConvertSubmit}>
                        <p>Convert {selectedSymbol.toUpperCase()} to USDT</p>
                        {showMessageModal && (
                          <div
                            className="modal show"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "fixed",
                              top: "0",
                              left: "0",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0, 0, 0, 0.4)",
                              zIndex: "1000",
                            }}
                          >
                            <div
                              className="modal-content"
                              style={{
                                backgroundColor: "#fefefe",
                                margin: "5% auto",
                                padding: "20px",
                                border: "1px solid #888",
                                width: "80%",
                                maxWidth: "400px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                textAlign: "center",
                              }}
                            >
                              <span
                                className="close"
                                onClick={() => setShowMessageModal(false)}
                                style={{
                                  color: "#aaa",
                                  float: "right",
                                  fontSize: "28px",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                }}
                              >
                                &times;
                              </span>
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  className="success-animation"
                                  style={{ marginBottom: "20px" }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={modalIconColor} // Use the modalIconColor
                                    width="80px"
                                    height="80px"
                                  >
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12s12-5.37 12-12C24 5.37 18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM10 17.2l-5.3-5.3 1.4-1.4 3.9 3.9 7.9-7.9 1.4 1.4L10 17.2z" />
                                    {modalIconColor === "red" && (
                                      <path
                                        d="M15.41 8.59L12 12l-3.41-3.41L7 10l5 5 5-5z"
                                        fill="red"
                                      />
                                    )}
                                  </svg>
                                </div>
                              </div>
                              <h2>{modalMessage}</h2>
                              <p>
                                {modalIconColor === "green"
                                  ? "Your order has been successfully submitted."
                                  : "There was an error with your submission."}
                              </p>
                              <button
                                onClick={() => setShowMessageModal(false)}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  padding: "10px",
                                  background:
                                    "linear-gradient(to right, #4caf50, #81c784)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  marginTop: "10px",
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                OK
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="form-group">
                          <label>USD Amount:</label>
                          <input
                            type="number"
                            value={usdtValue}
                            onChange={(e) => handleConvertAmountChange(e)}
                            required
                          />
                          <button type="button" onClick={handleMaxConvertUSD}>
                            Max
                          </button>
                        </div>
                        <div className="form-group">
                          <label>Asset Value:</label>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => {
                              const value = e.target.value;
                              setAmount(value);
                              if (
                                walletData &&
                                walletData.prices &&
                                walletData.prices[selectedSymbol]?.usd !==
                                  undefined
                              ) {
                                const usdValue =
                                  value * walletData.prices[selectedSymbol].usd;
                                setUsdtValue(usdValue.toFixed(2));
                              }
                            }}
                            placeholder="0"
                            className="input-field small-input"
                            required
                          />
                          <button
                            type="button"
                            onClick={handleMaxConvertAssetValue}
                            style={{ marginRight: "10px" }}
                          >
                            Max
                          </button>
                        </div>
                        <div className="wallet-buttons">
                          <span className="currency-tag">To</span>
                          <span className="currency">USDT</span>
                          <input
                            type="text"
                            value={usdtValue}
                            placeholder="0"
                            className="input-field small-input"
                            readOnly
                          />
                        </div>
                        <button type="submit" className="convert-button">
                          Proceed to pin
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showRechargeModal && (
        <div
          className="modal show"
          id="recharge-modal"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            zIndex: 1000,
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            overflow: "auto",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fefefe",
              padding: "20px",
              border: "1px solid #888",
              width: "80%",
              maxWidth: "400px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxHeight: "80%", // Add maxHeight for scrolling
              overflowY: "auto", // Enable vertical scrolling
            }}
          >
            <span
              className="close"
              onClick={() => setShowRechargeModal(false)}
              style={{
                color: "#aaa",
                fontSize: "28px",
                fontWeight: "bold",
                position: "absolute",
                top: "10px",
                right: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </span>
            <h2>{selectedSymbol.toUpperCase()} Recharge </h2>

            {showSuccessPopup && (
              <div
                className="modal show"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "fixed",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  zIndex: "1000",
                }}
              >
                <div
                  className="modal-content"
                  style={{
                    backgroundColor: "#fefefe",
                    margin: "5% auto",
                    padding: "20px",
                    border: "1px solid #888",
                    width: "80%",
                    maxWidth: "400px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                  }}
                >
                  <span
                    className="close"
                    onClick={() => setShowSuccessPopup(false)}
                    style={{
                      color: "#aaa",
                      float: "right",
                      fontSize: "28px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    &times;
                  </span>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="success-animation"
                      style={{ marginBottom: "20px" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={modalIconColor}
                        width="80px"
                        height="80px"
                      >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12s12-5.37 12-12C24 5.37 18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM10 17.2l-5.3-5.3 1.4-1.4 3.9 3.9 7.9-7.9 1.4 1.4L10 17.2z" />
                        {modalIconColor === "red" && (
                          <path
                            d="M15.41 8.59L12 12l-3.41-3.41L7 10l5 5 5-5z"
                            fill="red"
                          />
                        )}
                      </svg>
                    </div>
                  </div>
                  <h2>{modalMessage}</h2>
                  <button
                    onClick={() => {
                      setShowSuccessPopup(false);
                      setRechargeSuccessMessage(""); // Reset the message
                      setShowRechargeModal(false); // Close the modal
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px",
                      background: "linear-gradient(to right, #4caf50, #81c784)",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                      marginTop: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

            {/* The existing form content remains as it is */}
            {!showSuccessPopup && (
              <form onSubmit={handleRechargeSubmit}>
                <div className="form-group">
                  <label>Currency</label>
                  <input
                    type="text"
                    value={selectedSymbol.toUpperCase()}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Network</label>
                  <input
                    type="text"
                    value={selectedSymbol.toUpperCase()}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={walletInfo.walletAddress}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>USD Amount:</label>
                  <input
                    type="number"
                    value={usdDepositAmount}
                    onChange={handleUsdDepositAmountChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{selectedSymbol.toUpperCase()} Amount:</label>
                  <input
                    type="number"
                    value={cryptoDepositAmount}
                    onChange={handleCryptoDepositAmountChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Upload Screenshot</label>
                  <div
                    className="upload-screenshot"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    <span className="upload-icon">&#128247;</span>
                    <p id="upload-text">
                      Please upload a screenshot of your successful transfer
                    </p>
                    <img
                      id="uploaded-image"
                      style={{
                        display: "none",
                        maxWidth: "100%",
                        height: "auto",
                      }}
                      alt="uploaded"
                    />
                  </div>
                  <input
                    type="file"
                    id="file-upload"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        document.getElementById("uploaded-image").src =
                          event.target.result;
                        document.getElementById(
                          "uploaded-image"
                        ).style.display = "block";
                        document.getElementById("upload-text").style.display =
                          "none";
                      };
                      reader.readAsDataURL(file);
                      setProof(file);
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="submit-button"
                  style={{
                    backgroundColor: "#4caf50",
                    color: "white",
                    position: "relative",
                  }}
                  disabled={isLoadingRecharge} // Disable the button when loading
                >
                  {isLoadingRecharge && (
                    <div
                      className="loading-overlay"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1000,
                      }}
                    >
                      <div
                        className="loading-spinner"
                        style={{
                          border: "4px solid #f3f3f3",
                          borderTop: "4px solid #3498db",
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                    </div>
                  )}
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {showLoginModal && <Login closeModal={() => setShowLoginModal(false)} />}

      {showSignupModal && (
        <SignupModal closeModal={() => setShowSignupModal(false)} />
      )}
    </div>
  );
};

export default WalletDashboard;
