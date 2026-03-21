import { X, Moon, Sun, Monitor, Bell, Shield } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../ui/button";

export function SettingsDrawer({ open, onClose }) {
  const { darkMode, toggleDarkMode } = useApp();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Appearance Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Appearance
            </h3>
            <div className="space-y-3">
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <span className="text-gray-700 dark:text-gray-300">
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {darkMode ? "Switch to light" : "Switch to dark"}
                </span>
              </button>
            </div>
          </div>
          
          {/* Notifications Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notifications
            </h3>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Notifications
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive email when visitors check in
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Security
            </h3>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data Privacy
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    All visitor data is stored locally on your device
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}