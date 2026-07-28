// src/services/shareCardService.ts
import { formatCount } from "@/utils/formatters";

/**
 * Renders shareable result cards to PNG, sized for Instagram/TikTok
 * Stories (1080x1920). Pure canvas — no image library needed, and it
 * keeps this fully client-side like everything else in the app: nothing
 * generated here ever touches a network request.
 */

const WIDTH = 1080;
const HEIGHT = 1920;

type Tone = "mutual" | "lost" | "gained" | "neutral";

const TONE_COLORS: Record<Tone, string> = {
  mutual: "#4fd1a5",
  lost: "#f2795b",
  gained: "#6ea8fe",
  neutral: "#f5f6f8",
};

export interface StatCardOptions {
  value: number;
  label: string;
  sublabel?: string;
  tone: Tone;
}

export interface SummaryCardOptions {
  counts: {
    followers: number;
    following: number;
    mutual: number;
    notFollowingBack: number;
    notFollowedBack: number;
  };
}

/** Waits for the fonts used on-canvas to actually be loaded, so text
 * doesn't render in a fallback serif on the first call. */
async function ensureFontsReady() {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.all([
    document.fonts.load("700 120px Fraunces"),
    document.fonts.load("400 36px Inter"),
    document.fonts.load("600 36px Inter"),
  ]);
}

function drawBackground(ctx: CanvasRenderingContext2D, accent: string) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, "#12151a");
  gradient.addColorStop(1, "#0b0d10");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Soft accent glow behind the headline stat
  const glow = ctx.createRadialGradient(
    WIDTH / 2,
    HEIGHT * 0.4,
    0,
    WIDTH / 2,
    HEIGHT * 0.4,
    WIDTH * 0.6,
  );
  glow.addColorStop(0, `${accent}22`);
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawFooter(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#7c8493";
  ctx.font = "500 28px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("instagram-analytics", WIDTH / 2, HEIGHT - 90);
  ctx.font = "400 24px Inter, sans-serif";
  ctx.fillStyle = "#3a4150";
  ctx.fillText("your data, your browser, nothing uploaded", WIDTH / 2, HEIGHT - 50);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, lineY);
      line = word;
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, lineY);
  return lineY;
}

export async function renderStatCard(options: StatCardOptions): Promise<Blob> {
  await ensureFontsReady();

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const accent = TONE_COLORS[options.tone];
  if (!accent) throw new Error(`Unknown tone: ${options.tone}`);
  drawBackground(ctx, accent);

  ctx.textAlign = "center";

  // Big stat number
  ctx.fillStyle = accent;
  ctx.font = "700 220px Fraunces, serif";
  ctx.fillText(formatCount(options.value), WIDTH / 2, HEIGHT * 0.42);

  // Label
  ctx.fillStyle = "#f5f6f8";
  ctx.font = "600 56px Inter, sans-serif";
  const labelBottomY = wrapText(ctx, options.label, WIDTH / 2, HEIGHT * 0.42 + 100, WIDTH - 160, 68);

  // Sublabel
  if (options.sublabel) {
    ctx.fillStyle = "#7c8493";
    ctx.font = "400 36px Inter, sans-serif";
    wrapText(ctx, options.sublabel, WIDTH / 2, labelBottomY + 70, WIDTH - 220, 48);
  }

  drawFooter(ctx);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))), "image/png");
  });
}

export async function renderSummaryCard({ counts }: SummaryCardOptions): Promise<Blob> {
  await ensureFontsReady();

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  drawBackground(ctx, TONE_COLORS.mutual);
  ctx.textAlign = "center";

  ctx.fillStyle = "#c7cbd3";
  ctx.font = "600 44px Inter, sans-serif";
  ctx.fillText("Your Instagram, unwrapped", WIDTH / 2, 220);

  const rows: { value: number; label: string; color: string }[] = [
    { value: counts.mutual, label: "mutual follows", color: TONE_COLORS.mutual },
    { value: counts.notFollowingBack, label: "don't follow you back", color: TONE_COLORS.lost },
    { value: counts.notFollowedBack, label: "you haven't followed back", color: TONE_COLORS.gained },
  ];

  let y = 480;
  for (const row of rows) {
    ctx.fillStyle = row.color;
    ctx.font = "700 140px Fraunces, serif";
    ctx.fillText(formatCount(row.value), WIDTH / 2, y);

    ctx.fillStyle = "#f5f6f8";
    ctx.font = "500 40px Inter, sans-serif";
    ctx.fillText(row.label, WIDTH / 2, y + 70);

    y += 340;
  }

  drawFooter(ctx);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))), "image/png");
  });
}

/** Triggers a browser download of the rendered card, same pattern as
 * exportService.ts — Blob + object URL, no network involved. */
export function downloadImageBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}