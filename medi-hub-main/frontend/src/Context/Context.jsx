import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const Context = createContext();

const AppContext = ({ children }) => {
  const [isAuthe, setIsAuthe] = useState(false);
  const [user, setUser] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthe(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthe(false);
      }
    } else {
      // Clear any partial data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthe(false);
    }
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthe(false);
    toast.success("Logged out successfully!");
  };

  return (
    <Context.Provider
      value={{
        isAuthe,
        setIsAuthe,
        user,
        setUser,
        handleLogout
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppContext;
