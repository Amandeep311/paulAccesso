import { useApp } from "../context/AppContext";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useEffect } from "react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

export function Toaster() {
  const { notifications } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const Icon = icons[notification.type] || Info;
        return (
          <div
            key={notification.id}
            className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[300px] max-w-md animate-in slide-in-from-right-full duration-300"
          >
            <Icon className={`w-5 h-5 ${
              notification.type === "success" ? "text-green-500" :
              notification.type === "error" ? "text-red-500" :
              "text-blue-500"
            }`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {notification.message}
              </p>
              {notification.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {notification.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}