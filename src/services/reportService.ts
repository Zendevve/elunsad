
import { supabase } from "@/integrations/supabase/client";
import { ApplicationStatus, ApplicationType } from "./application/types";

export interface ReportFilters {
  dateRange: {
    from: string;
    to: string;
  };
  status: string;
  businessType: string;
  format: string;
}

class ReportService {
  async generateReport(reportType: string, filters: ReportFilters) {
    console.log("Generating report:", reportType, "with filters:", filters);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would:
    // 1. Fetch data based on reportType and filters
    // 2. Format the data according to the requested format
    // 3. Generate the file (PDF, CSV, Excel)
    // 4. Return download link or trigger download
    
    return {
      success: true,
      downloadUrl: "#",
      filename: `${reportType}-${Date.now()}.${filters.format}`
    };
  }

  async getApplicationsReport(filters: ReportFilters) {
    let query = supabase
      .from("applications")
      .select(`
        *,
        business_information(*),
        owner_information(*)
      `);

    if (filters.status) {
      query = query.eq("application_status", filters.status as ApplicationStatus);
    }

    if (filters.businessType) {
      query = query.eq("application_type", filters.businessType as ApplicationType);
    }

    if (filters.dateRange.from) {
      query = query.gte("created_at", filters.dateRange.from);
    }

    if (filters.dateRange.to) {
      query = query.lte("created_at", filters.dateRange.to);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    return data;
  }

  async getBusinessOwnersReport(filters: ReportFilters) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*");

    if (error) {
      throw new Error(`Failed to fetch business owners: ${error.message}`);
    }

    return data;
  }

  formatDataAsCsv(data: any[], headers: string[]) {
    const csvHeaders = headers.join(",");
    const csvRows = data.map(row => 
      headers.map(header => 
        JSON.stringify(row[header] || "")
      ).join(",")
    );
    
    return [csvHeaders, ...csvRows].join("\n");
  }

  downloadFile(content: string, filename: string, contentType: string) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const reportService = new ReportService();
