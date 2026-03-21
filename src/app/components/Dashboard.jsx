import { Link } from "react-router";
import { UserPlus, ClipboardList, Users, Clock, CheckCircle2, UserCheck, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { useApp } from "./context/AppContext";

export function Dashboard() {
  const { visitors, getStats } = useApp();
  const [stats, setStats] = useState({
    totalToday: 0,
    activeNow: 0,
    checkedOut: 0,
  });
  const [recentVisitors, setRecentVisitors] = useState([]);

  useEffect(() => {
    const today = new Date().toDateString();
    const todayVisitors = visitors.filter(v => 
      new Date(v.checkInTime).toDateString() === today
    );
    
    const active = todayVisitors.filter(v => !v.checkOutTime).length;
    const checkedOut = todayVisitors.filter(v => v.checkOutTime).length;

    setStats({
      totalToday: todayVisitors.length,
      activeNow: active,
      checkedOut: checkedOut,
    });

    setRecentVisitors(todayVisitors.slice(-5).reverse());
  }, [visitors]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mt-2 text-lg">
          Welcome to Paul Accesso - Visitor Management System
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Today's Visitors
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {stats.totalToday}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Total check-ins today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Now
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {stats.activeNow}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Visitors on premises</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Checked Out
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
              <LogOut className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {stats.checkedOut}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Completed visits today</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/register" className="block">
            <Button className="w-full h-auto py-6 flex items-center justify-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-base">Register New Visitor</p>
                <p className="text-sm opacity-90">Add a new visitor entry</p>
              </div>
            </Button>
          </Link>
          <Link to="/log" className="block">
            <Button className="w-full h-auto py-6 flex items-center justify-start gap-4 bg-cyan-600 hover:bg-cyan-700">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-base">View Visitor Log</p>
                <p className="text-sm opacity-90">Check all visitor records</p>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Visitors */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Recent Visitors</CardTitle>
              <CardDescription>
                Latest visitor check-ins
              </CardDescription>
            </div>
            <Link to="/log">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentVisitors.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">No visitors yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Register your first visitor to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentVisitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-gray-800/50 dark:to-gray-700/50 border border-blue-100 dark:border-gray-700 hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden ring-2 ring-blue-200 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
                    <img
                      src={visitor.photo}
                      alt={visitor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{visitor.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Meeting: {visitor.personToMeet}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(visitor.checkInTime).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    {visitor.checkOutTime ? (
                      <Badge variant="secondary">
                        Checked Out
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-600 text-white">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}