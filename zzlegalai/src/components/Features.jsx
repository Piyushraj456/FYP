import { FileText, Search, AlertTriangle, BookOpen } from "lucide-react";

const features = [
  {
    icon: <FileText className="h-10 w-10 " />,
    title: "Smart PDF Extraction",
    description:
      "Upload contracts and legal documents. Our AI extracts clean, structured text using advanced PDF parsing.",
    points: ["Accurate text capture", "Supports long contracts", "Metadata insights"],
    color: "blue",
  },
  {
    icon: <Search className="h-10 w-10 " />,
    title: "Clause Detection",
    description:
      "Automatically detect key clauses like termination, confidentiality, and liability with NLP + regex.",
    points: ["Keyword-based search", "Clause categorization", "Context-aware detection"],
    color: "green",
  },
  {
    icon: <BookOpen className="h-10 w-10 " />,
    title: "AI-Powered Summaries",
    description:
      "Get concise executive summaries of lengthy contracts using Gemini AI — save hours of manual reading.",
    points: ["Readable insights", "Focus on key terms", "Auto-generated in seconds"],
    color: "purple",
  },
  {
    icon: <AlertTriangle className="h-10 w-10 " />,
    title: "Risk Identification",
    description:
      "Highlight risky clauses in your documents to avoid compliance issues and negotiate better contracts.",
    points: ["Detect high-risk terms", "Prioritize critical sections", "Reduce legal blind spots"],
    color: "red",
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          🚀 Key Features of LegalEase
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-${feature.color}-100 ${feature.color === "blue" ? "text-blue-900" : ""}  rounded-2xl shadow-sm p-6 
                          hover:shadow-md transition-all hover:-translate-y-1 
                          `}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-[50%] bg-${feature.color}-500 text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.points.map((point, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span
                      className={`h-2 w-2 rounded-full mr-2 
                                  ${feature.color === "blue" ? "bg-blue-500" : ""}
                                  ${feature.color === "green" ? "bg-green-500" : ""}
                                  ${feature.color === "purple" ? "bg-purple-500" : ""}
                                  ${feature.color === "red" ? "bg-red-500" : ""}`}
                    ></span>
                    {point}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`mt-4 inline-block font-semibold hover:underline
                            ${feature.color === "blue" ? "text-blue-600" : ""}
                            ${feature.color === "green" ? "text-green-600" : ""}
                            ${feature.color === "purple" ? "text-purple-600" : ""}
                            ${feature.color === "red" ? "text-red-600" : ""}`}
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
