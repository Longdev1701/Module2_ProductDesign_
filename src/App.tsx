import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/src/components/Layout";
import DashboardPage from "@/src/pages/DashboardPage";
import HistoryPage from "@/src/pages/HistoryPage";
import RegulationsPage from "@/src/pages/RegulationsPage";
import NewCheckPage from "@/src/pages/NewCheckPage";
import ReportPage from "@/src/pages/ReportPage";
import ProductsPage from "@/src/pages/ProductsPage";
import ProductDetailPage from "@/src/pages/ProductDetailPage";
import SettingsPage from "@/src/pages/SettingsPage";
import AuthPage from "@/src/pages/AuthPage";
import IntegrityPage from "@/src/pages/IntegrityPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        
        <Route path="/" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/integrity" element={<Layout><IntegrityPage /></Layout>} />
        <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
        <Route path="/regulations" element={<Layout><RegulationsPage /></Layout>} />
        <Route path="/new" element={<Layout><NewCheckPage /></Layout>} />
        <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
        <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        <Route path="/report/:id" element={<Layout><ReportPage /></Layout>} />
        
        {/* Temporary route to show report easily */}
        <Route path="/report" element={<Navigate to="/report/1" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
