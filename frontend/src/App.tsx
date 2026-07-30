import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BidParser from './pages/BidParser';
import RAGKnowledge from './pages/RAGKnowledge';
import BidWriter from './pages/BidWriter';
import BidPricing from './pages/BidPricing';
import BidReview from './pages/BidReview';
import BidDelivery from './pages/BidDelivery';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="parse" element={<BidParser />} />
        <Route path="knowledge" element={<RAGKnowledge />} />
        <Route path="write" element={<BidWriter />} />
        <Route path="pricing" element={<BidPricing />} />
        <Route path="review" element={<BidReview />} />
        <Route path="delivery" element={<BidDelivery />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;