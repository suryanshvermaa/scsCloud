import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FolderIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  ServerIcon,
  FolderPlusIcon,
  DocumentIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  enableBucketService,
  getBuckets,
  createBucket,
  deleteBucket,
  listObjects,
  getUploadUrl,
  uploadFile,
  getDownloadUrl,
  deleteObject,
  Bucket,
  StorageObject,
  EnableServiceResponse,
} from "../utils/objectStorageApi";

const ObjectStorageDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Service state
  const [serviceEnabled, setServiceEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [credentials, setCredentials] = useState<EnableServiceResponse | null>(null);
  
  // Buckets state
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [loadingBuckets, setLoadingBuckets] = useState<boolean>(false);
  
  // Objects state
  const [objects, setObjects] = useState<StorageObject[]>([]);
  const [loadingObjects, setLoadingObjects] = useState<boolean>(false);
  
  // Modals state
  const [showEnableModal, setShowEnableModal] = useState<boolean>(false);
  const [showCreateBucketModal, setShowCreateBucketModal] = useState<boolean>(false);
  const [showDeleteBucketModal, setShowDeleteBucketModal] = useState<boolean>(false);
  const [showDeleteObjectModal, setShowDeleteObjectModal] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState<boolean>(false);
  
  // Form state
  const [storageSize, setStorageSize] = useState<number>(10);
  const [newBucketName, setNewBucketName] = useState<string>("");
  const [bucketToDelete, setBucketToDelete] = useState<string>("");
  const [objectToDelete, setObjectToDelete] = useState<string>("");
  const [uploadFileState, setUploadFileState] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Check if service is enabled
  useEffect(() => {
    checkServiceStatus();
  }, []);

  // Load buckets when service is enabled
  useEffect(() => {
    if (serviceEnabled) {
      loadBuckets();
    }
  }, [serviceEnabled]);

  // Load objects when a bucket is selected
  useEffect(() => {
    if (selectedBucket) {
      loadObjects(selectedBucket);
    }
  }, [selectedBucket]);

  const checkServiceStatus = async () => {
    try {
      setLoading(true);
      
      // Check user profile to verify if object storage service is enabled
      const accessToken = Cookies.get("AccessCookie");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const profileResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/profile?token=${accessToken}`
      );
      
      // Handle nested data structure: response.data.data.data
      const userProfile = profileResponse.data.data.data || profileResponse.data.data;
      
      if (!userProfile.objectStorageServiceEnabled) {
        setServiceEnabled(false);
        setLoading(false);
        return;
      }

      // If service is enabled, fetch buckets
      const bucketsData = await getBuckets();
      setServiceEnabled(true);
      setBuckets(bucketsData);
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 401) {
        setServiceEnabled(false);
      } else {
        console.error("Error checking service status:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadBuckets = async () => {
    try {
      setLoadingBuckets(true);
      const bucketsData = await getBuckets();
      setBuckets(bucketsData);
    } catch (error) {
      console.error("Error loading buckets:", error);
      alert("Failed to load buckets");
    } finally {
      setLoadingBuckets(false);
    }
  };

  const loadObjects = async (bucketName: string) => {
    try {
      setLoadingObjects(true);
      const objectsData = await listObjects(bucketName);
      setObjects(objectsData || []);
    } catch (error) {
      console.error("Error loading objects:", error);
      alert("Failed to load objects");
      setObjects([]);
    } finally {
      setLoadingObjects(false);
    }
  };

  const handleEnableService = async () => {
    try {
      const response = await enableBucketService(storageSize);
      setCredentials(response);
      setShowEnableModal(false);
      setShowCredentialsModal(true);
      
      // Re-check service status to verify it's enabled in the backend
      await checkServiceStatus();
    } catch (error: any) {
      console.error("Error enabling service:", error);
      alert(error.response?.data?.message || "Failed to enable service. Please check your SCS Coins balance.");
    }
  };

  const handleCreateBucket = async () => {
    if (!newBucketName.trim()) {
      alert("Please enter a bucket name");
      return;
    }

    // Validate bucket name
    const bucketNameRegex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
    if (!bucketNameRegex.test(newBucketName)) {
      alert("Invalid bucket name. Must be 3-63 characters, lowercase, start/end with letter or number.");
      return;
    }

    try {
      await createBucket(newBucketName);
      setShowCreateBucketModal(false);
      setNewBucketName("");
      loadBuckets();
      alert("Bucket created successfully!");
    } catch (error: any) {
      console.error("Error creating bucket:", error);
      alert(error.response?.data?.message || "Failed to create bucket");
    }
  };

  const handleDeleteBucket = async () => {
    try {
      await deleteBucket(bucketToDelete);
      setShowDeleteBucketModal(false);
      setBucketToDelete("");
      if (selectedBucket === bucketToDelete) {
        setSelectedBucket(null);
        setObjects([]);
      }
      loadBuckets();
      alert("Bucket deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting bucket:", error);
      alert(error.response?.data?.message || "Failed to delete bucket. Ensure the bucket is empty.");
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFileState || !selectedBucket) {
      alert("Please select a file");
      return;
    }

    try {
      setUploading(true);
      const fileSizeInKB = uploadFileState.size / 1024;
      const signedUrl = await getUploadUrl(selectedBucket, uploadFileState.name, fileSizeInKB);
      await uploadFile(signedUrl, uploadFileState);
      setShowUploadModal(false);
      setUploadFileState(null);
      loadObjects(selectedBucket);
      alert("File uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading file:", error);
      alert(error.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadObject = async (objectKey: string) => {
    if (!selectedBucket) return;

    try {
      const downloadUrl = await getDownloadUrl(selectedBucket, objectKey);
      window.open(downloadUrl, "_blank");
    } catch (error: any) {
      console.error("Error downloading object:", error);
      alert(error.response?.data?.message || "Failed to download object");
    }
  };

  const handleDeleteObject = async () => {
    if (!selectedBucket) return;

    try {
      await deleteObject(selectedBucket, objectToDelete);
      setShowDeleteObjectModal(false);
      setObjectToDelete("");
      loadObjects(selectedBucket);
      alert("Object deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting object:", error);
      alert(error.response?.data?.message || "Failed to delete object");
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-xl text-slate-600 dark:text-slate-300">Loading...</div>
      </div>
    );
  }

  if (!serviceEnabled) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full ring-1 ring-slate-900/10 bg-slate-900/5 px-3 py-1 text-xs text-slate-600 dark:ring-white/10 dark:bg-white/5 dark:text-slate-300 mb-4">
              S3-Compatible Object Storage
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Object Storage
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              Scalable, S3-compatible object storage for your applications. Store and retrieve any amount of data at any time.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setShowEnableModal(true)}
                className="inline-flex items-center gap-2 rounded-md bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-semibold px-6 py-3"
              >
                <PlusIcon className="h-5 w-5" />
                Enable Service
              </button>
              <button
                onClick={() => navigate("/object-storage-docs")}
                className="inline-flex items-center gap-2 rounded-md ring-1 ring-slate-900/10 hover:bg-slate-900/5 dark:ring-white/10 dark:hover:bg-white/5 px-6 py-3 text-slate-700 dark:text-slate-200"
              >
                View Documentation
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <ServerIcon className="h-10 w-10 text-cyan-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                S3-Compatible API
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Works with all S3-compatible tools and SDKs
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <KeyIcon className="h-10 w-10 text-emerald-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Secure Access
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Access keys and secure pre-signed URLs
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <FolderIcon className="h-10 w-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Unlimited Buckets
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Create as many buckets as you need
              </p>
            </div>
          </div>

          {/* Enable Service Card */}
          <div className="max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Enable Object Storage
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Get started with scalable object storage. Choose your storage size and enable the service.
            </p>
            <button
              onClick={() => setShowEnableModal(true)}
              className="inline-flex items-center gap-2 rounded-md bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-semibold px-6 py-3"
            >
              <PlusIcon className="h-5 w-5" />
              Enable Service
            </button>
          </div>
        </div>

        {/* Enable Service Modal */}
        <Dialog open={showEnableModal} onClose={() => setShowEnableModal(false)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/30 dark:bg-black/60" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="max-w-md rounded-xl bg-white dark:bg-slate-800 p-6">
              <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Enable Object Storage Service
              </DialogTitle>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Storage Size (GB)
                </label>
                <input
                  type="number"
                  min="1"
                  value={storageSize}
                  onChange={(e) => setStorageSize(parseInt(e.target.value) || 1)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Valid for 1 month. Cost will be deducted from your SCS Coins.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleEnableService}
                  className="flex-1 rounded-md bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-slate-900 font-medium"
                >
                  Enable Service
                </button>
                <button
                  onClick={() => setShowEnableModal(false)}
                  className="flex-1 rounded-md border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Credentials Modal */}
        <Dialog open={showCredentialsModal} onClose={() => setShowCredentialsModal(false)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/30 dark:bg-black/60" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="max-w-2xl rounded-xl bg-white dark:bg-slate-800 p-6">
              <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />
                  Important: Save Your Credentials
                </div>
              </DialogTitle>
              <div className="mb-4 space-y-3">
                <div className="rounded-lg bg-slate-100 dark:bg-slate-900 p-4">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Storage Endpoint</p>
                  <code className="text-sm text-slate-900 dark:text-white break-all">{credentials?.StorageEndpoint}</code>
                </div>
                <div className="rounded-lg bg-slate-100 dark:bg-slate-900 p-4">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Access Key ID</p>
                  <code className="text-sm text-slate-900 dark:text-white break-all">{credentials?.accessKeyId}</code>
                </div>
                <div className="rounded-lg bg-slate-100 dark:bg-slate-900 p-4">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Secret Access Key</p>
                  <code className="text-sm text-slate-900 dark:text-white break-all">{credentials?.secretAccessKey}</code>
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 mb-4">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⚠️ Save these credentials securely. You won't be able to see the secret key again.
                </p>
              </div>
              <button
                onClick={() => setShowCredentialsModal(false)}
                className="w-full rounded-md bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-slate-900 font-medium"
              >
                I've Saved My Credentials
              </button>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    );
  }

  // Main Dashboard - Service Enabled
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Object Storage</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                S3-compatible object storage dashboard
              </p>
            </div>
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Bucket View or Object View */}
        {!selectedBucket ? (
          <div>
            {/* Buckets Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Buckets ({buckets.length})
              </h2>
              <button
                onClick={() => setShowCreateBucketModal(true)}
                className="inline-flex items-center gap-2 rounded-md bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-slate-900 font-medium"
              >
                <FolderPlusIcon className="h-5 w-5" />
                Create Bucket
              </button>
            </div>

            {/* Buckets List */}
            {loadingBuckets ? (
              <div className="text-center py-12 text-slate-600 dark:text-slate-300">
                Loading buckets...
              </div>
            ) : buckets.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-12 text-center">
                <FolderIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No buckets yet
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Create your first bucket to start storing objects
                </p>
                <button
                  onClick={() => setShowCreateBucketModal(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-slate-900 font-medium"
                >
                  <FolderPlusIcon className="h-5 w-5" />
                  Create Bucket
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {buckets.map((bucket) => (
                  <div
                    key={bucket.Name}
                    className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-5 hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        onClick={() => setSelectedBucket(bucket.Name)}
                        className="flex-1"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <FolderIcon className="h-8 w-8 text-cyan-500" />
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-cyan-500">
                            {bucket.Name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Created: {formatDate(bucket.CreationDate)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBucketToDelete(bucket.Name);
                          setShowDeleteBucketModal(true);
                        }}
                        className="text-red-500 hover:text-red-600 p-2"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Objects Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedBucket(null);
                    setObjects([]);
                  }}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  Back to Buckets
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {selectedBucket}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {objects.length} object{objects.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 rounded-md bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-slate-900 font-medium"
              >
                <ArrowUpTrayIcon className="h-5 w-5" />
                Upload Object
              </button>
            </div>

            {/* Objects List */}
            {loadingObjects ? (
              <div className="text-center py-12 text-slate-600 dark:text-slate-300">
                Loading objects...
              </div>
            ) : objects.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-12 text-center">
                <DocumentIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No objects in this bucket
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Upload your first object to get started
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-slate-900 font-medium"
                >
                  <ArrowUpTrayIcon className="h-5 w-5" />
                  Upload Object
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 dark:text-slate-300 uppercase">
                        Name
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 dark:text-slate-300 uppercase">
                        Size
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 dark:text-slate-300 uppercase">
                        Last Modified
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-slate-600 dark:text-slate-300 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {objects.map((obj) => (
                      <tr key={obj.Key} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <DocumentIcon className="h-5 w-5 text-slate-400" />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {obj.Key}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {formatBytes(obj.Size)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {formatDate(obj.LastModified)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDownloadObject(obj.Key)}
                              className="p-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded"
                              title="Download"
                            >
                              <ArrowDownTrayIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                setObjectToDelete(obj.Key);
                                setShowDeleteObjectModal(true);
                              }}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              title="Delete"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Create Bucket Modal */}
        <Dialog open={showCreateBucketModal} onClose={() => setShowCreateBucketModal(false)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/30 dark:bg-black/60" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="max-w-md rounded-xl bg-white dark:bg-slate-800 p-6">
              <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Create New Bucket
              </DialogTitle>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Bucket Name
                </label>
                <input
                  type="text"
                  value={newBucketName}
                  onChange={(e) => setNewBucketName(e.target.value.toLowerCase())}
                  placeholder="my-bucket-name"
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  3-63 characters, lowercase, hyphens allowed, must start/end with letter or number
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateBucket}
                  className="flex-1 rounded-md bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-slate-900 font-medium"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateBucketModal(false);
                    setNewBucketName("");
                  }}
                  className="flex-1 rounded-md border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Delete Bucket Modal */}
        <Dialog open={showDeleteBucketModal} onClose={() => setShowDeleteBucketModal(false)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/30 dark:bg-black/60" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="max-w-md rounded-xl bg-white dark:bg-slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Delete Bucket
                </DialogTitle>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Are you sure you want to delete the bucket <strong>{bucketToDelete}</strong>? This action cannot be undone. The bucket must be empty.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteBucket}
                  className="flex-1 rounded-md bg-red-500 hover:bg-red-600 px-4 py-2 text-white font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteBucketModal(false);
                    setBucketToDelete("");
                  }}
                  className="flex-1 rounded-md border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Upload Object Modal */}
        <Dialog open={showUploadModal} onClose={() => setShowUploadModal(false)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/30 dark:bg-black/60" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="max-w-md rounded-xl bg-white dark:bg-slate-800 p-6">
              <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Upload Object
              </DialogTitle>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadFileState(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-500 dark:text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-cyan-50 file:text-cyan-700
                    hover:file:bg-cyan-100
                    dark:file:bg-cyan-900/20 dark:file:text-cyan-400"
                />
                {uploadFileState && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    Selected: {uploadFileState.name} ({formatBytes(uploadFileState.size)})
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleFileUpload}
                  disabled={!uploadFileState || uploading}
                  className="flex-1 rounded-md bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-300 disabled:cursor-not-allowed px-4 py-2 text-slate-900 font-medium"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFileState(null);
                  }}
                  disabled={uploading}
                  className="flex-1 rounded-md border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Delete Object Modal */}
        <Dialog open={showDeleteObjectModal} onClose={() => setShowDeleteObjectModal(false)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/30 dark:bg-black/60" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="max-w-md rounded-xl bg-white dark:bg-slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Delete Object
                </DialogTitle>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Are you sure you want to delete <strong>{objectToDelete}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteObject}
                  className="flex-1 rounded-md bg-red-500 hover:bg-red-600 px-4 py-2 text-white font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteObjectModal(false);
                    setObjectToDelete("");
                  }}
                  className="flex-1 rounded-md border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ObjectStorageDashboard;
