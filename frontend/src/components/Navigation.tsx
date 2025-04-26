import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">SpireLogs</div>
        <div className="space-x-4">
          <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded">
            View Runs
          </Link>
          <Link to="/upload" className="hover:bg-gray-700 px-3 py-2 rounded">
            Upload Run
          </Link>
          <Link to="/cards" className="hover:bg-gray-700 px-3 py-2 rounded">
            Card Statistics
          </Link>
          <Link to="/relics" className="hover:bg-gray-700 px-3 py-2 rounded">
            Relic Statistics
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
