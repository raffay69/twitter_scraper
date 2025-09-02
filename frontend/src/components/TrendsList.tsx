import React from "react";
import { TrendingUp } from "lucide-react";

interface TrendsListProps {
  trends: string[];
  showAll: boolean;
  onToggleShowMore: () => void;
}

const TrendsList: React.FC<TrendsListProps> = ({
  trends,
  showAll,
  onToggleShowMore,
}) => {
  const displayedTrends = showAll ? trends : trends.slice(0, 5);
  const hasMoreTrends = trends.length > 5;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-white" />
        <h2 className="text-xl font-bold text-white">Trending Now</h2>
      </div>

      <div className="space-y-3">
        {displayedTrends.map((trend, index) => (
          <div
            key={index}
            className="group bg-gray-900 border border-gray-800 rounded-xl p-4 hover:bg-gray-800 hover:border-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium text-lg">#{trend}</span>
              <div className="text-gray-400 text-sm font-medium">
                {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMoreTrends && (
        <button
          onClick={onToggleShowMore}
          className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20"
        >
          {showAll ? "Show Less" : `Show More (${trends.length - 5} more)`}
        </button>
      )}
    </div>
  );
};

export default TrendsList;
