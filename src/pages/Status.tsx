
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApplication } from "@/contexts/ApplicationContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ApplicationStatus } from "@/services/application/types";

// Status page component
const Status = () => {
  const { applicationId, applicationStatus } = useApplication();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setIsAuthenticated(!!data.user);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">You need to be logged in to view application status.</p>
            <div className="flex justify-center">
              <Button asChild>
                <Link to="/signin">Go to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no application has been submitted
  if (!applicationId) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <h1 className="text-2xl font-bold mb-6">Application Status</h1>
        <div className="bg-gray-50 p-6 rounded-md text-center">
          <p className="text-lg mb-4">You have not submitted any applications yet.</p>
          <Button asChild>
            <Link to="/applications">Start New Application</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get status text and color
  const getStatusDetails = (status: ApplicationStatus | null) => {
    if (!status) return { text: 'Unknown', color: 'bg-gray-500', textColor: 'text-gray-500' };
    
    switch (status) {
      case 'draft':
        return { text: 'Draft', color: 'bg-gray-400', textColor: 'text-gray-500' };
      case 'submitted':
        return { text: 'Submitted', color: 'bg-blue-400', textColor: 'text-blue-500' };
      case 'under_review':
        return { text: 'Under Review', color: 'bg-yellow-400', textColor: 'text-yellow-600' };
      case 'approved':
        return { text: 'Approved', color: 'bg-green-400', textColor: 'text-green-500' };
      case 'rejected':
        return { text: 'Rejected', color: 'bg-red-400', textColor: 'text-red-500' };
      case 'requires_additional_info':
        return { text: 'Additional Info Required', color: 'bg-orange-400', textColor: 'text-orange-500' };
      default:
        return { text: 'Unknown', color: 'bg-gray-500', textColor: 'text-gray-500' };
    }
  };

  const { text, color, textColor } = getStatusDetails(applicationStatus);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6">Application Status</h1>
      
      <div className="bg-gray-50 p-6 rounded-md">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium">Application ID</h2>
            <p className="text-gray-600">{applicationId}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <h2 className="text-lg font-medium">Status</h2>
            <div className="flex items-center mt-1">
              <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
              <span className={`font-medium ${textColor}`}>{text}</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium mb-2">What's Next?</h2>
            {applicationStatus === 'draft' && (
              <p className="text-gray-600">Please complete and submit your application.</p>
            )}
            {applicationStatus === 'submitted' && (
              <p className="text-gray-600">Your application has been submitted and is pending initial review. You will be notified once the review process begins.</p>
            )}
            {applicationStatus === 'under_review' && (
              <p className="text-gray-600">Your application is currently being reviewed by our team. You will be notified of the results once the review is complete.</p>
            )}
            {applicationStatus === 'requires_additional_info' && (
              <p className="text-gray-600">Additional information is required to process your application. Please check your notifications for details.</p>
            )}
            {applicationStatus === 'approved' && (
              <p className="text-gray-600">Congratulations! Your application has been approved. You will receive further instructions about how to proceed.</p>
            )}
            {applicationStatus === 'rejected' && (
              <p className="text-gray-600">Unfortunately, your application has been declined. Please check your notifications for more information about why it was declined and how you can appeal.</p>
            )}
          </div>
          
          <div className="pt-4">
            <h2 className="text-lg font-medium mb-2">Actions</h2>
            <div className="flex flex-wrap gap-3">
              {applicationStatus === 'draft' && (
                <Button asChild>
                  <Link to="/applications">Continue Application</Link>
                </Button>
              )}
              
              {applicationStatus === 'requires_additional_info' && (
                <Button asChild>
                  <Link to="/applications">Update Application</Link>
                </Button>
              )}
              
              {applicationStatus === 'rejected' && (
                <Button variant="outline" asChild>
                  <Link to="/applications">Create New Application</Link>
                </Button>
              )}
              
              <Button variant="outline" asChild>
                <Link to="/notifications">View Notifications</Link>
              </Button>
              
              {applicationStatus === 'approved' && (
                <Button variant="outline" asChild>
                  <Link to="/documents">View Documents</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
