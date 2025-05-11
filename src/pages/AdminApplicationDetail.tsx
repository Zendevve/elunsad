
import React from "react";
import { useParams } from "react-router-dom";
import ApplicationDetails from "@/components/admin/ApplicationDetails";

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {id && <ApplicationDetails applicationId={id} />}
    </div>
  );
};

export default AdminApplicationDetail;
