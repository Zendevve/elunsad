
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import ApplicationDetails from "@/components/admin/ApplicationDetails";

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {id && <ApplicationDetails applicationId={id} />}
    </div>
  );
};

export default AdminApplicationDetail;
