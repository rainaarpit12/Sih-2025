import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf, ArrowLeft, User, Mail, Lock, Phone, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

const FarmerSignup = () => {
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
    dateOfBirth: "",
    
    // Farm Information
    farmName: "",
    farmAddress: "",
    farmSize: "",
    farmType: "",
    cropsGrown: "",
    experience: "",
    certification: "",
    
    // Additional
    agreement: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const farmTypes = [
    "Organic Farm",
    "Conventional Farm", 
    "Hydroponic Farm",
    "Greenhouse Farm",
    "Livestock Farm",
    "Mixed Farm",
    "Poultry Farm",
    "Dairy Farm"
  ];

  const certificationTypes = [
    "Organic Certification",
    "GAP (Good Agricultural Practices)",
    "Fair Trade Certified",
    "Rainforest Alliance",
    "USDA Organic",
    "Non-GMO Project Verified",
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
    if (!formData.farmName.trim()) newErrors.farmName = "Farm name is required";
    if (!formData.farmAddress.trim()) newErrors.farmAddress = "Farm address is required";
    if (!formData.farmSize.trim()) newErrors.farmSize = "Farm size is required";
    if (!formData.farmType) newErrors.farmType = "Farm type is required";
    if (!formData.cropsGrown.trim()) newErrors.cropsGrown = "Crops grown information is required";
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
        dateOfBirth: formData.dateOfBirth,
        role: 'farmer' as const,
        farmName: formData.farmName,
        farmAddress: formData.farmAddress,
        farmSize: formData.farmSize,
        farmType: formData.farmType,
        cropsGrown: formData.cropsGrown,
        experience: formData.experience,
        certification: formData.certification,
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
        description: "Your farmer account has been created. Please login to continue.",
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-foreground">AgriChain</span>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Leaf className="h-6 w-6" />
              Farmer Registration
            </CardTitle>
            <CardDescription className="text-green-100">
              Join the AgriChain network and start tracking your produce from farm to table
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
                  
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    />
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

              {/* Farm Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Farm Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="farmName">Farm Name *</Label>
                      <Input
                        id="farmName"
                        value={formData.farmName}
                        onChange={(e) => handleInputChange("farmName", e.target.value)}
                        placeholder="Enter your farm name"
                        className={errors.farmName ? "border-red-500" : ""}
                      />
                      {errors.farmName && <p className="text-red-500 text-sm mt-1">{errors.farmName}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="farmSize">Farm Size (in acres) *</Label>
                      <Input
                        id="farmSize"
                        value={formData.farmSize}
                        onChange={(e) => handleInputChange("farmSize", e.target.value)}
                        placeholder="e.g., 10 acres"
                        className={errors.farmSize ? "border-red-500" : ""}
                      />
                      {errors.farmSize && <p className="text-red-500 text-sm mt-1">{errors.farmSize}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="farmAddress">Farm Address *</Label>
                    <Textarea
                      id="farmAddress"
                      value={formData.farmAddress}
                      onChange={(e) => handleInputChange("farmAddress", e.target.value)}
                      placeholder="Enter complete farm address"
                      className={errors.farmAddress ? "border-red-500" : ""}
                      rows={3}
                    />
                    {errors.farmAddress && <p className="text-red-500 text-sm mt-1">{errors.farmAddress}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="farmType">Farm Type *</Label>
                      <Select value={formData.farmType} onValueChange={(value) => handleInputChange("farmType", value)}>
                        <SelectTrigger className={errors.farmType ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select farm type" />
                        </SelectTrigger>
                        <SelectContent>
                          {farmTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.farmType && <p className="text-red-500 text-sm mt-1">{errors.farmType}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        placeholder="e.g., 5 years"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="cropsGrown">Primary Crops Grown *</Label>
                    <Textarea
                      id="cropsGrown"
                      value={formData.cropsGrown}
                      onChange={(e) => handleInputChange("cropsGrown", e.target.value)}
                      placeholder="List the main crops you grow (e.g., Rice, Wheat, Tomatoes, etc.)"
                      className={errors.cropsGrown ? "border-red-500" : ""}
                      rows={3}
                    />
                    {errors.cropsGrown && <p className="text-red-500 text-sm mt-1">{errors.cropsGrown}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="certification">Certifications</Label>
                    <Select value={formData.certification} onValueChange={(value) => handleInputChange("certification", value)}>
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
                    <button type="button" className="text-green-600 hover:underline">
                      Terms and Conditions
                    </button>{" "}
                    and{" "}
                    <button type="button" className="text-green-600 hover:underline">
                      Privacy Policy
                    </button>
                  </Label>
                  {errors.agreement && <p className="text-red-500 text-sm">{errors.agreement}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="farmer"
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
                    <Leaf className="h-5 w-5 mr-2" />
                    Create Farmer Account
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
              className="text-green-600 hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerSignup;