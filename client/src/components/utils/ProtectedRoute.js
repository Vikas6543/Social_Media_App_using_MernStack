import { useEffect } from "react";

const ProtectedRoute = ({ user, children }) => {
  useEffect(() => {
    if (!user) {
      window.location.href = "/";
    }
  }, [user]);

  return children;
};

export default ProtectedRoute;
