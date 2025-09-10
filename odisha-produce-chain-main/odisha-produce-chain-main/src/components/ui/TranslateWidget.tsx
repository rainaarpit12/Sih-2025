import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function TranslateWidget() {
  useEffect(() => {
    if (!document.querySelector("#google-translate-script")) {
      const addScript = document.createElement("script");
      addScript.id = "google-translate-script";
      addScript.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(addScript);
    }

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
    };
  }, []);

  const changeLanguage = (lang: string) => {
    const cookieValue = `/en/${lang}`;
    document.cookie = `googtrans=${cookieValue};path=/;domain=${window.location.hostname}`;
    window.location.reload();
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-md p-2 rounded flex items-center space-x-2">
      {/* Google Translate hidden div */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* Select box */}
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="ta">தமிழ்</option>
        <option value="or">ଓଡ଼ିଆ</option>
      </select>
    </div>
  );
}
