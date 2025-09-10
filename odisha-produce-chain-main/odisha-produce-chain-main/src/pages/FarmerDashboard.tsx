import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, QrCode, Download, Share, LogOut, BarChart3, Cloud, TrendingUp, Calendar, MapPin, Loader2, Award, Info, Menu, X, Home, PieChart, Sprout, ArrowLeft, Lightbulb } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

// Custom toast hook replacement
const useToast = () => ({
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    const toastEl = document.createElement('div');
    toastEl.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
      variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`;
    toastEl.innerHTML = `
      <div class="font-medium">${title}</div>
      <div class="text-sm opacity-90">${description}</div>
    `;
    document.body.appendChild(toastEl);
    setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateX(100%)';
      setTimeout(() => toastEl.remove(), 300);
    }, 3000);
  }
});

// Custom navigate hook replacement
const useNavigate = () => {
  return (path: string) => {
    window.location.href = path;
  };
};

// Tamil translations
const tamilTranslations = {
  productName: "பொருள் பெயர்",
  category: "வகை",
  dateOfManufacture: "உற்பத்தி தேதி",
  time: "நேரம்",
  place: "இடம்",
  qualityRating: "தர மதிப்பீடு",
  priceForFarmer: "விவசாயிக்கான விலை",
  description: "விளக்கம்",
  productId: "பொருள் ஐடி",
  register: "பதிவு செய்",
  reset: "மீட்டமை",
  downloadQR: "QR பதிவிறக்க",
  shareQR: "QR பகிர்",
  dashboard: "டாஷ்போர்டு",
  weather: "வானிலை",
  marketPrices: "சந்தை விலைகள்",
  productsRegistered: "பதிவுசெய்யப்பட்ட பொருட்கள்",
  today: "இன்று",
  thisWeek: "இந்த வாரம்",
  thisMonth: "இந்த மாதம்",
  total: "மொத்தம்",
  temperature: "வெப்பநிலை",
  humidity: "ஈரப்பதம்",
  rainfall: "மழை",
  wind: "காற்று",
  condition: "நிலை",
  sunny: "வெயில்",
  rainy: "மழை",
  cloudy: "மேகமூட்டம்",
  crop: "பயிர்",
  price: "விலை",
  trend: "போக்கு",
  state: "மாநிலம்",
  currentLocation: "தற்போதைய இடம்",
  productRegistration: "தயாரிப்பு பதிவு",
  registrationStats: "பதிவு புள்ளிவிவரங்கள்",
  weeklyRegistrations: "வாராந்திர பதிவுகள்",
  productCategories: "தயாரிப்பு வகைகள்",
  governmentSchemes: "அரசு திட்டங்கள்",
  qrGeneration: "QR உருவாக்கம்",
  analysis: "பகுப்பாய்வு",
  pmSchemes: "PM திட்டங்கள்",
  seasonalCrops: "பருவகால பயிர்கள்",
  summer: "கோடை",
  winter: "குளிர்காலம்",
  monsoon: "மழைக்காலம்",
  rabi: "ராபி",
  kharif: "கரீப்",
  KharifSeason: "கரீப் பருவம்",
  RabiSeason: "ராபி பருவம்",
  SummerSeason: "கோடைக்கால பருவம்",
  MonsoonSeason: "மழைக்கால பருவம்",
  WinterSeason: "குளிர்கால பருவம்",
  Vegetables: "காய்கறிகள்",
  Fruits: "பழங்கள்",
  Grains: "தானியங்கள்",
  Spices: "மசாலாப் பொருட்கள்",
  Dairy: "பால் பொருட்கள்",
  Poultry: "கோழி வளர்ப்பு",
  Flowers: "மலர்கள்",
  Herbs: "மூலிகைகள்",
  Nuts: "கொட்டைகள்",
  Other: "மற்றவை",
  Rice: "அரிசி",
  Cotton: "பருத்தி",
  Sugarcane: "கரும்பு",
  Maize: "மக்காச்சோளம்",
  Soybean: "சோயாபீன்",
  Wheat: "கோதுமை",
  Barley: "பார்லி",
  Mustard: "கடுகு",
  Peas: "பட்டாணி",
  Potato: "உருளைக்கிழங்கு",
  Groundnut: "நிலக்கடலை",
  Millet: "கேழ்வரகு",
  Watermelon: "தர்பூசணி",
  Cucumber: "வெள்ளரிக்காய்",
  Pumpkin: "பூசணிக்காய்",
  Tomato: "தக்காளி",
  Onion: "வெங்காயம்",
  loadingWeather: "வானிலை தகவல் ஏற்றப்படுகிறது...",
  registrationSuccessful: "தயாரிப்பு வெற்றிகரமாக பதிவு செய்யப்பட்டது!",
  addedToBlockchain: "பிளாக்செயினில் சேர்க்கப்பட்டது.",
  registrationFailed: "பதிவு தோல்வியடைந்தது",
  copied: "நகலெடுக்கப்பட்டது",
  productIdCopied: "தயாரிப்பு ID கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது",
  bestTime: "சரியான நேரம்",
  expectedYield: "எதிர்பார்க்கப்படும் விளைச்சல்",
  season: "பருவம்",
  eligibility: "தகுதி",
  schemeDetails: "திட்ட விவரங்கள்",
  welcomeMessage: "விவசாயி தளத்திற்கு வரவேற்கிறோம்!"
};

const indianStates = [
  "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana",
  "Maharashtra", "Gujarat", "Rajasthan", "Punjab", "Haryana",
  "Uttar Pradesh", "Bihar", "West Bengal", "Odisha", "Madhya Pradesh",
  "Assam", "Other"
];

const productCategories = [
  "Vegetables", "Fruits", "Grains", "Spices", "Dairy",
  "Poultry", "Flowers", "Herbs", "Nuts", "Other"
];

const qualityRatings = ["Premium", "Excellent", "Good", "Standard", "Fair"];

const governmentSchemes = [
  {
    name: "PM-KISAN",
    description: "Direct income support of ₹6,000 per year to farmer families. This scheme aims to provide financial stability and support to small and marginal farmers, helping them meet their day-to-day expenses and agricultural input costs.",
    eligibility: "All landholding farmer families are eligible for this scheme, regardless of the size of their landholding.",
    tamilName: "பிரதமர் கிசான் சம்மான் நிதி",
    tamilDescription: "விவசாய குடும்பங்களுக்கு ஆண்டுக்கு ₹6,000 நேரடி வருமான ஆதரவு. இந்த திட்டம் சிறு மற்றும் குறு விவசாயிகளுக்கு நிதி ஸ்திரத்தன்மையையும் ஆதரவையும் வழங்குவதை நோக்கமாகக் கொண்டுள்ளது, இது அவர்களின் அன்றாட செலவுகள் மற்றும் விவசாய உள்ளீட்டு செலவுகளை பூர்த்தி செய்ய உதவுகிறது.",
    tamilEligibility: "நிலம் வைத்திருக்கும் அனைத்து விவசாய குடும்பங்களும், நிலத்தின் அளவைப் பொருட்படுத்தாமல், இந்த திட்டத்திற்கு தகுதியுடையவர்கள்."
  },
  {
    name: "Crop Insurance",
    description: "Insurance coverage for crop losses due to natural calamities, pests, and diseases. This provides a safety net for farmers against unforeseen events, ensuring their financial security and encouraging them to adopt modern farming practices.",
    eligibility: "All farmers growing notified crops in notified areas are eligible. This includes loanee and non-loanee farmers.",
    tamilName: "பயிர் காப்பீடு திட்டம்",
    tamilDescription: "இயற்கை பேரழிவுகள், பூச்சிகள் மற்றும் நோய்கள் காரணமாக ஏற்படும் பயிர் இழப்புகளுக்கு காப்பீட்டு பாதுகாப்பு. இது எதிர்பாராத நிகழ்வுகளுக்கு எதிராக விவசாயிகளுக்கு ஒரு பாதுகாப்பு வலையை வழங்குகிறது, அவர்களின் நிதி பாதுகாப்பை உறுதிசெய்து நவீன விவசாய முறைகளை பின்பற்ற அவர்களை ஊக்குவிக்கிறது.",
    tamilEligibility: "அறிவிக்கப்பட்ட பகுதிகளில் அறிவிக்கப்பட்ட பயிர்களை பயிரிடும் அனைத்து விவசாயிகளும் தகுதியுடையவர்கள். இதில் கடன் வாங்கிய மற்றும் கடன் வாங்காத விவசாயிகள் அடங்குவர்."
  },
  {
    name: "Soil Health Card",
    description: "Free soil testing and nutrient management advice to help farmers optimize fertilizer use. The card provides a detailed report on the soil's nutrient status and recommends the right amount and type of fertilizers to improve productivity and sustainability.",
    eligibility: "All farmers with agricultural land.",
    tamilName: "மண் ஆரோக்கிய அட்டை",
    tamilDescription: "மண் பரிசோதனை மற்றும் ஊட்டச்சத்து மேலாண்மை ஆலோசனை விவசாயிகளுக்கு உர பயன்பாட்டை மேம்படுத்த உதவும். இந்த அட்டை மண்ணின் ஊட்டச்சத்து நிலை குறித்த விரிவான அறிக்கையை வழங்குகிறது மற்றும் உற்பத்தித்திறன் மற்றும் நிலைத்தன்மையை மேம்படுத்த சரியான அளவு மற்றும் வகை உரங்களை பரிந்துரைக்கிறது.",
    tamilEligibility: "விவசாய நிலம் உள்ள அனைத்து விவசாயிகளும்."
  },
  {
    name: "KCC (Kisan Credit Card)",
    description: "Provides easy credit access for agricultural needs at a low interest rate. The card simplifies the credit process, allowing farmers to quickly access funds for cultivation, post-harvest expenses, and other related needs.",
    eligibility: "All farmers with land records, including tenant farmers and sharecroppers.",
    tamilName: "கிசான் கிரெடிட் கார்டு",
    tamilDescription: "குறைந்த வட்டி விகிதத்தில் விவசாய தேவைகளுக்கு எளிதான கடன் வசதியை வழங்குகிறது. இந்த அட்டை கடன் செயல்முறையை எளிதாக்குகிறது, பயிர் சாகுபடி, அறுவடைக்குப் பிந்தைய செலவுகள் மற்றும் பிற தொடர்புடைய தேவைகளுக்காக விவசாயிகள் விரைவாக நிதியை அணுக அனுமதிக்கிறது.",
    tamilEligibility: "குத்தகை விவசாயிகள் மற்றும் பங்குதாரர்கள் உட்பட நிலம் வைத்திருக்கும் அனைத்து விவசாயிகளும்."
  },
  {
    name: "e-NAM",
    description: "A pan-India online trading portal for agricultural commodities. It provides a single platform for farmers, traders, and buyers, helping to ensure transparent price discovery and providing better prices for the farmers.",
    eligibility: "All farmers and traders registered on the portal.",
    tamilName: "மின்-நாம் சந்தை",
    tamilDescription: "விவசாயப் பொருட்களுக்கான அகில இந்திய ஆன்லைன் வர்த்தக போர்டல். இது விவசாயிகள், வர்த்தகர்கள் மற்றும் வாங்குபவர்களுக்கு ஒரு ஒற்றை தளத்தை வழங்குகிறது, வெளிப்படையான விலை கண்டுபிடிப்பை உறுதிசெய்ய உதவுகிறது மற்றும் விவசாயிகளுக்கு சிறந்த விலைகளை வழங்குகிறது.",
    tamilEligibility: "போர்ட்டலில் பதிவு செய்துள்ள அனைத்து விவசாயிகளும் மற்றும் வர்த்தகர்களும்."
  }
];

const seasonalCrops = {
  Kharif: [
    { name: "Rice", bestTime: "June-November", yield: "High", tamilName: "அரிசி" },
    { name: "Cotton", bestTime: "June-December", yield: "Medium", tamilName: "பருத்தி" },
    { name: "Sugarcane", bestTime: "June-November", yield: "High", tamilName: "கரும்பு" },
    { name: "Maize", bestTime: "June-September", yield: "High", tamilName: "மக்காச்சோளம்" },
    { name: "Soybean", bestTime: "June-October", yield: "Medium", tamilName: "சோயாபீன்" }
  ],
  Rabi: [
    { name: "Wheat", bestTime: "October-March", yield: "High", tamilName: "கோதுமை" },
    { name: "Barley", bestTime: "October-March", yield: "Medium", tamilName: "பார்லி" },
    { name: "Mustard", bestTime: "October-February", yield: "High", tamilName: "கடுகு" },
    { name: "Peas", bestTime: "November-February", yield: "Medium", tamilName: "பட்டாணி" },
    { name: "Potato", bestTime: "October-February", yield: "High", tamilName: "உருளைக்கிழங்கு" }
  ],
  Summer: [
    { name: "Groundnut", bestTime: "February-May", yield: "Medium", tamilName: "நிலக்கடலை" },
    { name: "Millet", bestTime: "February-June", yield: "High", tamilName: "கேழ்வரகு" },
    { name: "Watermelon", bestTime: "March-June", yield: "High", tamilName: "தர்பூசணி" },
    { name: "Cucumber", bestTime: "February-May", yield: "Medium", tamilName: "வெள்ளரிக்காய்" },
    { name: "Pumpkin", bestTime: "March-June", yield: "High", tamilName: "பூசணிக்காய்" }
  ],
  Monsoon: [
    { name: "Rice", bestTime: "June-November", yield: "High", tamilName: "அரிசி" },
    { name: "Maize", bestTime: "June-September", yield: "High", tamilName: "மக்காச்சோளம்" },
    { name: "Cotton", bestTime: "June-December", yield: "Medium", tamilName: "பருத்தி" },
    { name: "Sugarcane", bestTime: "June-November", yield: "High", tamilName: "கரும்பு" },
    { name: "Soybean", bestTime: "June-October", yield: "Medium", tamilName: "சோயாபீன்" }
  ],
  Winter: [
    { name: "Wheat", bestTime: "October-March", yield: "High", tamilName: "கோதுமை" },
    { name: "Barley", bestTime: "October-March", yield: "Medium", tamilName: "பார்லி" },
    { name: "Mustard", bestTime: "October-February", yield: "High", tamilName: "கடுகு" },
    { name: "Peas", bestTime: "November-February", yield: "Medium", tamilName: "பட்டாணி" },
    { name: "Potato", bestTime: "October-February", yield: "High", tamilName: "உருளைக்கிழங்கு" }
  ]
};

interface RegistrationStats {
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
}

interface ChartData {
  name: string;
  registrations: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface ProductData {
  productName: string;
  dateOfManufacture: string;
  time: string;
  place: string;
  qualityRating: string;
  priceForFarmer: string;
  productId: string;
  description: string;
  category: string;
  state: string;
}

interface WeatherData {
  temperature: string;
  humidity: string;
  rainfall: string;
  wind: string;
  condition: "Sunny" | "Rainy" | "Cloudy";
}

interface MarketPrice {
  crop: string;
  price: string;
  trend: "up" | "down" | "stable";
}

const FarmerDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [productId, setProductId] = useState<string>("");
  const [language, setLanguage] = useState<"english" | "tamil">("english");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [registrationStats, setRegistrationStats] = useState<RegistrationStats>({
    daily: 0,
    weekly: 0,
    monthly: 0,
    total: 0
  });
  const [registrationChartData, setRegistrationChartData] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([
    { name: "Vegetables", value: 35 },
    { name: "Fruits", value: 25 },
    { name: "Grains", value: 20 },
    { name: "Spices", value: 15 },
    { name: "Dairy", value: 5 }
  ]);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<"dashboard" | "qrGeneration" | "analysis" | "pmSchemes" | "seasonalCrops">("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<"Kharif" | "Rabi" | "Summer" | "Monsoon" | "Winter">("Kharif");
  const [selectedScheme, setSelectedScheme] = useState<typeof governmentSchemes[0] | null>(null);

  const [productData, setProductData] = useState<ProductData>({
    productName: "",
    dateOfManufacture: "",
    time: "",
    place: "",
    qualityRating: "",
    priceForFarmer: "",
    productId: "",
    description: "",
    category: "",
    state: ""
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => {
              const location = `${data.city || data.locality}, ${data.countryName}`;
              setCurrentLocation(location);
              setProductData(prev => ({ ...prev, place: location }));
            })
            .catch(error => {
              console.error("Error fetching location:", error);
              setCurrentLocation("Location unavailable");
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation("Location access denied");
        }
      );
    } else {
      setCurrentLocation("Geolocation not supported");
    }
  }, []);

  useEffect(() => {
    const fetchWeather = () => {
      const conditions = ["Sunny", "Rainy", "Cloudy"];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      setWeatherData({
        temperature: "28°C",
        humidity: "78%",
        rainfall: "12mm",
        wind: "12 km/h",
        condition: randomCondition as WeatherData["condition"]
      });
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMarketPrices([
      { crop: "Rice", price: "₹2,850 per quintal", trend: "up" },
      { crop: "Wheat", price: "₹2,250 per quintal", trend: "down" },
      { crop: "Tomato", price: "₹45 per kg", trend: "up" },
      { crop: "Potato", price: "₹25 per kg", trend: "stable" },
      { crop: "Onion", price: "₹35 per kg", trend: "up" }
    ]);
  }, []);

  useEffect(() => {
    setRegistrationStats({
      daily: 0,
      weekly: 10,
      monthly: 12,
      total: 22
    });

    setRegistrationChartData([
      { name: language === "tamil" ? "திங்கள்" : "Mon", registrations: 3 },
      { name: language === "tamil" ? "செவ்வாய்" : "Tue", registrations: 9 },
      { name: language === "tamil" ? "புதன்" : "Wed", registrations: 5 },
      { name: language === "tamil" ? "வியாழன்" : "Thu", registrations: 4 },
      { name: language === "tamil" ? "வெள்ளி" : "Fri", registrations: 8 },
      { name: language === "tamil" ? "சனி" : "Sat", registrations: 2 },
      { name: language === "tamil" ? "ஞாயிறு" : "Sun", registrations: 1 }
    ]);

    setCategoryData([
      { name: "Vegetables", value: 0 },
      { name: "Fruits", value: 0 },
      { name: "Grains", value: 0 },
      { name: "Spices", value: 0 },
      { name: "Dairy", value: 0 }
    ]);
  }, [language]);

  const handleInputChange = (field: keyof ProductData, value: string) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (value: string) => {
    setProductData(prev => ({ ...prev, category: value }));
    setCategoryData(prevData => {
      const updatedData = [...prevData];
      const existingIndex = updatedData.findIndex(item => item.name === value);

      if (existingIndex !== -1) {
        updatedData[existingIndex] = {
          ...updatedData[existingIndex],
          value: updatedData[existingIndex].value + 1
        };
      } else {
        updatedData.push({ name: value, value: 1 });
      }

      return updatedData;
    });
  };

  const validateForm = () => {
    if (!productData.productName.trim()) {
      toast({
        title: language === "tamil" ? "பிழை" : "Error",
        description: language === "tamil" ? "தயாரிப்பு பெயர் தேவை" : "Product name is required",
        variant: "destructive"
      });
      return false;
    }

    if (!productData.category) {
      toast({
        title: language === "tamil" ? "பிழை" : "Error",
        description: language === "tamil" ? "வகை தேவை" : "Category is required",
        variant: "destructive"
      });
      return false;
    }

    if (!productData.dateOfManufacture) {
      toast({
        title: language === "tamil" ? "பிழை" : "Error",
        description: language === "tamil" ? "உற்பத்தி தேதி தேவை" : "Manufacture date is required",
        variant: "destructive"
      });
      return false;
    }

    if (!productData.priceForFarmer || parseFloat(productData.priceForFarmer) <= 0) {
      toast({
        title: language === "tamil" ? "பிழை" : "Error",
        description: language === "tamil" ? "செல்லுபடியான விலை தேவை" : "Valid price is required",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const registerProduct = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setIsFormVisible(false);

    try {
      console.log("Sending product data:", productData);
      
      const response = await fetch('http://localhost:8086/api/products/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: productData.productName,
          category: productData.category,
          dateOfManufacture: productData.dateOfManufacture,
          time: productData.time,
          place: productData.place,
          qualityRating: productData.qualityRating,
          priceForFarmer: parseFloat(productData.priceForFarmer),
          description: productData.description,
          productId: productData.productId || undefined,
          state: productData.state
        })
      });

      let data;
      try {
        data = await response.json();
        console.log("Response from server:", data);
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        throw new Error("Server did not return valid JSON. Please check backend.");
      }

      if (response.ok && data && data.qrCode && data.product) {
        setQrCode(data.qrCode);
        setProductId(data.product.productId);
        
        toast({
          title: language === "tamil" ? tamilTranslations.registrationSuccessful : "Product Registered Successfully!",
          description: language === "tamil"
            ? `தயாரிப்பு ${data.product.productId} ${tamilTranslations.addedToBlockchain}`
            : `Product ${data.product.productId} has been added to the blockchain.`,
        });

        setRegistrationStats(prev => ({
          daily: prev.daily + 1,
          weekly: prev.weekly + 1,
          monthly: prev.monthly + 1,
          total: prev.total + 1
        }));

        setTimeout(() => setIsFormVisible(true), 500);
      } else {
        throw new Error((data && data.error) || 'Failed to register product');
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: language === "tamil" ? tamilTranslations.registrationFailed : "Registration Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
      setIsFormVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductData({
      productName: "",
      dateOfManufacture: "",
      time: "",
      place: currentLocation,
      qualityRating: "",
      priceForFarmer: "",
      productId: "",
      description: "",
      category: "",
      state: ""
    });
    setQrCode(null);
    setProductId("");
  };

  const downloadQR = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `product-qr-${productId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareQR = async () => {
    if (!qrCode) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: language === "tamil" ? "தயாரிப்பு QR குறியீடு" : "Product QR Code",
          text: language === "tamil"
            ? `தயாரிப்பு QR குறியீடு: ${productId}`
            : `Product QR Code: ${productId}`,
          url: qrCode
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(productId);
        toast({
          title: language === "tamil" ? tamilTranslations.copied : "Copied",
          description: language === "tamil"
            ? tamilTranslations.productIdCopied
            : "Product ID copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

  const t = (key: keyof typeof tamilTranslations) => {
    return language === "tamil" ? tamilTranslations[key] : key;
  };

  const getTranslatedCategory = (category: string) => {
    return language === "tamil" ? tamilTranslations[category as keyof typeof tamilTranslations] || category : category;
  };
  const getTranslatedCrop = (crop: string) => {
    return language === "tamil" ? tamilTranslations[crop as keyof typeof tamilTranslations] || crop : crop;
  };
  const getTranslatedCondition = (condition: string) => {
    return language === "tamil" ? tamilTranslations[condition.toLowerCase() as keyof typeof tamilTranslations] || condition : condition;
  };

  const NavItem = ({ section, icon: Icon, label, tamilLabel }: {
    section: typeof activeSection,
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string,
    tamilLabel: string
  }) => (
    <button
      onClick={() => {
        setActiveSection(section);
        setIsMobileMenuOpen(false);
        setSelectedScheme(null);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        activeSection === section
          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
          : 'hover:bg-white/20 text-gray-700 hover:text-blue-600'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="font-medium">{language === "tamil" ? tamilLabel : label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-10px);
          }
          70% {
            transform: translateY(-5px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }

        .animate-pulse-custom {
          animation: pulse 2s infinite;
        }

        .animate-bounce-custom {
          animation: bounce 2s infinite;
        }

        .shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
          background-size: 400% 100%;
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .recharts-pie-label-text {
          font-weight: bold;
          fill: #333;
        }
      `}</style>

      {/* Animated Header */}
      <header className="border-b border-border/50 glass-effect backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 animate-slideInRight">
              <div className="animate-bounce-custom">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <span className="text-2xl font-bold gradient-text">AgriChain</span>
              <span className="text-sm bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full animate-pulse-custom">
                {language === "tamil" ? "விவசாயி" : "Farmer"}
              </span>
            </div>
            <div className="flex items-center gap-4 animate-slideInRight" style={{ animationDelay: '0.2s' }}>
              <Select value={language} onValueChange={(value: "english" | "tamil") => setLanguage(value)}>
                <SelectTrigger className="w-28 glass-effect">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="tamil">தமிழ்</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" onClick={() => navigate("/")} className="hover:bg-white/20 transition-all duration-300 hidden lg:flex">
                <LogOut className="h-4 w-4 mr-2" />
                {language === "tamil" ? "வெளியேறு" : "Logout"}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-4">
              <NavItem section="dashboard" icon={Home} label="Dashboard" tamilLabel="டாஷ்போர்டு" />
              <NavItem section="qrGeneration" icon={QrCode} label="QR Generation" tamilLabel="QR உருவாக்கம்" />
              <NavItem section="analysis" icon={PieChart} label="Analysis" tamilLabel="பகுப்பாய்வு" />
              <NavItem section="pmSchemes" icon={Award} label="PM Schemes" tamilLabel="PM திட்டங்கள்" />
              <NavItem section="seasonalCrops" icon={Sprout} label="Seasonal Crops" tamilLabel="பருவகால பயிர்கள்" />
              {isMobileMenuOpen && (
                <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2 px-4 py-2 hover:bg-white/20">
                  <LogOut className="h-4 w-4" />
                  {language === "tamil" ? "வெளியேறு" : "Logout"}
                </Button>
              )}
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Motivational Header */}
        <div className="mb-8 text-center animate-fadeInUp">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            {language === "tamil" ? "விவசாயி டாஷ்போர்டு" : "Farmer Dashboard"}
          </h1>
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 mb-6 shadow-xl animate-slideIn" style={{ animationDelay: '0.3s' }}>
            <p className="text-2xl font-semibold text-gray-700 mb-2">
              {language === "tamil" ? "🌾 விவசாயிகள் நமது நாட்டின் முதுகெலும்பு 🌾" : "🌾 Farmers are the Backbone of Our Country 🌾"}
            </p>
            <p className="text-lg text-gray-600">
              {language === "tamil" ? "பிளாக்செயினில் உங்கள் தயாரிப்புகளைப் பதிவு செய்து நிர்வகிக்கவும்" : "Register and manage your products on the blockchain - Empowering agriculture through technology"}
            </p>
          </div>
        </div>

        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Registration Stats */}
            <Card className="card-hover glass-effect border-0 shadow-xl animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                  {t('productsRegistered')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300">
                    <p className="text-xs text-muted-foreground">{t('today')}</p>
                    <p className="text-3xl font-bold text-blue-600 animate-pulse-custom">{registrationStats.daily}</p>
                  </div>
                  <div className="space-y-1 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300">
                    <p className="text-xs text-muted-foreground">{t('thisWeek')}</p>
                    <p className="text-3xl font-bold text-green-600">{registrationStats.weekly}</p>
                  </div>
                  <div className="space-y-1 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300">
                    <p className="text-xs text-muted-foreground">{t('thisMonth')}</p>
                    <p className="text-3xl font-bold text-purple-600">{registrationStats.monthly}</p>
                  </div>
                  <div className="space-y-1 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-300">
                    <p className="text-xs text-muted-foreground">{t('total')}</p>
                    <p className="text-3xl font-bold text-orange-600">{registrationStats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Card */}
            <Card className="card-hover glass-effect border-0 shadow-xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Cloud className="h-4 w-4 mr-2 text-sky-600" />
                  {t('weather')}
                </CardTitle>
                <div className="text-xs text-muted-foreground">
                  {weatherData ? getTranslatedCondition(weatherData.condition) : ''}
                </div>
              </CardHeader>
              <CardContent>
                {weatherData ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 transition-all duration-300">
                      <span className="text-muted-foreground flex items-center">
                        {weatherData.condition === 'Sunny' ? '☀️' : weatherData.condition === 'Rainy' ? '🌧️' : '☁️'} {t('temperature')}
                      </span>
                      <span className="font-medium text-sky-600">{weatherData.temperature}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 transition-all duration-300">
                      <span className="text-muted-foreground flex items-center">
                        💧 {t('humidity')}
                      </span>
                      <span className="font-medium text-teal-600">{weatherData.humidity}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300">
                      <span className="text-muted-foreground flex items-center">
                        🌧️ {t('rainfall')}
                      </span>
                      <span className="font-medium text-indigo-600">{weatherData.rainfall}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 transition-all duration-300">
                      <span className="text-muted-foreground flex items-center">
                        💨 {t('wind')}
                      </span>
                      <span className="font-medium text-gray-600">{weatherData.wind}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t('currentLocation')}: {currentLocation}</span>
                    </div>
                  </div>
                ) : (
                  <div className="shimmer h-24 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">
                      {t('loadingWeather')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Market Prices */}
            <Card className="card-hover glass-effect border-0 shadow-xl animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                  {t('marketPrices')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketPrices.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 transform hover:scale-[1.02]">
                      <span className="text-sm font-medium flex items-center">
                        🌾 {item.crop}
                      </span>
                      <div className="flex items-center">
                        <span className="text-sm mr-2 font-semibold">{item.price}</span>
                        {item.trend === 'up' && (
                          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-green-500 animate-bounce-custom"></div>
                        )}
                        {item.trend === 'down' && (
                          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-500"></div>
                        )}
                        {item.trend === 'stable' && (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* QR Generation Section */}
        {activeSection === "qrGeneration" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className={`card-hover glass-effect border-0 shadow-xl transition-all duration-500 ${
              isFormVisible ? 'animate-fadeInUp' : 'opacity-50 scale-95'
            }`}>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center text-lg">
                  <QrCode className="h-5 w-5 mr-2 text-blue-600" />
                  {t('productRegistration')}
                </CardTitle>
                <CardDescription className="text-base">
                  {language === "tamil"
                    ? "QR குறியீடு உருவாக்க உங்கள் தயாரிப்பு விவரங்களைப் பதிவிடவும்."
                    : "Enter your product details to generate a QR code for traceability."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="productName">{t('productName')}</Label>
                    <Input id="productName" placeholder={t('productName')} value={productData.productName} onChange={(e) => handleInputChange('productName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{t('category')}</Label>
                    <Select value={productData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {getTranslatedCategory(cat)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfManufacture">{t('dateOfManufacture')}</Label>
                    <Input id="dateOfManufacture" type="date" value={productData.dateOfManufacture} onChange={(e) => handleInputChange('dateOfManufacture', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">{t('time')}</Label>
                    <Input id="time" type="time" value={productData.time} onChange={(e) => handleInputChange('time', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="place">{t('place')}</Label>
                    <Input id="place" placeholder={t('place')} value={productData.place} onChange={(e) => handleInputChange('place', e.target.value)} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">{t('state')}</Label>
                    <Select value={productData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('state')} />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualityRating">{t('qualityRating')}</Label>
                    <Select value={productData.qualityRating} onValueChange={(value) => handleInputChange('qualityRating', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('qualityRating')} />
                      </SelectTrigger>
                      <SelectContent>
                        {qualityRatings.map(rating => (
                          <SelectItem key={rating} value={rating}>{rating}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priceForFarmer">{t('priceForFarmer')}</Label>
                    <Input id="priceForFarmer" type="number" placeholder="₹" value={productData.priceForFarmer} onChange={(e) => handleInputChange('priceForFarmer', e.target.value)} />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="description">{t('description')}</Label>
                    <Textarea id="description" placeholder={t('description')} value={productData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
                  </div>
                </form>
                <div className="flex justify-end gap-4 mt-6">
                  <Button variant="outline" onClick={resetForm}>{t('reset')}</Button>
                  <Button onClick={registerProduct} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('register')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {qrCode && (
              <Card className="card-hover glass-effect border-0 shadow-xl animate-fadeInUp">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-lg">
                    <QrCode className="h-5 w-5 mr-2 text-green-600" />
                    QR Code Generated
                  </CardTitle>
                  <CardDescription>
                    {language === "tamil" ? "உங்கள் தயாரிப்பு QR குறியீடு தயாராக உள்ளது." : "Your product QR code is ready."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                  <img src={qrCode} alt="Product QR Code" className="w-48 h-48 border rounded-lg shadow-md animate-pulse-custom" />
                  <p className="text-lg font-mono text-gray-700">{t('productId')}: <span className="font-semibold text-blue-600">{productId}</span></p>
                  <div className="flex gap-4">
                    <Button onClick={downloadQR}><Download className="mr-2 h-4 w-4" /> {t('downloadQR')}</Button>
                    <Button onClick={shareQR} variant="outline"><Share className="mr-2 h-4 w-4" /> {t('shareQR')}</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Analysis Section */}
        {activeSection === "analysis" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="card-hover glass-effect border-0 shadow-xl animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg">
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="h-5 w-5 mr-2 text-teal-600" />
                  {t('weeklyRegistrations')}
                </CardTitle>
                <CardDescription>
                  {language === "tamil" ? "இந்த வாரத்திற்கான தயாரிப்பு பதிவு புள்ளிவிவரங்கள்." : "Product registration statistics for the current week."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={registrationChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="registrations" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
<Card className="card-hover glass-effect border-0 shadow-xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
    <CardTitle className="flex items-center text-lg">
      <PieChart className="h-5 w-5 mr-2 text-amber-600" />
      {t('productCategories')}
    </CardTitle>
    <CardDescription>
      {language === "tamil" ? "உங்கள் பதிவு செய்யப்பட்ட தயாரிப்புகளின் வகை வாரியான விநியோகம்." : "Category-wise distribution of your registered products."}
    </CardDescription>
  </CardHeader>
  <CardContent className="p-6 h-80 flex items-center justify-center"> {/* Increased height from h-64 to h-80 */}
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={categoryData.filter(item => item.value > 0)}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100} 
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${getTranslatedCategory(name)} (${(percent * 100).toFixed(0)}%)`}
        >
          {categoryData.filter(item => item.value > 0).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [value, getTranslatedCategory(name as string)]} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
          
          </div>
        )}

        {/* PM Schemes Section */}
        {activeSection === "pmSchemes" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {selectedScheme ? (
              <Card className="card-hover glass-effect border-0 shadow-xl col-span-full animate-fadeInUp">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-purple-600">{language === "tamil" ? selectedScheme.tamilName : selectedScheme.name}</CardTitle>
                    <Button variant="ghost" onClick={() => setSelectedScheme(null)}>
                      <ArrowLeft className="h-4 w-4 mr-2" /> {language === "tamil" ? "பின்னால் செல்" : "Go Back"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center mb-2"><Lightbulb className="h-5 w-5 mr-2 text-blue-600" /> {language === "tamil" ? "விவரங்கள்" : "Description"}</h3>
                    <p className="text-sm text-gray-700">
                      {language === "tamil" ? selectedScheme.tamilDescription : selectedScheme.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold flex items-center mb-2"><Info className="h-5 w-5 mr-2 text-green-600" /> {t('eligibility')}</h3>
                    <p className="text-sm text-gray-700">
                      {language === "tamil" ? selectedScheme.tamilEligibility : selectedScheme.eligibility}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              governmentSchemes.map((scheme, index) => (
                <Card
                  key={index}
                  className="card-hover glass-effect border-0 shadow-xl cursor-pointer animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedScheme(scheme)}
                >
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                    <CardTitle className="text-xl font-bold text-purple-600">{language === "tamil" ? scheme.tamilName : scheme.name}</CardTitle>
                    <CardDescription className="text-base text-gray-700">{language === "tamil" ? scheme.tamilDescription.split(".")[0] : scheme.description.split(".")[0]}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="font-semibold mb-2 flex items-center"><Info className="h-4 w-4 mr-2" />{t('eligibility')}:</p>
                    <p className="text-sm text-gray-600">{language === "tamil" ? scheme.tamilEligibility : scheme.eligibility}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Seasonal Crops Section */}
        {activeSection === "seasonalCrops" && (
          <div className="space-y-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {Object.keys(seasonalCrops).map(season => (
                <Button
                  key={season}
                  onClick={() => setSelectedSeason(season as keyof typeof seasonalCrops)}
                  variant={selectedSeason === season ? "default" : "outline"}
                  className={`transition-all duration-300 ${selectedSeason === season ? 'bg-green-600 text-white shadow-lg scale-105' : 'bg-white/50 text-gray-700 hover:bg-green-50'}`}
                >
                  {t(season as keyof typeof tamilTranslations)}
                </Button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seasonalCrops[selectedSeason].map((crop, index) => (
                <Card key={index} className="card-hover glass-effect border-0 shadow-xl animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                    <CardTitle className="text-xl font-bold text-green-600">{getTranslatedCrop(crop.name)}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {t('season')}: {t(selectedSeason as keyof typeof tamilTranslations)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-2">
                    <p className="text-base">
                      <span className="font-semibold">{t('bestTime')}</span>: {crop.bestTime}
                    </p>
                    <p className="text-base">
                      <span className="font-semibold">{t('expectedYield')}</span>: {crop.yield}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;