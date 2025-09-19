import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, ArrowLeft, User, Mail, Lock, Phone, MapPin, Warehouse, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

const DistributorSignup = () => {
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
    
    // Company Information
    companyName: "",
    companyRegistration: "",
    businessLicense: "",
    gstNumber: "",
    establishedYear: "",
    
    // Distribution Information
    warehouseAddress: "",
    warehouseCapacity: "",
    deliveryRange: "",
    vehicleFleetSize: "",
    specializations: "",
    certifications: "",
    operatingRegions: "",
    
    // Additional
    agreement: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specializations = [
    "Fresh Produce",
    "Organic Products",
    "Frozen Foods",
    "Dairy Products",
    "Grains & Cereals",
    "Fruits & Vegetables",
    "Meat & Poultry",
    "Processed Foods",
    "Beverages",
    "All Categories"
  ];

  const certificationTypes = [
    "ISO 22000 (Food Safety)",
    "HACCP Certification",
    "Cold Chain Certification",
    "Organic Distribution License",
    "Import/Export License",
    "Food Distribution License",
    "Good Distribution Practices (GDP)",
    "None"
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
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.warehouseAddress.trim()) newErrors.warehouseAddress = "Warehouse address is required";
    if (!formData.warehouseCapacity.trim()) newErrors.warehouseCapacity = "Warehouse capacity is required";
    if (!formData.deliveryRange.trim()) newErrors.deliveryRange = "Delivery range is required";
    if (!formData.specializations) newErrors.specializations = "Product specialization is required";
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
        dateOfBirth: "", // Not collected in distributor form
        role: 'distributor' as const,
        companyName: formData.companyName,
        businessAddress: formData.warehouseAddress,
        licenseNumber: formData.businessLicense,
        distributionAreas: formData.operatingRegions,
        vehicleDetails: `Fleet Size: ${formData.vehicleFleetSize}, Specializations: ${formData.specializations}`,
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
        description: "Your distributor account has been created. Please login to continue.",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          <div className="flex items-center gap-2">
            <Truck className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-foreground">AgriChain</span>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Truck className="h-6 w-6" />
              Distributor Registration
            </CardTitle>
            <CardDescription className="text-blue-100">
              Join our distribution network and connect farmers with retailers
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

              {/* Company Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        placeholder="Enter company name"
                        className={errors.companyName ? "border-red-500" : ""}
                      />
                      {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="establishedYear">Established Year</Label>
                      <Input
                        id="establishedYear"
                        value={formData.establishedYear}
                        onChange={(e) => handleInputChange("establishedYear", e.target.value)}
                        placeholder="e.g., 2020"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyRegistration">Company Registration No.</Label>
                      <Input
                        id="companyRegistration"
                        value={formData.companyRegistration}
                        onChange={(e) => handleInputChange("companyRegistration", e.target.value)}
                        placeholder="Enter registration number"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input
                        id="gstNumber"
                        value={formData.gstNumber}
                        onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                        placeholder="Enter GST number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="businessLicense">Business License</Label>
                    <Input
                      id="businessLicense"
                      value={formData.businessLicense}
                      onChange={(e) => handleInputChange("businessLicense", e.target.value)}
                      placeholder="Enter business license number"
                    />
                  </div>
                </div>
              </div>

              {/* Distribution Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Warehouse className="h-5 w-5" />
                  Distribution Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="warehouseAddress">Main Warehouse Address *</Label>
                    <Textarea
                      id="warehouseAddress"
                      value={formData.warehouseAddress}
                      onChange={(e) => handleInputChange("warehouseAddress", e.target.value)}
                      placeholder="Enter complete warehouse address"
                      className={errors.warehouseAddress ? "border-red-500" : ""}
                      rows={3}
                    />
                    {errors.warehouseAddress && <p className="text-red-500 text-sm mt-1">{errors.warehouseAddress}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="warehouseCapacity">Warehouse Capacity *</Label>
                      <Input
                        id="warehouseCapacity"
                        value={formData.warehouseCapacity}
                        onChange={(e) => handleInputChange("warehouseCapacity", e.target.value)}
                        placeholder="e.g., 1000 tons"
                        className={errors.warehouseCapacity ? "border-red-500" : ""}
                      />
                      {errors.warehouseCapacity && <p className="text-red-500 text-sm mt-1">{errors.warehouseCapacity}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryRange">Delivery Range *</Label>
                      <Input
                        id="deliveryRange"
                        value={formData.deliveryRange}
                        onChange={(e) => handleInputChange("deliveryRange", e.target.value)}
                        placeholder="e.g., 500 km"
                        className={errors.deliveryRange ? "border-red-500" : ""}
                      />
                      {errors.deliveryRange && <p className="text-red-500 text-sm mt-1">{errors.deliveryRange}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="vehicleFleetSize">Vehicle Fleet Size</Label>
                      <Input
                        id="vehicleFleetSize"
                        value={formData.vehicleFleetSize}
                        onChange={(e) => handleInputChange("vehicleFleetSize", e.target.value)}
                        placeholder="e.g., 25 vehicles"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="specializations">Product Specializations *</Label>
                    <Select value={formData.specializations} onValueChange={(value) => handleInputChange("specializations", value)}>
                      <SelectTrigger className={errors.specializations ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select your main specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.specializations && <p className="text-red-500 text-sm mt-1">{errors.specializations}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="operatingRegions">Operating Regions</Label>
                    <Textarea
                      id="operatingRegions"
                      value={formData.operatingRegions}
                      onChange={(e) => handleInputChange("operatingRegions", e.target.value)}
                      placeholder="List the regions/states where you operate (e.g., Karnataka, Tamil Nadu, Kerala)"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="certifications">Certifications</Label>
                    <Select value={formData.certifications} onValueChange={(value) => handleInputChange("certifications", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select certification (if any)" />
                      </SelectTrigger>
                      <SelectContent>
                        {certificationTypes.map((cert) => (
                          <SelectItem key={cert} value={cert}>{cert}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <button type="button" className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </button>{" "}
                    and{" "}
                    <button type="button" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </button>
                  </Label>
                  {errors.agreement && <p className="text-red-500 text-sm">{errors.agreement}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Truck className="h-5 w-5 mr-2" />
                    Create Distributor Account
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
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DistributorSignup;