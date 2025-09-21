import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, User, Store, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser, demoUsers } from "@/contexts/UserContext";




const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [selectedRole, setSelectedRole] = useState<string>("farmer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const roles = [
    {
      id: "farmer",
      name: "Farmer",
      icon: Leaf,
      description: "Register products and manage your farm's supply chain",
      color: "farmer",
      route: "/farmer-dashboard"
    },
    {
      id: "distributor",
      name: "Distributor",
      icon: User,
      description: "Manage distribution network and track shipments",
      color: "distributor",
      route: "/distributor-dashboard"
    },
    {
      id: "retailer", 
      name: "Retailer",
      icon: Store,
      description: "Update product information and manage retail operations",
      color: "retail",
      route: "/retailer-dashboard"
    },
    {
      id: "customer",
      name: "Customer",
      icon: ShoppingCart,
      description: "Verify product authenticity and view supply chain history",
      color: "scan",
      route: "/customer-dashboard"
    }
  ];

  // Demo credentials
  const demoCredentials = {
    farmer: {
      email: "farmer@gmail.com",
      password: "farmer123"
    },
    distributor: {
      email: "distributor@gmail.com",
      password: "distributor123"
    },
    retailer: {
      email: "retailer@gmail.com",
      password: "retailer123"
    },
    customer: {
      email: "customer@gmail.com",
      password: "customer123"
    }
  };

  const handleDirectNavigation = (role: string) => {
    console.log("🔧 DIRECT NAV: Testing direct navigation to", role);
    const routes = {
      farmer: "/farmer-dashboard",
      retailer: "/retailer-dashboard", 
      distributor: "/distributor-dashboard",
      customer: "/customer-dashboard"
    };
    const route = routes[role as keyof typeof routes];
    console.log("🔧 DIRECT NAV: Navigating to route:", route);
    navigate(route);
  };

  const handleLogin = async (e: React.FormEvent) => {
    setError(""); // Reset error
    
    console.log("Login attempt:", { selectedRole, email, password });
    
    // First check registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const registeredUser = registeredUsers.find((user: any) => 
      user.email === email && 
      user.password === password && 
      user.profile.role === selectedRole
    );
    
    if (registeredUser) {
      console.log("Found registered user:", registeredUser);
      // Use actual registered user data
      setUser(registeredUser.profile);
      
      // Navigate to the appropriate dashboard
      const role = roles.find(r => r.id === selectedRole);
      if (role) {
        console.log("Navigating to:", role.route);
        navigate(role.route);
      }
      return;
    }
    
    // Fallback to demo credentials if no registered user found
    const roleCredentials = demoCredentials[selectedRole as keyof typeof demoCredentials];
    console.log("Checking demo credentials:", roleCredentials);
    
    if (email === roleCredentials.email && password === roleCredentials.password) {
      console.log("Demo credentials match, setting user data");
      // Set user data from demo users
      const userData = demoUsers[selectedRole as keyof typeof demoUsers];
      console.log("Demo user data:", userData);
      setUser(userData);
      
      // Navigate to the appropriate dashboard
      const role = roles.find(r => r.id === selectedRole);
      if (role) {
        console.log("Navigating to dashboard:", role.route);
        navigate(role.route);
      } else {
        console.error("Role not found for:", selectedRole);
        setError("Navigation error: Role configuration not found");
      }
    } else {
      console.log("Credentials don't match. Expected:", roleCredentials, "Got:", { email, password });
      setError("Invalid email or password for the selected role");
    }
  };

  const handleRegister = () => {
    // Navigate to the appropriate signup page based on selected role
    navigate(`/${selectedRole}-signup`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">AgriChain</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Choose your role and sign in to continue</p>
        </div>

        <Card className="bg-gradient-card border-border shadow-agricultural">
          <CardHeader>
            <CardTitle className="text-center">Select Your Role</CardTitle>
            <CardDescription className="text-center">
              Different roles have different access levels and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedRole} onValueChange={setSelectedRole} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                {roles.map((role) => (
                  <TabsTrigger key={role.id} value={role.id}>
                    <role.icon className="h-4 w-4" />
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {roles.map((role) => (
                <TabsContent key={role.id} value={role.id} className="mt-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <role.icon className="h-12 w-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold text-lg text-foreground">{role.name}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Demo: {demoCredentials[role.id as keyof typeof demoCredentials].email} / 
                      {demoCredentials[role.id as keyof typeof demoCredentials].password}
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="space-y-4">
              {/* Quick test buttons for debugging */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 mb-2">Quick Login Test:</p>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedRole("distributor");
                      setEmail("distributor@gmail.com");
                      setPassword("distributor123");
                    }}
                  >
                    Fill Distributor
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedRole("farmer");
                      setEmail("farmer@gmail.com");
                      setPassword("farmer123");
                    }}
                  >
                    Fill Farmer
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">Direct Navigation Test:</p>
                <div className="flex gap-2 flex-wrap mt-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDirectNavigation("distributor")}
                  >
                    Go to Distributor
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDirectNavigation("farmer")}
                  >
                    Go to Farmer
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {error && (
                <div className="text-destructive text-sm text-center">
                  {error}
                </div>
              )}
              
              <Button 
                variant={selectedRole === "farmer" ? "farmer" : selectedRole === "retailer" ? "retail" : selectedRole === "distributor" ? "default" : "scan"}
                className="w-full"
                onClick={handleLogin}
                type="button"
              >
                Sign In as {roles.find(r => r.id === selectedRole)?.name}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button 
                  className="text-primary hover:underline cursor-pointer"
                  onClick={handleRegister}
                >
                  Register here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;