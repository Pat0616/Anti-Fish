export async function checkUrlSafety(urlToCheck: string) {
  const apiKey = "";
  const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

  // ✅ LAYER 1: URL VALIDATION using URL parser
  function isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url.startsWith("http") ? url : "https://" + url);
      return !!parsed.hostname && parsed.hostname.includes(".");
    } catch {
      return false;
    }
  }

  if (!isValidUrl(urlToCheck)) {
    return { safe: false, status: "invalid-domain" };
  }

  // normalize to include https://
  const normalizedUrl = urlToCheck.startsWith("http")
    ? urlToCheck
    : `https://${urlToCheck}`;

  // ✅ LAYER 2: SAFE BROWSING API
  const requestBody = {
    client: { clientId: "anti-fish-checker", clientVersion: "1.0" },
    threatInfo: {
      threatTypes: [
        "MALWARE",
        "SOCIAL_ENGINEERING",
        "UNWANTED_SOFTWARE",
        "POTENTIALLY_HARMFUL_APPLICATION",
      ],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url: normalizedUrl }],
    },
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) throw new Error(`Error: ${response.status}`);

  const data = await response.json();

  if (data.matches && data.matches.length > 0) {
    return { safe: false, threats: data.matches };
  }

  // No matches → safe but not listed
  return { safe: true, status: "not-recognized" };
}
