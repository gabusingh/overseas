const translation = (selectedLanguage) => {
    return {
      //   header translation start
      downloadApp:
        selectedLanguage === "english"
          ? "Download App"
          : selectedLanguage === "hindi"
          ? "ऐप डाउनलोड करें"
          : "অ্যাপ ডাউনलोड করুন",
  
      //   header translation end
    };
  };
  
  export default translation;

