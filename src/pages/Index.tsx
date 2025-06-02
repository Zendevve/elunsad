import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Rocket, BarChart2, CheckCircle, Database, TrendingUp, MapPin, Bell, Upload, ArrowRight, Quote, Mail, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const coreFeatures = [
    {
      icon: Upload,
      title: "Online Applications & Renewals",
      description: "Submit and manage permit applications and renewals from anywhere, anytime.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Database,
      title: "Document Management",
      description: "Securely upload, store, and manage all required documentation in one place.",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Automated alerts for deadlines, status changes, and important updates.",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    }
  ];

  const advancedFeatures = [
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Gain insights with visual analytics and reporting on application trends.",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: MapPin,
      title: "Interactive Maps",
      description: "Visualize permit locations and areas of high business activity.",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: BarChart2,
      title: "Performance Tracking",
      description: "Monitor processing times and identify opportunities for improvement.",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header & Navigation - Simplified */}
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/bbd34367-e328-4dff-9103-719d6d3c2bd6.png" alt="eLUNSAD Logo" className="h-10 w-10" />
              <h1 className="text-xl font-bold">eLUNSAD</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </nav>
            <div>
              <Link to="/signin">
                <Button>Sign In / Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Single Primary CTA */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Get Your Business Permit in Minutes, Not Weeks
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                The fastest way to apply, track, and manage your business permits online. Join thousands of businesses already saving time.
              </p>
              <div className="flex flex-col space-y-4">
                <Link to="/signin">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                    Start Your Application Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-sm text-gray-500">No setup required • Free to start • Secure & trusted</p>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
                <img alt="Business Permit Management" className="w-full h-64 object-cover rounded" src="/lovable-uploads/c2fa4958-ca21-4f46-8eff-378b42e6bc34.jpg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Value Proposition */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need in One Place</h2>
            <p className="text-lg text-gray-600">
              Stop juggling paperwork, emails, and office visits. Our platform handles your entire permit process from start to finish.
            </p>
          </div>
          
          {/* Core Features - Reduced to 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className={`${feature.bgColor} p-3 rounded-full inline-flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="mb-2">{feature.title}</CardTitle>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progressive Disclosure for Advanced Features */}
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => setShowAllFeatures(!showAllFeatures)}
              className="text-blue-600 hover:text-blue-700"
            >
              {showAllFeatures ? 'Show Less' : 'Discover More Features'}
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAllFeatures ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Advanced Features - Hidden by Default */}
          {showAllFeatures && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 animate-fade-in">
              {advancedFeatures.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`${feature.bgColor} p-3 rounded-full inline-flex items-center justify-center mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <CardTitle className="mb-2">{feature.title}</CardTitle>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section - Streamlined */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Three Simple Steps</h2>
            <p className="text-lg text-gray-600">
              Get your business permit faster than ever before
            </p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="bg-blue-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Apply Online</h3>
                <p className="text-gray-600">Fill out your application in minutes with our guided form.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="bg-blue-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                <p className="text-gray-600">Monitor your application status in real-time with automatic updates.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="bg-blue-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Approved</h3>
                <p className="text-gray-600">Receive your permit and manage renewals automatically.</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link to="/signin">
              <Button size="lg">
                Start Now - It's Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof - Simplified */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Business Owners</h2>
            <p className="text-lg text-gray-600">
              Join thousands who've streamlined their permit process
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-blue-400 mb-4" />
                <p className="text-gray-600 mb-6">
                  "What used to take weeks now takes hours. The eLUNSAD platform saved my restaurant business and reduced my stress by 90%."
                </p>
                <div className="flex items-center">
                  <div className="bg-gray-200 h-10 w-10 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Michael Chen</p>
                    <p className="text-sm text-gray-500">Restaurant Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-blue-400 mb-4" />
                <p className="text-gray-600 mb-6">
                  "The automated reminders alone are worth it. I never miss a renewal deadline anymore, and my permits are always current."
                </p>
                <div className="flex items-center">
                  <div className="bg-gray-200 h-10 w-10 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Retail Business Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA - Single Focus */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of businesses who've simplified their permit process. Start your application today.
          </p>
          <Link to="/signin">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Start Your Application Now
            </Button>
          </Link>
          <p className="text-sm mt-4 text-blue-100">Free to start • No credit card required • Secure & trusted</p>
        </div>
      </section>

      {/* Contact Section - Simplified */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-gray-600">support@elunsad.gov</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Simplified */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src="/lovable-uploads/bbd34367-e328-4dff-9103-719d6d3c2bd6.png" alt="eLUNSAD Logo" className="h-8 w-8 bg-white rounded p-1" />
              <h3 className="text-lg font-bold">eLUNSAD</h3>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Business Permit Licensing Office. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
