import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Converts rgb(...) or rgba(...) color strings to 6-character hex strings.
 * Discards alpha or blends it with a white background.
 * Returns null if the color is transparent.
 * 
 * @param {string} rgbStr 
 * @returns {string|null} 6-character hex string (e.g. 'FF0000') or null
 */
/**
 * Converts LAB color coordinates (CIELAB) to standard sRGB.
 * Assumes D65 reference white point.
 */
function labToRgb(l, a, b) {
  // 1. Convert LAB to XYZ
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  const y3 = y * y * y;
  const x3 = x * x * x;
  const z3 = z * z * z;

  y = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787;
  x = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787;
  z = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787;

  x = x * 0.95047;
  y = y * 1.00000;
  z = z * 1.08883;

  // 2. Convert XYZ to sRGB
  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let bVal = x * 0.0557 + y * -0.2040 + z * 1.0570;

  // 3. Apply sRGB gamma correction
  const adjust = (val) => {
    return val > 0.0031308
      ? 1.055 * Math.pow(val, 1 / 2.4) - 0.055
      : 12.92 * val;
  };

  let rCorrected = Math.round(Math.min(1, Math.max(0, adjust(r))) * 255);
  let gCorrected = Math.round(Math.min(1, Math.max(0, adjust(g))) * 255);
  let bCorrected = Math.round(Math.min(1, Math.max(0, adjust(bVal))) * 255);

  return { r: rCorrected, g: gCorrected, b: bCorrected };
}

/**
 * Converts rgb(...), rgba(...), lab(...), or lch(...) color strings to 6-character hex strings.
 * Discards alpha or blends it with a white background.
 * Returns null if the color is transparent.
 * 
 * @param {string} rgbStr 
 * @returns {string|null} 6-character hex string (e.g. 'FF0000') or null
 */
export function rgbToHex(rgbStr) {
  if (!rgbStr) return null;
  const cleanStr = rgbStr.trim().toLowerCase();
  
  if (cleanStr === 'transparent' || cleanStr === 'rgba(0, 0, 0, 0)' || cleanStr === 'none') {
    return null;
  }

  // Handle CSS Color Level 4 lab(L a b [/ alpha])
  const labMatch = cleanStr.match(/^lab\(([\d.-]+%?)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.-]+%?))?\)$/);
  if (labMatch) {
    const l = parseFloat(labMatch[1]);
    const a = parseFloat(labMatch[2]);
    const b = parseFloat(labMatch[3]);
    const alpha = labMatch[4] !== undefined 
      ? (labMatch[4].endsWith('%') ? parseFloat(labMatch[4]) / 100 : parseFloat(labMatch[4])) 
      : 1.0;

    if (alpha === 0) return null;

    const rgb = labToRgb(l, a, b);

    // Blend with white background (255, 255, 255)
    const blend = (c) => Math.round(c * alpha + 255 * (1 - alpha));
    const toHexStr = (c) => {
      const h = c.toString(16).toUpperCase();
      return h.length === 1 ? '0' + h : h;
    };

    return toHexStr(blend(rgb.r)) + toHexStr(blend(rgb.g)) + toHexStr(blend(rgb.b));
  }

  // Handle CSS Color Level 4 lch(L C H [/ alpha])
  const lchMatch = cleanStr.match(/^lch\(([\d.-]+%?)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.-]+%?))?\)$/);
  if (lchMatch) {
    const l = parseFloat(lchMatch[1]);
    const c = parseFloat(lchMatch[2]);
    const h = parseFloat(lchMatch[3]);
    const alpha = lchMatch[4] !== undefined 
      ? (lchMatch[4].endsWith('%') ? parseFloat(lchMatch[4]) / 100 : parseFloat(lchMatch[4])) 
      : 1.0;

    if (alpha === 0) return null;

    // Convert LCH to LAB coordinates
    const hueRad = h * Math.PI / 180;
    const a = c * Math.cos(hueRad);
    const b = c * Math.sin(hueRad);

    const rgb = labToRgb(l, a, b);

    // Blend with white background (255, 255, 255)
    const blend = (c) => Math.round(c * alpha + 255 * (1 - alpha));
    const toHexStr = (c) => {
      const h = c.toString(16).toUpperCase();
      return h.length === 1 ? '0' + h : h;
    };

    return toHexStr(blend(rgb.r)) + toHexStr(blend(rgb.g)) + toHexStr(blend(rgb.b));
  }

  const match = cleanStr.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (!match) {
    // If it's already a hex string from somewhere
    if (cleanStr.startsWith('#')) {
      const hex = cleanStr.substring(1);
      return hex.length === 3 
        ? hex.split('').map(char => char + char).join('').toUpperCase()
        : hex.toUpperCase();
    }
    return null;
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1.0;

  if (a === 0) return null;

  // Blend with white background (255, 255, 255)
  const blend = (c) => Math.round(c * a + 255 * (1 - a));
  const toHexStr = (c) => {
    const h = c.toString(16).toUpperCase();
    return h.length === 1 ? '0' + h : h;
  };

  return toHexStr(blend(r)) + toHexStr(blend(g)) + toHexStr(blend(b));
}

/**
 * Parses rgb(...), rgba(...), lab(...), lch(...), or #hex color strings.
 * Returns an object with { hex, alpha } or null if transparent.
 * 
 * @param {string} colorStr 
 * @returns {object|null} { hex: string, alpha: number } or null
 */
export function parseColor(colorStr) {
  if (!colorStr) return null;
  const cleanStr = colorStr.trim().toLowerCase();
  
  if (cleanStr === 'transparent' || cleanStr === 'rgba(0, 0, 0, 0)' || cleanStr === 'none') {
    return null;
  }

  // Handle CSS Color Level 4 lab(L a b [/ alpha])
  const labMatch = cleanStr.match(/^lab\(([\d.-]+%?)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.-]+%?))?\)$/);
  if (labMatch) {
    const l = parseFloat(labMatch[1]);
    const a = parseFloat(labMatch[2]);
    const b = parseFloat(labMatch[3]);
    const alpha = labMatch[4] !== undefined 
      ? (labMatch[4].endsWith('%') ? parseFloat(labMatch[4]) / 100 : parseFloat(labMatch[4])) 
      : 1.0;

    if (alpha === 0) return null;

    const rgb = labToRgb(l, a, b);

    const toHexStr = (c) => {
      const h = c.toString(16).toUpperCase();
      return h.length === 1 ? '0' + h : h;
    };

    return {
      hex: toHexStr(rgb.r) + toHexStr(rgb.g) + toHexStr(rgb.b),
      alpha: alpha
    };
  }

  // Handle CSS Color Level 4 lch(L C H [/ alpha])
  const lchMatch = cleanStr.match(/^lch\(([\d.-]+%?)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.-]+%?))?\)$/);
  if (lchMatch) {
    const l = parseFloat(lchMatch[1]);
    const c = parseFloat(lchMatch[2]);
    const h = parseFloat(lchMatch[3]);
    const alpha = lchMatch[4] !== undefined 
      ? (lchMatch[4].endsWith('%') ? parseFloat(lchMatch[4]) / 100 : parseFloat(lchMatch[4])) 
      : 1.0;

    if (alpha === 0) return null;

    // Convert LCH to LAB coordinates
    const hueRad = h * Math.PI / 180;
    const a = c * Math.cos(hueRad);
    const b = c * Math.sin(hueRad);

    const rgb = labToRgb(l, a, b);

    const toHexStr = (c) => {
      const h = c.toString(16).toUpperCase();
      return h.length === 1 ? '0' + h : h;
    };

    return {
      hex: toHexStr(rgb.r) + toHexStr(rgb.g) + toHexStr(rgb.b),
      alpha: alpha
    };
  }

  const match = cleanStr.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (!match) {
    if (cleanStr.startsWith('#')) {
      let hex = cleanStr.substring(1).toUpperCase();
      let alpha = 1.0;
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      } else if (hex.length === 4) {
        const parts = hex.split('');
        hex = parts.slice(0, 3).map(char => char + char).join('');
        alpha = parseInt(parts[3] + parts[3], 16) / 255;
      } else if (hex.length === 8) {
        alpha = parseInt(hex.substring(6, 8), 16) / 255;
        hex = hex.substring(0, 6);
      }
      return { hex, alpha };
    }
    return null;
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1.0;

  if (a === 0) return null;

  const toHexStr = (c) => {
    const h = c.toString(16).toUpperCase();
    return h.length === 1 ? '0' + h : h;
  };

  return {
    hex: toHexStr(r) + toHexStr(g) + toHexStr(b),
    alpha: a
  };
}


/**
 * Parses a CSS box-shadow string and approximates it as a PowerPoint shadow configuration.
 * 
 * @param {string} shadowStr 
 * @param {number} [ptScale=0.75] Points per pixel scale factor
 * @returns {object|null} PowerPoint shadow configuration object or null
 */
export function parseBoxShadow(shadowStr, ptScale = 0.75) {
  if (!shadowStr || shadowStr === 'none') return null;

  // Search for color in rgb(...) or rgba(...) format
  const colorMatch = shadowStr.match(/rgba?\(.*?\)/);
  let colorStr = '';
  let opacity = 1.0;
  let hexColor = '000000';

  if (colorMatch) {
    colorStr = colorMatch[0];
    const alphaMatch = colorStr.match(/rgba?\(.*?,.*?,\s*.*?(?:,\s*([\d.]+))?\)/);
    opacity = alphaMatch && alphaMatch[1] !== undefined ? parseFloat(alphaMatch[1]) : 1.0;
    hexColor = rgbToHex(colorStr) || '000000';
  } else {
    // Fallback if color is a word or hex color not wrapped in rgb()
    const parts = shadowStr.split(/\s+/);
    // Find color parts (either starting with # or words)
    for (const part of parts) {
      if (part.startsWith('#') || /^[a-zA-Z]+$/.test(part)) {
        colorStr = part;
        hexColor = part.startsWith('#') ? part.substring(1).toUpperCase() : '000000'; // Simplification
        break;
      }
    }
  }

  // Remove color from the shadow string to parse numeric values easily
  const numbersStr = colorStr ? shadowStr.replace(colorStr, '').trim() : shadowStr.trim();
  // Split remainder by whitespace and parse out pixel values
  const numbers = numbersStr.split(/\s+/).map(s => parseFloat(s) || 0);

  // In standard box-shadow: [offsetX, offsetY, blur, spread]
  const offsetX = numbers[0] || 0;
  const offsetY = numbers[1] || 0;
  const blur = numbers[2] || 0;

  if (offsetX === 0 && offsetY === 0 && blur === 0) {
    return null;
  }

  // Offset in points = offset in px * ptScale
  const offsetPx = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
  const offsetPt = offsetPx * ptScale;

  // Angle in degrees
  let angle = Math.round(Math.atan2(offsetY, offsetX) * 180 / Math.PI);
  if (angle < 0) angle += 360;

  // Blur in points = blur in px * ptScale
  const blurPt = blur * ptScale;

  return {
    type: 'outer',
    color: hexColor,
    opacity: opacity,
    blur: Math.max(1, Math.round(blurPt)),
    offset: Math.max(1, Math.round(offsetPt)),
    angle: angle
  };
}

/**
 * Maps CSS fontFamily font list to the closest PowerPoint-safe font family.
 * Supported safe fallbacks: Arial, Calibri, Georgia, Times New Roman, Courier New, Verdana
 * 
 * @param {string} fontFamilyStr 
 * @returns {string} PowerPoint-safe font name
 */
export function getSafeFontFamily(fontFamilyStr) {
  if (!fontFamilyStr) return 'Calibri';
  
  // Get first font name, clean quotes and whitespace
  const firstFontRaw = fontFamilyStr.split(',')[0].replace(/['"]/g, '').trim();
  const firstFontLower = firstFontRaw.toLowerCase();
  
  if (firstFontLower === 'sans-serif' || firstFontLower === 'system-ui') return 'Calibri';
  if (firstFontLower === 'serif') return 'Times New Roman';
  if (firstFontLower === 'monospace') return 'Courier New';
  
  // Return the actual font name so PPT can use it if installed
  return firstFontRaw;
}

/**
 * Resolves an image source (URL, relative path, base64 data) into a base64 encoded data URI.
 * This ensures PowerPoint has direct embedded access to the image resource.
 * 
 * @param {string} src 
 * @param {string} [baseDir] The directory of the source HTML to resolve relative paths
 * @returns {Promise<string|null>} Resolves to standard base64 data URI string or null
 */
export async function resolveImageToBase64(src, baseDir) {
  if (!src) return null;
  const trimmedSrc = src.trim();

  if (trimmedSrc.startsWith('data:')) {
    return trimmedSrc;
  }

  if (trimmedSrc.startsWith('http://') || trimmedSrc.startsWith('https://')) {
    try {
      const response = await fetch(trimmedSrc, { signal: AbortSignal.timeout(6000) });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const mimeType = response.headers.get('content-type') || 'image/png';
      return `data:${mimeType};base64,${base64}`;
    } catch (err) {
      console.error(`[resolveImageToBase64] Failed to fetch remote image: ${trimmedSrc}`, err);
      return null;
    }
  }

  // Local file path or file:// URL
  try {
    let filePath = trimmedSrc;
    if (trimmedSrc.startsWith('file://')) {
      filePath = fileURLToPath(trimmedSrc);
    } else if (baseDir) {
      filePath = path.resolve(baseDir, trimmedSrc);
    } else {
      filePath = path.resolve(trimmedSrc);
    }

    const buffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.svg') mimeType = 'image/svg+xml';

    const base64 = buffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    console.error(`[resolveImageToBase64] Failed to read local image: ${trimmedSrc}`, err);
    return null;
  }
}
