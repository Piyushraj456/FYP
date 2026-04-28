import { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { UploadDropzone } from "@uploadthing/react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadPage = () => {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Upload Your Legal Document
          </h2>
          <p className="text-gray-600">
            We'll analyze your document and provide a clear explanation
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
            {!authUser ? (
              <div className="p-8">
                <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Authentication Required
                </h3>
                <p className="text-red-600 mb-6">
                  Please log in to upload files
                </p>
              </div>
            ) : (
              <>
                <UploadDropzone
                  endpoint="pdfUploader"
                  url={`${
                    import.meta.env.VITE_API_URL || "http://localhost:5000"
                  }/api/upload/uploadthing`}
                  onClientUploadComplete={async (files) => {
                    try {
                      const file = files[0];

                      // Get JWT token from localStorage
                      const token = localStorage.getItem("token");

                      if (!token) {
                        toast.error(
                          "Authentication token not found. Please login again."
                        );
                        return;
                      }

                      // Save document to database
                      const response = await axios.post(
                        `${
                          import.meta.env.VITE_API_URL ||
                          "http://localhost:5000"
                        }/api/upload/save-document`,
                        {
                          title: file.name,
                          fileUrl: file.url,
                          originalName: file.name,
                          size: file.size,
                          fileKey: file.key,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      toast.success("File uploaded successfully!");
                      setUploadingFileName("");
                      setProgress(0);

                    
                      const documentId = response.data.document._id;
                      navigate(`/extract/${documentId}`);
                    } catch (error) {
                      console.error("Error saving document:", error);
                      toast.error("Failed to save document to database");
                    }
                  }}
                  onUploadProgress={(p) => setProgress(Math.round(p))}
                  onUploadError={(err) => {
                    toast.error(`Upload failed: ${err.message}`);
                    setUploadingFileName("");
                    setProgress(0);
                  }}
                  onUploadBegin={(fileName) => {
                    setUploadingFileName(fileName);
                    setProgress(0);
                  }}
                  config={{ mode: "auto" }}
                  appearance={{
                    container:
                      "w-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-6",
                    uploadIcon: "text-blue-500 mb-4",
                    label: "text-lg font-semibold text-gray-900 mb-2",
                    allowedContent: "text-gray-600 mb-4",
                    button:
                      "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors",
                  }}
                  content={{
                    uploadIcon: <Upload className="h-12 w-12" />,
                    label: "Drop your PDF here or click to upload",
                    allowedContent: "PDF files up to 16MB",
                    button: ({ ready }) =>
                      ready ? "Choose File" : "Getting ready...",
                  }}
                />

                {uploadingFileName && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium">
                      Uploading: {uploadingFileName}
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-3 mt-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-blue-600 text-sm mt-2">
                      {progress}% complete
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-semibold text-yellow-800">
                    File Restrictions
                  </h4>
                  <ul className="text-yellow-700 text-sm mt-2 space-y-1">
                    <li>• Maximum file size: 16MB</li>
                    <li>• Supported format: PDF only</li>
                    <li>• Document should be in English</li>
                    <li>
                      • Clear, readable text (avoid handwritten documents)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
