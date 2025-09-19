import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building, 
  Leaf, 
  Store, 
  Truck,
  Edit,
  Shield
} from "lucide-react";
import { useUser, UserProfile as UserProfileType } from "@/contexts/UserContext";

interface UserProfileProps {
  showEditButton?: boolean;
  onEdit?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ showEditButton = true, onEdit }) => {
  const { user } = useUser();

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No user data available</p>
        </CardContent>
      </Card>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'farmer': return <Leaf className="h-5 w-5 text-green-600" />;
      case 'distributor': return <Truck className="h-5 w-5 text-blue-600" />;
      case 'retailer': return <Store className="h-5 w-5 text-purple-600" />;
      case 'customer': return <User className="h-5 w-5 text-orange-600" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'bg-green-100 text-green-800 border-green-200';
      case 'distributor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'retailer': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'customer': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-sm text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getRoleIcon(user.role)}
            <div>
              <CardTitle className="text-xl">
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge className={getRoleBadgeColor(user.role)}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                <span className="text-xs">Member since {new Date(user.registeredAt).toLocaleDateString()}</span>
              </CardDescription>
            </div>
          </div>
          {showEditButton && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={<Mail className="h-4 w-4 text-blue-500" />}
              label="Email"
              value={user.email}
            />
            <InfoItem
              icon={<Phone className="h-4 w-4 text-green-500" />}
              label="Phone"
              value={user.phone}
            />
            <InfoItem
              icon={<Calendar className="h-4 w-4 text-purple-500" />}
              label="Date of Birth"
              value={new Date(user.dateOfBirth).toLocaleDateString()}
            />
          </div>
        </div>

        {/* Role-specific Information */}
        {user.role === 'farmer' && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Farm Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<Building className="h-4 w-4 text-green-500" />}
                label="Farm Name"
                value={user.farmName || 'N/A'}
              />
              <InfoItem
                icon={<MapPin className="h-4 w-4 text-red-500" />}
                label="Farm Address"
                value={user.farmAddress || 'N/A'}
              />
              <InfoItem
                icon={<Building className="h-4 w-4 text-blue-500" />}
                label="Farm Size"
                value={user.farmSize || 'N/A'}
              />
              <InfoItem
                icon={<Leaf className="h-4 w-4 text-green-500" />}
                label="Farm Type"
                value={user.farmType || 'N/A'}
              />
              <InfoItem
                icon={<Leaf className="h-4 w-4 text-green-500" />}
                label="Crops Grown"
                value={user.cropsGrown || 'N/A'}
              />
              <InfoItem
                icon={<Calendar className="h-4 w-4 text-purple-500" />}
                label="Experience"
                value={user.experience || 'N/A'}
              />
              {user.certification && (
                <InfoItem
                  icon={<Shield className="h-4 w-4 text-yellow-500" />}
                  label="Certification"
                  value={user.certification}
                />
              )}
            </div>
          </div>
        )}

        {user.role === 'distributor' && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<Building className="h-4 w-4 text-blue-500" />}
                label="Company Name"
                value={user.companyName || 'N/A'}
              />
              <InfoItem
                icon={<MapPin className="h-4 w-4 text-red-500" />}
                label="Business Address"
                value={user.businessAddress || 'N/A'}
              />
              <InfoItem
                icon={<Shield className="h-4 w-4 text-yellow-500" />}
                label="License Number"
                value={user.licenseNumber || 'N/A'}
              />
              <InfoItem
                icon={<MapPin className="h-4 w-4 text-green-500" />}
                label="Distribution Areas"
                value={user.distributionAreas || 'N/A'}
              />
              <InfoItem
                icon={<Truck className="h-4 w-4 text-blue-500" />}
                label="Vehicle Details"
                value={user.vehicleDetails || 'N/A'}
              />
            </div>
          </div>
        )}

        {user.role === 'retailer' && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Store className="h-5 w-5 text-purple-600" />
              Store Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<Store className="h-4 w-4 text-purple-500" />}
                label="Store Name"
                value={user.storeName || 'N/A'}
              />
              <InfoItem
                icon={<MapPin className="h-4 w-4 text-red-500" />}
                label="Store Address"
                value={user.storeAddress || 'N/A'}
              />
              <InfoItem
                icon={<Building className="h-4 w-4 text-blue-500" />}
                label="Business Type"
                value={user.businessType || 'N/A'}
              />
              <InfoItem
                icon={<Shield className="h-4 w-4 text-yellow-500" />}
                label="GST Number"
                value={user.gstNumber || 'N/A'}
              />
            </div>
          </div>
        )}

        {user.role === 'customer' && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-orange-600" />
              Additional Information
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <InfoItem
                icon={<MapPin className="h-4 w-4 text-red-500" />}
                label="Address"
                value={user.address || 'N/A'}
              />
              <InfoItem
                icon={<User className="h-4 w-4 text-orange-500" />}
                label="Preferences"
                value={user.preferences || 'N/A'}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;