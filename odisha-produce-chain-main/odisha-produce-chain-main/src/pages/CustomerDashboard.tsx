import { useState, useRef } from "react";
import {
  ShoppingCart, Scan, CheckCircle, Calendar, MapPin, Star, DollarSign,
  LogOut, User, XCircle, QrCode, Store, Warehouse, Bell, Download, Share2, Heart
} from "lucide-react";
import jsQR from "jsqr";

interface Product {
  productId: string;
  productName: string;
  category: string;
  dateOfManufacture: string;
  time: string;
  place: string;
  qualityRating: string;
  priceForFarmer: number;
  description: string;
}

interface RetailerInfo {
  retailerName: string;
  storageConditions: string;
  retailPrice: number;
  retailerLocation: string;
  dateOfArrival: string;
  retailerRating: number;
}

interface VerificationResponse {
  success: boolean;
  verified: boolean;
  product: Product;
  retailerInfo?: RetailerInfo;
  error?: string;
}

interface HistoryEntry {
  timestamp: string;
  product: Product;
}

const CustomerDashboard = () => {
  // Mock toast function
  const toast = ({ title, description, variant }: any) => {
    console.log(`Toast: ${title} - ${description}${variant ? ` (${variant})` : ''}`);
  };

  const [verifiedProduct, setVerifiedProduct] = useState<Product | null>(null);
  const [retailerInfo, setRetailerInfo] = useState<RetailerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [qrInput, setQrInput] = useState("");
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [notifications, setNotifications] = useState<string[]>([
    "✅ Milk batch verified successfully",
    "⚠ Suspicious wheat flour detected",
    "🌱 Sustainability report updated",
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("verify");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock profile
  const userProfile = {
    name: "Customer",
    preferences: ["Organic", "Local Produce", "Sustainable"],
  };

  // Verify product via API
  const verifyProduct = async (encryptedCode: string) => {
    setLoading(true);
    setVerificationError(null);
    setVerifiedProduct(null);
    setRetailerInfo(null);

    try {
      // Replace with your API
      const response = await fetch(`http://localhost:8081/api/retailer/product-details/${encodeURIComponent(encryptedCode)}`);
      const data: VerificationResponse = await response.json();

      if (response.ok && data.success && data.verified) {
        setVerifiedProduct(data.product);
        if (data.retailerInfo) setRetailerInfo(data.retailerInfo);

        setHistory(prev => [...prev, { timestamp: new Date().toISOString(), product: data.product }]);

        toast({
          title: "Product Verified",
          description: `Authentic product: ${data.product.productName} verified.`,
        });
      } else {
        throw new Error(data.error || "Product verification failed");
      }
    } catch (err: any) {
      setVerificationError(err.message || "Unknown error during verification");
      toast({
        title: "Verification Failed",
        description: err.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Manual QR verification
  const handleManualVerify = () => {
    if (!qrInput.trim()) {
      toast({
        title: "Input Error",
        description: "Please enter a QR code value",
        variant: "destructive",
      });
      return;
    }
    verifyProduct(qrInput.trim());
  };

  // Simulated QR scan for demo
  const simulateCustomerScan = () => {
    const mockEncryptedCode =
      "QUdSLTg4NGY0Y2N8T3JnYW5pYyBBcHBsZXN8Q2FsaWZvcm5pYSBGYXJtfDE3MzE2MTQ5ODA4OQ==";
    setQrInput(mockEncryptedCode);
    verifyProduct(mockEncryptedCode);
  };

  // QR code scanning from uploaded image
  const handleQrFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setVerificationError(null);
    setDecodedText("");

    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setVerificationError("Could not read image.");
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code && code.data) {
          setQrInput(code.data);
          verifyProduct(code.data);
        } else {
          setVerificationError("No QR code found in the image.");
        }
      };
      if (typeof ev.target?.result === "string") {
        img.src = ev.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const [decodedText, setDecodedText] = useState<string>("");

  const getQualityColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case "premium": return "bg-gradient-to-r from-emerald-400 to-green-600 text-white";
      case "excellent": return "bg-gradient-to-r from-blue-400 to-indigo-600 text-white";
      case "good": return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
      default: return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const addToFavorites = () => {
    if (verifiedProduct) {
      setFavorites(prev => [...prev, verifiedProduct]);
      toast({ title: "Added to Favorites", description: verifiedProduct.productName });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Navbar */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg animate-pulse">
                <ShoppingCart size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AgriChain
                </h1>
                <p className="text-xs text-gray-500">Trust • Transparency • Quality</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Enhanced Notifications */}
              <div className="relative">
                <button 
                  className="relative p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                    {notifications.length}
                  </span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 transform transition-all duration-300 scale-100">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((note, i) => (
                        <div key={i} className="p-3 border-b border-gray-50 hover:bg-blue-50 transition-all duration-200">
                          <p className="text-sm">{note}</p>
                          <p className="text-xs text-gray-500 mt-1">Just now</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => console.log("Logout clicked")}
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile.name}! 👋
          </h2>
          <p className="text-gray-600">Track, verify, and trust your food's journey from farm to table.</p>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-2 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          {["verify", "history", "favorites", "profile", "education"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              <div className="flex items-center gap-2">
                {tab === "verify" && <Scan size={18} />}
                {tab === "history" && <Calendar size={18} />}
                {tab === "favorites" && <Heart size={18} />}
                {tab === "profile" && <User size={18} />}
                {tab === "education" && <Star size={18} />}
                <span className="hidden sm:inline capitalize">{tab}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Product Verification */}
        {activeTab === "verify" && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <Scan size={24} />
                  Product Verification
                </h2>
                <p className="text-blue-100 mt-1">Scan or enter QR code to verify authenticity</p>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Quick Scan */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Quick Scan</h3>
                    <button 
                      className={`w-full p-6 border-2 border-dashed rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        loading 
                          ? 'border-blue-500 bg-blue-50 animate-pulse' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      onClick={simulateCustomerScan}
                      disabled={loading}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <QrCode size={32} className={loading ? "text-blue-500" : "text-gray-400"} />
                        <p className="font-medium">{loading ? "Processing..." : "Simulate QR Scan"}</p>
                      </div>
                    </button>
                  </div>

                  {/* Manual Input */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Manual Entry</h3>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Choose QR file:</label>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        onChange={handleQrFile}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      
                      <label className="block text-sm font-medium text-gray-700">Manual input:</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={qrInput} 
                          onChange={(e) => setQrInput(e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter QR code"
                        />
                        <button 
                          className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                          }`}
                          onClick={handleManualVerify}
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            'Verify'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {verificationError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <XCircle size={24} className="text-red-500" />
                  <div>
                    <h4 className="font-semibold text-red-900">Verification Failed</h4>
                    <p className="text-red-700">{verificationError}</p>
                  </div>
                </div>
              </div>
            )}

            {decodedText && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle size={24} className="text-blue-500" />
                  <div>
                    <h4 className="font-semibold text-blue-900">QR Code Decoded</h4>
                    <p className="text-blue-700 font-mono text-sm">{decodedText}</p>
                  </div>
                </div>
              </div>
            )}

            {verifiedProduct && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <CheckCircle size={24} />
                    Verified Product ✨
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{verifiedProduct.productName}</h3>
                      <p className="text-gray-600">{verifiedProduct.category}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-semibold ${getQualityColor(verifiedProduct.qualityRating)} shadow-lg`}>
                      {verifiedProduct.qualityRating}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Product ID:</span>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{verifiedProduct.productId}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Manufactured:</span>
                        <span className="font-medium">{formatDate(verifiedProduct.dateOfManufacture)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Origin:</span>
                        <span className="font-medium">{verifiedProduct.place}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Farm Price:</span>
                        <span className="font-bold text-green-600">₹{verifiedProduct.priceForFarmer}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">{verifiedProduct.description}</p>
                      
                      <button 
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                        onClick={addToFavorites}
                      >
                        <Heart size={16} />
                        Add to Favorites
                      </button>
                    </div>
                  </div>

                  {retailerInfo && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <Store size={18} />
                        Retailer Information
                      </h4>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-lg font-semibold text-gray-900">{retailerInfo.retailerName}</p>
                          <p className="text-2xl font-bold text-green-600">₹{retailerInfo.retailPrice}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin size={14} />
                            {retailerInfo.retailerLocation}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar size={14} />
                            Arrived: {formatDate(retailerInfo.dateOfArrival)}
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Warehouse size={14} />
                            {retailerInfo.storageConditions}
                          </p>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">Trust Rating</span>
                              <span className="text-sm font-bold text-blue-600">{retailerInfo.retailerRating}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${retailerInfo.retailerRating}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History */}
        {activeTab === "history" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar size={24} />
                Verification History
              </h2>
            </div>
            <div className="p-6">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 italic">No verification history yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{h.product.productName}</p>
                          <p className="text-sm text-gray-500">{formatDate(h.timestamp)}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 transition-colors">
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Favorites */}
        {activeTab === "favorites" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <Heart size={24} />
                Favorite Products
              </h2>
            </div>
            <div className="p-6">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 italic">No favorite products yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorites.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                          <Heart size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{f.productName}</p>
                          <p className="text-sm text-gray-500">{f.category}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Download size={16} />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile */}
        {activeTab === "profile" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <User size={24} />
                User Profile
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{userProfile.name}</h3>
                  <p className="text-gray-600">Trusted Customer</p>
                </div>
              </div>
              
              <div>
                <p className="font-semibold text-gray-900 mb-3">Food Preferences:</p>
                <div className="flex gap-2 flex-wrap">
                  {userProfile.preferences.map((pref, i) => (
                    <span key={i} className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Education */}
        {activeTab === "education" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <Star size={24} />
                Learn & Awareness
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { icon: "🌱", title: "Why authentic products matter in your diet", desc: "Learn about the health benefits of genuine organic food" },
                  { icon: "📦", title: "How blockchain ensures supply chain transparency", desc: "Understanding the technology behind AgriChain" },
                  { icon: "💡", title: "Tips to identify genuine organic food", desc: "Practical guide for smart shopping" },
                  { icon: "⚡", title: "Sustainability practices in farming", desc: "Supporting eco-friendly agriculture" }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;