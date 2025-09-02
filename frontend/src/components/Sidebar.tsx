import React, { useEffect, useState } from "react";
import { Card, Typography, List, ListItem } from "@material-tailwind/react";
import axios from "axios";

interface DefaultSidebarProps {
  onSelectItem: React.Dispatch<React.SetStateAction<any>>;
  trigger: React.Dispatch<React.SetStateAction<any>>;
}

export const DefaultSidebar: React.FC<DefaultSidebarProps> = ({
  onSelectItem,
  trigger,
}) => {
  const [data, setData] = useState<any>([]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  async function fetchRecents() {
    try {
      const res = await axios.get(
        "https://sixth-sense-assignment.onrender.com/recents"
      );
      setData(res.data);
    } catch (e) {
      setData([{ IPAddress: "Error fetching Recents" }]);
    }
  }

  useEffect(() => {
    fetchRecents();
  }, [trigger]);

  const handleItemClick = (item: any) => {
    onSelectItem(item);
  };

  return (
    <Card
      {...(undefined as any)}
      className="h-screen w-64 bg-black text-white shadow-lg border-r border-gray-800 "
    >
      <div className="mb-6 ml-6 mt-8 p-4">
        <Typography {...(undefined as any)} variant="h3" className="text-white">
          Recents
        </Typography>
      </div>
      <div className="overflow-y-auto">
        {data.length > 0 ? (
          data.map((el: any) => (
            <List
              onClick={() => handleItemClick(el)}
              className="space-y-2 text-gray-200"
              {...(undefined as any)}
            >
              <ListItem
                {...(undefined as any)}
                className="flex justify-between items-center rounded-lg bg-gray-800 px-4 py-2 shadow-md hover:bg-gray-700 hover:text-white transition"
              >
                <span className="font-mono text-sm">{el.IPAddress}</span>
                <span className="text-xs text-gray-400">
                  {formatDate(el.DateandTime)}
                </span>
              </ListItem>
            </List>
          ))
        ) : (
          <List className="text-gray-300" {...(undefined as any)}>
            No Recents
          </List>
        )}
      </div>
    </Card>
  );
};
