import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { CameraCapture } from "../CameraCapture";
import { useApp } from "../context/AppContext";
import { UserPlus, Edit, Trash2, Users, Camera, X } from "lucide-react";

export function UserManagement() {
  const {
    users,
    createUser,
    updateUser,
    deleteUser,
    loading,
    user: currentUser,
    API_BASE,
    token,
  } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [formData, setFormData] = useState({
    empId: "",
    name: "",
    email: "",
    mobile: "",
    designation: "",
    role: "EMPLOYEE",
    photo: "",
  });
  const [showCamera, setShowCamera] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [customDesignation, setCustomDesignation] = useState("");

  // Fetch all unique designations from users
  useEffect(() => {
    if (users && users.length > 0) {
      const uniqueDesignations = [
        ...new Set(users.map((u) => u.designation).filter((d) => d)),
      ];
      setDesignations(uniqueDesignations.sort());
    }
  }, [users]);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        empId: user.empId || "",
        name: user.name,
        email: user.email,
        mobile: user.mobile || "",
        designation: user.designation || "",
        role: user.role,
        photo: user.photo || "",
      });
      // Check if designation is custom (not in the list)
      if (user.designation && !designations.includes(user.designation)) {
        setShowCustomInput(true);
        setCustomDesignation(user.designation);
      } else {
        setShowCustomInput(false);
        setCustomDesignation("");
      }
    } else {
      setEditingUser(null);
      setFormData({
        empId: "",
        name: "",
        email: "",
        mobile: "",
        designation: "",
        role: "EMPLOYEE",
        photo: "",
      });
      setShowCustomInput(false);
      setCustomDesignation("");
    }
    setShowModal(true);
  };

  const handleDesignationChange = (value) => {
    if (value === "Other") {
      setShowCustomInput(true);
      setFormData({ ...formData, designation: "" });
    } else {
      setShowCustomInput(false);
      setFormData({ ...formData, designation: value });
      setCustomDesignation("");
    }
  };

  const handleCustomDesignationChange = (e) => {
    const value = e.target.value;
    setCustomDesignation(value);
    setFormData({ ...formData, designation: value });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.empId) {
      alert("Employee ID is required");
      return;
    }
    if (!formData.name) {
      alert("Name is required");
      return;
    }
    if (!formData.email) {
      alert("Email is required");
      return;
    }

    const submitData = {
      empId: formData.empId,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile || "",
      designation: formData.designation || customDesignation,
      role: formData.role,
      photo: formData.photo,
    };

    if (editingUser) {
      await updateUser(editingUser.id, submitData);
    } else {
      await createUser(submitData);
    }
    setShowModal(false);
    setEditingUser(null);
    setShowCustomInput(false);
    setCustomDesignation("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
  };

  const handlePhotoCapture = (photo) => {
    setFormData({ ...formData, photo });
    setShowCamera(false);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "RECEPTIONIST":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return "👑";
      case "RECEPTIONIST":
        return "🎫";
      default:
        return "👤";
    }
  };

  const getDesignationBadgeColor = (designation) => {
    // Dynamic color based on designation - no hardcoding
    const colors = [
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    ];
    // Use hash of designation to pick a color consistently
    const hash = designation
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">
            Admin Panel
          </h2>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-1 sm:mt-2">
            Manage users and system settings
          </p>
        </div>

        {/* User Management Card */}
        <Card className="mx-2 sm:mx-0">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <CardTitle className="text-xl sm:text-2xl">
                User Management
              </CardTitle>
              <CardDescription className="text-sm">
                Manage system users and their roles
              </CardDescription>
            </div>
            {currentUser?.role === "ADMIN" && (
              <Button
                onClick={() => handleOpenModal()}
                className="bg-blue-600 w-full sm:w-auto"
                size="sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add User</span>
                <span className="sm:hidden">Add</span>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
                  No users found
                </div>
              ) : (
                users.map((u) => (
                  <div
                    key={u.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg border hover:shadow-md transition gap-3 sm:gap-4"
                  >
                    {/* User Info Section */}
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      {u.photo ? (
                        <img
                          src={u.photo}
                          alt={u.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                          {getRoleIcon(u.role)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm sm:text-base truncate">
                          {u.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                          Emp ID: {u.empId} | {u.email}
                        </p>
                        {u.designation && (
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getDesignationBadgeColor(u.designation)}`}
                          >
                            {u.designation}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions Section */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getRoleBadgeColor(u.role)}`}
                      >
                        {u.role === "ADMIN"
                          ? "Admin"
                          : u.role === "RECEPTIONIST"
                            ? "Receptionist"
                            : "Employee"}
                      </span>
                      {currentUser?.role === "ADMIN" && u.role !== "ADMIN" && (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenModal(u)}
                            className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                          >
                            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 h-8 w-8 sm:h-9 sm:w-9 p-0"
                            onClick={() => handleDelete(u.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit User Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-md mx-2 sm:mx-0 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {/* Profile Photo Section */}
            <div>
              <Label className="text-sm font-medium">Profile Photo</Label>
              <div className="mt-2">
                {formData.photo ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.photo}
                      alt="Profile"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                    />
                    <button
                      onClick={() => setShowCamera(true)}
                      className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, photo: "" })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCamera(true)}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 sm:px-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Employee ID Field */}
            <div>
              <Label className="text-sm font-medium">
                Employee ID <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.empId}
                onChange={(e) =>
                  setFormData({ ...formData, empId: e.target.value })
                }
                placeholder="e.g., F023, E6955, R007"
                className="mt-1 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Unique Employee ID (e.g., F023, E6955, R007)
              </p>
            </div>

            {/* Name Field */}
            <div>
              <Label className="text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Full name"
                className="mt-1 text-sm"
              />
            </div>

            {/* Email Field */}
            <div>
              <Label className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@company.com"
                className="mt-1 text-sm"
              />
            </div>

            {/* Mobile Field (Optional) */}
            <div>
              <Label className="text-sm font-medium">
                Mobile Number{" "}
                <span className="text-gray-400 text-xs ml-1">(Optional)</span>
              </Label>
              <Input
                type="tel"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                placeholder="Enter mobile number"
                className="mt-1 text-sm"
              />
            </div>

            {/* Designation Field - Dynamic from existing users */}
            <div>
              <Label className="text-sm font-medium">Designation</Label>
              <Select
                value={showCustomInput ? "Other" : formData.designation}
                onValueChange={handleDesignationChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {/* Show existing designations from database */}
                  {designations.map((des) => (
                    <SelectItem key={des} value={des}>
                      {des}
                    </SelectItem>
                  ))}
                  <SelectItem value="Other">Other (Custom)</SelectItem>
                </SelectContent>
              </Select>

              {showCustomInput && (
                <div className="mt-2">
                  <Input
                    value={customDesignation}
                    onChange={handleCustomDesignationChange}
                    placeholder="Enter custom designation"
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a new designation not listed above
                  </p>
                </div>
              )}
            </div>

            {/* Role Field */}
            <div>
              <Label className="text-sm font-medium">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full text-sm sm:text-base"
              size="default"
            >
              {loading
                ? "Saving..."
                : editingUser
                  ? "Update User"
                  : "Create User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera Modal */}
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-md mx-2 sm:mx-0 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Take Profile Photo
            </DialogTitle>
          </DialogHeader>
          <CameraCapture
            onCapture={handlePhotoCapture}
            capturedImage={formData.photo}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
