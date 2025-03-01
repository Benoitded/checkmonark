import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "viem";
import { getSheetData } from "./getSheets";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address || typeof address !== "string") {
    return NextResponse.json({ error: "Adresse invalide" });
  }

  let formattedAddress;
  try {
    formattedAddress = getAddress(address.toLowerCase());
  } catch (error) {
    formattedAddress = address.toLowerCase();
  }

  try {
    const sheetData = await getSheetData();

    // Find the user in the sheet data
    const userEntry = sheetData.find(
      (entry: any) =>
        entry.wallet?.toLowerCase() === formattedAddress.toLowerCase()
    );

    // Get tier from the entry
    const tier = userEntry?.tier ? parseInt(userEntry.tier) : undefined;
    console.log("tier:", tier);

    // Prepare data for Supabase
    const supabaseData = {
      address: formattedAddress,
      wallets_wl: tier !== undefined ? tier : null,
    };

    // Return API response
    return NextResponse.json({
      address: formattedAddress,
      tier: tier,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    return NextResponse.json({
      error: "Erreur lors de la récupération des données",
    });
  }
}

// Helper function to parse weight (not used in this version)
function parseWeight(weight: any, hasAddress: boolean): number | null {
  if (!hasAddress) return null;
  if (!weight) return -1;

  if (typeof weight === "number") return weight;
  if (typeof weight === "string") {
    const parsed = Number(weight.trim().replace(",", "."));
    return isNaN(parsed) ? -1 : parsed;
  }

  return -1;
}

////////////////////////////
//////// Supabase //////////
////////////////////////////

const getCount = async () => {
  try {
    const { data, error } = await supabase
      .from("counter")
      .select("count")
      .eq("id", 2)
      .single();

    if (error) throw error;
    return data.count;
  } catch (error: any) {
    console.error("Error getting count:", error.message);
    return 0;
  }
};
