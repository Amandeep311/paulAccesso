import { useState } from "react";
import { useNavigate } from "react-router";
import { CameraCapture } from "./CameraCapture";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useApp } from "./context/AppContext";
import { CheckCircle2, XCircle } from "lucide-react";

export function VisitorRegistration() {
  const navigate = useNavigate();
  const { registerVisitor, employees, loading } = useApp();
  const [capturedImage, setCapturedImage] = useState("");
  const [formData, setFormData] = useState({
    name: "", mobile: "", email: "", company: "", address: "", personToMeet: "", purpose: ""
  });
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.mobile) newErrors.mobile = "Mobile is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!selectedEmployee) newErrors.personToMeet = "Please select person to meet";
    if (!formData.purpose) newErrors.purpose = "Purpose is required";
    if (!capturedImage) newErrors.photo = "Photo is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const visitorData = {
      ...formData,
      personToMeet: selectedEmployee,
      photo: capturedImage,
    };

    const result = await registerVisitor(visitorData);
    if (result) {
      setTimeout(() => navigate("/log"), 1500);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", mobile: "", email: "", company: "", address: "", personToMeet: "", purpose: "" });
    setSelectedEmployee("");
    setCapturedImage("");
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-blue-600">Register New Visitor</h2>
        <p className="text-gray-700 dark:text-gray-300 mt-2">Capture visitor information and photo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visitor Information</CardTitle>
          <CardDescription>Please fill in all required fields</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="mb-2 block">Visitor Photo *</Label>
              <CameraCapture onCapture={setCapturedImage} capturedImage={capturedImage} />
              {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Full Name *</Label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label className="mb-2 block">Mobile Number *</Label>
                <Input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter mobile number" />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>
              <div>
                <Label className="mb-2 block">Email Address *</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label className="mb-2 block">Company</Label>
                <Input name="company" value={formData.company} onChange={handleChange} placeholder="Company name" />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Address</Label>
              <Textarea name="address" value={formData.address} onChange={handleChange} rows={3} placeholder="Full address" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Person to Meet *</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.email}>
                        {emp.name} - {emp.designation || "Employee"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.personToMeet && <p className="text-red-500 text-sm mt-1">{errors.personToMeet}</p>}
              </div>
              <div>
                <Label className="mb-2 block">Purpose of Visit *</Label>
                <Input name="purpose" value={formData.purpose} onChange={handleChange} placeholder="Purpose of visit" />
                {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Registering..." : <><CheckCircle2 className="w-4 h-4 mr-2" /> Register Visitor</>}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                <XCircle className="w-4 h-4 mr-2" /> Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}