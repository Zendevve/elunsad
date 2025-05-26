
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface ReportCardProps {
  category: {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    iconColor: string;
    reports: Array<{
      id: string;
      name: string;
      description: string;
    }>;
  };
  onSelectReport: (reportId: string) => void;
}

const ReportCard = ({ category, onSelectReport }: ReportCardProps) => {
  const Icon = category.icon;

  return (
    <Card className={`${category.color} hover:shadow-md transition-shadow cursor-pointer`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white ${category.iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{category.title}</CardTitle>
              <Badge variant="secondary" className="mt-1 text-xs">
                {category.reports.length} report{category.reports.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{category.description}</p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          {category.reports.slice(0, 2).map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-2 bg-white rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{report.name}</p>
                <p className="text-xs text-gray-500">{report.description}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onSelectReport(report.id)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {category.reports.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs"
              onClick={() => onSelectReport(category.reports[2].id)}
            >
              View {category.reports.length - 2} more report{category.reports.length - 2 !== 1 ? 's' : ''}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
