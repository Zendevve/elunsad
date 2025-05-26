
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { 
  FileText, Download, Calendar, Filter, 
  BarChart3, Users, Building, Activity 
} from "lucide-react";
import ReportCard from "@/components/reports/ReportCard";
import ReportGenerator from "@/components/reports/ReportGenerator";

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);

  const reportCategories = [
    {
      id: "applications",
      title: "Application Reports",
      description: "Generate reports on business permit applications",
      icon: FileText,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      reports: [
        { id: "app-status", name: "Applications by Status", description: "View applications grouped by their current status" },
        { id: "app-timeline", name: "Application Timeline", description: "Track application submission and processing times" },
        { id: "app-type", name: "Applications by Type", description: "Breakdown of new applications vs renewals vs amendments" }
      ]
    },
    {
      id: "business-owners",
      title: "Business Owner Reports",
      description: "Generate reports on registered business owners",
      icon: Users,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      reports: [
        { id: "owner-list", name: "Business Owner Directory", description: "Complete list of registered business owners" },
        { id: "owner-activity", name: "Owner Activity Report", description: "Track business owner engagement and submissions" }
      ]
    },
    {
      id: "business-data",
      title: "Business Data Reports",
      description: "Generate reports on business information and operations",
      icon: Building,
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      reports: [
        { id: "business-types", name: "Business Types Distribution", description: "Breakdown of businesses by industry type" },
        { id: "business-locations", name: "Business Locations", description: "Geographic distribution of registered businesses" },
        { id: "business-size", name: "Business Size Analysis", description: "Analysis of business operations and employee counts" }
      ]
    },
    {
      id: "analytics",
      title: "Analytics Reports",
      description: "Generate analytical and trend reports",
      icon: BarChart3,
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
      reports: [
        { id: "submission-trends", name: "Submission Trends", description: "Track application submission patterns over time" },
        { id: "approval-rates", name: "Approval Rate Analysis", description: "Monitor application approval and rejection rates" },
        { id: "processing-time", name: "Processing Time Analysis", description: "Average time to process different types of applications" }
      ]
    },
    {
      id: "audit",
      title: "Audit Reports",
      description: "Generate audit trail and activity reports",
      icon: Activity,
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
      reports: [
        { id: "admin-activity", name: "Admin Activity Log", description: "Track administrative actions and changes" },
        { id: "system-usage", name: "System Usage Report", description: "Monitor system usage patterns and peak times" }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and download comprehensive reports</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Recent Downloads
          </Button>
        </div>
      </div>

      {!selectedReportType ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCategories.map((category) => (
            <ReportCard
              key={category.id}
              category={category}
              onSelectReport={(reportId) => setSelectedReportType(reportId)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedReportType(null)}
              className="flex items-center gap-2"
            >
              ← Back to Reports
            </Button>
            <h2 className="text-xl font-semibold">Generate Report</h2>
          </div>
          
          <ReportGenerator
            reportType={selectedReportType}
            onBack={() => setSelectedReportType(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Reports;
