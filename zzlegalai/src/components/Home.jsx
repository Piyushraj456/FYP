import {Upload, FileText, CheckCircle, ChevronDown} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
     
  const handleUploadClick = () => {
    navigate('/upload');
  }

  const scrollToCards = () => {
    document.getElementById('feature-cards').scrollIntoView({ 
      behavior: 'smooth' 
    });
  }
     
  const {authUser} = useAuthContext();
     
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Hero Section - Full viewport height */}
      <div className="min-h-screen flex items-center justify-center relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-lg opacity-30 animate-pulse"></div>
          <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-green-200 rotate-45 opacity-25 animate-spin" style={{animationDuration: '8s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute bottom-20 right-10 w-18 h-18 bg-indigo-200 rounded-lg opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
          
          {/* Floating documents icons */}
          <div className="absolute top-1/4 left-1/3 opacity-10 animate-float">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div className="absolute bottom-1/3 right-1/4 opacity-10 animate-float" style={{animationDelay: '2s'}}>
            <CheckCircle className="w-10 h-10 text-purple-600" />
          </div>
          <div className="absolute top-2/3 left-1/6 opacity-10 animate-float" style={{animationDelay: '4s'}}>
            <Upload className="w-6 h-6 text-green-600" />
          </div>
          
          {/* Gradient orbs */}
          <div className="absolute top-10 right-1/4 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-pulse" style={{animationDuration: '4s'}}></div>
          <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s', animationDuration: '6s'}}></div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Understand Legal Documents
            <span className="text-blue-600"> Instantly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Upload any legal document and get a clear, simple explanation of what it means. 
            No legal jargon, just plain English that everyone can understand.
          </p>
                 
          <button
            onClick={handleUploadClick}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg mb-16"
          >
            {authUser ? 'Upload Document Now' : 'Get Started'}
          </button>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button 
              onClick={scrollToCards}
              className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition-colors "
            >
              <span className="text-sm mb-2">Learn More</span>
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
                 
      {/* Feature Cards Section - Full width */}
      <div id="feature-cards" className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Three simple steps to understand any legal document</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Easy Upload</h3>
              <p className="text-gray-600 text-center">Simply drag and drop your legal document or click to upload. We support PDF, DOC, and DOCX files.</p>
            </div>
                     
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">AI Analysis</h3>
              <p className="text-gray-600 text-center">Our advanced AI analyzes your document and identifies key terms, obligations, and important clauses.</p>
            </div>
                     
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Simple Explanation</h3>
              <p className="text-gray-600 text-center">Get a clear, jargon-free summary with highlighted important points that matter most.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;