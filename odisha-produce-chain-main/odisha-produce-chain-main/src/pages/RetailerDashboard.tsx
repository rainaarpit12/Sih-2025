import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Store, Package, Edit, LogOut, Calendar, MapPin, Star, DollarSign, QrCode, Upload, Scan, Users, TrendingUp, ShieldCheck, History, BarChart3, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import jsQR from "jsqr";

// Define proper TypeScript interfaces
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

interface ScannedProductData {
  success: boolean;
  product: Product;
  verified: boolean;
  error?: string;
}

interface RetailerData {
  retailerName: string;
  storageConditions: string;
  retailPrice: string;
  retailerLocation: string;
  dateOfArrival: string;
}

const RetailerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [scannedProduct, setScannedProduct] = useState<ScannedProductData | null>(null);
  const [retailerData, setRetailerData] = useState<RetailerData>({
    retailerName: "",
    storageConditions: "",
    retailPrice: "",
    retailerLocation: "",
    dateOfArrival: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [scanResult, setScanResult] = useState<string>("");
  const [scanCount, setScanCount] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScannedProductData[]>([]);
  const [showScanHistory, setShowScanHistory] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Load scan count from localStorage on component mount
  useEffect(() => {
    const savedScanCount = localStorage.getItem('retailerScanCount');
    const savedScanHistory = localStorage.getItem('retailerScanHistory');
    
    if (savedScanCount) {
      setScanCount(parseInt(savedScanCount));
    }
    
    if (savedScanHistory) {
      try {
        setScanHistory(JSON.parse(savedScanHistory));
      } catch (error) {
        console.error("Error parsing scan history:", error);
      }
    }

    // Set initial animation state
    setIsVisible(true);
  }, []);

  // Save scan count and history to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('retailerScanCount', scanCount.toString());
    localStorage.setItem('retailerScanHistory', JSON.stringify(scanHistory));
  }, [scanCount, scanHistory]);

  // Handle QR image upload and decoding
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScanResult("");
    setIsScanning(true);
    
    const file = e.target.files?.[0];
    if (!file) {
      setIsScanning(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setIsScanning(false);
          toast({
            title: "Error",
            description: "Could not read image.",
            variant: "destructive"
          });
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        
        if (code && code.data) {
          const processedContent = code.data.trim();
          setScanResult(processedContent);
          handleQRScan(processedContent);
        } else {
          setIsScanning(false);
          toast({
            title: "Error",
            description: "No QR code found in the image.",
            variant: "destructive"
          });
        }
      };
      if (typeof ev.target?.result === "string") {
        img.src = ev.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Function to handle QR scan and product retrieval
  const handleQRScan = async (qrContent: string) => {
    try {
      console.log("Processing QR code:", qrContent);
      
      // Send the encrypted content directly to the backend
      const response = await fetch(`http://localhost:8086/api/retailer/product-details/${encodeURIComponent(qrContent)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ScannedProductData = await response.json();
      
      if (data.success) {
        setScannedProduct(data);
        setScanCount(prev => prev + 1);
        setScanHistory(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 scans
        toast({
          title: "QR Code Processed Successfully!",
          description: `Product ${data.product.productId} details loaded.`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to process product",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error processing QR:", error);
      toast({
        title: "Error",
        description: "Failed to process product. Please check if the backend is running on port 8086.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Manual input for encrypted code
  const handleManualInput = () => {
    if (scanResult.trim()) {
      setIsScanning(true);
      setTimeout(() => {
        handleQRScan(scanResult.trim());
        setIsScanning(false);
      }, 800);
    } else {
      toast({
        title: "Error",
        description: "Please enter an encrypted code",
        variant: "destructive"
      });
    }
  };

  const updateProductInfo = async () => {
    if (!scannedProduct) {
      toast({
        title: "Error",
        description: "Please scan a product first",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    try {
      // Update retailer info in backend
      const response = await fetch(`http://localhost:8086/api/retailer/update-info/${scannedProduct.product.productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...retailerData,
          // Retailer address will be handled by backend from application.properties
        })
      });
      
      const data = await response.json();
      
      if (data.retailerInfo) {
        toast({
          title: "Product Updated Successfully!",
          description: "Retailer information has been added to the product.",
        });
        
        // Reset form
        setRetailerData({
          retailerName: "",
          storageConditions: "",
          retailPrice: "",
          retailerLocation: "",
          dateOfArrival: ""
        });
        
      } else {
        throw new Error(data.error || "Failed to update product");
      }
    } catch (error: unknown) {
      console.error("Error updating product:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update product information";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Clear scan history
  const clearScanHistory = () => {
    setScanHistory([]);
    toast({
      title: "History Cleared",
      description: "Scan history has been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-border bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className={`flex items-center gap-2 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
            <Store className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">AgriChain</span>
            <Badge variant="secondary" className="bg-warning/10 text-warning">
              Retailer
            </Badge>
          </div>
          <Button variant="ghost" onClick={() => navigate("/")}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className={`mb-8 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <h1 className="text-4xl font-bold text-foreground mb-2">Retailer Dashboard</h1>
          <p className="text-muted-foreground">Scan product QR codes to add retail information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* QR Upload & Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* QR Upload Card */}
            <div className={`transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <Card className="bg-white border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Scan Product QR Code
                  </CardTitle>
                  <CardDescription>
                    Scan the product QR code image to retrieve product details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <div className={`h-16 w-16 mx-auto text-primary mb-4 ${isScanning ? 'animate-pulse' : ''}`}>
                      <Scan className="h-full w-full" />
                    </div>
                    
                    {/* Image QR Code Upload */}
                    <div className="mb-4">
                      <input
                        type="file"
                        ref={imageInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      
                      <Button 
                        onClick={() => imageInputRef.current?.click()} 
                        className="w-full relative overflow-hidden"
                        disabled={isScanning}
                      >
                        {isScanning && (
                          <div className="absolute inset-0 bg-primary/20 animate-shimmer" />
                        )}
                        <ImageIcon className="h-4 w-4 mr-2" />
                        {isScanning ? "Scanning..." : "Scan QR Image"}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">.jpg, .png, .gif</p>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">OR</div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="manualInput">Enter Encrypted Code Manually</Label>
                      <Input
                        id="manualInput"
                        placeholder="Paste encrypted code here"
                        value={scanResult}
                        onChange={(e) => setScanResult(e.target.value)}
                        className="font-mono text-sm"
                      />
                      <Button 
                        onClick={handleManualInput} 
                        variant="outline" 
                        className="w-full"
                        disabled={isScanning}
                      >
                        {isScanning ? "Processing..." : "Load Product Details"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Details Card */}
            {scannedProduct && scannedProduct.success && (
              <div className="transition-all duration-500 delay-300">
                <Card className="bg-white border-border shadow-lg">
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Product Details
                    </CardTitle>
                    <CardDescription>
                      Product information retrieved from the QR code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="productId">Product ID</Label>
                        <Input id="productId" value={scannedProduct.product.productId} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="productName">Product Name</Label>
                        <Input id="productName" value={scannedProduct.product.productName} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" value={scannedProduct.product.category} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="qualityRating">Quality Rating</Label>
                        <div className="flex items-center">
                          <Input id="qualityRating" value={scannedProduct.product.qualityRating} readOnly />
                          <Star className="h-4 w-4 ml-2 text-yellow-500 fill-current" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="dateOfManufacture">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Date of Manufacture
                        </Label>
                        <Input id="dateOfManufacture" value={scannedProduct.product.dateOfManufacture} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="time">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Time
                        </Label>
                        <Input id="time" value={scannedProduct.product.time} readOnly />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="place">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          Place of Manufacture
                        </Label>
                        <Input id="place" value={scannedProduct.product.place} readOnly />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="priceForFarmer">
                          <DollarSign className="h-4 w-4 inline mr-1" />
                          Price for Farmer
                        </Label>
                        <Input id="priceForFarmer" value={`₹${scannedProduct.product.priceForFarmer.toFixed(2)}`} readOnly />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" value={scannedProduct.product.description} readOnly />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Retailer Information Form */}
            {scannedProduct && scannedProduct.success && (
              <div className="transition-all duration-500 delay-400">
                <Card className="bg-white border-border shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Add Retailer Information
                    </CardTitle>
                    <CardDescription>
                      Add your retail information to complete the product record
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="retailerName">Retailer Name</Label>
                        <Input
                          id="retailerName"
                          value={retailerData.retailerName}
                          onChange={(e) => setRetailerData({...retailerData, retailerName: e.target.value})}
                          placeholder="Enter your business name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="storageConditions">Storage Conditions</Label>
                        <Select
                          value={retailerData.storageConditions}
                          onValueChange={(value) => setRetailerData({...retailerData, storageConditions: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select storage conditions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Room Temperature">Room Temperature</SelectItem>
                            <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                            <SelectItem value="Frozen">Frozen</SelectItem>
                            <SelectItem value="Dry Storage">Dry Storage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="retailPrice">Retail Price (₹)</Label>
                        <Input
                          id="retailPrice"
                          type="number"
                          value={retailerData.retailPrice}
                          onChange={(e) => setRetailerData({...retailerData, retailPrice: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="retailerLocation">Retailer Location</Label>
                        <Input
                          id="retailerLocation"
                          value={retailerData.retailerLocation}
                          onChange={(e) => setRetailerData({...retailerData, retailerLocation: e.target.value})}
                          placeholder="Enter your location"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfArrival">Date of Arrival</Label>
                        <Input
                          id="dateOfArrival"
                          type="date"
                          value={retailerData.dateOfArrival}
                          onChange={(e) => setRetailerData({...retailerData, dateOfArrival: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={updateProductInfo} 
                      className="w-full mt-4"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Update Product Information"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Retailer Stats Sidebar */}
          <div className="space-y-6">
            {/* Stats Overview Card */}
            <div className={`transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <Card className="bg-white border-border shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Scan className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Products Scanned</span>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {scanCount}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Verified Products</span>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      {scanHistory.filter(item => item.verified).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Customer Reach</span>
                    </div>
                    <Badge variant="secondary" className="bg-warning/10 text-warning">
                      {scanCount * 25}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scan History Card */}
            <div className={`transition-all duration-500 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <Card className="bg-white border-border shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Recent Scans
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setShowScanHistory(!showScanHistory)}>
                      {showScanHistory ? "Hide" : "Show"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showScanHistory ? (
                    <div className="space-y-3">
                      {scanHistory.length > 0 ? (
                        <>
                          {scanHistory.map((scan, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">{scan.product.productName}</p>
                                  <p className="text-xs text-muted-foreground">{scan.product.productId}</p>
                                </div>
                              </div>
                              <Badge variant={scan.verified ? "default" : "secondary"} className={scan.verified ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
                                {scan.verified ? "Verified" : "Pending"}
                              </Badge>
                            </div>
                          ))}
                          <Button variant="outline" className="w-full mt-2" onClick={clearScanHistory}>
                            Clear History
                          </Button>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No scan history yet</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">{scanHistory.length} scans recorded</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowScanHistory(true)}>
                        View History
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Verification Status Card */}
            {scannedProduct && (
              <div className={`transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <Card className={`bg-white border-border shadow-lg ${scannedProduct.verified ? 'border-success/20' : 'border-warning/20'}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      Verification Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-2">
                      <div className={`h-16 w-16 mx-auto mb-4 ${scannedProduct.verified ? 'text-success' : 'text-warning'}`}>
                        <ShieldCheck className="h-full w-full" />
                      </div>
                      <h3 className={`font-bold text-lg ${scannedProduct.verified ? 'text-success' : 'text-warning'}`}>
                        {scannedProduct.verified ? "Verified Product" : "Verification Pending"}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {scannedProduct.verified 
                          ? "This product has been verified in the supply chain." 
                          : "This product requires retailer verification."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale {
          0% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .scale-animation {
          animation: scale 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RetailerDashboard;