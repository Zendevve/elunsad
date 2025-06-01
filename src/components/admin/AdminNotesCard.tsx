
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FileText } from 'lucide-react';

interface AdminNotesCardProps {
  applicationId: string;
  initialNotes?: string;
  onRefetch: () => void;
}

const AdminNotesCard: React.FC<AdminNotesCardProps> = ({
  applicationId,
  initialNotes,
  onRefetch
}) => {
  const { toast } = useToast();
  const [adminNotes, setAdminNotes] = useState('');
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  useEffect(() => {
    if (initialNotes) {
      setAdminNotes(initialNotes);
    }
  }, [initialNotes]);

  const handleAdminNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdminNotes(e.target.value);
  };

  const handleSaveAdminNotes = async () => {
    if (!applicationId) {
      toast({
        title: "Error",
        description: "Application ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Admin notes saved successfully.",
        });
        onRefetch();
      } else {
        toast({
          title: "Error",
          description: "Failed to save admin notes.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving admin notes:", error);
      toast({
        title: "Error",
        description: "Failed to save admin notes. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Admin Notes
        </CardTitle>
        <CardDescription>Add internal notes for this application</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <textarea
            className="w-full rounded-md border border-gray-200 shadow-sm focus:border-primary focus:ring-primary text-sm"
            rows={isNotesExpanded ? 5 : 3}
            placeholder="Enter admin notes..."
            value={adminNotes}
            onChange={handleAdminNotesChange}
            onClick={() => setIsNotesExpanded(true)}
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSaveAdminNotes}>
              Save Notes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminNotesCard;
