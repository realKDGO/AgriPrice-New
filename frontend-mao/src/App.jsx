import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import {AppProvider,useApp} from "./hooks/useApp";
import Auth from "./pages/public/Auth";
import Dashboard from "./pages/mao/Dashboard";
import CropManagement from "./pages/mao/CropManagement";
import MarketManagement from "./pages/mao/MarketManagement";
import CropPrices from "./pages/mao/CropPrices";
import PriceValidation from "./pages/mao/PriceValidation";
import HistoricalRecords from "./pages/mao/HistoricalRecords";
import ForecastInformation from "./pages/mao/ForecastInformation";
import ReportsAnalytics from "./pages/mao/ReportsAnalytics";
import Settings from "./pages/mao/Settings";
function Protected(){const{session,authLoading}=useApp();if(authLoading)return <div style={{padding:40}}>Loading...</div>;if(!session)return <Navigate to="/login" replace/>;return <Routes><Route path="/" element={<Dashboard/>}/><Route path="/crops" element={<CropManagement/>}/><Route path="/markets" element={<MarketManagement/>}/><Route path="/prices" element={<CropPrices/>}/><Route path="/validation" element={<PriceValidation/>}/><Route path="/history" element={<HistoricalRecords/>}/><Route path="/forecast" element={<ForecastInformation/>}/><Route path="/reports" element={<ReportsAnalytics/>}/><Route path="/settings" element={<Settings/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
export default function App(){return <AppProvider><BrowserRouter><Routes><Route path="/login" element={<Auth/>}/><Route path="/forgot-password" element={<Auth mode="forgot"/>}/><Route path="/*" element={<Protected/>}/></Routes></BrowserRouter></AppProvider>}
