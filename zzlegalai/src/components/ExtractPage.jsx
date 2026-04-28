import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FileText, Clock, CheckCircle } from "lucide-react";

const ExtractPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [extractionStatus, setExtractionStatus] = useState("processing");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!documentId) {
      toast.error("No document ID provided");
      navigate("/upload");
      return;
    }

    const performExtraction = async () => {
      try {
        setExtractionStatus("processing");

     
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.random() * 15;
          });
        }, 500);

     
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication token not found. Please login again.");
          clearInterval(progressInterval);
          setExtractionStatus("failed");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/extract`,
          { documentId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        clearInterval(progressInterval);
        setProgress(100);
        setExtractionStatus("completed");

    
        setTimeout(() => {
          navigate(`/summary/${documentId}`);
        }, 1500);
      } catch (err) {
        console.error("Extraction error:", err);
        setExtractionStatus("failed");
        toast.error("Extraction failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    performExtraction();
  }, [documentId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            {extractionStatus === "processing" && (
              <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
            )}
            {extractionStatus === "completed" && (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            )}
            {extractionStatus === "failed" && (
              <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {extractionStatus === "processing" && "Processing Document"}
            {extractionStatus === "completed" && "Extraction Complete!"}
            {extractionStatus === "failed" && "Extraction Failed"}
          </h2>

          <p className="text-gray-600 mb-6">
            {extractionStatus === "processing" &&
              "We're analyzing your legal document and extracting key information..."}
            {extractionStatus === "completed" &&
              "Your document has been successfully processed. Redirecting to summary..."}
            {extractionStatus === "failed" &&
              "There was an error processing your document. Please try uploading again."}
          </p>

          {extractionStatus === "processing" && (
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <p className="text-sm text-gray-500">
            {extractionStatus === "processing" &&
              `${Math.round(progress)}% complete`}
            {extractionStatus === "completed" &&
              "Processing completed successfully"}
            {extractionStatus === "failed" && (
              <button
                onClick={() => navigate("/upload")}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Upload Another Document
              </button>
            )}
          </p>

          {extractionStatus === "processing" && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              <p className="text-blue-700 text-sm mt-2">
                This may take a few moments depending on document size
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtractPage;
