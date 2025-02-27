
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Filter,
  Info,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import Map from "../components/Map";

// Sample permit location data
const permits = [
  { id: 1, lat: 14.5995, lng: 120.9842, status: "approved", type: "business" },
  { id: 2, lat: 14.6037, lng: 120.9821, status: "pending", type: "restaurant" },
  { id: 3, lat: 14.5947, lng: 120.9772, status: "rejected", type: "retail" },
];

const MapView = () => {
  const [selectedPermitType, setSelectedPermitType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Map View</span>
          </nav>
        </div>
      </div>

      {/* Title Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Geo-Tagging Map</h1>
            <p className="text-muted-foreground">
              Explore business permit locations across the city. Use the filters to narrow down by permit type, status, or region.
              Color-coded markers indicate permit status: green for approved, yellow for pending, and red for rejected applications.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Search permits..." />
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Permit Type</label>
                  <Select value={selectedPermitType} onValueChange={setSelectedPermitType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Approved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">Rejected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                <div className="h-[calc(100vh-24rem)] w-full rounded-lg overflow-hidden">
                  <Map permits={permits} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Help & Resources</h3>
              <div className="space-y-2">
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">User Guide</Link>
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">FAQs</Link>
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Support Center</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Privacy Policy</Link>
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Terms of Service</Link>
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Data Protection</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Licensing Office</p>
                <p className="text-sm text-gray-500">Monday - Friday, 9AM - 5PM</p>
                <p className="text-sm text-gray-500">support@licensing.gov</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MapView;
