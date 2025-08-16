import { NextResponse } from "next/server";
import { getWalletBalance, fundWallet } from "@/lib/cdp-wallet";

export async function GET() {
  try {
    const balance = await getWalletBalance();
    return NextResponse.json(balance);
  } catch (error: unknown) {
    console.error("Error fetching wallet balance:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error fetching wallet balance";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await fundWallet();
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error funding wallet:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error funding wallet";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
