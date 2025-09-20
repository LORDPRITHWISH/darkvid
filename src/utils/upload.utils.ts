// Upload component
export async function uploadVideo(file: File) {
  // Step 1: Init upload
  const initResp = await fetch("/video/init", { method: "POST" });
  const { videoId, uploadId, videoUrl } = await initResp.json();
  console.log("Your video URL:", videoUrl);

  // Step 2: Split file into chunks
  const chunkSize = 5 * 1024 * 1024; // 5 MB
  const totalChunks = Math.ceil(file.size / chunkSize);
  const parts = [];

  for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
    const start = (partNumber - 1) * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    // Get signed URL for this chunk
    const signedResp = await fetch("/video/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: `videos/${videoId}.mp4`, uploadId, partNumber }),
    });
    const { signedUrl } = await signedResp.json();

    // Upload chunk directly to S3
    const uploadResp = await fetch(signedUrl, {
      method: "PUT",
      body: chunk,
    });

    const eTag = uploadResp.headers.get("ETag");
    parts.push({ ETag: eTag, PartNumber: partNumber });
  }

  // Step 3: Complete upload
  await fetch("/video/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: `videos/${videoId}.mp4`, uploadId, parts }),
  });

  console.log("Upload complete!");
}
