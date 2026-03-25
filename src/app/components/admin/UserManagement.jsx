import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { CameraCapture } from "../CameraCapture";
import { useApp } from "../context/AppContext";
import { UserPlus, Edit, Trash2, Users, Camera, X, Plus } from "lucide-react";

// Designation options
const DESIGNATIONS = [
  "CEO",
  "Managing Director",
  "Business Head",
  "AVP",
  "Senior Manager",
  "Manager",
  "Team Lead",
  "Senior Engineer",
  "Engineer",
  "Associate",
  "Intern",
  "Other"
];

export function UserManagement() {
  const { users, createUser, updateUser, deleteUser, loading, user: currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [customDesignation, setCustomDesignation] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    role: "EMPLOYEE",
    photo: "",
  });
  const [showCamera, setShowCamera] = useState(false);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        designation: user.designation || "",
        role: user.role,
        photo: user.photo || "",
      });
      // Check if designation is custom
      if (user.designation && !DESIGNATIONS.includes(user.designation)) {
        setShowCustomInput(true);
        setCustomDesignation(user.designation);
      } else {
        setShowCustomInput(false);
        setCustomDesignation("");
      }
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
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
    if (!formData.name || !formData.email) {
      alert("Name and email are required");
      return;
    }
    const submitData = {
      ...formData,
      designation: formData.designation || customDesignation
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
      case "ADMIN": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "RECEPTIONIST": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN": return "👑";
      case "RECEPTIONIST": return "🎫";
      default: return "👤";
    }
  };

  const getDesignationBadgeColor = (designation) => {
    const seniorRoles = ["CEO", "Managing Director", "Business Head", "AVP"];
    const midRoles = ["Senior Manager", "Manager", "Team Lead"];
    if (seniorRoles.includes(designation)) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    if (midRoles.includes(designation)) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-blue-600">Admin Panel</h2>
          <p className="text-gray-700 dark:text-gray-300 mt-2">Manage users and system settings</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and their roles</CardDescription>
            </div>
            {currentUser?.role === "ADMIN" && (
              <Button onClick={() => handleOpenModal()} className="bg-blue-600">
                <UserPlus className="w-4 h-4 mr-2" /> Add User
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No users found</div>
              ) : (
                users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      {u.photo ? (
                        <img src={u.photo} alt={u.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">
                          {getRoleIcon(u.role)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
                        {u.designation && (
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getDesignationBadgeColor(u.designation)}`}>
                            {u.designation}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(u.role)}`}>
                        {u.role}
                      </span>
                      {currentUser?.role === "ADMIN" && u.role !== "ADMIN" && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => handleOpenModal(u)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(u.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Profile Photo</Label>
              <div className="mt-2">
                {formData.photo ? (
                  <div className="relative inline-block">
                    <img src={formData.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                    <button
                      onClick={() => setShowCamera(true)}
                      className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, photo: "" })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCamera(true)}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Camera className="w-4 h-4" /> Take Photo
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <Label>Name *</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="Full name"
              />
            </div>
            
            <div>
              <Label>Email *</Label>
              <Input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                placeholder="email@company.com"
              />
            </div>
            
            <div>
              <Label>Designation</Label>
              <Select 
                value={showCustomInput ? "Other" : formData.designation} 
                onValueChange={handleDesignationChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {DESIGNATIONS.map(des => (
                    <SelectItem key={des} value={des}>{des}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {showCustomInput && (
                <div className="mt-2">
                  <Input 
                    value={customDesignation} 
                    onChange={handleCustomDesignationChange}
                    placeholder="Enter custom designation"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">e.g., Chief Technology Officer, VP Engineering, etc.</p>
                </div>
              )}
            </div>
            
            <div>
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? "Saving..." : editingUser ? "Update User" : "Create User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Take Profile Photo</DialogTitle>
          </DialogHeader>
          <CameraCapture onCapture={handlePhotoCapture} capturedImage={formData.photo} />
        </DialogContent>
      </Dialog>
    </>
  );
}