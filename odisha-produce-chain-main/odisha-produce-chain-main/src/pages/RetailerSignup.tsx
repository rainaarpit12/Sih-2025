import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Store, ArrowLeft, User, Mail, Lock, Phone, MapPin, Building, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

const RetailerSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    
    // Store Information
    storeName: "",
    storeType: "",
    businessRegistration: "",
    gstNumber: "",
    fssaiLicense: "",
    establishedYear: "",
    
    // Location Information
    storeAddress: "",
    city: "",
    state: "",
    pincode: "",
    operatingHours: "",
    storeSize: "",
    
    // Business Information
    productCategories: "",
    targetCustomers: "",
    averageDailySales: "",
    
    // Additional
    agreement: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storeTypes = [
    "Supermarket",
    "Grocery Store",
    "Organic Store",
    "Farmer's Market Stall",
    "Specialty Food Store",
    "Convenience Store",
    "Hypermarket",
    "Online Retail",
    "Department Store",
    "Co-operative Store"
  ];

  const productCategories = [
    "Fresh Fruits & Vegetables",
    "Organic Products",
    "Dairy Products",
    "Grains & Cereals",
    "Processed Foods",
    "Beverages",
    "Frozen Foods",
    "Meat & Poultry",
    "Bakery Items",
    "All Categories"
  ];

  const targetCustomers = [
    "General Public",
    "Health Conscious Consumers",
    "Organic Food Enthusiasts",
    "Local Community",
    "Premium Customers",
    "Budget Conscious Shoppers",
    "Restaurants & Cafes",
    "Corporate Clients"
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.storeName.trim()) newErrors.storeName = "Store name is required";
    if (!formData.storeType) newErrors.storeType = "Store type is required";
    if (!formData.storeAddress.trim()) newErrors.storeAddress = "Store address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!formData.productCategories) newErrors.productCategories = "Product categories are required";
    if (!formData.agreement) newErrors.agreement = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create user profile from registration data
      const newUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: "", // Not collected in retailer form
        role: 'retailer' as const,
        storeName: formData.storeName,
        storeAddress: `${formData.storeAddress}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        businessType: formData.storeType,
        gstNumber: formData.gstNumber,
        registeredAt: new Date().toISOString()
      };
      
      // Save registered users to localStorage for login validation
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      registeredUsers.push({
        email: formData.email,
        password: formData.password,
        profile: newUser
      });
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      toast({
        title: "Registration Successful!",
        description: "Your retailer account has been created. Please login to continue.",
      });
      
      // Navigate to login page
      navigate("/login");
      
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          <div className="flex items-center gap-2">
            <Store className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-foreground">AgriChain</span>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Store className="h-6 w-6" />
              Retailer Registration
            </CardTitle>
            <CardDescription className="text-purple-100">
              Join our retail network and bring authentic products to your customers
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter your first name"
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter your last name"
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Account Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Create a password"
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="Confirm your password"
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Store Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Store Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="storeName">Store Name *</Label>
                      <Input
                        id="storeName"
                        value={formData.storeName}
                        onChange={(e) => handleInputChange("storeName", e.target.value)}
                        placeholder="Enter store name"
                        className={errors.storeName ? "border-red-500" : ""}
                      />
                      {errors.storeName && <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="storeType">Store Type *</Label>
                      <Select value={formData.storeType} onValueChange={(value) => handleInputChange("storeType", value)}>
                        <SelectTrigger className={errors.storeType ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select store type" />
                        </SelectTrigger>
                        <SelectContent>
                          {storeTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.storeType && <p className="text-red-500 text-sm mt-1">{errors.storeType}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="businessRegistration">Business Registration</Label>
                      <Input
                        id="businessRegistration"
                        value={formData.businessRegistration}
                        onChange={(e) => handleInputChange("businessRegistration", e.target.value)}
                        placeholder="Registration number"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input
                        id="gstNumber"
                        value={formData.gstNumber}
                        onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                        placeholder="GST number"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fssaiLicense">FSSAI License</Label>
                      <Input
                        id="fssaiLicense"
                        value={formData.fssaiLicense}
                        onChange={(e) => handleInputChange("fssaiLicense", e.target.value)}
                        placeholder="FSSAI license number"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="establishedYear">Established Year</Label>
                      <Input
                        id="establishedYear"
                        value={formData.establishedYear}
                        onChange={(e) => handleInputChange("establishedYear", e.target.value)}
                        placeholder="e.g., 2020"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="storeSize">Store Size</Label>
                      <Input
                        id="storeSize"
                        value={formData.storeSize}
                        onChange={(e) => handleInputChange("storeSize", e.target.value)}
                        placeholder="e.g., 1000 sq ft"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="storeAddress">Store Address *</Label>
                    <Textarea
                      id="storeAddress"
                      value={formData.storeAddress}
                      onChange={(e) => handleInputChange("storeAddress", e.target.value)}
                      placeholder="Enter complete store address"
                      className={errors.storeAddress ? "border-red-500" : ""}
                      rows={3}
                    />
                    {errors.storeAddress && <p className="text-red-500 text-sm mt-1">{errors.storeAddress}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Enter city"
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="Enter state"
                        className={errors.state ? "border-red-500" : ""}
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        placeholder="Enter pincode"
                        className={errors.pincode ? "border-red-500" : ""}
                      />
                      {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="operatingHours">Operating Hours</Label>
                    <Input
                      id="operatingHours"
                      value={formData.operatingHours}
                      onChange={(e) => handleInputChange("operatingHours", e.target.value)}
                      placeholder="e.g., 9:00 AM - 9:00 PM"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Business Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productCategories">Product Categories *</Label>
                    <Select value={formData.productCategories} onValueChange={(value) => handleInputChange("productCategories", value)}>
                      <SelectTrigger className={errors.productCategories ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select main product categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.productCategories && <p className="text-red-500 text-sm mt-1">{errors.productCategories}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetCustomers">Target Customers</Label>
                      <Select value={formData.targetCustomers} onValueChange={(value) => handleInputChange("targetCustomers", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target customers" />
                        </SelectTrigger>
                        <SelectContent>
                          {targetCustomers.map((customer) => (
                            <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="averageDailySales">Average Daily Sales</Label>
                      <Input
                        id="averageDailySales"
                        value={formData.averageDailySales}
                        onChange={(e) => handleInputChange("averageDailySales", e.target.value)}
                        placeholder="e.g., ₹50,000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreement"
                  checked={formData.agreement}
                  onCheckedChange={(checked) => handleInputChange("agreement", checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="agreement" className="text-sm">
                    I agree to the{" "}
                    <button type="button" className="text-purple-600 hover:underline">
                      Terms and Conditions
                    </button>{" "}
                    and{" "}
                    <button type="button" className="text-purple-600 hover:underline">
                      Privacy Policy
                    </button>
                  </Label>
                  {errors.agreement && <p className="text-red-500 text-sm">{errors.agreement}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="retail"
                className="w-full py-6 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Store className="h-5 w-5 mr-2" />
                    Create Retailer Account
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/login")}
              className="text-purple-600 hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RetailerSignup;