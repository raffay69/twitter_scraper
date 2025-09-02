import React, { useEffect, useState } from "react";
import { Globe, Clock } from "lucide-react";
import axios from "axios";

interface InfoPanelProps {
  ipAddress: string;
  date: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ ipAddress, date }) => {
  const [location, setLocation] = useState<{
    city?: string;
    country?: string;
  } | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  async function getLocation(ipAddress: string) {
    try {
      const res = await axios.get(`https://ipwho.is/${ipAddress}`);
      setLocation({ city: res.data.city, country: res.data.country });
    } catch (e) {
      setLocation({ city: "N/A", country: "N/A" });
    }
  }

  useEffect(() => {
    getLocation(ipAddress);
  }, [ipAddress]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:bg-gray-800 transition-all duration-200">
        <div className="flex items-center space-x-3">
          <Globe className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-gray-400 text-sm font-medium">IP Address</div>
            <div className="text-white font-mono text-lg">{ipAddress}</div>
            {location ? (
              <div className="text-gray-400 text-sm mt-1">
                {location.city}, {location.country}
              </div>
            ) : (
              <div className="text-gray-500 text-sm mt-1">Loading...</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:bg-gray-800 transition-all duration-200">
        <div className="flex items-center mt-2 space-x-3">
          <Clock className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-gray-400 text-sm font-medium">
              Last Updated
            </div>

            <div className="text-white text-lg">{formatDate(date)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
