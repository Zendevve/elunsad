
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  UploadCloud,
  Search,
  Filter,
  X,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivities } from "@/hooks/useActivities";
import { formatDistanceToNow } from "date-fns";

const getActivityIcon = (activityType: string) => {
  switch (activityType) {
    case "document_approved":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "document_uploaded":
      return <UploadCloud className="h-5 w-5 text-blue-500" />;
    case "permit_renewal_reminder":
    case "permit_expiring":
      return <Bell className="h-5 w-5 text-amber-500" />;
    case "application_submitted":
    case "application_updated":
      return <FileText className="h-5 w-5 text-blue-500" />;
    case "document_rejected":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const getActivityBorderColor = (activityType: string) => {
  switch (activityType) {
    case "document_approved":
      return "border-green-500 bg-green-50";
    case "document_uploaded":
    case "application_submitted":
    case "application_updated":
      return "border-blue-500 bg-blue-50";
    case "permit_renewal_reminder":
    case "permit_expiring":
      return "border-amber-500 bg-amber-50";
    case "document_rejected":
      return "border-red-500 bg-red-50";
    default:
      return "border-gray-500 bg-gray-50";
  }
};

const Notifications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread" | "read">("all");
  
  const { activities, isLoading, markAsRead } = useActivities();

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || 
                         (filterType === "unread" && !activity.is_read) ||
                         (filterType === "read" && activity.is_read);
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = activities.filter(activity => !activity.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Dashboard
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">Notifications</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="mt-2 text-gray-600">
                Stay updated with your application status and important reminders
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {unreadCount} unread
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filterType === "unread" ? "default" : "outline"}
              onClick={() => setFilterType("unread")}
              size="sm"
            >
              Unread
            </Button>
            <Button
              variant={filterType === "read" ? "default" : "outline"}
              onClick={() => setFilterType("read")}
              size="sm"
            >
              Read
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              All Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-start p-4 border-l-4 border-gray-200 bg-gray-50 rounded">
                    <Skeleton className="h-5 w-5 mr-3 mt-0.5 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredActivities.length > 0 ? (
              <div className="space-y-3">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-start p-4 border-l-4 rounded transition-all hover:shadow-sm ${getActivityBorderColor(activity.activity_type)} ${activity.is_read ? 'opacity-60' : ''}`}
                  >
                    {getActivityIcon(activity.activity_type)}
                    <div className="ml-3 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!activity.is_read && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(activity.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterType !== "all" 
                    ? "Try adjusting your search or filter criteria"
                    : "You'll see notifications here when there's activity on your account"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
