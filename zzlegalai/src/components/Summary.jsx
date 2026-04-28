import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { marked } from "marked";
import DOMPurify from "dompurify";

import {
  FileText,
  Download,
  Share2,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const Summary = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [error, setError] = useState(null);
  const [needsExtraction, setNeedsExtraction] = useState(false);
  const [showAllClauses, setShowAllClauses] = useState(false);


  const renderMarkdown = (content) => {
    if (!content) return "";
    const rawHtml = marked.parse(content); 
    return DOMPurify.sanitize(rawHtml); 
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      navigate("/login");
      return null;
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

const renderMarkdownSections = (content) => {
  if (!content) return [];

  const rawHtml = marked.parse(content);
  const safeHtml = DOMPurify.sanitize(rawHtml);


  const regex = /<p><strong>(.*?)<\/strong><\/p>([\s\S]*?)(?=<p><strong>|$)/gi;

  const sections = [];
  let match;
  while ((match = regex.exec(safeHtml)) !== null) {
    sections.push({
      heading: match[1].replace(/:$/, ""), 
      body: match[2].trim(),
    });
  }


  if (sections.length === 0) {
    sections.push({ heading: "Summary", body: safeHtml });
  }

  return sections;
};




  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = getAuthHeaders();
      if (!headers) return;

      console.log("Fetching summary for documentId:", documentId);

     
      const summaryResponse = await axios.post(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/summarize`,
        { documentId },
        { headers }
      );

      console.log("Summary response:", summaryResponse.data);
      setSummaryData(summaryResponse.data);

      
      try {
        const docResponse = await axios.get(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/upload/files/${documentId}`,
          { headers }
        );
        setDocumentInfo(docResponse.data.file);
      } catch (docErr) {
        console.warn("Could not fetch document info:", docErr.message);
        setDocumentInfo({
          title: `Document ${documentId}`,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Error fetching summary:", err);

      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
        navigate("/login");
        return;
      }

      if (err.response?.data?.needsExtraction) {
        setNeedsExtraction(true);
        setError(
          "Document needs to be extracted first. Please run extraction."
        );
        return;
      }

      setError(
        err.response?.data?.message || "Failed to load document summary"
      );

   
      if (err.response?.status !== 404) {
        try {
          const headers = getAuthHeaders();
          if (headers) {
            console.log("Attempting extraction fallback...");
            const extractResponse = await axios.post(
              `${
                import.meta.env.VITE_API_URL || "http://localhost:5000"
              }/api/extract`,
              { documentId },
              { headers }
            );

            setSummaryData({
              summary:
                "Summary not available, showing extracted content instead.",
              clauses: extractResponse.data.clauses || [],
              extractionResults: extractResponse.data.extractionResults,
            });
            setError(null);
          }
        } catch (extractErr) {
          console.error("Extract fallback failed:", extractErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!documentId) {
      toast.error("No document ID provided");
      navigate("/upload");
      return;
    }

    fetchSummary();
  }, [documentId, navigate]);

  const handleDownload = () => {
    if (documentInfo?.fileUrl) {
      window.open(documentInfo.fileUrl, "_blank");
    } else {
      toast.warn("Download link not available");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Document Summary: ${documentInfo?.title || "Legal Document"}`,
        text: summaryData?.summary || "Document analysis completed",
        url: window.location.href,
      });
    } catch (err) {
     
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch (clipErr) {
        toast.error("Could not share or copy link");
      }
    }
  };

  const handleRunExtraction = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      setLoading(true);
      toast.info("Running extraction...");

      await axios.post(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/extract`,
        { documentId },
        { headers }
      );

      toast.success("Extraction completed! Generating summary...");

    
      setTimeout(() => {
        fetchSummary();
      }, 1000);
    } catch (err) {
      console.error("Extraction error:", err);
      toast.error("Extraction failed. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-700 text-lg">Loading summary...</p>
        </div>
      </div>
    );
  }

  if (error && !summaryData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">{error}</p>

          {needsExtraction ? (
            <div className="space-y-3">
              <button
                onClick={handleRunExtraction}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Extraction
              </button>
              <button
                onClick={() => navigate("/upload")}
                className="block mx-auto text-gray-600 hover:text-gray-800 transition-colors"
              >
                Upload New Document
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={fetchSummary}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </button>
              <button
                onClick={() => navigate("/upload")}
                className="block mx-auto text-gray-600 hover:text-gray-800 transition-colors"
              >
                Upload New Document
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white font-semibold rounded-xl shadow-sm border p-6 mb-6 mt-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-3">
              {documentInfo?.fileUrl && (
                <button
                  onClick={handleDownload}
                  className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
              )}
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Document Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 p-3 rounded-[20%] bg-yellow-500 text-white">
              <FileText className="h-12 w-12 " />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {documentInfo?.title || "Legal Document Analysis"}
              </h1>
              <div className="flex items-center space-x-6 text-sm text-gray-600 font-semibold">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {documentInfo?.createdAt
                    ? new Date(documentInfo.createdAt).toLocaleDateString()
                    : "Recently uploaded"}
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Analysis Complete
                </div>
                {documentInfo?.size && (
                  <span>{Math.round(documentInfo.size / 1024)} KB</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Executive Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">
                  Executive Summary
                </h2>
              </div>
              <div className="prose prose-gray max-w-none">
                {renderMarkdownSections(summaryData?.summary).map(
                  (section, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-300 rounded-lg p-4 mb-4 bg-blue-50 shadow-sm"
                    >
                      <h2 className="text-lg font-bold text-blue-800 mb-2">
                        {section.heading}
                      </h2>
                      <div
                        className="prose prose-blue text-gray-700"
                        dangerouslySetInnerHTML={{ __html: section.body }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>

           
          </div>

          {/* Sidebar */}
<div className="lg:col-span-1 space-y-6">
  {/* Actions */}
  <div className="bg-white rounded-xl shadow-sm border p-4">
    <h3 className="text-lg font-semibold text-gray-900 mb-3">Actions</h3>
    <div className="space-y-2">
      <button
        onClick={() => navigate("/upload")}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Upload Another Document
      </button>
      <button
        onClick={() => navigate("/dashboard")}
        className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
      >
        View All Documents
      </button>
      <button
        onClick={fetchSummary}
        className="w-full border border-blue-300 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Summary
      </button>
    </div>
  </div>

  {/* Document Clauses */}
  <div className="bg-white rounded-xl shadow-sm border p-4">
    <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Clauses</h3>
    {summaryData?.clauses && summaryData.clauses.length > 0 ? (
      <>
        <div className="flex flex-wrap gap-3">
          {(showAllClauses ? summaryData.clauses : summaryData.clauses.slice(0, 12)).map(
            (clause, idx) => (
              <div
                key={idx}
                className="flex-1 min-w-[200px] max-w-[250px] p-3 border border-gray-200 rounded-lg bg-gray-50 hover:border-blue-300 transition-colors"
              >
                <div className="text-xs text-gray-500 mb-1">
                  {clause.category || "General"} • Score:{" "}
                  {clause.importance || clause.score || "N/A"}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                  {clause.text ||
                    clause.summary ||
                    (typeof clause === "string"
                      ? clause
                      : JSON.stringify(clause))}
                </p>
              </div>
            )
          )}
        </div>

        {/* Toggle Button */}
        {summaryData.clauses.length > 12 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAllClauses(!showAllClauses)}
              className="text-blue-600 text-sm hover:underline"
            >
              {showAllClauses ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </>
    ) : (
      <div className="text-center py-6">
        <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">No clauses identified</p>
      </div>
    )}
  </div>
   {/* Key Findings */}
            {summaryData?.extractionResults && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Extraction Results
                </h3>
                <div className="grid grid-cols-1  gap-2">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {summaryData.extractionResults.totalClausesAnalyzed || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Clauses</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {summaryData.extractionResults.highImportanceClauses || 0}
                    </div>
                    <div className="text-sm text-gray-600">High Priority</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {summaryData.extractionResults.categoriesDetected || 0}
                    </div>
                    <div className="text-sm text-gray-600">Categories</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">
                      {summaryData.extractionResults.pageCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Pages</div>
                  </div>
                </div>
              </div>
            )}
</div>

         
        </div>
      </div>
    </div>
  );
};

export default Summary;
