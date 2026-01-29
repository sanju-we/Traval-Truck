'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Compass, 
  Route, 
  Sparkles, 
  Users, 
  Calendar, 
  TrendingUp,
  Shield,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  Navigation,
  Plane,
  Camera,
  Mountain,
  Waves,
  Sun,
  Cloud,
  Heart
} from 'lucide-react';

// Floating Icon Component
function FloatingIcon({ icon: Icon, delay = 0, duration = 3 }) {
  return (
    <div 
      className="absolute animate-float opacity-20"
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      <Icon size={32} className="text-blue-400" />
    </div>
  );
}

// Animated Counter
function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count.toLocaleString()}{suffix}</>;
}

// Travel Card Component
function TravelCard({ title, location, distance, day, color }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative p-4 rounded-xl transition-all duration-300 cursor-pointer ${
        isHovered ? 'scale-105 shadow-2xl' : 'shadow-lg'
      }`}
      style={{ background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ background: color }}
        >
          {day}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-xs text-gray-600 flex items-center gap-1">
            <MapPin size={12} />
            {location} • {distance}
          </div>
        </div>
        {isHovered && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Star size={14} className="text-yellow-900" />
          </div>
        )}
      </div>
    </div>
  );
}

// Feature Card with Hover Effect
function FeatureCard({ icon: Icon, title, description, gradient }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative p-8 rounded-2xl border transition-all duration-500 overflow-hidden ${
        isHovered ? 'shadow-2xl -translate-y-2' : 'shadow-lg'
      }`}
      style={{ 
        background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        borderColor: gradient[1]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 ${
          isHovered ? 'rotate-12 scale-110' : ''
        }`}
        style={{ background: gradient[2] }}
      >
        <Icon className="text-white" size={28} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700">{description}</p>
      
      {isHovered && (
        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-20 animate-ping"
          style={{ background: gradient[2] }}
        />
      )}
    </div>
  );
}

// Journey Step Component
function JourneyStep({ number, icon: Icon, title, description, accent }: any) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), number * 200);
    return () => clearTimeout(timer);
  }, [number]);

  return (
    <div 
      className={`text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="relative inline-block mb-6">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${accent[0]}, ${accent[1]})` }}
        >
          {number}
        </div>
        <div 
          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-bounce"
          style={{ background: accent[2] }}
        >
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Testimonial Card
function TestimonialCard({ name, location, text, rating }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 mb-4 italic">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
          {name[0]}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin size={10} />
            {location}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes drift {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          50% { transform: translateX(30px) rotate(10deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-drift {
          animation: drift 8s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Navigation className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                TravelTruck
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
              <a href="#journey" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Reviews</a>
              <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Login</Link>
              <Link href="/signup" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-20 left-10"><FloatingIcon icon={Plane} delay={0} /></div>
        <div className="absolute top-40 right-20"><FloatingIcon icon={Mountain} delay={1} /></div>
        <div className="absolute bottom-40 left-32"><FloatingIcon icon={Camera} delay={0.5} /></div>
        <div className="absolute top-60 right-40"><FloatingIcon icon={Compass} delay={1.5} /></div>
        <div className="absolute bottom-20 right-10"><FloatingIcon icon={Waves} delay={2} /></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium mb-6 shadow-md animate-bounce">
                <Sparkles size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
                AI-Powered Trip Planning
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Plan Your Perfect
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  Road Trip
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Create AI-optimized travel itineraries, discover hidden gems, and track your journey with intelligent route planning. Your adventure starts here! ✈️
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
                  Start Planning Free
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#journey" className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 border-2 border-gray-200 flex items-center justify-center gap-2 hover:border-blue-300">
                  <Compass size={20} className="animate-spin" style={{ animationDuration: '3s' }} />
                  Explore Features
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900"><AnimatedCounter end={1250} suffix="+" /></div>
                  <div className="text-sm text-gray-600">Trips Planned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900"><AnimatedCounter end={3420} suffix="+" /></div>
                  <div className="text-sm text-gray-600">Happy Travelers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900"><AnimatedCounter end={45} suffix="+" /></div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
              </div>
            </div>

            {/* Animated Travel Card */}
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <MapPin className="text-white" size={28} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Your Next Adventure</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Sparkles size={12} className="text-yellow-500" />
                      AI-Optimized Route
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <TravelCard
                    title="Kerala Backwaters"
                    location="Alappuzha"
                    distance="120 km"
                    day="1"
                    color="#3B82F6"
                  />
                  <TravelCard
                    title="Munnar Hill Station"
                    location="Tea Gardens"
                    distance="85 km"
                    day="2"
                    color="#8B5CF6"
                  />
                  <TravelCard
                    title="Thekkady Wildlife"
                    location="Periyar Reserve"
                    distance="95 km"
                    day="3"
                    color="#EC4899"
                  />
                </div>

                <div className="pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Distance</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">300 km</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Budget</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₹12.5K</div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Sun size={24} className="text-yellow-900" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center shadow-lg animate-drift">
                <Cloud size={20} className="text-blue-900" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                <Sparkles size={24} />
                <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Smart Travel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to plan, track, and enjoy your perfect road trip 🚗
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Sparkles}
              title="AI-Powered Planning"
              description="Our AI analyzes your preferences, budget, and time to create the perfect itinerary with optimized routes."
              gradient={['#EFF6FF', '#DBEAFE', '#3B82F6']}
            />
            <FeatureCard
              icon={Route}
              title="Smart Route Optimization"
              description="Get the shortest, safest, and most scenic routes with real-time traffic updates and alternative paths."
              gradient={['#F3E8FF', '#E9D5FF', '#8B5CF6']}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Budget Tracking"
              description="Track expenses in real-time with AI-powered budget predictions and cost-saving recommendations."
              gradient={['#ECFDF5', '#D1FAE5', '#10B981']}
            />
            <FeatureCard
              icon={MapPin}
              title="Hidden Gems Discovery"
              description="Discover local attractions, restaurants, and experiences that other travelers love but tourists miss."
              gradient={['#FFF7ED', '#FFEDD5', '#F97316']}
            />
            <FeatureCard
              icon={Users}
              title="Collaborative Planning"
              description="Plan together with friends and family. Share itineraries, vote on destinations, and sync schedules."
              gradient={['#FCE7F3', '#FBE7F4', '#EC4899']}
            />
            <FeatureCard
              icon={Shield}
              title="Safety First"
              description="Real-time safety alerts, emergency contacts, and travel insurance recommendations for peace of mind."
              gradient={['#EEF2FF', '#E0E7FF', '#6366F1']}
            />
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute top-20 left-10 opacity-10"><Mountain size={100} className="text-blue-600 animate-float" /></div>
        <div className="absolute bottom-20 right-10 opacity-10"><Waves size={100} className="text-purple-600 animate-drift" /></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Journey in 3 Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start planning your perfect trip in minutes 🗺️
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <JourneyStep
              number={1}
              icon={Zap}
              title="Set Your Preferences"
              description="Tell us your destination, dates, budget, and travel style. Our AI will understand your preferences."
              accent={['#3B82F6', '#8B5CF6', '#FBBF24']}
            />
            <JourneyStep
              number={2}
              icon={Sparkles}
              title="AI Creates Your Plan"
              description="Watch as our AI generates a personalized itinerary with optimized routes and recommendations."
              accent={['#8B5CF6', '#EC4899', '#10B981']}
            />
            <JourneyStep
              number={3}
              icon={CheckCircle}
              title="Hit The Road"
              description="Download your offline map, share with friends, and enjoy your perfectly planned adventure!"
              accent={['#EC4899', '#F97316', '#3B82F6']}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by Travelers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our community says about their adventures 💬
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Priya Sharma"
              location="Mumbai, India"
              text="TravelTruck made planning our Kerala trip so easy! The AI suggested places we never knew existed. Best vacation ever!"
              rating={5}
            />
            <TestimonialCard
              name="Rahul Mehta"
              location="Delhi, India"
              text="The budget tracking feature saved us so much money. Plus the offline maps worked perfectly in remote areas."
              rating={5}
            />
            <TestimonialCard
              name="Ananya Reddy"
              location="Bangalore, India"
              text="Love how easy it is to collaborate with friends. We planned our Rajasthan road trip together seamlessly!"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 animate-float"><Heart size={60} /></div>
          <div className="absolute bottom-20 right-40 animate-drift"><Star size={40} /></div>
          <div className="absolute top-40 right-20 animate-float"><Compass size={50} /></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold mb-2"><AnimatedCounter end={1250} suffix="+" /></div>
              <div className="text-blue-100">Trips Planned</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold mb-2"><AnimatedCounter end={3420} suffix="+" /></div>
              <div className="text-blue-100">Happy Travelers</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold mb-2"><AnimatedCounter end={45} suffix="+" /></div>
              <div className="text-blue-100">Countries Covered</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold mb-2"><AnimatedCounter end={125} suffix="K+" /></div>
              <div className="text-blue-100">Km Traveled</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-3 text-6xl">
              <span className="animate-bounce">🌍</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>✈️</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🗺️</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of travelers who trust TravelTruck for their adventures
          </p>
          <Link href="/signup" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 text-lg hover:scale-105">
            Create Your First Trip Free
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Navigation className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold">TravelTruck</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered travel planning for the modern explorer 🚀
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2024 TravelT