import "./Webpage.css";
import { useState } from "react";
import checkUrlSafety from "./Api/checkUrlSafety";

function WebPage() {
  const [url, setUrl] = useState("https://");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  async function handleCheck() {

    if (!url) return alert("Please enter a URL first!");
    setLoading(true);
    setResult(null);

    try {
      const data = await checkUrlSafety(url);

      if (data.status === "invalid-domain") {
        setResult("⚠️ Invalid or unrecognized domain. Please enter a valid website.");
      } else if (!data.safe) {
        setResult("🚨 Warning! This site may be malicious or phishing.");
      } else {
        setResult("✅ This website is safe to visit!");
      }
    } catch (err) {
      console.error(err);
      setResult("❌ Error checking this URL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <div className="design-container">
        <p className="header-text">Anti-Fish</p>

        


        <div className="link-input-container">
          <input
            className="link-input"
            value={url}
            type="text"
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL: https://"
          />
          <button className="link-input-button" onClick={handleCheck} disabled={loading}>
            <svg className="searchbar-logo"></svg>
          </button>
        </div>

         

        <div className="result-container">
          {loading ? "Checking..." : result && (
            <p style={{ marginTop: "20px", fontSize: "18px" }}>{result}</p>
          )}
        </div>


          <div className = "submit-div">
            Anti-Phishing Website Prototype made by BSCS Group 3 
          </div>

          

      </div>
    </div>
  );
}

export default WebPage;
