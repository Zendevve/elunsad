
import { Link } from "react-router-dom";
import { AlertTriangle, Plus, Upload, ArrowRight, CalendarClock, CheckCircle2, XCircle, TrendingUp, Filter, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const quickActions = [{
  name: 'New Application',
  description: 'Start a new permit application',
  href: '/applications/new',
  icon: Plus,
  color: 'bg-blue-500'
}, {
  name: 'Submit Renewal',
  description: 'Renew an existing permit',
  href: '/applications/renewal',
  icon: CalendarClock,
  color: 'bg-green-500'
}, {
  name: 'Upload Documents',
  description: 'Submit required documentation',
  href: '/documents/upload',
  icon: Upload,
  color: 'bg-purple-500'
}];

const statistics = [{
  title: 'Pending Applications',
  value: 12,
  change: '+2 from last week',
  icon: AlertTriangle,
  color: 'text-yellow-500'
}, {
  title: 'Approved This Month',
  value: 28,
  change: '+5 from last month',
  icon: CheckCircle2,
  color: 'text-green-500'
}, {
  title: 'Expiring Soon',
  value: 3,
  change: 'Due within 30 days',
  icon: CalendarClock,
  color: 'text-blue-500'
}];

const recentActivity = [{
  id: 1,
  message: 'New permit application submitted by John Doe',
  time: '5 minutes ago',
  type: 'success',
  icon: CheckCircle2
}, {
  id: 2,
  message: 'Document review pending for Business License #BL-2024-001',
  time: '1 hour ago',
  type: 'warning',
  icon: AlertTriangle
}, {
  id: 3,
  message: 'Permit renewal rejected for Restaurant License #RL-2024-003',
  time: '2 hours ago',
  type: 'error',
  icon: XCircle
}];

const Index = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
              <p className="text-gray-600 mt-1">{currentDate}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <Badge variant="destructive" className="text-sm">
                3 permits expiring soon
              </Badge>
              <Badge variant="secondary" className="text-sm">
                5 pending reviews
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statistics.map(stat => <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600">{stat.change}</p>
              </CardContent>
            </Card>)}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map(action => <Link key={action.name} to={action.href}>
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
                <CardContent className="flex items-center p-6">
                  <div className={`${action.color} p-3 rounded-lg text-white mr-4`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{action.name}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>)}
        </div>

        {/* Analytics & Map Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Analytics Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Application Trends</CardTitle>
              <Link to="/analytics" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View analytics <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Analytics preview will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Permit Locations</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Filter className="h-3 w-3 mr-1" />
                    Filter by district
                  </Button>
                </div>
              </div>
              <Link to="/map" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View full map <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Map preview will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map(activity => <div key={activity.id} className="flex items-start space-x-4">
                  <activity.icon className={`h-5 w-5 mt-0.5 ${activity.type === 'success' ? 'text-green-500' : activity.type === 'warning' ? 'text-yellow-500' : 'text-red-500'}`} />
                  <div>
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold">Support</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Help Center</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">FAQs</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Contact</h3>
              <p className="mt-4 text-sm text-gray-600">
                Business Permits Office<br />
                Email: support@permits.gov<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
