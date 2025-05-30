
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface DocumentStatusBadgesProps {
  status: string;
}

const DocumentStatusBadges: React.FC<DocumentStatusBadgesProps> = ({ status }) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
    case 'rejected':
      return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
    case 'pending':
    default:
      return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" /> Pending Review</Badge>;
  }
};

export default DocumentStatusBadges;
