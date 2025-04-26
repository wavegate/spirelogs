import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import RunList from "./components/RunList";
import RunUpload from "./components/RunUpload";
import CardStatsTable from "./components/CardStatsTable";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<RunList />} />
            <Route path="/upload" element={<RunUpload />} />
            <Route path="/cards" element={<CardStatsTable />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
