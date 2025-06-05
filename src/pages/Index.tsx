import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, BarChart3, FileText, Clock, Bell, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
const Index = () => {
  return <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md">
              <img src="/lovable-uploads/f15f1274-8a45-4de7-acf3-a436e3d7bca9.png" alt="eLUNSAD Logo" className="h-10 w-10 object-contain" />
            </div>
            <span className="text-xl font-bold text-gray-900">eLUNSAD</span>
            <span className="hidden md:inline-block text-sm text-gray-500 ml-2">Business Permit Licensing Office</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">
              Testimonials
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">
              Contact
            </a>
          </nav>
          <div>
            <Link to="/signin">
              <Button className="bg-blue-700 hover:bg-blue-800">Sign Up / Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 lg:py-32">
        <div className="absolute inset-0">
          <img src="/lovable-uploads/0a98a96a-815e-4ef4-aeec-ae2be1bd783b.png" alt="Government building" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-900/60"></div>
        </div>
        <div className="container relative grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-white px-4 py-1.5 text-sm text-blue-700 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              Official Government Platform
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Modernizing the
              <span className="block text-blue-200">Business Permit Process</span>
            </h1>
            <p className="text-xl text-blue-50 max-w-2xl">
              A secure, efficient platform for managing business permit applications, renewals, and compliance for both
              businesses and government agencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signin">
                <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white hover:bg-white text-blue-700">
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative mx-auto lg:mr-0">
            <div className="relative rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
              <img src="/lovable-uploads/8a70bd39-81f9-4507-8c49-ccbcfeece1a6.png" alt="Business permit management dashboard" className="w-full h-auto rounded-lg object-cover" />
              <div className="absolute -bottom-6 -left-6 rounded-lg bg-white p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Processing Time</p>
                    <p className="font-semibold text-blue-700">Reduced by 75%</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 rounded-lg bg-white p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Compliance Rate</p>
                    <p className="font-semibold text-green-700">Increased to 98%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">98%</div>
              <div className="text-gray-600 font-medium">Faster Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Permits Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">System Availability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">99.9%</div>
              <div className="text-gray-600 font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 mb-4">
              Key Features
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Streamlining Government Processes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform connects business owners with licensing offices, streamlining the application process,
              automating renewals, and providing real-time status updates for all stakeholders.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Secure Processing</h3>
              <p className="text-gray-600">
                Government-grade security protocols ensure all permit data and personal information remains protected.
              </p>
            </div>

            <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Smart Notifications</h3>
              <p className="text-gray-600">
                Automated reminders ensure businesses never miss critical deadlines or renewal dates.
              </p>
            </div>

            <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Advanced Analytics</h3>
              <p className="text-gray-600">
                Comprehensive reporting tools help government agencies make data-driven policy decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Features */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 mb-4">
              Comprehensive Solution
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Complete Permit Management</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides powerful tools for both business owners and government licensing offices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Online Applications & Renewals</h3>
              <p className="text-gray-600">
                Submit and manage permit applications and renewals from anywhere, anytime with our secure portal.
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Document Management</h3>
              <p className="text-gray-600">
                Securely upload, store, and manage all required documentation in one centralized location.
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Gain insights with visual analytics and reporting on application trends and processing metrics.
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Zoning & Compliance Maps</h3>
              <p className="text-gray-600">
                Interactive maps showing permit locations, zoning regulations, and compliance requirements.
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Automated Notifications</h3>
              <p className="text-gray-600">
                Timely alerts for deadlines, status changes, and important regulatory updates.
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Performance Tracking</h3>
              <p className="text-gray-600">
                Monitor processing times and identify opportunities for operational improvements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 mb-4">
              Process Overview
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined process makes managing business permits simple, efficient, and transparent.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="relative z-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-white font-bold">
                  1
                </div>
                <div className="mb-4 h-48 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80" alt="Register and Sign In" className="w-full h-full object-cover" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Register & Sign In</h3>
                <p className="text-gray-600">
                  Create your secure government account and access your personalized dashboard.
                </p>
              </div>
              <div className="absolute top-1/2 left-full hidden h-px w-12 bg-dashed border-t-2 border-dashed border-gray-300 md:block"></div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-white font-bold">
                  2
                </div>
                <div className="mb-4 h-48 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80" alt="Submit Application" className="w-full h-full object-cover" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Submit Application</h3>
                <p className="text-gray-600">
                  Complete digital forms and upload required documents through our secure portal.
                </p>
              </div>
              <div className="absolute top-1/2 left-full hidden h-px w-12 bg-dashed border-t-2 border-dashed border-gray-300 md:block"></div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-white font-bold">
                  3
                </div>
                <div className="mb-4 h-48 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80" alt="Track and Get Reminded" className="w-full h-full object-cover" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Track & Monitor</h3>
                <p className="text-gray-600">
                  Follow your application's progress in real-time and receive official notifications at each stage.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/signin">
              <Button className="bg-blue-700 hover:bg-blue-800">
                Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 mb-4">
              Success Stories
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">What Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from business owners and government officials about their experience with our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-xl bg-white p-8 shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50&q=80" alt="Sarah Johnson" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Small Business Owner</p>
                </div>
              </div>
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>)}
              </div>
              <p className="text-gray-600">
                "The eUNSAD platform has completely transformed how we manage business permits. The automated workflows
                and tracking features have reduced our paperwork by 80%."
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50&q=80" alt="Michael Chen" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Michael Chen</h4>
                  <p className="text-sm text-gray-500">Restaurant Owner</p>
                </div>
              </div>
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>)}
              </div>
              <p className="text-gray-600">
                "As a restaurant owner, managing permits used to be my biggest headache. eUNSAD has made it so easy to
                explore and submit applications that I now have more time to focus on my business."
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50&q=80" alt="David Rodriguez" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">David Rodriguez</h4>
                  <p className="text-sm text-gray-500">City Permit Officer</p>
                </div>
              </div>
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>)}
              </div>
              <p className="text-gray-600">
                "The analytics and reporting features have transformed the way our department operates. We can now make
                data-driven decisions about business development and regulatory compliance."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-700 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Permit Process?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and government agencies already saving time and resources with our official
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signin">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                Create an Account
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-800">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 mb-4">
              Get in Touch
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Have questions or need assistance?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our government support team is here to help.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">support@eunsad.gov</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Office Hours</p>
                    <p className="font-medium">Monday - Friday: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">(555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Send Us a Message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input type="text" id="name" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input type="email" id="email" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Your email" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input type="text" id="subject" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Message subject" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea id="message" rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="How can we help you?"></textarea>
                </div>
                <Button className="w-full bg-blue-700 hover:bg-blue-800">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                  <img src="/lovable-uploads/f15f1274-8a45-4de7-acf3-a436e3d7bca9.png" alt="eLUNSAD Logo" className="h-8 w-8 object-contain" />
                </div>
                <span className="text-xl font-bold text-white">eLUNSAD</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Business Permit Licensing Office - Streamlining government processes for a more efficient future.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Accessibility
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    FOIA
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Government Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Business Registration
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Regulatory Compliance
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Small Business Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Government Directory
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Business Permit Licensing Office. All rights reserved. An official government website.</p>
            <div className="mt-2 flex justify-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Accessibility
              </a>
              <span className="text-gray-600">|</span>
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-600">|</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;