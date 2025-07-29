import { type NextRequest, NextResponse } from "next/server"

const API_TOKEN = process.env.BIGSHIP_API_TOKEN || "40c6ac42996e6bd4ab595120928d2f96871939d14f2247b46dd8f9f37e4fd006"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const trackingId = searchParams.get("tracking_id")
  const trackingType = searchParams.get("tracking_type") || "awb"

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  }

  if (!trackingId) {
    return NextResponse.json(
      { success: false, message: "Tracking ID is required" },
      { status: 400, headers: corsHeaders },
    )
  }

  try {
    const bigshipResponse = await fetch(
      `https://api.bigship.in/api/tracking?tracking_type=${trackingType}&tracking_id=${trackingId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    )

    if (!bigshipResponse.ok) {
      const errorText = await bigshipResponse.text()
      return NextResponse.json(
        {
          success: false,
          message: `BigShip API Error: ${bigshipResponse.status}`,
          error: errorText,
        },
        { status: bigshipResponse.status, headers: corsHeaders },
      )
    }

    const bigshipData = await bigshipResponse.json()

    const cleanResponse = {
      success: bigshipData.success !== false,
      data: bigshipData.data
        ? {
            order_detail: {
              tracking_id: bigshipData.data.order_detail?.tracking_id || trackingId,
              tracking_type: bigshipData.data.order_detail?.tracking_type || trackingType,
              current_tracking_status: bigshipData.data.order_detail?.current_tracking_status || "Unknown",
              courier_name: bigshipData.data.order_detail?.courier_name || null,
              order_manifest_datetime: bigshipData.data.order_detail?.order_manifest_datetime || null,
              current_tracking_datetime: bigshipData.data.order_detail?.current_tracking_datetime || null,
            },
            scan_histories: (bigshipData.data.scan_histories || []).map((scan: any) => ({
              scan_datetime: scan.scan_datetime || null,
              scan_status: scan.scan_status || "Update",
              scan_remarks: scan.scan_remarks || "",
              scan_location: scan.scan_location || "",
            })),
          }
        : null,
      message: bigshipData.message || "Tracking data retrieved successfully",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(cleanResponse, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tracking data from BigShip",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders },
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  })
}
