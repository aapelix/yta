import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("link");

  if (!url) {
    return NextResponse.json({ data: "No URL" });
  }

  try {
    const videoInfo = await ytdl.getInfo(url);

    const title = videoInfo.videoDetails.title;
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, "_");

    const responseHeaders = new Headers();
    responseHeaders.set(
      "Content-Disposition",
      `attachment; filename="${sanitizedTitle}.mp4"`
    );
    responseHeaders.set(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
    );

    const format = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestvideo' });

    if (!format) {
      throw new Error("No suitable format found");
    }

    const data = ytdl(url, { format });

    return new Response(data, {
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error fetching video info:", error);
    return NextResponse.json({ data: "Failed to fetch video info" });
  }
}
