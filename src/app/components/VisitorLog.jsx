import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
import { Search, LogOut, Eye, Calendar, Filter, Users, Download, X, CalendarDays, User, FileText, CheckCircle } from "lucide-react";
import { useApp } from "./context/AppContext";

export function VisitorLog() {
  const { visitors, checkoutVisitor, loading } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  
  // Download dialog states
  const [downloadFilters, setDownloadFilters] = useState({
    dateRange: {
      startDate: "",
      endDate: ""
    },
    personToMeet: "all",
    purpose: "all",
    status: "all"
  });
  const [selectedFormat, setSelectedFormat] = useState("csv");

  // Get unique persons to meet and purposes for filters
  const uniquePersonsToMeet = [...new Set(visitors.map(v => v.personToMeet))];
  const uniquePurposes = [...new Set(visitors.map(v => v.purpose))];

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      !searchQuery ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.mobile.includes(searchQuery) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.personToMeet.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && v.active) ||
      (statusFilter === "checked-out" && !v.active);

    return matchesSearch && matchesStatus;
  });

  const handleCheckout = async (visitor) => {
    await checkoutVisitor(visitor.id);
    if (selectedVisitor?.id === visitor.id) setIsDetailsOpen(false);
  };

  const formatDateTime = (dateString) => new Date(dateString).toLocaleString();
  
  const formatDateForExport = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkOut) return "Active";
    const duration = new Date(checkOut) - new Date(checkIn);
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // Get data based on download filters
  const getFilteredDataForDownload = () => {
    return visitors.filter((v) => {
      // Date range filter
      const checkInDate = new Date(v.checkInTime);
      const matchesDateRange =
        (!downloadFilters.dateRange.startDate || checkInDate >= new Date(downloadFilters.dateRange.startDate)) &&
        (!downloadFilters.dateRange.endDate || checkInDate <= new Date(downloadFilters.dateRange.endDate + "T23:59:59"));

      // Person to meet filter
      const matchesPersonToMeet =
        downloadFilters.personToMeet === "all" || v.personToMeet === downloadFilters.personToMeet;

      // Purpose filter
      const matchesPurpose =
        downloadFilters.purpose === "all" || v.purpose === downloadFilters.purpose;

      // Status filter
      const matchesStatus =
        downloadFilters.status === "all" ||
        (downloadFilters.status === "active" && v.active) ||
        (downloadFilters.status === "checked-out" && !v.active);

      return matchesDateRange && matchesPersonToMeet && matchesPurpose && matchesStatus;
    });
  };

  // Prepare data for export
  const prepareExportData = (dataToExport) => {
    return dataToExport.map(v => ({
      'Name': v.name,
      'Mobile': v.mobile,
      'Email': v.email,
      'Company': v.company || 'N/A',
      'Person to Meet': v.personToMeet,
      'Purpose': v.purpose,
      'Meeting Status': v.meetingStatus || 'PENDING',
      'Check In Time': formatDateForExport(v.checkInTime),
      'Check Out Time': v.checkOutTime ? formatDateForExport(v.checkOutTime) : 'Active',
      'Duration': calculateDuration(v.checkInTime, v.checkOutTime),
      'Status': v.active ? 'Active' : 'Checked Out'
    }));
  };

  // Export functions
  const exportToCSV = (data) => {
    if (data.length === 0) {
      alert("No data to export with selected filters");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(header => {
        let value = row[header];
        if (value === undefined || value === null) value = '';
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""');
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            value = `"${value}"`;
          }
        }
        return value;
      });
      csvRows.push(values.join(','));
    }
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `visitor_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = (data) => {
    if (data.length === 0) {
      alert("No data to export with selected filters");
      return;
    }
    
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `visitor_log_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToHTML = (data) => {
    if (data.length === 0) {
      alert("No data to export with selected filters");
      return;
    }
    
    const headers = Object.keys(data[0]);
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Visitor Log Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #2563eb; }
          .info { margin-bottom: 20px; color: #666; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .status-active { color: green; font-weight: bold; }
          .status-checked-out { color: gray; }
        </style>
      </head>
      <body>
        <h1>Visitor Log Report</h1>
        <div class="info">
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Total Visitors: ${data.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${headers.map(header => {
                  let value = row[header];
                  if (header === 'Status') {
                    value = `<span class="status-${value.toLowerCase().replace(' ', '-')}">${value}</span>`;
                  }
                  return `<td>${value}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `visitor_log_${new Date().toISOString().split('T')[0]}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    const filteredData = getFilteredDataForDownload();
    const exportData = prepareExportData(filteredData);
    
    switch(selectedFormat) {
      case 'csv':
        exportToCSV(exportData);
        break;
      case 'json':
        exportToJSON(exportData);
        break;
      case 'html':
        exportToHTML(exportData);
        break;
      default:
        exportToCSV(exportData);
    }
    
    setIsDownloadDialogOpen(false);
  };

  const resetDownloadFilters = () => {
    setDownloadFilters({
      dateRange: { startDate: "", endDate: "" },
      personToMeet: "all",
      purpose: "all",
      status: "all"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-blue-600">Visitor Log</h2>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            View and manage visitor records
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsDownloadDialogOpen(true)}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Download Data
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <CardTitle>All Visitors</CardTitle>
              <CardDescription>
                {filteredVisitors.length} visitor(s) found
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
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
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No visitors found</p>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitors.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell>
                        {v.photo ? (
                          <img
                            src={v.photo}
                            alt={v.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {v.mobile}
                          <br />
                          {v.email}
                        </div>
                      </TableCell>
                      <TableCell>{v.personToMeet}</TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(v.checkInTime)}
                      </TableCell>
                      <TableCell>
                        {!v.active ? (
                          <Badge variant="secondary">Checked Out</Badge>
                        ) : (
                          <Badge className="bg-green-600">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedVisitor(v);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {v.active && (
                            <Button
                              size="sm"
                              onClick={() => handleCheckout(v)}
                              disabled={loading}
                              className="bg-cyan-600"
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

      {/* Download Dialog */}
      <Dialog open={isDownloadDialogOpen} onOpenChange={setIsDownloadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Download Visitor Data</DialogTitle>
            <DialogDescription>
              Apply filters and choose format to download visitor records
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Start Date</label>
                  <Input
                    type="date"
                    value={downloadFilters.dateRange.startDate}
                    onChange={(e) => setDownloadFilters({
                      ...downloadFilters,
                      dateRange: { ...downloadFilters.dateRange, startDate: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">End Date</label>
                  <Input
                    type="date"
                    value={downloadFilters.dateRange.endDate}
                    onChange={(e) => setDownloadFilters({
                      ...downloadFilters,
                      dateRange: { ...downloadFilters.dateRange, endDate: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Person to Meet Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Person to Meet
              </label>
              <Select 
                value={downloadFilters.personToMeet} 
                onValueChange={(value) => setDownloadFilters({...downloadFilters, personToMeet: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Persons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Persons</SelectItem>
                  {uniquePersonsToMeet.map(person => (
                    <SelectItem key={person} value={person}>{person}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Purpose Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Purpose
              </label>
              <Select 
                value={downloadFilters.purpose} 
                onValueChange={(value) => setDownloadFilters({...downloadFilters, purpose: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Purposes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Purposes</SelectItem>
                  {uniquePurposes.map(purpose => (
                    <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Status
              </label>
              <Select 
                value={downloadFilters.status} 
                onValueChange={(value) => setDownloadFilters({...downloadFilters, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Download Format */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Download Format</label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant={selectedFormat === "csv" ? "default" : "outline"}
                  onClick={() => setSelectedFormat("csv")}
                  className="gap-2"
                >
                  CSV
                </Button>
                <Button
                  type="button"
                  variant={selectedFormat === "json" ? "default" : "outline"}
                  onClick={() => setSelectedFormat("json")}
                  className="gap-2"
                >
                  JSON
                </Button>
                <Button
                  type="button"
                  variant={selectedFormat === "html" ? "default" : "outline"}
                  onClick={() => setSelectedFormat("html")}
                  className="gap-2"
                >
                  HTML
                </Button>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Data to be downloaded:
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {getFilteredDataForDownload().length} records
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Based on selected filters
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={resetDownloadFilters}
            >
              Reset Filters
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDownloadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <Download className="w-4 h-4" />
              Download {selectedFormat.toUpperCase()}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Visitor Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visitor Details</DialogTitle>
            <DialogDescription>Complete visitor information</DialogDescription>
          </DialogHeader>
          {selectedVisitor && (
            <div className="space-y-4">
              <div className="flex gap-4">
                {selectedVisitor.photo && (
                  <img
                    src={selectedVisitor.photo}
                    alt={selectedVisitor.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedVisitor.name}
                  </h3>
                  <Badge
                    className={selectedVisitor.active ? "bg-green-600" : ""}
                  >
                    {selectedVisitor.active ? "Active" : "Checked Out"}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Mobile</p>
                  <p className="font-medium">{selectedVisitor.mobile}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{selectedVisitor.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Company</p>
                  <p className="font-medium">
                    {selectedVisitor.company || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Person to Meet</p>
                  <p className="font-medium">{selectedVisitor.personToMeet}</p>
                </div>
                <div>
                  <p className="text-gray-500">Purpose</p>
                  <p className="font-medium">{selectedVisitor.purpose}</p>
                </div>
                <div>
                  <p className="text-gray-500">Meeting Status</p>
                  <p className="font-medium">
                    {selectedVisitor.meetingStatus || "PENDING"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Check In</p>
                  <p className="font-medium">
                    {formatDateTime(selectedVisitor.checkInTime)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium">
                    {calculateDuration(
                      selectedVisitor.checkInTime,
                      selectedVisitor.checkOutTime,
                    )}
                  </p>
                </div>
              </div>

              {selectedVisitor.personToMeetDetails && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Meeting With:</h4>
                  <div className="flex items-center gap-3">
                    {selectedVisitor.personToMeetDetails.photo ? (
                      <img
                        src={selectedVisitor.personToMeetDetails.photo}
                        alt={selectedVisitor.personToMeetDetails.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <Users className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {selectedVisitor.personToMeetDetails.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedVisitor.personToMeetDetails.email}
                      </p>
                      {selectedVisitor.personToMeetDetails.designation && (
                        <p className="text-xs text-gray-400">
                          {selectedVisitor.personToMeetDetails.designation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedVisitor.active && (
                <Button
                  onClick={() => handleCheckout(selectedVisitor)}
                  disabled={loading}
                  className="w-full"
                >
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