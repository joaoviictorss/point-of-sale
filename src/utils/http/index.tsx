import { NextResponse } from "next/server";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/types/http/index.ts";

export function createSuccessResponse<T>(
  message: string,
  data: T,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ message, data }, { status });
}

export function createErrorResponse(
  message: string,
  status = 400
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ message }, { status });
}
