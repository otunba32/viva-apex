import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function GET() {
  try {
    const result = cloudinary.api.ping()
    return NextResponse.json({ message: "Cloudinary config looks set", result })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Cloudinary not connected properly" },
      { status: 500 }
    )
  }
}