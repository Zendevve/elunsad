
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This is a redirect component to ensure we use only one SignIn component
const SignInRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("[SignInRedirect] Redirecting to canonical signin page");
    navigate("/signin", { replace: true });
  }, [navigate]);
  
  return null;
};

export default SignInRedirect;
