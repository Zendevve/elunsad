
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { adminApplicationService } from '@/services/application/adminApplicationService';
import { ApplicationStatus } from '@/services/application/types';

interface ApplicationActionsProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
  currentNotes?: string;
  onStatusUpdate: () => void;
}

const ApplicationActions: React.FC<ApplicationActionsProps> = ({
  applicationId,
  currentStatus,
  currentNotes,
  onStatusUpdate
}) => {
  const { toast } = useToast();
  const [reviewNotes, setReviewNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(currentStatus);

  const statusOptions = [
    { value: 'submitted' as ApplicationStatus, label: 'Submitted', icon: Clock, color: 'bg-blue-500' },
    { value: 'under_review' as ApplicationStatus, label: 'Under Review', icon: Clock, color: 'bg-amber-500' },
    { value: 'requires_additional_info' as ApplicationStatus, label: 'Requires Additional Info', icon: AlertCircle, color: 'bg-purple-500' },
    { value: 'approved' as ApplicationStatus, label: 'Approved', icon: CheckCircle, color: 'bg-green-500' },
    { value: 'rejected' as ApplicationStatus, label: 'Rejected', icon: XCircle, color: 'bg-red-500' },
  ];

  const handleStatusUpdate = async (newStatus: ApplicationStatus, notes?: string) => {
    setIsUpdating(true);
    try {
      await adminApplicationService.updateApplicationStatus(applicationId, newStatus, notes);
      toast({
        title: "Success",
        description: `Application status updated to ${newStatus.replace('_', ' ')}.`,
      });
      onStatusUpdate();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickAction = (status: ApplicationStatus) => {
    handleStatusUpdate(status, reviewNotes);
  };

  const handleStatusChange = () => {
    if (selectedStatus !== currentStatus) {
      handleStatusUpdate(selectedStatus, reviewNotes);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const statusConfig = statusOptions.find(opt => opt.value === status);
    if (!statusConfig) return null;
    
    const Icon = statusConfig.icon;
    return (
      <Badge className={`${statusConfig.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {statusConfig.label}
      </Badge>
    );
  };

  const canApprove = currentStatus === 'submitted' || currentStatus === 'under_review';
  const canReject = currentStatus === 'submitted' || currentStatus === 'under_review';
  const canRequestInfo = currentStatus === 'submitted' || currentStatus === 'under_review';

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Status</span>
            {getStatusBadge(currentStatus)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Change Status</label>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as ApplicationStatus)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <Icon className="w-4 h-4 mr-2" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Review Notes</label>
              <Textarea
                placeholder="Add review notes or feedback for the applicant..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>

            <Button 
              onClick={handleStatusChange} 
              disabled={selectedStatus === currentStatus || isUpdating}
              className="w-full"
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Approve Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700" 
                  disabled={!canApprove || isUpdating}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve Application</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve this application? This action will notify the applicant.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleQuickAction('approved')}>
                    Approve Application
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Reject Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  disabled={!canReject || isUpdating}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject Application</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject this application? Please make sure you've added review notes explaining the reason.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleQuickAction('rejected')}>
                    Reject Application
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Request Additional Info Button */}
            <Button 
              variant="outline" 
              onClick={() => handleQuickAction('requires_additional_info')}
              disabled={!canRequestInfo || isUpdating}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Request Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Admin Notes */}
      {currentNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Current Admin Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm whitespace-pre-wrap">{currentNotes}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationActions;
