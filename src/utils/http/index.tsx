import { ApiResponse } from "@/types/auth/data";
import { NextResponse } from "next/server";

export function createSuccessResponse(
  message: string,
  data?: any,
  meta?: Record<string, any>
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: true,
    message,
    data,
    meta,
  });
}

export function createErrorResponse(
  message: string,
  status: number,
  meta?: Record<string, any>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      error: message,
      meta,
    },
    { status }
  );
}
