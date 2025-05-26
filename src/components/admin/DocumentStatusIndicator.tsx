
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, AlertTriangle, FileText } from 'lucide-react';

interface DocumentStatusIndicatorProps {
  totalRequired: number;
  uploaded: number;
  approved: number;
  pending: number;
  rejected: number;
}

const DocumentStatusIndicator: React.FC<DocumentStatusIndicatorProps> = ({
  totalRequired,
  uploaded,
  approved,
  pending,
  rejected
}) => {
  const missing = totalRequired - uploaded;
  
  const getStatusInfo = () => {
    if (approved === totalRequired) {
      return { 
        label: 'Complete', 
        variant: 'default' as const, 
        icon: CheckCircle, 
        className: 'bg-green-500 hover:bg-green-600' 
      };
    } else if (missing > 0) {
      return { 
        label: `${missing} Missing`, 
        variant: 'destructive' as const, 
        icon: AlertTriangle, 
        className: 'bg-red-500 hover:bg-red-600' 
      };
    } else if (pending > 0) {
      return { 
        label: `${pending} Pending`, 
        variant: 'secondary' as const, 
        icon: Clock, 
        className: 'bg-yellow-500 hover:bg-yellow-600' 
      };
    } else if (rejected > 0) {
      return { 
        label: `${rejected} Rejected`, 
        variant: 'destructive' as const, 
        icon: XCircle, 
        className: 'bg-red-500 hover:bg-red-600' 
      };
    } else {
      return { 
        label: 'Under Review', 
        variant: 'default' as const, 
        icon: FileText, 
        className: 'bg-blue-500 hover:bg-blue-600' 
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Badge variant={statusInfo.variant} className={statusInfo.className}>
      <StatusIcon className="h-3 w-3 mr-1" />
      {statusInfo.label}
    </Badge>
  );
};

export default DocumentStatusIndicator;
