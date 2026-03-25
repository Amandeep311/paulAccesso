import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [visitors, setVisitors] = useState([]);
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8080/api";

  // Dark mode effect
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Fetch current user on refresh if token exists but user doesn't
  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser();
    }
  }, [token]);

  // Fetch data when token or user role changes
  useEffect(() => {
    if (token && user) {
      fetchVisitors();
      fetchEmployees();
      if (user?.role === "ADMIN") {
        fetchUsers();
      }
    }
  }, [token, user?.role]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    }
  };

  const fetchVisitors = async () => {
    try {
      const response = await fetch(`${API_BASE}/visitors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setVisitors(data);
      }
    } catch (error) {
      console.error("Failed to fetch visitors:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/employees`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const fetchUsers = async () => {
    if (!token || user?.role !== "ADMIN") return;
    try {
      const response = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const sendOtp = async (email) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        addNotification({ type: "success", message: data.message });
        return true;
      } else {
        addNotification({ type: "error", message: data.status===500? 'Not an Admin or Receptionist': data.error || "Internal Server Error" });
        return false;
      }
    } catch (error) {
      addNotification({ type: "error", message: "Failed to send OTP" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        addNotification({ type: "success", message: "Login successful!" });
        return true;
      } else {
        addNotification({ type: "error", message: data.message || "Invalid OTP" });
        return false;
      }
    } catch (error) {
      addNotification({ type: "error", message: "Failed to verify OTP" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registerVisitor = async (visitorData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/visitors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(visitorData),
      });
      const data = await response.json();
      if (response.ok) {
        setVisitors([data, ...visitors]);
        addNotification({
          type: "success",
          message: `${data.name} registered successfully!`,
          description: `Notification sent to ${data.personToMeet}`,
        });
        return data;
      } else {
        addNotification({ type: "error", message: data.message || "Registration failed" });
        return null;
      }
    } catch (error) {
      addNotification({ type: "error", message: "Failed to register visitor" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkoutVisitor = async (id, checkoutPhoto = null) => {
    setLoading(true);
    try {
      const body = checkoutPhoto ? { checkoutPhoto } : {};
      const response = await fetch(`${API_BASE}/visitors/${id}/checkout`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        setVisitors(visitors.map(v => v.id === id ? data : v));
        addNotification({ type: "success", message: `${data.name} checked out` });
        return data;
      } else {
        addNotification({ type: "error", message: "Checkout failed" });
        return null;
      }
    } catch (error) {
      addNotification({ type: "error", message: "Failed to checkout" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        setUsers([...users, data]);
        addNotification({ type: "success", message: `User ${data.name} created` });
        return data;
      } else {
        addNotification({ type: "error", message: data.message || "Failed to create user" });
        return null;
      }
    } catch (error) {
      addNotification({ type: "error", message: "Failed to create user" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.map(u => u.id === id ? data : u));
        addNotification({ type: "success", message: `User ${data.name} updated` });
        return data;
      } else {
        addNotification({ type: "error", message: data.message || "Failed to update user" });
        return null;
      }
    } catch (error) {
      addNotification({ type: "error", message: "Failed to update user" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
        addNotification({ type: "success", message: "User deleted successfully" });
        return true;
      } else {
        addNotification({ type: "error", message: "Failed to delete user" });
        return false;
      }
    } catch (error) {
      addNotification({ type: "error", message: "Failed to delete user" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, ...notification }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setVisitors([]);
    setUsers([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    addNotification({ type: "info", message: "Logged out successfully" });
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const getStats = () => {
    const today = new Date().toDateString();
    const todayVisitors = visitors.filter(v => 
      new Date(v.checkInTime).toDateString() === today
    );
    const activeNow = todayVisitors.filter(v => v.active).length;
    const checkedOut = todayVisitors.filter(v => !v.active).length;
    return { totalToday: todayVisitors.length, activeNow, checkedOut };
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        token,
        user,
        visitors,
        users,
        employees,
        loading,
        API_BASE,
        sendOtp,
        verifyOtp,
        registerVisitor,
        checkoutVisitor,
        createUser,
        updateUser,
        deleteUser,
        logout,
        getStats,
        notifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};