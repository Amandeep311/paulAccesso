import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { CameraCapture } from "./CameraCapture";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CheckCircle2, XCircle, Upload } from "lucide-react";
import { useApp } from "./context/AppContext";

const employees = [
  { id: "1", name: "John Smith", department: "CEO" },
  { id: "2", name: "Sarah Johnson", department: "HR Manager" },
  { id: "3", name: "Michael Brown", department: "IT Director" },
  { id: "4", name: "Emily Davis", department: "Marketing Head" },
  { id: "5", name: "David Wilson", department: "Operations Manager" },
];

const purposes = [
  "Business Meeting",
  "Interview",
  "Delivery",
  "Maintenance",
  "Personal Visit",
  "Other",
];

export function VisitorRegistration() {
  const navigate = useNavigate();
  const { addVisitor } = useApp();
  const [capturedImage, setCapturedImage] = useState("");
  const [idProof, setIdProof] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

  const handlePhotoCapture = (image) => {
    setCapturedImage(image);
  };

  const handleIdProofUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIdProof(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    if (!capturedImage) {
      alert("Please capture visitor photo");
      return;
    }

    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const visitor = {
      id: Date.now().toString(),
      ...data,
      photo: capturedImage,
      idProof: idProof?.name || "",
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
    };

    addVisitor(visitor);
    setIsSubmitting(false);
    navigate("/log");
  };

  const resetForm = () => {
    setCapturedImage("");
    setIdProof(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Register New Visitor
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mt-2 text-lg">
          Capture visitor information and photo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visitor Information</CardTitle>
          <CardDescription>
            Please fill in all required fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Camera Section */}
            <div>
              <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                Visitor Photo *
              </Label>
              <CameraCapture
                onCapture={handlePhotoCapture}
                capturedImage={capturedImage}
              />
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Full Name *
                </Label>
                <Input
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Mobile Number *
                </Label>
                <Input
                  {...register("mobile", { required: "Mobile number is required" })}
                  placeholder="Enter mobile number"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Email Address *
                </Label>
                <Input
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Company/Organization
                </Label>
                <Input
                  {...register("company")}
                  placeholder="Enter company name"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                Address
              </Label>
              <Textarea
                {...register("address")}
                placeholder="Enter full address"
                rows={3}
              />
            </div>

            {/* Visit Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Person to Meet *
                </Label>
                <Select
                  onValueChange={(value) => setValue("personToMeet", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.name}>
                        {emp.name} - {emp.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.personToMeet && (
                  <p className="text-red-500 text-sm mt-1">Please select a person to meet</p>
                )}
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Purpose of Visit *
                </Label>
                <Select
                  onValueChange={(value) => setValue("purpose", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    {purposes.map((purpose) => (
                      <SelectItem key={purpose} value={purpose}>
                        {purpose}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.purpose && (
                  <p className="text-red-500 text-sm mt-1">Please select purpose of visit</p>
                )}
              </div>
            </div>

            {/* ID Proof Upload */}
            <div>
              <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                ID Proof (Optional)
              </Label>
              <div className="flex items-center gap-4 flex-wrap">
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleIdProofUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {idProof && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Uploaded</span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4 flex-wrap">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Register Visitor
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reset Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}