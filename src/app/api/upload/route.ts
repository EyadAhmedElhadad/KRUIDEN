import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { isCloudinaryConfigured, uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary isn't configured. Set the CLOUDINARY_* environment variables." },
      { status: 500 }
    );
  }

  const { image } = await req.json().catch(() => ({ image: null }));
  if (!image || typeof image !== "string") {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  try {
    const url = await uploadImage(image);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload failed", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
