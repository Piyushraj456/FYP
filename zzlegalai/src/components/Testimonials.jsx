import Marquee from "react-fast-marquee";
import { Quote } from "lucide-react";


const testimonials = [
  {
    id: 1,
    name: "Advocate Sk Sahil",
    role: "Senior Partner, Delhi High Court",
    text: "Advocate.ai has revolutionized how I research case laws. The AI chatbot provides accurate references and saves me hours of manual research.",
    rating: 5,
    img: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Business Owner, Mumbai",
    text: "The V-KYC process was seamless and the video consultation feature helped me resolve my property dispute efficiently.",
    rating: 5,
    img: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: 3,
    name: "Dr. Sunita Reddy",
    role: "Legal Researcher, Bangalore",
    text: "The legal library is incredibly comprehensive. AI-powered summaries help me understand complex judgments quickly.",
    rating: 5,
    img: "https://i.pravatar.cc/100?img=32",
  },
  {
    id: 4,
    name: "Ananya Gupta",
    role: "Law Student, Kolkata",
    text: "LegalEase helps me prepare for exams faster with quick access to case summaries and references.",
    rating: 4,
    img: "https://i.pravatar.cc/100?img=48",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">
          What Our Users Say
        </h2>

        <Marquee gradient={false} speed={50} pauseOnHover>
          <div className="flex space-x-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white shadow-md rounded-xl p-6 w-80 flex-shrink-0 hover:shadow-lg transition-shadow duration-300"
              >
                <Quote className="text-blue-500 mb-3" size={28} />
                <p className="text-gray-700 text-sm mb-4">"{t.text}"</p>

                {/* Rating */}
                <div className="flex text-yellow-400 mb-4">
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  );
};

export default Testimonials;
