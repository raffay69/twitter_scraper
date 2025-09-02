import { useState } from "react";
import { Search, Github, Linkedin } from "lucide-react";
import axios from "axios";
import LoadingSpinner from "./components/LoadingSpinner";
import TrendsList from "./components/TrendsList";
import InfoPanel from "./components/InfoPanel";
import { AppState, ScrapedData } from "./types";
import { DefaultSidebar } from "./components/Sidebar";
import { toast, ToastContainer } from "react-toastify";

function App() {
  const [state, setState] = useState<AppState>({
    data: null,
    isLoading: false,
    error: null,
    showAllTrends: false,
  });
  const [trigger, setTrigger] = useState<any>(0);

  const handleStartScraping = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      showAllTrends: false,
    }));

    try {
      const response = await axios.get(
        `https://sixth-sense-assignment.onrender.com/get-trends`
      );
      const data: ScrapedData = response.data;
      setState((prev) => ({
        ...prev,
        data,
        isLoading: false,
      }));
      setTrigger((prev: number) => prev + 1);
    } catch (error) {
      toast.error("Error scraping Trends , Please try again", {
        theme: "dark",
        autoClose: 1000,
      });
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const handleSelectHistoryItem = (selectedData: any) => {
    setState((prev) => ({
      ...prev,
      data: selectedData,
      showAllTrends: false,
    }));
  };

  const toggleShowMore = () => {
    setState((prev) => ({
      ...prev,
      showAllTrends: !prev.showAllTrends,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <ToastContainer />
      <div className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-gray-800">
        <DefaultSidebar
          onSelectItem={handleSelectHistoryItem}
          trigger={trigger}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 ml-55 flex flex-col">
        {/* Header */}
        <div>
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center space-x-3">
              <Search className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold">X Trends Scraper</h1>
            </div>
            <p className="text-gray-400 mt-2">
              Discover what's trending on X right now across the world
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8 flex-1">
          {/* Start Button */}
          {!state.data && !state.isLoading && (
            <div className="flex items-center justify-center min-h-[60vh] animate-fadeIn">
              <div className="text-center">
                <button
                  onClick={handleStartScraping}
                  disabled={state.isLoading}
                  className="bg-white hover:bg-gray-100 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-20 shadow-lg"
                >
                  Start Scraping
                </button>
                <p className="text-gray-500 mt-4">
                  Click to fetch the latest trending topics
                </p>
                <div className="mt-6 p-4 bg-gray-900 border border-gray-800 rounded-xl">
                  <p className="text-gray-400 text-sm">
                    <span className="text-yellow-400">⚡</span> Service hosted
                    on Render - First request may take 1-2 minutes to wake up
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {state.isLoading && (
            <div className="flex justify-center animate-fadeIn">
              <LoadingSpinner />
            </div>
          )}

          {/* Results */}
          {state.data && !state.isLoading && (
            <div className="animate-slideUp">
              <TrendsList
                trends={state.data.trends}
                showAll={state.showAllTrends}
                onToggleShowMore={toggleShowMore}
              />

              <InfoPanel
                ipAddress={state.data.IPAddress}
                date={state.data.date! || state.data.DateandTime!}
              />

              {/* Action Button */}
              <div className="text-center mt-8">
                <button
                  onClick={handleStartScraping}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-full border border-gray-800 hover:border-gray-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20"
                >
                  Refresh Trends
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Card - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-10">
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/90 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <div>
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                Created by
              </div>
              <div className="text-white font-semibold text-lg">
                Mohammed Abdul Raffay
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <a
              href="https://github.com/raffay69/sixth_sense_assignment"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center p-3 bg-gray-800/50 hover:bg-gray-700/70 rounded-xl transition-all duration-200 group border border-gray-700/30 hover:border-gray-600/50"
            >
              <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
            </a>
            <a
              href="https://www.linkedin.com/in/mohammed-abdul-raffay-28a608308/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center p-3 bg-gray-800/50 hover:bg-gray-700/70 rounded-xl transition-all duration-200 group border border-gray-700/30 hover:border-gray-600/50"
            >
              <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
