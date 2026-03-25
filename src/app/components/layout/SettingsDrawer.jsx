import { X, Moon, Sun, Bell, Shield, User } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../ui/button";

export function SettingsDrawer({ open, onClose }) {
  const { darkMode, toggleDarkMode, user } = useApp();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-blue-600">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Profile</h3>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                {user?.photo ? (
                  <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
                <div>
                  <p className="font-medium">{user?.name || user?.email}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  {user?.designation && <p className="text-xs text-gray-400">{user.designation}</p>}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Appearance</h3>
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </div>
              <span className="text-sm text-gray-500">{darkMode ? "Switch to light" : "Switch to dark"}</span>
            </button>
          </div>

          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive visitor notifications</p>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Security</h3>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Data Privacy</p>
                  <p className="text-xs text-gray-500">All data stored locally</p>
                </div>
              </div>
            </div>
          </div> */}

          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </>
  );
}