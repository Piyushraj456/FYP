import React, { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  AlertTriangle,
  Upload,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  RotateCcw,
  Trash2,
} from "lucide-react";

const Dashboard = () => {
  const [documentHistory, setDocumentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token not found. Please login again.");
      window.location.href = "/login";
      return null;
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchDocumentHistory = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(
        `${window.location.protocol}//${window.location.hostname}:5000/api/summarize/history?limit=50`,
        {
          method: "GET",
          headers,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setDocumentHistory(data.summaries || []);
      } else {
        console.error("Failed to fetch document history:", data.message);
        alert("Failed to fetch document history");
      }
    } catch (error) {
      console.error("Error fetching document history:", error);
      if (error.status === 401) {
        alert("Authentication failed. Please login again.");
        window.location.href = "/login";
      } else {
        alert("Failed to load document history");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentHistory();
  }, []);

  const filteredDocuments = documentHistory.filter((doc) => {
    const matchesSearch =
      doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.originalName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || doc.summaryStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewSummary = (doc) => {
    if (doc.summaryStatus === "completed") {
      window.location.href = `/summary/${doc.documentId}`;
    } else {
      alert("Summary not available yet");
    }
  };

  const handleRegenerateSummary = async (doc) => {
    const confirmed = window.confirm(`Regenerate summary for "${doc.title}"?`);
    if (!confirmed) return;

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

   
      setDocumentHistory((prev) =>
        prev.map((d) =>
          d.documentId === doc.documentId
            ? { ...d, summaryStatus: "processing", version: d.version + 1 }
            : d
        )
      );

      const response = await fetch(
        `${window.location.protocol}//${window.location.hostname}:5000/api/summarize/regenerate`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ documentId: doc.documentId }),
        }
      );

      if (response.ok) {
        alert("Summary regeneration started");

     
        setTimeout(() => {
          fetchDocumentHistory();
        }, 2000);
      } else {
        throw new Error("Failed to regenerate summary");
      }
    } catch (error) {
      console.error("Error regenerating summary:", error);
      alert("Failed to regenerate summary");
 
      fetchDocumentHistory();
    }
  };

  const handleDeleteSummary = async (doc) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the summary for "${doc.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(
        `${window.location.protocol}//${window.location.hostname}:5000/api/summarize/${doc.documentId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (response.ok) {
        setDocumentHistory((prev) =>
          prev.filter((d) => d.documentId !== doc.documentId)
        );

        alert(`Summary deleted for "${doc.title}"`);
      } else {
        throw new Error("Failed to delete summary");
      }
    } catch (error) {
      console.error("Error deleting summary:", error);
      alert("Failed to delete summary");
    }
  };

  const handleUpload = () => {
    window.location.href = "/upload";
  };

  const handleRefresh = () => {
    fetchDocumentHistory();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your document history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Document Analysis History
              </h2>
              <p className="text-gray-600">
                View your processed legal documents and their summaries
              </p>
            </div>
            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload New Document
            </button>
          </div>
        </div>

        {documentHistory.length > 0 && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {/* Refresh Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        loading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Document Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-lg p-2 mr-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {documentHistory.length}
                    </p>
                    <p className="text-gray-600 text-sm">Total Documents</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-lg p-2 mr-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        documentHistory.filter(
                          (d) => d.summaryStatus === "completed"
                        ).length
                      }
                    </p>
                    <p className="text-gray-600 text-sm">Completed</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded-lg p-2 mr-3">
                    <RefreshCw className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        documentHistory.filter(
                          (d) => d.summaryStatus === "processing"
                        ).length
                      }
                    </p>
                    <p className="text-gray-600 text-sm">Processing</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="bg-red-100 rounded-lg p-2 mr-3">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        documentHistory.filter(
                          (d) => d.summaryStatus === "failed"
                        ).length
                      }
                    </p>
                    <p className="text-gray-600 text-sm">Failed</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Document List */}
        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {documentHistory.length === 0
                ? "No documents uploaded yet"
                : "No documents match your filters"}
            </h3>
            <p className="text-gray-600 mb-6">
              {documentHistory.length === 0
                ? "Upload your first legal document to get started with AI-powered analysis and summaries"
                : "Try adjusting your search or filter criteria"}
            </p>
            {documentHistory.length === 0 && (
              <button
                onClick={handleUpload}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Upload Files to Analyze
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.documentId}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      <FileText className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {doc.title || doc.originalName}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(doc.uploadedAt)}
                      </span>
                      <span>{formatFileSize(doc.size)}</span>
                      {doc.llmUsed && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          AI Enhanced
                        </span>
                      )}
                      {doc.isStale && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                          Needs Update
                        </span>
                      )}
                      {doc.version > 1 && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          v{doc.version}
                        </span>
                      )}
                    </div>

                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        doc.summaryStatus
                      )}`}
                    >
                      {getStatusIcon(doc.summaryStatus)}
                      <span className="ml-2 capitalize">
                        {doc.summaryStatus}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    {doc.summaryStatus === "completed" && (
                      <button
                        onClick={() => handleViewSummary(doc)}
                        className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                        title="View Summary"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}

                    {(doc.summaryStatus === "completed" ||
                      doc.summaryStatus === "failed") && (
                      <button
                        onClick={() => handleRegenerateSummary(doc)}
                        className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition-colors"
                        title="Regenerate Summary"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteSummary(doc)}
                      className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete Summary"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Summary Preview for Completed Documents */}
                {doc.summaryStatus === "completed" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Quick Preview:
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Analysis complete with key clauses identified and
                      executive summary generated.
                      {doc.llmUsed && " Enhanced with AI-powered insights."}
                      {doc.isStale &&
                        " This summary may be outdated - consider regenerating."}
                    </p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span>
                        Last updated: {formatDate(doc.summaryUpdatedAt)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Error Message for Failed Documents */}
                {doc.summaryStatus === "failed" && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      <h4 className="font-medium text-red-900">
                        Processing Failed
                      </h4>
                    </div>
                    <p className="text-red-700 text-sm mb-2">
                      There was an error processing this document. This could be
                      due to:
                    </p>
                    <ul className="text-red-600 text-sm list-disc list-inside mb-3">
                      <li>Corrupted or unreadable PDF file</li>
                      <li>Document format not supported</li>
                      <li>Server processing timeout</li>
                      <li>Insufficient text content for analysis</li>
                    </ul>
                    <p className="text-red-700 text-sm">
                      Try regenerating the summary or contact support if the
                      issue persists.
                    </p>
                  </div>
                )}

                {/* Processing Status */}
                {doc.summaryStatus === "processing" && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <RefreshCw className="h-5 w-5 text-yellow-600 mr-2 animate-spin" />
                      <h4 className="font-medium text-yellow-900">
                        Processing Document
                      </h4>
                    </div>
                    <p className="text-yellow-700 text-sm mb-3">
                      Your document is being analyzed. This process includes:
                    </p>
                    <ul className="text-yellow-600 text-sm list-disc list-inside mb-3">
                      <li>Text extraction and clause identification</li>
                      <li>Legal category classification</li>
                      <li>Risk assessment and importance scoring</li>
                      <li>AI-powered summary generation</li>
                    </ul>
                    <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full animate-pulse"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                    <p className="text-yellow-600 text-xs">
                      Estimated completion: 2-5 minutes
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
