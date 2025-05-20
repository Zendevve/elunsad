
import React, { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ApplicationDetails from "@/components/admin/ApplicationDetails";
import { useToast } from "@/hooks/use-toast";

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if the ID is missing
    if (!id) {
      toast({
        variant: "destructive",
        title: "Missing Application ID",
        description: "No application ID was provided in the URL"
      });
      
      // Redirect back to admin dashboard after a short delay
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);
    }
  }, [id, toast, navigate]);
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {id && <ApplicationDetails applicationId={id} />}
    </div>
  );
};

export default AdminApplicationDetail;
