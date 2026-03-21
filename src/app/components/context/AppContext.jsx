import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [visitors, setVisitors] = useState(() => {
    const saved = localStorage.getItem("visitors");
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("visitors", JSON.stringify(visitors));
  }, [visitors]);

  const addVisitor = (visitor) => {
    setVisitors((prev) => [...prev, visitor]);
    addNotification({
      type: "success",
      message: `${visitor.name} has been registered`,
      description: `Notification sent to ${visitor.personToMeet}`,
    });
  };

  const updateVisitor = (id, updates) => {
    setVisitors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, ...notification }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const getStats = () => {
    const today = new Date().toDateString();
    const todayVisitors = visitors.filter(
      (v) => new Date(v.checkInTime).toDateString() === today
    );
    const activeNow = todayVisitors.filter((v) => !v.checkOutTime).length;
    const checkedOut = todayVisitors.filter((v) => v.checkOutTime).length;

    return {
      totalToday: todayVisitors.length,
      activeNow,
      checkedOut,
    };
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        visitors,
        addVisitor,
        updateVisitor,
        notifications,
        getStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};