
import React from "react";
import { Link } from "react-router-dom";
import { Rocket, BarChart2, CheckCircle, Database, TrendingUp, MapPin, Bell, Upload, ArrowRight, Quote, Mail, Globe, Sparkles, Shield, Zap, Award, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Header & Navigation */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/bbd34367-e328-4dff-9103-719d6d3c2bd6.png" alt="eLUNSAD Logo" className="h-12 w-12" />
              <h1 className="text-2xl font-display font-bold text-gradient">eLUNSAD</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Testimonials</a>
              <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Contact</a>
            </nav>
            <div>
              <Link to="/signin">
                <Button className="bg-hero-gradient text-white font-semibold px-6 py-3 hover:shadow-lg transition-all duration-300">
                  Sign In / Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Dramatic Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl floating-element"></div>
          <div className="absolute bottom-32 right-16 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl floating-element" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-300/15 rounded-full blur-2xl floating-element" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="slide-up">
            <Badge className="mb-8 bg-white/20 text-white border-white/30 px-6 py-2 text-lg font-medium">
              <Sparkles className="mr-2 h-5 w-5" />
              Revolutionizing Government Services
            </Badge>
          </div>
          
          <h1 className="slide-up slide-up-delay-1 font-display text-6xl md:text-8xl font-bold leading-tight mb-8 text-shadow-lg">
            Transform Your
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Permit Journey
            </span>
          </h1>
          
          <p className="slide-up slide-up-delay-2 text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Experience the future of business licensing with our intelligent platform that transforms 
            complex bureaucracy into seamless digital experiences.
          </p>
          
          <div className="slide-up slide-up-delay-3 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link to="/applications/new">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 font-bold px-8 py-4 text-lg shadow-elegant scale-hover pulse-glow">
                Start Your Application
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-700 font-semibold px-8 py-4 text-lg backdrop-blur-sm scale-hover">
                Discover Features
              </Button>
            </a>
          </div>

          {/* Stats Row */}
          <div className="slide-up slide-up-delay-3 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-white/80">Applications Processed</div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-white/80">Approval Rate</div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Support Available</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
          <div className="flex flex-col items-center">
            <div className="w-1 h-16 bg-white/30 rounded-full mb-2"></div>
            <ArrowRight className="h-6 w-6 rotate-90" />
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="font-display text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Where Innovation Meets
              <span className="text-gradient"> Government</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              We bridge the gap between complex government processes and modern user expectations, 
              creating experiences that delight both citizens and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <Card className="border-0 shadow-elegant hover:shadow-2xl transition-all duration-500 group-hover:scale-105 bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardContent className="pt-8 pb-8 px-8">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-2xl inline-flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="mb-4 text-2xl font-display">Lightning Fast</CardTitle>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    What once took weeks now happens in minutes. Our intelligent automation 
                    accelerates every step of the permit process.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="border-0 shadow-elegant hover:shadow-2xl transition-all duration-500 group-hover:scale-105 bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="pt-8 pb-8 px-8">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl inline-flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="mb-4 text-2xl font-display">Bulletproof Security</CardTitle>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Bank-level encryption and compliance ensure your sensitive business 
                    information remains protected at every step.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="border-0 shadow-elegant hover:shadow-2xl transition-all duration-500 group-hover:scale-105 bg-gradient-to-br from-rose-50 to-pink-50">
                <CardContent className="pt-8 pb-8 px-8">
                  <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-4 rounded-2xl inline-flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="mb-4 text-2xl font-display">Award Winning</CardTitle>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Recognized by government innovation awards for transforming 
                    citizen services and administrative efficiency.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 px-4 py-2 text-base">
              Powerful Features
            </Badge>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need,
              <span className="text-gradient"> Nothing You Don't</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Our comprehensive platform provides all the tools necessary for seamless permit management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Smart Applications",
                description: "AI-powered forms that adapt to your business type and pre-fill common information.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Database,
                title: "Secure Vault",
                description: "Military-grade document storage with instant retrieval and version control.",
                gradient: "from-emerald-500 to-green-500"
              },
              {
                icon: TrendingUp,
                title: "Live Analytics",
                description: "Real-time insights and predictive analytics to optimize your permit strategy.",
                gradient: "from-purple-500 to-indigo-500"
              },
              {
                icon: MapPin,
                title: "Interactive Maps",
                description: "Visualize permit zones, regulations, and business opportunities in your area.",
                gradient: "from-red-500 to-pink-500"
              },
              {
                icon: Bell,
                title: "Intelligent Alerts",
                description: "Proactive notifications that prevent missed deadlines and compliance issues.",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: BarChart2,
                title: "Performance Tracking",
                description: "Monitor processing times and optimize workflows for maximum efficiency.",
                gradient: "from-indigo-500 to-purple-500"
              }
            ].map((feature, index) => (
              <Card key={feature.title} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <CardContent className="pt-8 pb-8 px-8">
                  <div className={`bg-gradient-to-br ${feature.gradient} p-4 rounded-2xl inline-flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="mb-4 text-xl font-display">{feature.title}</CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Redesigned */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-18-15c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z\" fill=\"%23ffffff\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-4 py-2 text-base">
              Simple Process
            </Badge>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-shadow-lg">
              Three Steps to
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent"> Success</span>
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Our streamlined process eliminates complexity and delivers results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-y-1/2 z-0"></div>
            
            {[
              {
                number: "01",
                title: "Register & Verify",
                description: "Create your secure account with enterprise-grade authentication and verification.",
                icon: Users
              },
              {
                number: "02", 
                title: "Smart Application",
                description: "Our AI guides you through personalized forms that adapt to your specific needs.",
                icon: Sparkles
              },
              {
                number: "03",
                title: "Live Tracking",
                description: "Monitor progress in real-time with intelligent notifications and status updates.",
                icon: Clock
              }
            ].map((step, index) => (
              <div key={step.number} className="relative z-10 group">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
                  <CardContent className="pt-8 pb-8 px-8 text-center">
                    <div className="bg-gradient-to-br from-yellow-400 to-pink-400 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                      <span className="text-2xl font-bold text-gray-900">{step.number}</span>
                    </div>
                    <step.icon className="h-8 w-8 text-white/70 mx-auto mb-4" />
                    <CardTitle className="mb-4 text-2xl font-display text-white">{step.title}</CardTitle>
                    <p className="text-white/80 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/signin">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 font-bold px-8 py-4 text-lg shadow-elegant scale-hover">
                Begin Your Journey
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Users Say</h2>
            <p className="text-lg text-gray-600">
              Hear from business owners and licensing offices about their experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-blue-400 mb-4" />
                <p className="text-gray-600 mb-6">
                  "The eLUNSAD platform has completely transformed how we process business permits. 
                  The automated reminders and tracking features have reduced our paperwork by 60%."
                </p>
                <div className="flex items-center">
                  <div className="bg-gray-200 h-10 w-10 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Licensing Office Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-blue-400 mb-4" />
                <p className="text-gray-600 mb-6">
                  "As a restaurant owner, managing permits used to be a headache. Now I can track 
                  everything from my phone and submit renewals with just a few clicks!"
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
                  "The analytics and reporting features have been invaluable for our city planning 
                  department. We can now make data-driven decisions about business development."
                </p>
                <div className="flex items-center">
                  <div className="bg-gray-200 h-10 w-10 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">David Rodriguez</p>
                    <p className="text-sm text-gray-500">City Planner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Permit Process?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and licensing offices already saving time and resources.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/signin">
              <Button size="lg" variant="secondary">
                Create an Account
              </Button>
            </Link>
            <a href="#contact">
              <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white hover:text-blue-600">
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4">Contact</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600">
              Have questions or need assistance? Our support team is here to help.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">support@permits.gov</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Office Hours</p>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Your email" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="How can we help you?"></textarea>
                </div>
                <Button className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/lovable-uploads/bbd34367-e328-4dff-9103-719d6d3c2bd6.png" alt="eLUNSAD Logo" className="h-8 w-8 bg-white rounded p-1" />
                <h3 className="text-lg font-bold">eLUNSAD</h3>
              </div>
              <p className="text-gray-400">
                Streamlining business permits for a more efficient future.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
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
