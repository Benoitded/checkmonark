import { unstable_cache } from "next/cache";

const CACHE_DURATION = 10; // 10 seconds for cache duration

/**
 * Fetches Google Sheet data with caching
 * Returns the sheet data
 */
const fetchSheetData = async () => {
  console.log("🔄 Fetching fresh sheet data...");
  try {
    const URL = `https://opensheet.elk.sh/1M5zbiQZTMr70JxzsgdANaUvZZkaksmxNyYfEh7JZmZw/wallets_wl`;
    console.log("URL", URL);
    const response = await fetch(URL);

    if (!response.ok) {
      console.error(`Error fetching sheet: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching sheet data:`, error);
    return [];
  }
};

export const getSheetData = async (forceRefetch: boolean = false) => {
  if (forceRefetch) {
    // Fetch new data
    const newData = await fetchSheetData();

    // Update the main cache with new data
    await unstable_cache(async () => newData, ["google-sheets-da"], {
      revalidate: CACHE_DURATION,
      tags: ["google-sheets-da"],
    })();

    return newData;
  }

  return unstable_cache(fetchSheetData, ["google-sheets-da"], {
    revalidate: CACHE_DURATION,
    tags: ["google-sheets-da"],
  })();
};
