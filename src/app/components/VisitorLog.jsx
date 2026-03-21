import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Search, LogOut, Eye, Calendar, Filter, Download } from "lucide-react";
import { useApp } from "./context/AppContext";

export function VisitorLog() {
  const { visitors, updateVisitor, addNotification } = useApp();
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    filterVisitors();
  }, [searchQuery, statusFilter, visitors]);

  const filterVisitors = () => {
    let filtered = [...visitors];

    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.mobile.includes(searchQuery) ||
          v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (v.company && v.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
          v.personToMeet.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter === "active") {
      filtered = filtered.filter((v) => !v.checkOutTime);
    } else if (statusFilter === "checked-out") {
      filtered = filtered.filter((v) => v.checkOutTime);
    }

    setFilteredVisitors(filtered.reverse());
  };

  const handleCheckOut = (visitor) => {
    updateVisitor(visitor.id, { checkOutTime: new Date().toISOString() });
    addNotification({
      type: "success",
      message: `${visitor.name} checked out successfully`,
    });
  };

  const viewDetails = (visitor) => {
    setSelectedVisitor(visitor);
    setIsDetailsOpen(true);
  };

  const exportToCSV = () => {
    const headers = ["Name", "Mobile", "Email", "Company", "Person to Meet", "Purpose", "Check In", "Check Out"];
    const rows = filteredVisitors.map(v => [
      v.name,
      v.mobile,
      v.email,
      v.company || "",
      v.personToMeet,
      v.purpose,
      new Date(v.checkInTime).toLocaleString(),
      v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : "Active",
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visitors-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    
    addNotification({
      type: "success",
      message: "Visitor log exported successfully",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkOut) return "Active";
    const duration = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Visitor Log
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mt-2 text-lg">
            View and manage all visitor records
          </p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>All Visitors</CardTitle>
              <CardDescription className="mt-1">
                {filteredVisitors.length} visitor(s) found
              </CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search visitors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-[250px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVisitors.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                <Calendar className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">No visitors found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Register your first visitor to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Meeting With</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg overflow-hidden ring-2 ring-blue-200 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
                          <img
                            src={visitor.photo}
                            alt={visitor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{visitor.name}</p>
                          {visitor.company && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{visitor.company}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium text-gray-700 dark:text-gray-300">{visitor.mobile}</p>
                          <p className="text-gray-500 dark:text-gray-400">{visitor.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700 dark:text-gray-300">{visitor.personToMeet}</TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDateTime(visitor.checkInTime)}
                      </TableCell>
                      <TableCell className="font-medium text-gray-700 dark:text-gray-300">
                        {calculateDuration(visitor.checkInTime, visitor.checkOutTime)}
                      </TableCell>
                      <TableCell>
                        {visitor.checkOutTime ? (
                          <Badge variant="secondary">Checked Out</Badge>
                        ) : (
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewDetails(visitor)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {!visitor.checkOutTime && (
                            <Button
                              size="sm"
                              onClick={() => handleCheckOut(visitor)}
                              className="bg-cyan-600 hover:bg-cyan-700 text-white"
                            >
                              <LogOut className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visitor Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visitor Details</DialogTitle>
            <DialogDescription>Complete visitor information</DialogDescription>
          </DialogHeader>
          {selectedVisitor && (
            <div className="space-y-6">
              <div className="flex items-start gap-6 flex-wrap">
                <img
                  src={selectedVisitor.photo}
                  alt={selectedVisitor.name}
                  className="w-32 h-32 rounded-lg object-cover ring-2 ring-blue-200"
                />
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedVisitor.name}</h3>
                  {selectedVisitor.checkOutTime ? (
                    <Badge variant="secondary">Checked Out</Badge>
                  ) : (
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mobile Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVisitor.mobile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVisitor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVisitor.company || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Person to Meet</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVisitor.personToMeet}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Purpose of Visit</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVisitor.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID Proof</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVisitor.idProof || "Not uploaded"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVisitor.address || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Check In Time</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(selectedVisitor.checkInTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Check Out Time</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedVisitor.checkOutTime
                      ? formatDateTime(selectedVisitor.checkOutTime)
                      : "Still on premises"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {calculateDuration(selectedVisitor.checkInTime, selectedVisitor.checkOutTime)}
                  </p>
                </div>
              </div>

              {!selectedVisitor.checkOutTime && (
                <Button
                  onClick={() => {
                    handleCheckOut(selectedVisitor);
                    setIsDetailsOpen(false);
                  }}
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Check Out Visitor
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}