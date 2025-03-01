import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const count = await getCount();
    // console.log("count", count);

    const response = NextResponse.json(count);
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    // console.error(error);
    console.log("errorrrr");
    return NextResponse.json({ error });
  }
}

const getCount = async () => {
  try {
    const { data, error } = await supabase
      .from("counter")
      .select("count")
      .eq("id", 2) // 1 for checkeigen, 2 for checkdrop
      .single();

    if (error) throw error;
    return data.count;
  } catch (error: any) {
    console.error("Error getting count:", error.message);
    return 0;
  }
};
