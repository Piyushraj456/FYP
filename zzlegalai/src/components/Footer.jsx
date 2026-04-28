import { Mail, Phone, MapPin, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Company Info */}
        <div className="col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-7 w-7 text-green-500" />
            <span className="text-xl font-bold text-white">LegalEase</span>
          </div>
          <p className="text-sm mb-4">
            Empowering legal access with AI. Your intelligent companion for case
            research, document analysis, and connecting with expert advocates.
          </p>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" /> support@legalease.com
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" /> +91 98765 43210
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" /> Noida, India
            </p>
          </div>
        </div>

        {/* Platform */}
        <div>
          <h3 className="text-white font-semibold mb-3">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/ai-chatbot" className="hover:text-white">AI Chatbot</a></li>
            <li><a href="/library" className="hover:text-white">Legal Library</a></li>
            <li><a href="/consult" className="hover:text-white">Video Consult</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
            <li><a href="/cookies" className="hover:text-white">Cookie Policy</a></li>
            <li><a href="/compliance" className="hover:text-white">Compliance</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/help" className="hover:text-white">Help Center</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
            <li><a href="/docs" className="hover:text-white">Documentation</a></li>
            <li><a href="/api" className="hover:text-white">API Reference</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 text-sm">
          <p>
            © {new Date().getFullYear()} LegalEase. All rights reserved. | Built with{" "}
            <span className="text-red-500">♥</span> for people  who want legal help 
          </p>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
