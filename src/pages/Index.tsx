
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Users, BarChart3, Vote, CheckCircle, Lock } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-blue-900">Vote4urRights</h1>
            <p className="text-sm text-blue-600">Your Vote, Your Voice, Your Right</p>
          </div>
          <div className="space-x-4 animate-slide-in-right">
            <Link to="/login">
              <Button variant="outline" className="hover-lift">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="civic-gradient hover-lift">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Vote,<br />
                <span className="text-blue-600">Your Voice,</span><br />
                Your Right
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Secure, transparent, and accessible voting platform that empowers democracy. 
                Make your voice heard in every election with complete confidence and trust.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="civic-gradient hover-lift text-lg px-8 py-6">
                  Start Voting Today
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="hover-lift text-lg px-8 py-6">
                Learn More
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 animate-counter">1000+</div>
                <div className="text-sm text-gray-500">Votes Cast</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 animate-counter">50+</div>
                <div className="text-sm text-gray-500">Elections</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 animate-counter">99.9%</div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Right Image/Visual */}
          <div className="relative animate-slide-in-right">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 card-hover">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Presidential Election 2024</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Live</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover-lift">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">John Smith</div>
                        <div className="text-sm text-gray-500">Democratic Party</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">45.2%</div>
                      <div className="text-sm text-gray-500">2,451 votes</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover-lift">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">Jane Doe</div>
                        <div className="text-sm text-gray-500">Republican Party</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">38.7%</div>
                      <div className="text-sm text-gray-500">2,096 votes</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover-lift">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">Bob Wilson</div>
                        <div className="text-sm text-gray-500">Independent</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">16.1%</div>
                      <div className="text-sm text-gray-500">873 votes</div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full civic-gradient hover-lift">
                  <Vote className="w-4 h-4 mr-2" />
                  Cast Your Vote
                </Button>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full opacity-20 pulse-shadow"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-500 rounded-full opacity-20 pulse-shadow animation-delay-1000"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Vote4urRights?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge security with user-friendly design to deliver 
              a voting experience you can trust.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover animate-scale-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Secure & Private</h3>
                <p className="text-gray-600">
                  End-to-end encryption ensures your vote remains completely private and secure.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover animate-scale-in animation-delay-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Transparent Results</h3>
                <p className="text-gray-600">
                  Real-time results with complete transparency and verifiable vote counting.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover animate-scale-in animation-delay-400">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Easy to Use</h3>
                <p className="text-gray-600">
                  Intuitive interface designed for voters of all ages and technical backgrounds.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-counter">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">Uptime</div>
            </div>
            <div className="animate-counter animation-delay-200">
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-200">Votes Cast</div>
            </div>
            <div className="animate-counter animation-delay-400">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Elections</div>
            </div>
            <div className="animate-counter animation-delay-600">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-200">Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of voters who trust Vote4urRights for secure, transparent elections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="civic-gradient hover-lift text-lg px-8 py-6">
                  Register to Vote
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="hover-lift text-lg px-8 py-6">
                  Login to Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Vote4urRights</h3>
            <p className="text-gray-400 mb-4">Your Vote, Your Voice, Your Right</p>
            <p className="text-sm text-gray-500">
              © 2024 Vote4urRights. Empowering democracy through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
