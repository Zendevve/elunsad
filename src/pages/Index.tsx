
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Database, TrendingUp, MapPin, Bell, Upload, ArrowRight, Quote, Mail, Globe, ChevronDown, Users, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const coreFeatures = [
    {
      icon: Upload,
      title: "Digital Applications",
      description: "Submit and manage permit applications online with intelligent form guidance.",
      bgColor: "bg-slate-50",
      iconColor: "text-slate-700"
    },
    {
      icon: Database,
      title: "Document Hub",
      description: "Centralized document management with automated compliance checking.",
      bgColor: "bg-slate-50",
      iconColor: "text-slate-700"
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Proactive notifications for deadlines, updates, and requirements.",
      bgColor: "bg-slate-50",
      iconColor: "text-slate-700"
    }
  ];

  const advancedFeatures = [
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Data-driven insights for application performance and trends.",
      bgColor: "bg-slate-50",
      iconColor: "text-slate-700"
    },
    {
      icon: MapPin,
      title: "Location Intelligence",
      description: "Geographic visualization of permit data and business density.",
      bgColor: "bg-slate-50",
      iconColor: "text-slate-700"
    },
    {
      icon: CheckCircle,
      title: "Compliance Tracking",
      description: "Automated monitoring of regulatory requirements and deadlines.",
      bgColor: "bg-slate-50",
      iconColor: "text-slate-700"
    }
  ];

  const stats = [
    { number: "15,000+", label: "Permits Processed" },
    { number: "98%", label: "Approval Rate" },
    { number: "3 Days", label: "Average Processing" },
    { number: "24/7", label: "System Availability" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">eL</span>
              </div>
              <span className="text-xl font-semibold tracking-tight text-slate-900">eLUNSAD</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">Features</a>
              <a href="#process" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">Process</a>
              <a href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">Contact</a>
            </nav>
            <Link to="/signin">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white border-0 h-9 px-6 text-sm font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Bold Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="outline" className="text-slate-600 border-slate-200 bg-slate-50">
                  Government Digital Services
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                  Business permits
                  <br />
                  <span className="text-slate-600">in minutes</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  The most efficient way to apply, track, and manage your business permits. 
                  Built for modern businesses who value speed and simplicity.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signin">
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-8 text-base font-medium">
                    Start Application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="h-12 px-8 text-base font-medium border-slate-200 text-slate-600 hover:bg-slate-50">
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>No setup required</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Secure platform</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Application Status</h3>
                    <Badge className="bg-green-100 text-green-700 border-0">Approved</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Business License</span>
                      <span className="text-slate-900 font-medium">Complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Health Permit</span>
                      <span className="text-slate-900 font-medium">Complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Fire Safety</span>
                      <span className="text-slate-900 font-medium">In Review</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Processing Time</span>
                      <span className="text-slate-900 font-medium">2 days</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-50 rounded-2xl transform rotate-1"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">{stat.number}</div>
                <div className="text-slate-600 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Everything you need to manage permits
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              A complete platform designed to streamline the entire permit lifecycle 
              from application to renewal.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="border-0 bg-slate-50 hover:bg-slate-100 transition-colors group">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <feature.icon className="h-8 w-8 text-slate-700 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <CardTitle className="text-xl mb-4 text-slate-900">{feature.title}</CardTitle>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => setShowAllFeatures(!showAllFeatures)}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              {showAllFeatures ? 'Show Less Features' : 'View All Features'}
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAllFeatures ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {showAllFeatures && (
            <div className="grid lg:grid-cols-3 gap-8 mt-12 animate-fade-in">
              {advancedFeatures.map((feature, index) => (
                <Card key={index} className="border-0 bg-slate-50 hover:bg-slate-100 transition-colors group">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <feature.icon className="h-8 w-8 text-slate-700 group-hover:text-slate-900 transition-colors" />
                    </div>
                    <CardTitle className="text-xl mb-4 text-slate-900">{feature.title}</CardTitle>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Three simple steps to get started
            </h2>
            <p className="text-xl text-slate-600">
              Our streamlined process gets you from application to approval faster than ever.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Apply Online", description: "Complete your application using our guided digital forms with real-time validation." },
              { step: "02", title: "Track Progress", description: "Monitor your application status with live updates and automated notifications." },
              { step: "03", title: "Get Approved", description: "Receive your permits digitally and manage renewals with automated reminders." }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 text-white rounded-2xl text-xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/signin">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-8">
                Start Your Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Trusted by business owners everywhere
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <Card className="border-0 bg-slate-50 p-8">
              <CardContent className="p-0">
                <Quote className="h-8 w-8 text-slate-400 mb-6" />
                <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                  "What used to take weeks now takes days. The eLUNSAD platform 
                  transformed how we handle permits for our restaurant chain."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold text-slate-900">Michael Chen</p>
                    <p className="text-sm text-slate-600">Restaurant Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-slate-50 p-8">
              <CardContent className="p-0">
                <Quote className="h-8 w-8 text-slate-400 mb-6" />
                <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                  "The automated reminders and status tracking eliminated all the 
                  guesswork. Our permits are always current and compliant."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold text-slate-900">Sarah Johnson</p>
                    <p className="text-sm text-slate-600">Retail Business Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to streamline your permits?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses who've simplified their permit process with our platform.
          </p>
          <Link to="/signin">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-medium bg-white text-slate-900 hover:bg-slate-100">
              Get Started Today
            </Button>
          </Link>
          <p className="text-sm mt-6 text-slate-400">
            Free to start • No credit card required • Enterprise support available
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Get Support</h2>
            <p className="text-xl text-slate-600 mb-8">
              Our team is here to help you succeed with your permit applications.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
              <div className="flex items-center text-slate-600">
                <Mail className="h-5 w-5 mr-3" />
                <span className="font-medium">support@elunsad.gov</span>
              </div>
              <div className="flex items-center text-slate-600">
                <Clock className="h-5 w-5 mr-3" />
                <span className="font-medium">Monday - Friday: 8AM - 5PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">eL</span>
              </div>
              <span className="text-xl font-semibold text-slate-900">eLUNSAD</span>
            </div>
            <div className="flex space-x-8 text-sm">
              <Link to="/privacy-policy" className="text-slate-600 hover:text-slate-900 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-slate-600 hover:text-slate-900 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-100 mt-8 pt-8 text-center">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Business Permit Licensing Office. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
