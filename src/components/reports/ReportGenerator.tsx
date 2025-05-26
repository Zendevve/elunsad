
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Download, FileSpreadsheet, FileText, File,
  Calendar, Filter, Eye, Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReportPreview from "./ReportPreview";
import { reportService } from "@/services/reportService";

interface ReportGeneratorProps {
  reportType: string;
  onBack: () => void;
}

const ReportGenerator = ({ reportType, onBack }: ReportGeneratorProps) => {
  const [filters, setFilters] = useState({
    dateRange: { from: "", to: "" },
    status: "",
    businessType: "",
    format: "pdf"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await reportService.generateReport(reportType, filters);
      toast({
        title: "Report Generated",
        description: "Your report has been generated and is ready for download.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const formatOptions = [
    { value: "pdf", label: "PDF", icon: FileText },
    { value: "csv", label: "CSV", icon: FileSpreadsheet },
    { value: "excel", label: "Excel", icon: File }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Configuration Panel */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="filters" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="format">Format</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
              
              <TabsContent value="filters" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateFrom">Date From</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={filters.dateRange.from}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, from: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateTo">Date To</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={filters.dateRange.to}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, to: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Application Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select
                      value={filters.businessType}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, businessType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All types</SelectItem>
                        <SelectItem value="newApplication">New Application</SelectItem>
                        <SelectItem value="renewalApplication">Renewal</SelectItem>
                        <SelectItem value="amendmentApplication">Amendment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="format" className="space-y-4">
                <div>
                  <Label>Export Format</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {formatOptions.map((format) => {
                      const FormatIcon = format.icon;
                      return (
                        <Button
                          key={format.value}
                          variant={filters.format === format.value ? "default" : "outline"}
                          className="flex items-center gap-2 h-auto p-4"
                          onClick={() => setFilters(prev => ({ ...prev, format: format.value }))}
                        >
                          <FormatIcon className="h-4 w-4" />
                          {format.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2" />
                  <p>Scheduled reporting coming soon</p>
                  <p className="text-sm">Set up automated report generation</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Actions Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handlePreview}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview Report
            </Button>
            
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate & Download"}
            </Button>
            
            <Separator />
            
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-full"
            >
              ← Back to Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Report Details</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{reportType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Format:</span>
              <span className="font-medium uppercase">{filters.format}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date Range:</span>
              <span className="font-medium">
                {filters.dateRange.from && filters.dateRange.to 
                  ? `${filters.dateRange.from} to ${filters.dateRange.to}`
                  : "All dates"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal/Overlay */}
      {showPreview && (
        <ReportPreview
          reportType={reportType}
          filters={filters}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default ReportGenerator;
