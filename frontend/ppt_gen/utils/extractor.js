/**
 * Rasterizes an inline SVG element to a base64 PNG data URL using an HTML5 Canvas.
 * Resolves asynchronously when the image is fully drawn.
 * 
 * @param {SVGElement} svgElement 
 * @returns {Promise<string>} Base64 PNG data URL
 */
export async function rasterizeSvgToPng(svgElement) {
  return new Promise((resolve, reject) => {
    try {
      const rect = svgElement.getBoundingClientRect();
      const width = rect.width || svgElement.clientWidth || parseFloat(svgElement.getAttribute('width')) || 100;
      const height = rect.height || svgElement.clientHeight || parseFloat(svgElement.getAttribute('height')) || 100;

      // Clone the SVG so we don't mutate the active page DOM
      const clonedSvg = svgElement.cloneNode(true);

      // Ensure xmlns is present for standalone rendering
      if (!clonedSvg.getAttribute('xmlns')) {
        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      }

      // If no viewBox is present, create one based on current dimensions
      if (!clonedSvg.getAttribute('viewBox')) {
        clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      }

      // High-resolution scaling (12x) for crystal-clear snapshots
      const scale = 12;
      
      // Override HTML attributes
      clonedSvg.setAttribute('width', width * scale);
      clonedSvg.setAttribute('height', height * scale);

      // Force inline styles so CSS rules (like w-full, h-full, max-width) don't override the scaled attributes
      clonedSvg.style.width = `${width * scale}px`;
      clonedSvg.style.height = `${height * scale}px`;
      clonedSvg.style.maxWidth = 'none';
      clonedSvg.style.maxHeight = 'none';

      // Inline computed styles from the original SVG elements to the cloned SVG.
      // This is crucial because external stylesheets (like Tailwind) and CSS variables 
      // (like currentColor) are lost when rendering a standalone SVG image blob.
      const originalElements = [svgElement, ...Array.from(svgElement.querySelectorAll('*'))];
      const clonedElements = [clonedSvg, ...Array.from(clonedSvg.querySelectorAll('*'))];

      for (let i = 0; i < originalElements.length; i++) {
        const origEl = originalElements[i];
        const cloneEl = clonedElements[i];
        if (!cloneEl) continue;

        const computed = window.getComputedStyle(origEl);
        
        // Key SVG attributes and properties that could be styled via CSS/Tailwind
        const styleKeys = [
          'fill',
          'stroke',
          'strokeWidth',
          'strokeDasharray',
          'strokeDashoffset',
          'strokeLinecap',
          'strokeLinejoin',
          'opacity',
          'color',
          'display',
          'visibility'
        ];

        for (const key of styleKeys) {
          if (key === 'opacity' && i === 0) continue; // Skip root SVG opacity to let PowerPoint handle it
          const val = computed[key];
          if (val) {
            if (val === 'currentColor') {
              cloneEl.style[key] = computed.color;
            } else {
              cloneEl.style[key] = val;
            }
          }
        }

        const fillAttr = origEl.getAttribute('fill');
        if (fillAttr === 'currentColor') {
          cloneEl.setAttribute('fill', computed.color);
        }
        const strokeAttr = origEl.getAttribute('stroke');
        if (strokeAttr === 'currentColor') {
          cloneEl.setAttribute('stroke', computed.color);
        }
      }

      const svgString = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.width = width * scale;
      img.height = height * scale;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width * scale, height * scale);

        const pngBase64 = canvas.toDataURL('image/png');
        URL.revokeObjectURL(blobURL);
        resolve(pngBase64);
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(blobURL);
        reject(new Error('Failed to load SVG data URL inside Image element'));
      };
      img.src = blobURL;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Identifies if an element represents a top-level block of text.
 * 
 * @param {HTMLElement} el 
 * @returns {boolean}
 */
function isTextBoxElement(el) {
  const tagName = el.tagName.toLowerCase();
  const textTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'label', 'button', 'a', 'td', 'th'];

  if (textTags.includes(tagName)) {
    return true;
  }

  const hasDirectText = Array.from(el.childNodes).some(
    node => node.nodeType === 3 && node.textContent.trim().length > 0
  );
  return hasDirectText;
}

/**
 * Recursively parses formatting tags inside a text box element into styled runs.
 * 
 * @param {HTMLElement} element 
 * @returns {Array<object>} List of styled text runs
 */
function getTextRuns(element, slideWrapper) {
  const rawRuns = [];

  function traverse(node, currentStyle) {
    if (node.nodeType === 3) { // Text node
      let text = node.textContent;
      const style = window.getComputedStyle(node.parentElement);
      const whiteSpace = style.whiteSpace;

      if (whiteSpace !== 'pre' && whiteSpace !== 'pre-wrap') {
        text = text.replace(/\s+/g, ' '); // collapse standard spaces
      }

      if (text) {
        const runOpacity = getCumulativeOpacity(node.parentElement, slideWrapper || element);
        rawRuns.push({ text, style: { ...currentStyle, opacity: runOpacity } });
      }
    } else if (node.nodeType === 1) { // Element node
      const tagName = node.tagName.toLowerCase();

      if (tagName === 'br') {
        rawRuns.push({ text: '\n', style: {} });
        return;
      }

      const skipTags = ['script', 'style', 'svg', 'img'];
      if (skipTags.includes(tagName)) return;

      const style = window.getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return;

      const childStyle = {
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
        fontStyle: style.fontStyle,
        color: style.color,
        textTransform: style.textTransform,
        letterSpacing: style.letterSpacing,
        lineHeight: style.lineHeight
      };

      for (const child of node.childNodes) {
        traverse(child, childStyle);
      }
    }
  }

  const rootStyle = window.getComputedStyle(element);
  const initialStyle = {
    fontSize: rootStyle.fontSize,
    fontFamily: rootStyle.fontFamily,
    fontWeight: rootStyle.fontWeight,
    fontStyle: rootStyle.fontStyle,
    color: rootStyle.color,
    textTransform: rootStyle.textTransform,
    letterSpacing: rootStyle.letterSpacing,
    lineHeight: rootStyle.lineHeight
  };

  for (const child of element.childNodes) {
    traverse(child, initialStyle);
  }

  // Clean up whitespace around newlines to match browser line wrap behavior
  const cleanedRuns = [];
  for (let i = 0; i < rawRuns.length; i++) {
    let run = rawRuns[i];
    if (run.text === '\n') {
      cleanedRuns.push(run);
      continue;
    }

    let text = run.text;
    const prev = cleanedRuns[cleanedRuns.length - 1];
    if (prev && prev.text === '\n') text = text.trimStart();

    const next = rawRuns[i + 1];
    if (next && next.text === '\n') text = text.trimEnd();

    if (text) {
      cleanedRuns.push({ text, style: run.style });
    }
  }

  if (cleanedRuns.length > 0) {
    if (cleanedRuns[0].text !== '\n') cleanedRuns[0].text = cleanedRuns[0].text.trimStart();
    const last = cleanedRuns[cleanedRuns.length - 1];
    if (last.text !== '\n') last.text = last.text.trimEnd();
  }

  return cleanedRuns.filter(r => r.text.length > 0);
}

/**
 * Extracts element layout details, styles, and SVG rasterizations from a slide wrapper.
 * Coordinates are normalized to ratios between 0.0 and 1.0 relative to the slide wrapper.
 * 
 * @param {HTMLElement} slideWrapper DOM node containing slide elements
 * @param {number} slideIndex Index of the slide sheet
 * @returns {Promise<object>} Extracted slide layout structure
 */


export async function extractSlideData(slideWrapper, slideIndex = 0) {
  if (!slideWrapper) {
    throw new Error('Must provide a valid slide wrapper DOM element');
  }

  // Pre-rasterize all SVGs in this slide wrapper
  const svgs = Array.from(slideWrapper.querySelectorAll('svg'));
  for (let svg of svgs) {
    try {
      const base64Png = await rasterizeSvgToPng(svg);
      svg.setAttribute('data-rasterized-base64', base64Png);
    } catch (err) {
      console.error('[Extractor] Failed to rasterize SVG node in client:', err);
    }
  }

  const skipTags = ['script', 'style', 'head', 'link', 'meta', 'title'];
  const allElements = Array.from(slideWrapper.querySelectorAll('*'));
  const slideRect = slideWrapper.getBoundingClientRect();

  // Unscaled design dimensions (offset dimensions are immune to CSS scale transforms)
  const designWidth = slideWrapper.offsetWidth || 1280;
  const designHeight = slideWrapper.offsetHeight || 720;

  // Tag elements with temporary IDs
  allElements.forEach((el, index) => {
    el.setAttribute('data-pptx-id', `pptx-el-${index}`);
  });

  // Mark Text Box roots and their nested text descendants
  function markTextBoxes(el) {
    const tagName = el.tagName.toLowerCase();
    if (skipTags.includes(tagName)) return;

    if (isTextBoxElement(el)) {
      const descendants = el.querySelectorAll('*');
      const pId = el.getAttribute('data-pptx-id');
      for (const desc of descendants) {
        desc.setAttribute('data-pptx-descendant-of', pId);
      }
    } else {
      for (const child of el.children) {
        markTextBoxes(child);
      }
    }
  }

  markTextBoxes(slideWrapper);

  const extractedElements = [];

  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    const tagName = el.tagName.toLowerCase();

    if (skipTags.includes(tagName)) continue;
    if (el.closest('svg') && tagName !== 'svg') continue;

    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;

    // Extract rotation angle from CSS transform matrix
    let rotate = 0;
    if (style.transform && style.transform !== 'none') {
      const matrixMatch = style.transform.match(/^matrix\((.+)\)$/);
      if (matrixMatch) {
        const values = matrixMatch[1].split(',').map(parseFloat);
        if (values.length >= 6) {
          const a = values[0];
          const b = values[1];
          const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
          rotate = angle < 0 ? angle + 360 : angle;
        }
      }
    }

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Skip elements with no height or width
    if (width === 0 || height === 0) continue;

    // Calculate relative coordinates and scale ratios (0.0 to 1.0)
    // dividing by the actual bounding box dimensions of the slide wrapper.
    const relX = (rect.left - slideRect.left) / slideRect.width;
    const relY = (rect.top - slideRect.top) / slideRect.height;
    const relW = rect.width / slideRect.width;
    const relH = rect.height / slideRect.height;

    // Filter elements fully outside the slide canvas boundaries
    if (relX + relW <= -0.05 || relY + relH <= -0.05 || relX >= 1.05 || relY >= 1.05) {
      continue;
    }

    const pptxId = el.getAttribute('data-pptx-id');
    const isDescendant = el.hasAttribute('data-pptx-descendant-of');
    const isSvg = tagName === 'svg';

    // Parse text runs for parent text elements only
    const isTextBoxRoot = !isDescendant && isTextBoxElement(el);
    let runs = null;
    if (isTextBoxRoot) {
      runs = getTextRuns(el, slideWrapper);
    }

    // Skip descendants of text boxes unless they have background properties
    if (isDescendant && !isSvg) {
      const hasBg = style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent';
      const hasBorder = style.borderWidth !== '0px' && style.borderColor !== 'rgba(0, 0, 0, 0)';
      if (!hasBg && !hasBorder) {
        continue;
      }
    }

    // Shape type detection
    let shapeType = 'rect';
    const customShapeAttr = el.getAttribute('data-pptx-shape');
    const classList = Array.from(el.classList);

    if (customShapeAttr) {
      if (['circle', 'oval', 'ellipse'].includes(customShapeAttr.toLowerCase())) {
        shapeType = 'ellipse';
      } else if (['rect', 'rectangle'].includes(customShapeAttr.toLowerCase())) {
        shapeType = 'rect';
      } else if (['roundrect', 'rounded-rectangle'].includes(customShapeAttr.toLowerCase())) {
        shapeType = 'roundRect';
      }
    } else if (classList.includes('circle')) {
      shapeType = 'ellipse';
    } else {
      const borderRadiusPx = parseFloat(style.borderRadius) || 0;
      const isCircular = style.borderRadius.includes('50%') ||
        (borderRadiusPx > 0 && Math.abs(borderRadiusPx - (width / 2)) <= 5);
      if (isCircular) {
        shapeType = 'ellipse';
      } else if (borderRadiusPx > 0) {
        shapeType = 'roundRect';
      }
    }

    let src = null;
    if (tagName === 'img') src = el.src;

    let bgImage = null;
    if (style.backgroundImage && style.backgroundImage !== 'none') {
      const bgMatch = style.backgroundImage.match(/url\((['"]?)(.*?)\1\)/);
      if (bgMatch) bgImage = bgMatch[2];
    }

    let zIndex = 0;
    if (style.zIndex !== 'auto' && style.zIndex !== '') {
      const parsed = parseInt(style.zIndex, 10);
      if (!isNaN(parsed)) zIndex = parsed;
    }

    let textAlign = style.textAlign;
    let valign = 'top';
    if (style.display === 'flex' || style.display === 'inline-flex') {
      const isCol = style.flexDirection === 'column' || style.flexDirection === 'column-reverse';
      const hProp = isCol ? style.alignItems : style.justifyContent;
      const vProp = isCol ? style.justifyContent : style.alignItems;
      if (hProp === 'center') textAlign = 'center';
      else if (hProp === 'flex-end' || hProp === 'end') textAlign = 'right';
      if (vProp === 'center') valign = 'middle';
      else if (vProp === 'flex-end' || vProp === 'end') valign = 'bottom';
    }


    const rasterizedBase64 = isSvg ? el.getAttribute('data-rasterized-base64') : null;

    let finalSrc = src;
    let finalBgImage = bgImage;
    let finalRasterizedBase64 = rasterizedBase64;

    const borderRadius = style.borderRadius;
    const hasBorderRadius = borderRadius && borderRadius !== '0px' && borderRadius !== '0';
    const objectFit = style.objectFit;
    const isBgCover = style.backgroundSize === 'cover';
    const shouldCrop = (tagName === 'img' && src && objectFit === 'cover') || (bgImage && isBgCover);

    if (hasBorderRadius || shouldCrop) {
      if (tagName === 'img' && src) {
        finalSrc = await applyImageFormatting(src, width, height, borderRadius, objectFit);
      } else if (bgImage) {
        finalBgImage = await applyImageFormatting(bgImage, width, height, borderRadius, isBgCover ? 'cover' : 'fill');
      } else if (isSvg && rasterizedBase64) {
        finalRasterizedBase64 = await applyImageFormatting(rasterizedBase64, width, height, borderRadius, 'fill');
      }
    }

    const cumulativeOpacity = getCumulativeOpacity(el, slideWrapper);

    extractedElements.push({
      pptxId,
      domOrder: extractedElements.length,
      tagName,
      isSvg,
      x: relX,
      y: relY,
      width: relW,
      height: relH,
      zIndex,
      slideIndex,
      shapeType,
      backgroundColor: style.backgroundColor,
      color: style.color,
      borderColor: style.borderColor,
      borderStyle: style.borderStyle,
      borderWidth: style.borderWidth,
      borderRadius: style.borderRadius,
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      textAlign: style.textAlign,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      textTransform: style.textTransform,
      opacity: cumulativeOpacity,
      boxShadow: style.boxShadow,
      runs,
      text: isTextBoxRoot ? runs.map(r => r.text).join('') : '',
      src: finalSrc,
      bgImage: finalBgImage,
      rasterizedBase64: finalRasterizedBase64,
      rotate
    });
  }

  allElements.forEach(el => {
    el.removeAttribute('data-pptx-id');
    el.removeAttribute('data-pptx-descendant-of');
  });
  svgs.forEach(svg => {
    svg.removeAttribute('data-rasterized-base64');
  });
  const slideStyle = window.getComputedStyle(slideWrapper);
  const bgColor = slideStyle.backgroundColor;

  return {
    elements: extractedElements,
    backgroundColor: bgColor,
    designWidth,
    designHeight
  };
}

/**
 * Computes the visual opacity of an element by traversing up the parent hierarchy.
 */
function getCumulativeOpacity(el, slideWrapper) {
  let opacity = 1.0;
  let current = el;
  while (current && current !== slideWrapper) {
    const style = window.getComputedStyle(current);
    if (style) {
      const op = parseFloat(style.opacity);
      if (!isNaN(op)) {
        opacity *= op;
      }
    }
    current = current.parentElement;
  }
  return opacity;
}

/**
 * Applies border radius clipping and object-fit: cover cropping to an image.
 */
async function applyImageFormatting(src, width, height, borderRadiusStyle, objectFit) {
  return new Promise((resolve) => {
    const hasBorderRadius = borderRadiusStyle && borderRadiusStyle !== '0px' && borderRadiusStyle !== '0';
    const needsCrop = objectFit === 'cover';
    
    if (!hasBorderRadius && !needsCrop) {
      return resolve(src);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const scale = 3; // 3x scale for crisp images
        const canvas = document.createElement('canvas');
        const canvasW = width * scale;
        const canvasH = height * scale;
        canvas.width = canvasW;
        canvas.height = canvasH;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Apply border radius clip path
        if (hasBorderRadius) {
          let radius = 0;
          const cleanRadius = borderRadiusStyle.trim().toLowerCase();
          if (cleanRadius.endsWith('%')) {
            const pct = parseFloat(cleanRadius) / 100;
            radius = Math.min(canvasW, canvasH) * pct;
          } else {
            const pxVal = parseFloat(cleanRadius) || 0;
            radius = pxVal * scale;
          }
          radius = Math.min(radius, Math.min(canvasW, canvasH) / 2);

          ctx.beginPath();
          ctx.moveTo(radius, 0);
          ctx.lineTo(canvasW - radius, 0);
          ctx.quadraticCurveTo(canvasW, 0, canvasW, radius);
          ctx.lineTo(canvasW, canvasH - radius);
          ctx.quadraticCurveTo(canvasW, canvasH, canvasW - radius, canvasH);
          ctx.lineTo(radius, canvasH);
          ctx.quadraticCurveTo(0, canvasH, 0, canvasH - radius);
          ctx.lineTo(0, radius);
          ctx.quadraticCurveTo(0, 0, radius, 0);
          ctx.closePath();
          ctx.clip();
        }

        // Draw the image
        if (needsCrop) {
          const imgW = img.width;
          const imgH = img.height;
          const ratio = Math.max(canvasW / imgW, canvasH / imgH);
          
          const newImgW = imgW * ratio;
          const newImgH = imgH * ratio;
          
          const sx = (canvasW - newImgW) / 2;
          const sy = (canvasH - newImgH) / 2;
          
          ctx.drawImage(img, sx, sy, newImgW, newImgH);
        } else {
          ctx.drawImage(img, 0, 0, canvasW, canvasH);
        }

        const pngBase64 = canvas.toDataURL('image/png');
        resolve(pngBase64);
      } catch (err) {
        console.error('[Extractor] Error rounding image with canvas:', err);
        resolve(src);
      }
    };
    img.onerror = (e) => {
      console.error('[Extractor] Failed to load image for rounding:', src, e);
      resolve(src);
    };
    img.src = src;
  });
}
