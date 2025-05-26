
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

interface ReportPreviewProps {
  reportType: string;
  filters: any;
  onClose: () => void;
}

const ReportPreview = ({ reportType, filters, onClose }: ReportPreviewProps) => {
  const sampleData = [
    { id: "APP001", businessName: "Sample Business 1", status: "Submitted", date: "2024-01-15" },
    { id: "APP002", businessName: "Sample Business 2", status: "Approved", date: "2024-01-14" },
    { id: "APP003", businessName: "Sample Business 3", status: "Under Review", date: "2024-01-13" },
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Report Preview - {reportType}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Business Permit Applications Report</h3>
            <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">
              Date Range: {filters.dateRange.from || 'All'} - {filters.dateRange.to || 'All'}
            </p>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Application ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Business Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-sm">{item.id}</td>
                    <td className="px-4 py-2 text-sm">{item.businessName}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPreview;
