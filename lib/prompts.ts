import { IProject } from "@/models/Project";

/**
 * Builds an editorial AI prompt for Stable Diffusion XL (SDXL)
 * specifically designed to produce a cohesive interior design moodboard
 * and material concept collage.
 */
export function buildMoodboardPrompt(
  project: Pick<IProject, "roomType" | "style" | "colorPalette" | "notes">
): string {
  const roomName = project.roomType ? project.roomType.replace("-", " ") : "living room";
  const styleName = project.style || "modern contemporary";
  const palette = project.colorPalette?.trim()
    ? `Color palette: ${project.colorPalette.trim()}.`
    : "Curated harmonious neutral palette with warm earthy tones.";
  const extraNotes = project.notes?.trim()
    ? `Design focus: ${project.notes.trim()}.`
    : "";

  return [
    `Editorial interior design moodboard and tactile material palette for a high-end ${styleName} ${roomName}.`,
    palette,
    `Collage of architectural textures, fabric swatches, stone marble samples, wood finishes, bespoke lighting fixtures, and interior decor inspiration.`,
    extraNotes,
    `Architectural digest style, balanced composition, soft studio lighting, ultra-high resolution, hyper-detailed craftsmanship.`,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Builds a photorealistic architectural prompt for Flux.1 Schnell
 * specifically designed to produce photorealistic 3D interior renders
 * with accurate lighting, physics, and designer furniture.
 */
export function buildRenderPrompt(
  project: Pick<IProject, "roomType" | "style" | "colorPalette" | "budgetRange" | "notes">
): string {
  const roomName = project.roomType ? project.roomType.replace("-", " ") : "living space";
  const styleName = project.style || "modern minimalist";
  const palette = project.colorPalette?.trim()
    ? `Tonal palette: ${project.colorPalette.trim()}.`
    : "Warm muted tones, natural sand, soft charcoal, and organic textures.";
  const budgetTier =
    project.budgetRange === "high"
      ? "Ultra-luxury bespoke Italian craftsmanship, custom joinery, premium marble and walnut."
      : project.budgetRange === "low"
      ? "Clean, smart modular design, minimalist Scandinavian ergonomics."
      : "High-end contemporary designer furniture, refined finishes, and tailored accents.";
  const customNotes = project.notes?.trim() ? `Specific details: ${project.notes.trim()}.` : "";

  return [
    `Ultra-photorealistic interior architecture photograph of an exquisite ${styleName} ${roomName}.`,
    palette,
    budgetTier,
    customNotes,
    `Natural cinematic morning sunlight streaming through expansive architectural windows, soft realistic ambient occlusion shadows, tactile bouclé upholstery, brushed brass details, polished concrete and chevron hardwood flooring.`,
    `Shot on Hasselblad H6D-100c, 35mm lens, f/8 aperture, architectural photography, octane render, unreal engine 5 architectural visualization, 8k resolution, crisp pristine clarity.`,
  ]
    .filter(Boolean)
    .join(" ");
}
