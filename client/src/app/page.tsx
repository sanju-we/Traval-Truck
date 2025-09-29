'use client';

import { Footer } from '@/components/user/footer/page';
import { Header } from '@/components/user/header/page';
export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto mt-6">
        <img
          src="/images/Home head.png"
          alt="Hero"
          className="w-full h-[400px] object-cover rounded-xl"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black/40 rounded-xl">
          <h2 className="text-3xl font-bold">Embark on Your Next Adventure</h2>
          <button className="mt-4 px-6 py-3 bg-emerald-500 rounded-lg hover:bg-emerald-600">
            Plan Your Journey
          </button>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-6xl mx-auto mt-12 px-6">
        <h3 className="text-xl font-bold mb-4">Popular Destinations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            '/images/Alappuzha.jpg',
            '/images/Thrissur.jpg',
            '/images/trivadrum.jpg',
            '/images/vayalada.jpg',
          ].map((src, i) => (
            <div key={i} className="rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <img src={src} alt={`Destination ${i + 1}`} className="w-full h-32 object-cover" />
              <div className="p-2 text-sm">
                <h4 className="font-medium">Destination {i + 1}</h4>
                <p className="text-gray-500 text-xs">Short description here</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Trip */}
      <section className="max-w-6xl mx-auto mt-12 px-6">
        <h3 className="text-xl font-bold mb-4">Recent Trip</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src="/images/goa.jpg"
              alt="Recent trip"
              className="w-full h-48 object-cover rounded-lg"
            />
            <h4 className="mt-2 font-medium">Paris Adventure</h4>
            <p className="text-gray-500 text-sm">4 nights / 5 days</p>
          </div>
          <div>
            <img
              src="/images/Wayanad.jpg"
              alt="Recent trip"
              className="w-full h-48 object-cover rounded-lg"
            />
            <h4 className="mt-2 font-medium">Temple Visit</h4>
            <p className="text-gray-500 text-sm">2 nights / 3 days</p>
          </div>
        </div>
      </section>

      {/* Exclusive Packages */}
      <section className="max-w-6xl mx-auto mt-12 px-6">
        <h3 className="text-xl font-bold mb-4">Exclusive Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['/images/Package-1.jpg', '/images/Package-2.jpg', '/images/Package-3.jpg'].map(
            (src, i) => (
              <div key={i} className="border rounded-lg p-4 shadow hover:shadow-md transition">
                <img
                  src={src}
                  alt={`Package ${i + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
                <h4 className="mt-2 font-medium">Package {i + 1}</h4>
                <p className="text-gray-500 text-sm">Short description about package.</p>
                <button className="mt-3 px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600">
                  Join Adventure
                </button>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto mt-12 px-6">
        <h3 className="text-xl font-bold mb-4">Customer Testimonials</h3>
        <div className="grid gap-6">
          {['John', 'Emma', 'Chris'].map((name, i) => (
            <div key={i} className="p-4 border rounded-lg shadow-sm">
              <p className="text-gray-600 text-sm mb-2">
                “This was an amazing experience, everything was well arranged and I really enjoyed
                my trip!”
              </p>
              <h4 className="font-medium">{name}</h4>
              <p className="text-yellow-500">★★★★★</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-6xl mx-auto mt-12 px-6 text-center">
        <h3 className="text-xl font-bold">Stay Updated</h3>
        <p className="text-gray-500 text-sm mt-2">
          Sign up for our newsletter to receive exclusive deals and travel inspiration.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <input
            type="email"
            placeholder="Your email address"
            className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
            Subscribe
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
