
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminNotesViewProps {
  adminNotes: string | null | undefined;
}

const AdminNotesView: React.FC<AdminNotesViewProps> = ({ adminNotes }) => {
  if (!adminNotes) return null;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Admin Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{adminNotes}</p>
      </CardContent>
    </Card>
  );
};

export default AdminNotesView;
