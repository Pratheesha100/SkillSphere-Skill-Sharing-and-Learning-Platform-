import React from "react";
import { MapPin, Phone, Mail, FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, Copyright } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-black via-[#122b4d] to-[#1a4a8f] text-white pt-10 px-6 rounded-t-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {/* Replace with your logo if needed */}
            <span className="font-bold text-lg tracking-wide flex items-center gap-1">
              <span className="bg-white rounded-full p-1">
                {/* Example: Lucide icon as logo */}
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
                  <rect x="4" y="4" width="16" height="16" rx="4" />
                </svg>
              </span>
              skipmatrix
            </span>
          </div>
          <div className="text-sm mb-2">
            20619 Torrence Chapel Rd<br />
            Suite 116 #1040<br />
            Cornelius, NC 28031<br />
            United States
          </div>
          <div className="flex flex-col gap-1 text-sm mt-4">
            <div className="flex gap-2 items-center">
              <Phone className="w-4 h-4" /> <span>1-800-201-1019</span>
            </div>
            <div className="flex gap-2 items-center">
              <Mail className="w-4 h-4" /> <span>support@skipmatrix.com</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="font-semibold mb-2">Quick links</div>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Pricing</a></li>
            <li><a href="#" className="hover:underline">Resources</a></li>
            <li><a href="#" className="hover:underline">About us</a></li>
            <li><a href="#" className="hover:underline">FAQ</a></li>
            <li><a href="#" className="hover:underline">Contact us</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <div className="font-semibold mb-2">Social</div>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2"><FacebookIcon className="w-4 h-4" /> Facebook</li>
            <li className="flex items-center gap-2"><InstagramIcon className="w-4 h-4" /> Instagram</li>
            <li className="flex items-center gap-2"><LinkedinIcon className="w-4 h-4" /> LinkedIn</li>
            <li className="flex items-center gap-2"><TwitterIcon className="w-4 h-4" /> Twitter</li>
            <li className="flex items-center gap-2"><YoutubeIcon className="w-4 h-4" /> Youtube</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <div className="font-semibold mb-2">Legal</div>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Terms of service</a></li>
            <li><a href="#" className="hover:underline">Privacy policy</a></li>
            <li><a href="#" className="hover:underline">Cookie policy</a></li>
          </ul>
        </div>
      </div>

      {/* Thin white line */}
      <div className="border-t border-white/30 my-8"></div>

      {/* Newsletter section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6">
        <div>
          <div className="font-semibold mb-1">Never miss an update</div>
          <div className="text-sm text-gray-200 max-w-md">
            Get all the latest news, blog posts and product updates from <span className="font-bold text-white">Viroka</span>. Deliver directly to your inbox. We'll rarely send more than once email a month.
          </div>
        </div>
        <form className="flex flex-col md:flex-row items-center gap-2">
          <input
            type="email"
            placeholder="example@gmail.com"
            className="px-4 py-2 rounded bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded bg-white text-blue-700 font-semibold hover:bg-blue-200 transition"
          >
            Join
          </button>
          <div className="flex items-center mt-2 md:mt-0 md:ml-4">
            <input type="checkbox" id="marketing" className="mr-2 accent-blue-500" />
            <label htmlFor="marketing" className="text-xs text-gray-200">
              I agree to receive marketing emails from viroka
            </label>
          </div>
        </form>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-gray-200 pb-2">
        <div className="flex items-center gap-1">
          <Copyright className="w-4 h-4 inline" /> 2024 Skipmatrix. All rights reserved.
        </div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
