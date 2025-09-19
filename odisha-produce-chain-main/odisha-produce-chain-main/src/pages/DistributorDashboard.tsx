import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, Edit, LogOut, Calendar, MapPin, Star, DollarSign, QrCode, Upload, Scan, Users, TrendingUp, ShieldCheck, History, BarChart3, Image as ImageIcon, Warehouse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { NetworkStatus } from "@/components/NetworkStatus";
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

interface DistributorData {
  distributorName: string;
  warehouseLocation: string;
  storageConditions: string;
  transportationMethod: string;
  distributionPrice: string;
  dateOfReceiving: string;
  batchNumber: string;
  qualityCheckStatus: string;
}

const DistributorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [scannedProduct, setScannedProduct] = useState<ScannedProductData | null>(null);
  const [distributorData, setDistributorData] = useState<DistributorData>({
    distributorName: "",
    warehouseLocation: "",
    storageConditions: "",
    transportationMethod: "",
    distributionPrice: "",
    dateOfReceiving: "",
    batchNumber: "",
    qualityCheckStatus: ""
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
    const savedScanCount = localStorage.getItem('distributorScanCount');
    const savedScanHistory = localStorage.getItem('distributorScanHistory');
    
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
    localStorage.setItem('distributorScanCount', scanCount.toString());
    localStorage.setItem('distributorScanHistory', JSON.stringify(scanHistory));
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
      
      // First try to parse QR content locally if it's a JSON string
      let productData = null;
      try {
        // Check if QR content is direct JSON data
        productData = JSON.parse(qrContent);
        console.log("QR contains direct JSON data:", productData);
        
        // Create scanned product data from parsed JSON
        const scannedData: ScannedProductData = {
          success: true,
          product: {
            productId: productData.productId || "Unknown",
            productName: productData.productName || "Unknown Product",
            category: productData.category || "Unknown",
            dateOfManufacture: productData.dateOfManufacture || "Unknown",
            time: productData.time || "Unknown",
            place: productData.place || "Unknown",
            qualityRating: productData.qualityRating || "Unknown",
            priceForFarmer: parseFloat(productData.priceForFarmer) || 0,
            description: productData.description || "No description available"
          },
          verified: true
        };
        
        setScannedProduct(scannedData);
        setScanCount(prev => prev + 1);
        setScanHistory(prev => [scannedData, ...prev.slice(0, 9)]); // Keep last 10 scans
        toast({
          title: "QR Code Processed Successfully!",
          description: `Product ${scannedData.product.productId} details loaded.`,
        });
        return;
      } catch (parseError) {
        console.log("QR content is not direct JSON, trying backend...");
      }
      
      // If local parsing failed, try backend
      const response = await fetch(`http://localhost:8086/api/distributor/product-details/${encodeURIComponent(qrContent)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
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
      
      // Create a fallback response with the raw QR content
      const fallbackData: ScannedProductData = {
        success: true,
        product: {
          productId: "SCAN_" + Date.now(),
          productName: "Scanned Product",
          category: "Unknown",
          dateOfManufacture: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0],
          place: "Unknown Location",
          qualityRating: "Pending Review",
          priceForFarmer: 0,
          description: `Raw QR Content: ${qrContent.substring(0, 100)}${qrContent.length > 100 ? '...' : ''}`
        },
        verified: false
      };
      
      setScannedProduct(fallbackData);
      setScanCount(prev => prev + 1);
      setScanHistory(prev => [fallbackData, ...prev.slice(0, 9)]);
      
      toast({
        title: "QR Code Scanned (Offline Mode)",
        description: "Backend unavailable. Displaying QR content in offline mode.",
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
    
    // Validate required fields
    const requiredFields = [
      { field: 'distributorName', name: 'Distributor Name' },
      { field: 'warehouseLocation', name: 'Warehouse Location' },
      { field: 'storageConditions', name: 'Storage Conditions' },
      { field: 'transportationMethod', name: 'Transportation Method' },
      { field: 'distributionPrice', name: 'Distribution Price' },
      { field: 'dateOfReceiving', name: 'Date of Receiving' },
      { field: 'qualityCheckStatus', name: 'Quality Check Status' }
    ];
    
    const emptyFields = requiredFields.filter(req => !distributorData[req.field as keyof DistributorData]);
    
    if (emptyFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill: ${emptyFields.map(f => f.name).join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    console.log("🔧 DISTRIBUTOR UPDATE: Starting update with data:", distributorData);
    
    try {
      // Try to update via backend first
      const response = await fetch(`http://localhost:8086/api/distributor/update-info/${scannedProduct.product.productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...distributorData,
          // Distributor address will be handled by backend from application.properties
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("🔧 DISTRIBUTOR UPDATE: Backend response:", data);
      
      if (data.distributorInfo) {
        toast({
          title: "Product Updated Successfully!",
          description: "Distributor information has been added to the product.",
        });
        
        // Reset form
        setDistributorData({
          distributorName: "",
          warehouseLocation: "",
          storageConditions: "",
          transportationMethod: "",
          distributionPrice: "",
          dateOfReceiving: "",
          batchNumber: "",
          qualityCheckStatus: ""
        });
        
      } else {
        throw new Error(data.error || "Failed to update product");
      }
    } catch (error: unknown) {
      console.error("🔧 DISTRIBUTOR UPDATE: Backend failed, trying offline mode:", error);
      
      // Offline mode - save locally
      try {
        const distributorUpdate = {
          productId: scannedProduct.product.productId,
          distributorData: distributorData,
          timestamp: new Date().toISOString(),
          status: 'offline_saved'
        };
        
        // Save to localStorage
        const existingUpdates = JSON.parse(localStorage.getItem('distributorUpdates') || '[]');
        existingUpdates.push(distributorUpdate);
        localStorage.setItem('distributorUpdates', JSON.stringify(existingUpdates));
        
        console.log("🔧 DISTRIBUTOR UPDATE: Saved offline:", distributorUpdate);
        
        toast({
          title: "Product Updated (Offline Mode)!",
          description: "Distributor information saved locally. Will sync when online.",
        });
        
        // Reset form
        setDistributorData({
          distributorName: "",
          warehouseLocation: "",
          storageConditions: "",
          transportationMethod: "",
          distributionPrice: "",
          dateOfReceiving: "",
          batchNumber: "",
          qualityCheckStatus: ""
        });
        
      } catch (offlineError) {
        console.error("🔧 DISTRIBUTOR UPDATE: Offline save failed:", offlineError);
        const errorMessage = error instanceof Error ? error.message : "Failed to update product information";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
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

  // Load demo product for testing
  const loadDemoProduct = () => {
    const demoProduct: ScannedProductData = {
      success: true,
      product: {
        productId: "DEMO_001",
        productName: "Organic Tomatoes",
        category: "Vegetables",
        dateOfManufacture: "2024-01-15",
        time: "08:30:00",
        place: "Bhubaneswar, Odisha",
        qualityRating: "A+",
        priceForFarmer: 45,
        description: "Fresh organic tomatoes grown without pesticides"
      },
      verified: true
    };
    
    setScannedProduct(demoProduct);
    setScanCount(prev => prev + 1);
    setScanHistory(prev => [demoProduct, ...prev.slice(0, 9)]);
    
    toast({
      title: "Demo Product Loaded!",
      description: "You can now test the distributor form with demo data.",
    });
  };

  // Auto-fill distributor form for testing
  const autoFillDistributorForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setDistributorData({
      distributorName: "Odisha Fresh Distribution Pvt Ltd",
      warehouseLocation: "Industrial Area, Bhubaneswar, Odisha - 751024",
      storageConditions: "refrigerated",
      transportationMethod: "refrigerated-truck",
      distributionPrice: "60",
      dateOfReceiving: today,
      batchNumber: "DIST-2024-001",
      qualityCheckStatus: "passed"
    });
    
    toast({
      title: "Form Auto-filled!",
      description: "All required fields have been filled with sample data.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <header className="border-b border-border bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className={`flex items-center gap-2 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
            <Truck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">AgriChain</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Distributor
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
        {/* Network Status */}
        <div className="mb-6">
          <NetworkStatus />
        </div>
        
        <div className={`mb-8 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <h1 className="text-4xl font-bold text-foreground mb-2">Distributor Dashboard</h1>
          <p className="text-muted-foreground">Scan product QR codes to add distribution information</p>
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
                    
                    <div className="text-sm text-muted-foreground my-2 text-center">OR</div>
                    
                    {/* Demo Product Button */}
                    <div className="space-y-2">
                      <Button 
                        onClick={loadDemoProduct} 
                        variant="secondary" 
                        className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200"
                        disabled={isScanning}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Load Demo Product (For Testing)
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">Use this to test the distributor form</p>
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
                        <Label htmlFor="place">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          Farm Location
                        </Label>
                        <Input id="place" value={scannedProduct.product.place} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="priceForFarmer">
                          <DollarSign className="h-4 w-4 inline mr-1" />
                          Farmer Price
                        </Label>
                        <Input id="priceForFarmer" value={`₹${scannedProduct.product.priceForFarmer}`} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="time">Production Time</Label>
                        <Input id="time" value={scannedProduct.product.time} readOnly />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">Product Description</Label>
                        <Input id="description" value={scannedProduct.product.description} readOnly />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Distributor Information Form */}
            {scannedProduct && scannedProduct.success && (
              <div className="transition-all duration-500 delay-400">
                <Card className="bg-white border-border shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Add Distribution Information
                    </CardTitle>
                    <CardDescription>
                      Enter distribution details for this product
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {/* Auto-fill button for testing */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800">Quick Test Fill</p>
                          <p className="text-xs text-blue-600">Auto-fill all required fields for testing</p>
                        </div>
                        <Button 
                          onClick={autoFillDistributorForm}
                          variant="outline" 
                          size="sm"
                          className="bg-blue-100 hover:bg-blue-200 border-blue-300"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Auto Fill
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="distributorName">Distributor Name *</Label>
                        <Input
                          id="distributorName"
                          placeholder="Enter distributor name"
                          value={distributorData.distributorName}
                          onChange={(e) => setDistributorData({...distributorData, distributorName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="warehouseLocation">Warehouse Location *</Label>
                        <Input
                          id="warehouseLocation"
                          placeholder="Enter warehouse address"
                          value={distributorData.warehouseLocation}
                          onChange={(e) => setDistributorData({...distributorData, warehouseLocation: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="storageConditions">Storage Conditions *</Label>
                        <Select value={distributorData.storageConditions} onValueChange={(value) => setDistributorData({...distributorData, storageConditions: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select storage conditions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="refrigerated">Refrigerated (0-4°C)</SelectItem>
                            <SelectItem value="frozen">Frozen (-18°C)</SelectItem>
                            <SelectItem value="controlled-atmosphere">Controlled Atmosphere</SelectItem>
                            <SelectItem value="dry-storage">Dry Storage</SelectItem>
                            <SelectItem value="ambient">Ambient Temperature</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="transportationMethod">Transportation Method *</Label>
                        <Select value={distributorData.transportationMethod} onValueChange={(value) => setDistributorData({...distributorData, transportationMethod: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transportation method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="refrigerated-truck">Refrigerated Truck</SelectItem>
                            <SelectItem value="standard-truck">Standard Truck</SelectItem>
                            <SelectItem value="rail-transport">Rail Transport</SelectItem>
                            <SelectItem value="air-cargo">Air Cargo</SelectItem>
                            <SelectItem value="sea-freight">Sea Freight</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="distributionPrice">Distribution Price (₹) *</Label>
                        <Input
                          id="distributionPrice"
                          type="number"
                          placeholder="Enter distribution price"
                          value={distributorData.distributionPrice}
                          onChange={(e) => setDistributorData({...distributorData, distributionPrice: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfReceiving">Date of Receiving *</Label>
                        <Input
                          id="dateOfReceiving"
                          type="date"
                          value={distributorData.dateOfReceiving}
                          onChange={(e) => setDistributorData({...distributorData, dateOfReceiving: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="batchNumber">Batch Number</Label>
                        <Input
                          id="batchNumber"
                          placeholder="Enter batch number"
                          value={distributorData.batchNumber}
                          onChange={(e) => setDistributorData({...distributorData, batchNumber: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="qualityCheckStatus">Quality Check Status *</Label>
                        <Select value={distributorData.qualityCheckStatus} onValueChange={(value) => setDistributorData({...distributorData, qualityCheckStatus: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passed">Quality Check Passed</SelectItem>
                            <SelectItem value="failed">Quality Check Failed</SelectItem>
                            <SelectItem value="pending">Quality Check Pending</SelectItem>
                            <SelectItem value="conditional">Conditional Pass</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={updateProductInfo} 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isUpdating || !distributorData.distributorName || !distributorData.warehouseLocation || !distributorData.storageConditions || !distributorData.transportationMethod || !distributorData.distributionPrice || !distributorData.dateOfReceiving || !distributorData.qualityCheckStatus}
                    >
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                          Updating Product...
                        </>
                      ) : (
                        <>
                          <Warehouse className="h-4 w-4 mr-2" />
                          Update Distribution Information
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Stats & History Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className={`transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Products Scanned</p>
                      <p className="text-3xl font-bold">{scanCount}</p>
                    </div>
                    <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Scan className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className={`transition-all duration-500 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Distribution Network</p>
                      <p className="text-3xl font-bold">Active</p>
                    </div>
                    <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scan History */}
            <div className={`transition-all duration-500 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <Card className="bg-white border-border shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Scan History
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowScanHistory(!showScanHistory)}
                    >
                      {showScanHistory ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  <CardDescription>Recent product scans</CardDescription>
                </CardHeader>
                {showScanHistory && (
                  <CardContent>
                    {scanHistory.length > 0 ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {scanHistory.map((scan, index) => (
                          <div key={index} className="p-3 bg-muted/30 rounded-lg border">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{scan.product.productName}</span>
                              <Badge variant={scan.verified ? "default" : "secondary"} className="text-xs">
                                {scan.verified ? <ShieldCheck className="h-3 w-3 mr-1" /> : null}
                                {scan.verified ? "Verified" : "Unverified"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">ID: {scan.product.productId}</p>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearScanHistory}
                          className="w-full mt-2"
                        >
                          Clear History
                        </Button>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm text-center py-4">
                        No scans yet
                      </p>
                    )}
                  </CardContent>
                )}
              </Card>
            </div>

            {/* Quick Actions */}
            <div className={`transition-all duration-500 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <Card className="bg-white border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    View All Products
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Warehouse className="h-4 w-4 mr-2" />
                    Warehouse Management
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Supplier Network
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;