import React, { useEffect } from "react";

const GoogleSignInButton = () => {
  useEffect(() => {
    // Dynamically load the Google script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup the script on unmount
    };
  }, []);
 console.log(process.env.GOOGLE_CLIENT_ID)
  return (
    <div>

      <div
        id="g_id_onload"
        data-client_id={process.env.GOOGLE_CLIENT_ID} 
        data-login_uri= {process.env.GOOGLE_REDIRECT_URL}
      ></div>
      <div
        className="g_id_signin" 
        data-type="standard"
        data-size="large"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"  
        data-theme = "filled_black"
        
      ></div>
    </div>
  );
};

export default GoogleSignInButton;