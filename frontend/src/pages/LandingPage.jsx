//1st page when we run the application
//this page using publiclayout.jsx from layout folder


import { useState } from 'react';
//Link-A React component used to navigate between pages without reloading the browser
import { Link, useNavigate } from 'react-router-dom';
import { brandImages } from '../assets/imageAssets.js';
import PublicLayout from '../layouts/PublicLayout.jsx';
import { getUser } from '../utils/authStorage.js';

//services in the landing page.image with 
const services = [
  {
    //these all are onjects with values
    title: 'Parcel Pickup',
    description: 'Book a secure pickup and move each parcel into a controlled operational workflow.',
    image: brandImages.clientsideBg1,
    alt: 'Parcel pickup operations in a modern warehouse',
  },
  {
    title: 'Warehouse Routing',
    description: 'Route parcels through local service areas and a structured warehouse handoff.',
    image: brandImages.clientsideBg2,
    alt: 'Multimodal logistics network',
  },
  {
    title: 'Delivery Tracking',
    description: 'Follow public parcel progress while private customer and payment details stay protected.',
    image: brandImages.clientsideBg3,
    alt: 'Modern fleet and logistics operations',
  },
  {
    title: 'Payment Verification',
    description: 'Coordinate advance verification and final settlement with a clear financial trail.',
    image: brandImages.bgLogin,
    alt: 'Secure logistics payment workflow',

  },

];

//This is very similar to services, but there is one difference.

const reasons = [ // Changed to array of objects for better readability and maintainability
  {
    title: 'Secure Workflow',
    description: 'Protected access and validated handoffs keep every operational step accountable.',
  },
  {
    title: 'Role-Based Operations',
    description: 'Customers, finance officers, admins, field teams, and drivers see the tools they need.',
  },
  {
    title: 'Local Tracking',
    description: 'Tracking and core logistics operations run within the project environment without external services.',
  },
  {
    title: 'Clear Payment Settlement',
    description: 'Advance review, balance collection, and settlement status remain visible throughout delivery.',
  },
];

function LandingPage() {
  
  const navigate = useNavigate(); // use navaigate("/track")
  const [trackingNumber, setTrackingNumber] = useState('');//Stores what user types in tracking box. EX:ORD1001
  const [trackingError, setTrackingError] = useState(''); // for setup the error
  const user = getUser(); // {"username":"Sajadh","role":"CUSTOMER"}
let bookingPath = '/login'; //can change beacuse let 


//user not logged means go to login page 
//if loggedin then go to create order part 
//otherwise go to app/dashboard page
if (user) {
  if (user.role === 'CUSTOMER') {
    bookingPath = '/customer/create-order';
  } else {
    bookingPath = '/app'; //if user logged but he is not customer then go to specific role dashboard page
  }
}


//this function is telling after use click track
//event represents the form submit event. (when User clicks Track button Form submit happens submitTracking(event) runs)
  function submitTracking(event) {
    //event.preventDefault(); notmally after form submit page reload but here no
    event.preventDefault();
    //trackingNumber comes from your state:
    const value = trackingNumber.trim();
    if (!value) {
      setTrackingError('Enter an Order ID to track your parcel.');
      return;
    }
    //if order id is correct then it will open the order tracking page
    // //It changes the page to /track?tracking=ORD1001e
    navigate(`/track?tracking=${encodeURIComponent(value)}`); //Why use encodeURIComponent()? for to add some random --> /track?tracking=ORD%201001%2FTest
  }

  //The return() is the HTML structure that React displays on the browser.
  return (
    <PublicLayout>
      <main>
        <section id="home" className="relative isolate flex min-h-[720px] scroll-mt-24 items-center overflow-hidden">
          <img src={brandImages.clientsideBg1} alt="Paragrein warehouse logistics operations" className="absolute inset-0 -z-30 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(5,8,15,0.97)_0%,rgba(5,8,15,0.84)_48%,rgba(5,8,15,0.55)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_25%,rgba(34,197,94,0.18),transparent_32%),linear-gradient(180deg,transparent_72%,#070B14_100%)]" />

          <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
            <div className="max-w-4xl">
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#22C55E]/30 bg-[#07110B]/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#86EFAC] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_16px_rgba(34,197,94,0.9)]" />
                End-to-end logistics across Sri Lanka
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[1.03] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
                Move Smart, <span className="text-[#22C55E]">Move Paragrein.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-[#CBD5E1] sm:text-lg">
                Your reliable partner for secure, end-to-end logistics solutions across Sri Lanka.
              </p>

              <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-start">
                <Link to={bookingPath} className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#22C55E] px-7 text-sm font-black text-[#06110A] shadow-[0_16px_40px_rgba(34,197,94,0.22)] transition hover:-translate-y-0.5 hover:bg-[#2DDB6B]">
                  Create Order
                  <span className="ml-3 text-lg" aria-hidden="true">→</span>
                </Link>
                <form onSubmit={submitTracking} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <label htmlFor="hero-tracking" className="sr-only">Enter Order ID</label>
                    <input
                      id="hero-tracking"
                      value={trackingNumber}
                      onChange={(event) => {
                        setTrackingNumber(event.target.value);
                        setTrackingError('');
                      }}
                      className="h-14 w-full rounded-xl border border-white/15 bg-[#0B1220]/90 px-5 text-sm text-white outline-none backdrop-blur placeholder:text-[#94A3B8] focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
                      placeholder="Enter Order ID"
                    />
                    {trackingError && <p className="mt-2 text-xs font-semibold text-[#FCA5A5]">{trackingError}</p>}
                  </div>
                  <button type="submit" className="h-14 rounded-xl border border-white/15 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur transition hover:border-[#22C55E]/60 hover:bg-[#22C55E]/15">
                    Track
                  </button>
                </form>
              </div>

              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
                <span>Secure booking</span>
                <span className="text-[#22C55E]">•</span>
                <span>Local operations</span>
                <span className="text-[#22C55E]">•</span>
                <span>Full delivery visibility</span>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 border-y border-white/5 bg-[#090E18] py-24">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
            <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-white/10">
              <img src={brandImages.clientsideBg1} alt="Paragrein warehouse routing operation" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/25 to-transparent" />
              <div className="absolute bottom-0 left-0 p-7">
                <p className="text-3xl font-black text-white">One connected workflow.</p>
                <p className="mt-2 text-sm text-[#CBD5E1]">From customer booking to final settlement.</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#22C55E]">About Us</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl">Built to make every logistics handoff clear.</h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#94A3B8]">
                Paragrein is an academic logistics management platform designed around a real Sri Lankan parcel workflow. It connects customer orders, payment verification, pickup assignment, warehouse routing, final delivery, reporting, and settlement in one secure system.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {['Pickup', 'Warehouse', 'Delivery'].map((step, index) => (
                  <div key={step} className="rounded-2xl border border-white/10 bg-[#111827] p-5">
                    <span className="text-xs font-black text-[#22C55E]">0{index + 1}</span>
                    <p className="mt-3 font-bold text-white">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-24 bg-[#070B14] py-24">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#22C55E]">Our Services</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Logistics control from pickup to proof of delivery.</h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => (
                <article key={service.title} className="group overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-2xl shadow-black/20">
                  <div className="relative h-48 overflow-hidden">
                    <img src={service.image} alt={service.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-black/15" /> {/* Removed the number display */}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-black text-white">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#94A3B8]">{service.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-[#0A101C] py-24">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#22C55E]">Why Choose Paragrein</p>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-white">Operational confidence at every checkpoint.</h2>
                <p className="mt-5 text-base leading-8 text-[#94A3B8]">A focused logistics workspace with clear ownership, traceable actions, and no unnecessary external dependency.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {reasons.map(({ title, description }) => ( // Removed 'number' from destructuring
                  <article key={title} className="rounded-2xl border border-white/10 bg-[#111827] p-6 transition hover:border-[#22C55E]/40">
                    <h3 className="mt-4 text-lg font-black text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#94A3B8]">{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="careers" className="scroll-mt-24 bg-[#070B14] py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-[#22C55E]/20 bg-[#0D1722] px-7 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between">
              <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#22C55E]/10 blur-3xl" />
              <div className="relative max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#22C55E]">Careers</p>
                <h2 className="mt-3 text-3xl font-black text-white">Move logistics forward with Paragrein.</h2>
                <p className="mt-3 text-sm leading-6 text-[#94A3B8]">Career enquiries can be directed to the contact details below. This academic platform does not collect applications online.</p>
              </div>
              <a href="#contact" className="relative mt-6 inline-flex rounded-xl border border-[#22C55E]/40 px-5 py-3 text-sm font-bold text-[#86EFAC] transition hover:bg-[#22C55E]/10 lg:mt-0">Contact our team</a>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 border-t border-white/5 bg-[#090E18] py-24">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#22C55E]">Contact Us</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl">Let’s move your next delivery smarter.</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#94A3B8]">For shipment questions, tracking support, or operational enquiries, contact the Paragrein team using the local project contact details.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#111827] p-7">
              <div className="space-y-5 text-sm">
                <div><p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Email</p><p className="mt-2 font-semibold text-white">support@paragrein.local</p></div>
                <div className="border-t border-white/10 pt-5"><p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Service Area</p><p className="mt-2 font-semibold text-white">Sri Lanka</p></div>
                <div className="border-t border-white/10 pt-5"><p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Support</p><p className="mt-2 font-semibold text-white">Available through your Paragrein account</p></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

export default LandingPage;
