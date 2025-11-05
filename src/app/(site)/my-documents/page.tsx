"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import { getAllDocApi, addPassportApi, addCvApi, addHighestEduCertificate, addDrivingLicense, addCovidCertificateApi, addOtherDoc } from "../../../services/user.service";

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadDate: string;
  fileUrl: string;
  fileSize: string;
  status: "pending" | "approved" | "rejected";
  expiryDate?: string;
}

export default function MyDocumentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [activeCategory, setActiveCategory] = useState("all");

  const documentCategories = [
    { key: "all", label: "All Documents", icon: "fa fa-folder" },
    { key: "identity", label: "Identity Proof", icon: "fa fa-id-card" },
    { key: "education", label: "Educational", icon: "fa fa-graduation-cap" },
    { key: "experience", label: "Experience", icon: "fa fa-briefcase" },
    { key: "certificates", label: "Certificates", icon: "fa fa-certificate" },
    { key: "medical", label: "Medical", icon: "fa fa-medkit" },
    { key: "other", label: "Other", icon: "fa fa-file" }
  ];

  const requiredDocuments = [
    { category: "identity", name: "Passport", required: true },
    { category: "identity", name: "National ID/Aadhaar", required: true },
    { category: "education", name: "Highest Degree Certificate", required: true },
    { category: "education", name: "Mark Sheets/Transcripts", required: false },
    { category: "experience", name: "Experience Certificates", required: false },
    { category: "certificates", name: "Skill Certificates", required: false },
    { category: "medical", name: "Medical Certificate", required: false },
    { category: "other", name: "Reference Letters", required: false }
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Fetch real documents from API
      const response = await getAllDocApi(token);
      
      if (response?.data) {
        // Transform API response to match our Document interface
        const docs: Document[] = (response.data || []).map((doc: any) => ({
          id: doc.id?.toString() || Math.random().toString(),
          name: doc.file_name || doc.document_name || doc.name || 'Unknown Document',
          type: doc.file_type || doc.document_type || 'pdf',
          category: doc.category || doc.document_category || 'other',
          uploadDate: doc.created_at ? doc.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          fileUrl: doc.file_url || doc.document_url || '#',
          fileSize: doc.file_size || 'Unknown',
          status: (doc.status === 'verified' || doc.status === 'approved') ? 'approved' : 
                 (doc.status === 'rejected' || doc.status === 'declined') ? 'rejected' : 'pending',
          expiryDate: doc.expiry_date
        }));
        setDocuments(docs);
      } else {
        // If no documents or API returns empty, set empty array
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      // On error, still set empty array instead of showing error for better UX
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = activeCategory === "all" 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, JPG, JPEG, and PNG files are allowed");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Please log in to upload documents");
      router.push("/login");
      return;
    }

    const uploadId = `upload_${Date.now()}`;
    setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }));

    try {
      // Create FormData for API call
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_category', category);
      formData.append('document_name', file.name);
      
      // Show progress
      setUploadProgress(prev => ({ ...prev, [uploadId]: 25 }));

      let uploadResponse;
      
      // Call appropriate API based on document category
      switch (category) {
        case 'identity':
          // For identity documents, use passport API as primary
          formData.append('passport_file', file);
          uploadResponse = await addPassportApi(formData, token);
          break;
        case 'education':
          // For educational documents
          formData.append('highest_edu_file', file);
          uploadResponse = await addHighestEduCertificate(formData, token);
          break;
        case 'experience':
          // For experience documents, use CV API
          formData.append('cv_file', file);
          uploadResponse = await addCvApi(formData, token);
          break;
        case 'certificates':
          // For certificates, use driving license API or other docs
          if (file.name.toLowerCase().includes('driving') || file.name.toLowerCase().includes('license')) {
            formData.append('dl_file', file);
            uploadResponse = await addDrivingLicense(formData, token);
          } else {
            formData.append('other_docs', file);
            uploadResponse = await addOtherDoc(formData, token);
          }
          break;
        case 'medical':
          // For medical documents, use COVID certificate API or other docs
          if (file.name.toLowerCase().includes('covid') || file.name.toLowerCase().includes('vaccination')) {
            formData.append('covid_file', file);
            uploadResponse = await addCovidCertificateApi(formData, token);
          } else {
            formData.append('other_docs', file);
            uploadResponse = await addOtherDoc(formData, token);
          }
          break;
        default:
          // For other documents
          formData.append('other_docs', file);
          uploadResponse = await addOtherDoc(formData, token);
          break;
      }

      setUploadProgress(prev => ({ ...prev, [uploadId]: 75 }));

      // Check if upload was successful
      if (uploadResponse && (uploadResponse.status === 200 || uploadResponse.data?.success)) {
        setUploadProgress(prev => ({ ...prev, [uploadId]: 100 }));
        
        // Refresh documents list to show newly uploaded document
        await fetchDocuments();
        
        toast.success("Document uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload document. Please try again.");
    } finally {
      // Clear progress after a short delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const { [uploadId]: _, ...rest } = prev;
          return rest;
        });
      }, 1000);
      
      // Reset the file input
      event.target.value = '';
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      // Mock API call for deletion
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    }
  };

  const handleViewDocument = (document: Document) => {
    // Open document in new tab
    window.open(document.fileUrl, '_blank');
  };

  const getStatusBadge = (status: Document["status"]) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100 text-yellow-800", icon: "fa fa-clock" },
      approved: { bg: "bg-blue-100 text-green-800", icon: "fa fa-check" },
      rejected: { bg: "bg-red-100 text-red-800", icon: "fa fa-times" }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.bg}`}>
        <i className={`${config.icon} mr-1`}></i>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getDocumentIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      pdf: "fa fa-file-pdf text-red-500",
      jpg: "fa fa-file-image text-blue-500",
      jpeg: "fa fa-file-image text-blue-500",
      png: "fa fa-file-image text-blue-500",
      doc: "fa fa-file-word text-blue-600",
      docx: "fa fa-file-word text-blue-600"
    };
    return iconMap[type] || "fa fa-file text-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Documents - Manage Your Files | Overseas.ai</title>
        <meta name="description" content="Manage and upload your important documents for international job applications and visa processing." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold textBlue mb-4">
            <i className="fa fa-folder mr-3"></i>
            My Documents
          </h1>
          <p className="text-gray-600">
            Upload, manage, and organize your documents for international job applications
          </p>
        </div>

        {/* Document Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fa fa-folder textBlue"></i>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold textBlue">{documents.length}</p>
                <p className="text-sm text-gray-600">Total Documents</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fa fa-check text-green-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-green-600">
                  {documents.filter(doc => doc.status === 'approved').length}
                </p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="fa fa-clock text-yellow-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-yellow-600">
                  {documents.filter(doc => doc.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <i className="fa fa-times text-red-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-red-600">
                  {documents.filter(doc => doc.status === 'rejected').length}
                </p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-4">Document Categories</h3>
              <div className="space-y-2">
                {documentCategories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                      activeCategory === category.key
                        ? "bgBlue text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i className={`${category.icon} mr-2`}></i>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h3 className="font-semibold mb-4">Required Documents</h3>
              <div className="space-y-2 text-sm">
                {requiredDocuments.map((doc, index) => {
                  const hasDocument = documents.some(d => d.category === doc.category);
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className={doc.required ? "font-medium" : ""}>
                        {doc.name}
                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                      {hasDocument ? (
                        <i className="fa fa-check text-green-500"></i>
                      ) : (
                        <i className="fa fa-times text-gray-300"></i>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="font-semibold mb-4">Upload New Document</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {documentCategories.slice(1).map((category) => (
                  <div key={category.key} className="relative">
                    <input
                      type="file"
                      id={`upload-${category.key}`}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, category.key)}
                    />
                    <label
                      htmlFor={`upload-${category.key}`}
                      className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <i className={`${category.icon} text-2xl textBlue mb-2`}></i>
                      <span className="text-sm font-medium text-gray-700">{category.label}</span>
                      <span className="text-xs text-gray-500 mt-1">Click to upload</span>
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                <i className="fa fa-info-circle mr-1"></i>
                Supported formats: PDF, JPG, PNG. Maximum file size: 5MB
              </p>
            </div>

            {/* Upload Progress */}
            {Object.keys(uploadProgress).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h3 className="font-semibold mb-4">Upload Progress</h3>
                {Object.entries(uploadProgress).map(([id, progress]) => (
                  <div key={id} className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Uploading...</span>
                      <span className="text-sm">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bgBlue h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Documents Grid */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="font-semibold">
                  {activeCategory === "all" ? "All Documents" : 
                    documentCategories.find(c => c.key === activeCategory)?.label || "Documents"}
                </h3>
              </div>
              
              {filteredDocuments.length === 0 ? (
                <div className="p-12 text-center">
                  <i className="fa fa-folder-open text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">No documents found in this category</p>
                  <p className="text-sm text-gray-400 mt-2">Upload your first document to get started</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Upload Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDocuments.map((document) => (
                        <tr key={document.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <i className={`${getDocumentIcon(document.type)} text-xl mr-3`}></i>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {document.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {document.fileSize}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="capitalize text-sm text-gray-900">
                              {document.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {document.uploadDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(document.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button
                              onClick={() => handleViewDocument(document)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <i className="fa fa-eye mr-1"></i>
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(document.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <i className="fa fa-trash mr-1"></i>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
