export interface ScrapedData {
  DateandTime?: string;
  trends: string[];
  IPAddress: string;
  date?: string;
}

export interface AppState {
  data: ScrapedData | null;
  isLoading: boolean;
  error: string | null;
  showAllTrends: boolean;
}
