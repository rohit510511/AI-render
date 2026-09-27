/**
 * Cloudflare Workers AI Helper
 * Wraps REST calls to:
 * - @cf/stabilityai/stable-diffusion-xl-base-1.0 (Moodboards)
 * - @cf/black-forest-labs/flux-1-schnell (Photorealistic Renders)
 */

export interface CloudflareGenerationOptions {
  model:
    | "@cf/stabilityai/stable-diffusion-xl-base-1.0"
    | "@cf/black-forest-labs/flux-1-schnell";
  prompt: string;
  numSteps?: number;
}

export async function runCloudflareAI(options: CloudflareGenerationOptions): Promise<Buffer> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  // If Cloudflare credentials are configured, execute the live Workers AI REST call
  if (accountId && apiToken && apiToken.trim() !== "" && accountId.trim() !== "") {
    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${options.model}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: options.prompt,
        num_steps: options.numSteps || (options.model.includes("flux") ? 4 : 20),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Cloudflare AI Error] Status ${response.status}:`, errorText);
      throw new Error(`Cloudflare AI error (${response.status}): ${errorText.slice(0, 200)}`);
    }

    const contentType = response.headers.get("content-type") || "";

    // If Cloudflare returned binary image directly
    if (contentType.includes("image") || contentType.includes("octet-stream")) {
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    // If Cloudflare returned JSON with base64 encoded image
    const json = await response.json();
    if (json?.result?.image) {
      return Buffer.from(json.result.image, "base64");
    }
    if (json?.image) {
      return Buffer.from(json.image, "base64");
    }

    throw new Error("Cloudflare AI returned unexpected response structure without image data.");
  }

  // Fallback demo mode if Cloudflare tokens are not yet supplied:
  // Delivers pristine, editorial architectural photography so testing is instantaneous!
  console.info(
    `[Cloudflare AI Demo] Using curated architectural high-res visual for model: ${options.model}`
  );
  return getCuratedFallbackImageBuffer(options);
}

/**
 * Returns high-resolution architectural photography buffer when credentials are unset in dev.
 */
async function getCuratedFallbackImageBuffer(options: CloudflareGenerationOptions): Promise<Buffer> {
  const isMoodboard = options.model.includes("stable-diffusion");

  // Curated architectural & moodboard photography from Unsplash
  const curatedMoodboards = [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
  ];

  const curatedRenders = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=85",
  ];

  const pool = isMoodboard ? curatedMoodboards : curatedRenders;
  const selectedUrl = pool[Math.floor(Math.random() * pool.length)];

  try {
    const res = await fetch(selectedUrl);
    if (res.ok) {
      const ab = await res.arrayBuffer();
      return Buffer.from(ab);
    }
  } catch (err) {
    console.warn("[Cloudflare AI Demo] Fallback fetch failed, generating procedural buffer", err);
  }

  // In the unlikely event network is unavailable, create a valid 1x1 png or simple buffer
  const sampleBase64Png =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  return Buffer.from(sampleBase64Png, "base64");
}
