import pptxgen from 'pptxgenjs';
import path from 'path';
import { rgbToHex, parseBoxShadow, getSafeFontFamily, resolveImageToBase64 } from './utils.js';

// Standard fallback dimensions
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 720;

/**
 * Main conversion function. Receives pre-extracted element styling and coordinates
 * from the client, and generates a PPTX presentation saved to the outputPath.
 * 
 * @param {object} options
 * @param {Array<object>} options.slides Array of slide data, each containing elements list, designWidth, and designHeight
 * @param {string} [options.outputPath] Output file path
 * @returns {Promise<object>} Summary of processing
 */
export async function convertHtmlToPptx(options = {}) {
  const { slides, outputPath = 'output.pptx' } = options;

  if (!slides || !Array.isArray(slides)) {
    throw new Error('Must provide a valid slides array');
  }

  const baseDir = process.cwd();

  try {
    // Build the PowerPoint slides using PptxGenJS
    const summary = await buildPowerPoint(slides, baseDir, outputPath);
    return summary;
  } catch (err) {
    console.error('[Engine] Conversion error:', err);
    throw err;
  }
}

/**
 * Builds the PptxGenJS slides, loops through sorted elements, and writes the output file.
 */
async function buildPowerPoint(slidesData, baseDir, outputPath) {
  console.log(`[Engine] Designing PowerPoint Presentation with ${slidesData.length} slides...`);
  const pptx = new pptxgen();

  // Set PPTX slide layout - PowerPoint standard widescreen width is always 13.333 inches
  const firstSlide = slidesData[0] || { designWidth: VIEWPORT_WIDTH, designHeight: VIEWPORT_HEIGHT };
  const slideW_in = 13.333;
  const aspectRatio = (firstSlide.designWidth || VIEWPORT_WIDTH) / (firstSlide.designHeight || VIEWPORT_HEIGHT);
  const slideH_in = 13.333 / aspectRatio;

  pptx.defineLayout({
    name: 'DYNAMIC_HTML_LAYOUT',
    width: slideW_in,
    height: slideH_in
  });
  pptx.layout = 'DYNAMIC_HTML_LAYOUT';

  // Instantiate slide sheets
  const slides = [];
  for (let i = 0; i < slidesData.length; i++) {
    slides.push(pptx.addSlide());
  }

  let shapesAdded = 0;
  let imagesAdded = 0;
  let textsAdded = 0;

  for (let slideIdx = 0; slideIdx < slidesData.length; slideIdx++) {
    const slideData = slidesData[slideIdx];
    const slide = slides[slideIdx];
    
    const elements = slideData.elements || [];
    const designWidth = slideData.designWidth || VIEWPORT_WIDTH;
    const designHeight = slideData.designHeight || VIEWPORT_HEIGHT;

    if (slideData.backgroundColor) {
      const hexBg = rgbToHex(slideData.backgroundColor);
      if (hexBg) {
        slide.background = { color: hexBg };
      }
    }

    elements.sort((a, b) => {
      if (a.zIndex !== b.zIndex) return a.zIndex - b.zIndex;
      return a.domOrder - b.domOrder;
    });

    for (const el of elements) {
      const coords = scaleCoordinates(el, designWidth, designHeight);
      if (coords.w <= 0.01 || coords.h <= 0.01) continue;

      const drewBackground = drawBackgroundShape(slide, el, coords, designWidth, designHeight);
      if (drewBackground) shapesAdded++;

      const drewImage = await drawImageLayer(slide, el, coords, baseDir, designWidth);
      if (drewImage) imagesAdded++;

      const drewText = drawTextLayer(slide, el, coords, designWidth);
      if (drewText) textsAdded++;
    }
  }

  console.log(`[Engine] Presentation slides built successfully. Saving to: ${outputPath}`);
  try {
    await pptx.writeFile({ fileName: outputPath });
  } catch (writeErr) {
    if (writeErr.code === 'EBUSY' || writeErr.message.includes('EBUSY')) {
      throw new Error(`The file '${outputPath}' is locked or busy. If it is open in Microsoft PowerPoint, please close it and run the command again.`);
    }
    throw writeErr;
  }

  return {
    shapesAdded,
    imagesAdded,
    textsAdded,
    totalSlidesProcessed: slidesData.length,
    outputPath
  };
}

/**
 * Translates relative coordinate bounds (ratios 0..1) to slide inches.
 */
function scaleCoordinates(el, slideWidthPx = VIEWPORT_WIDTH, slideHeightPx = VIEWPORT_HEIGHT) {
  const slideWidthIn = 13.333;
  const aspectRatio = slideWidthPx / slideHeightPx;
  const slideHeightIn = 13.333 / aspectRatio;

  // el.x, el.y, el.width, el.height are ratios (0..1)
  let x_in = el.x * slideWidthIn;
  let y_in = el.y * slideHeightIn;
  let w_in = el.width * slideWidthIn;
  let h_in = el.height * slideHeightIn;

  // Prevent tiny negative offsets due to browser rounding, but preserve bleed-offs
  if (x_in < 0 && x_in > -0.05) {
    w_in += x_in;
    x_in = 0;
  }
  if (y_in < 0 && y_in > -0.05) {
    h_in += y_in;
    y_in = 0;
  }

  // Prevent tiny overflows due to browser rounding
  if (x_in + w_in > slideWidthIn && x_in + w_in < slideWidthIn + 0.05) {
    w_in = slideWidthIn - x_in;
  }
  if (y_in + h_in > slideHeightIn && y_in + h_in < slideHeightIn + 0.05) {
    h_in = slideHeightIn - y_in;
  }

  return { x: x_in, y: y_in, w: w_in, h: h_in };
}

/**
 * Draws background container shape (rectangle or circle/ellipse).
 */
function drawBackgroundShape(slide, el, coords, designWidth = VIEWPORT_WIDTH, designHeight = VIEWPORT_HEIGHT) {
  const fillColor = rgbToHex(el.backgroundColor);
  const borderColor = rgbToHex(el.borderColor);
  const borderWidthPx = parseFloat(el.borderWidth) || 0;
  const borderStyle = el.borderStyle;

  const hasBorder = borderColor && borderWidthPx > 0 && borderStyle !== 'none' && borderStyle !== 'hidden';
  
  const scale = 13.333 / designWidth;
  const ptScale = scale * 72;

  const shadowConfig = parseBoxShadow(el.boxShadow, ptScale);
  const hasBackground = fillColor || hasBorder || shadowConfig;

  if (hasBackground && !el.isSvg) {
    const shapeOpts = {};
    let shapeW = coords.w;
    let shapeH = coords.h;
    let shapeX = coords.x;
    let shapeY = coords.y;

    if (hasBorder) {
      const borderWidthIn = borderWidthPx * scale; // convert to inches
      
      // PowerPoint centers the outline on the shape's boundary.
      // To match CSS border-box, subtract borderWidthIn from width/height and shift position inward.
      shapeW = Math.max(0.01, coords.w - borderWidthIn);
      shapeH = Math.max(0.01, coords.h - borderWidthIn);
      shapeX = coords.x + (borderWidthIn / 2);
      shapeY = coords.y + (borderWidthIn / 2);
      
      const borderWidthPt = borderWidthPx * ptScale; // px to pt
      shapeOpts.line = { color: borderColor, width: borderWidthPt };
    }

    shapeOpts.x = shapeX;
    shapeOpts.y = shapeY;
    shapeOpts.w = shapeW;
    shapeOpts.h = shapeH;

    if (fillColor) shapeOpts.fill = { color: fillColor };

    if (el.shapeType === 'roundRect') {
      const borderRadiusPx = parseFloat(el.borderRadius) || 0;
      if (borderRadiusPx > 0) {
        // Convert to absolute pixel dimensions to calculate standard ratio
        const smallerSide = Math.min(el.width * designWidth, el.height * designHeight) || 1;
        const rectRadius = Math.min(0.5, Math.max(0.0, borderRadiusPx / smallerSide));
        shapeOpts.rectRadius = rectRadius;
      }
    }

    if (shadowConfig) shapeOpts.shadow = shadowConfig;
    if (el.rotate) shapeOpts.rotate = el.rotate;

    slide.addShape(el.shapeType || 'rect', shapeOpts);
    return true;
  }
  return false;
}

/**
 * Draws image and background image layers. Resolves local & remote URLs.
 */
async function drawImageLayer(slide, el, coords, baseDir, designWidth = VIEWPORT_WIDTH) {
  let imgX = coords.x;
  let imgY = coords.y;
  let imgW = coords.w;
  let imgH = coords.h;

  const borderWidthPx = parseFloat(el.borderWidth) || 0;
  const borderColor = rgbToHex(el.borderColor);
  const borderStyle = el.borderStyle;
  const hasBorder = borderColor && borderWidthPx > 0 && borderStyle !== 'none' && borderStyle !== 'hidden';

  const scale = 13.333 / designWidth;

  if (hasBorder) {
    const borderWidthIn = borderWidthPx * scale;
    imgX += borderWidthIn;
    imgY += borderWidthIn;
    imgW = Math.max(0.01, imgW - 2 * borderWidthIn);
    imgH = Math.max(0.01, imgH - 2 * borderWidthIn);
  }

  if (el.isSvg && el.rasterizedBase64) {
    slide.addImage({
      data: el.rasterizedBase64,
      x: imgX,
      y: imgY,
      w: imgW,
      h: imgH,
      ...(el.rotate ? { rotate: el.rotate } : {})
    });
    return true;
  }

  if (el.src) {
    console.log(`[Engine] Resolving image src: ${el.src}`);
    const base64Img = await resolveImageToBase64(el.src, baseDir);
    if (base64Img) {
      slide.addImage({
        data: base64Img,
        x: imgX,
        y: imgY,
        w: imgW,
        h: imgH,
        ...(el.rotate ? { rotate: el.rotate } : {})
      });
      return true;
    }
  }

  if (el.bgImage) {
    console.log(`[Engine] Resolving background image: ${el.bgImage}`);
    const base64Img = await resolveImageToBase64(el.bgImage, baseDir);
    if (base64Img) {
      slide.addImage({
        data: base64Img,
        x: imgX,
        y: imgY,
        w: imgW,
        h: imgH,
        ...(el.rotate ? { rotate: el.rotate } : {})
      });
      return true;
    }
  }

  return false;
}

/**
 * Draws paragraph text boxes with individual styled text runs and spacing rules.
 */
function drawTextLayer(slide, el, coords, designWidth = VIEWPORT_WIDTH) {
  if (!el.runs || el.runs.length === 0 || el.isSvg) return false;

  const scale = 13.333 / designWidth;
  const ptScale = scale * 72;
  const fontPtScale = ptScale; // Exact mathematical mapping

  const fontSizePx = parseFloat(el.fontSize) || 16;
  const fontSizePt = fontSizePx * fontPtScale;

  if (fontSizePt < 6) return false; // skip text below 6pt

  const textColor = rgbToHex(el.color) || '000000';
  const fontFamily = getSafeFontFamily(el.fontFamily);
  const isBold = parseFloat(el.fontWeight) >= 600 || ['bold', 'bolder'].includes(el.fontWeight);
  const isItalic = el.fontStyle === 'italic';

  // Align mappings
  let align = 'left';
  if (el.textAlign === 'center') align = 'center';
  else if (el.textAlign === 'right') align = 'right';
  else if (el.textAlign === 'justify') align = 'justify';

  // Adjust coordinates if the text container itself has a border (keeps text inside)
  let txtX = coords.x;
  let txtY = coords.y;
  let txtW = coords.w;
  let txtH = coords.h;

  const borderWidthPx = parseFloat(el.borderWidth) || 0;
  const borderColor = rgbToHex(el.borderColor);
  const borderStyle = el.borderStyle;
  const hasBorder = borderColor && borderWidthPx > 0 && borderStyle !== 'none' && borderStyle !== 'hidden';

  if (hasBorder) {
    const borderWidthIn = borderWidthPx * scale;
    txtX += borderWidthIn;
    txtY += borderWidthIn;
    txtW = Math.max(0.01, txtW - 2 * borderWidthIn);
    txtH = Math.max(0.01, txtH - 2 * borderWidthIn);
  }

  // Apply a 10% width buffer to prevent early wrapping on font substitutions
  const deltaW = txtW * 0.05;
  if (align === 'center') {
    txtX = txtX - (deltaW / 2);
    txtW = txtW + deltaW;
  } else if (align === 'right') {
    txtX = txtX - deltaW;
    txtW = txtW + deltaW;
  } else {
    txtW = txtW + deltaW;
  }

  // Format runs
  const pptxRuns = el.runs.map(run => {
    const runOpts = {};
    if (run.style.fontSize) {
      runOpts.fontSize = parseFloat(run.style.fontSize) * fontPtScale;
    }
    if (run.style.fontFamily) {
      runOpts.fontFace = getSafeFontFamily(run.style.fontFamily);
    }
    if (run.style.fontWeight) {
      runOpts.bold = parseFloat(run.style.fontWeight) >= 600 || ['bold', 'bolder'].includes(run.style.fontWeight);
    }
    if (run.style.fontStyle) {
      runOpts.italic = run.style.fontStyle === 'italic';
    }
    if (run.style.color) {
      runOpts.color = rgbToHex(run.style.color) || '000000';
    }
    
    // CSS text-transform handling on run text
    let runText = run.text;
    if (run.style.textTransform === 'uppercase') {
      runText = runText.toUpperCase();
    } else if (run.style.textTransform === 'lowercase') {
      runText = runText.toLowerCase();
    } else if (run.style.textTransform === 'capitalize') {
      runText = runText.replace(/\b\w/g, char => char.toUpperCase());
    }

    if (run.style.letterSpacing && run.style.letterSpacing.endsWith('px')) {
      const lsPx = parseFloat(run.style.letterSpacing);
      if (lsPx > 0) {
        runOpts.charSpacing = lsPx * ptScale;
      }
    }
    return { text: runText, options: runOpts };
  });

  const textOpts = {
    x: txtX,
    y: txtY,
    w: txtW,
    h: txtH,
    fontSize: fontSizePt,
    fontFace: fontFamily,
    bold: isBold,
    italic: isItalic,
    color: textColor,
    align,
    valign: el.valign || 'top',
    margin: [0, 0, 0, 0],
    wrap: true,
    autoFit: true
  };

  // Apply CSS line-height
  if (el.lineHeight) {
    if (el.lineHeight.endsWith('px')) {
      const lhPt = parseFloat(el.lineHeight) * fontPtScale;
      if (lhPt >= fontSizePt) {
        textOpts.lineSpacing = lhPt;
      }
    } else {
      const lhMultiplier = parseFloat(el.lineHeight);
      if (!isNaN(lhMultiplier) && lhMultiplier > 0) {
        textOpts.lineSpacingMultiple = lhMultiplier;
      }
    }
  }

  if (el.rotate) {
    textOpts.rotate = el.rotate;
  }

  slide.addText(pptxRuns, textOpts);
  return true;
}