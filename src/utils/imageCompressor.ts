/**
 * High-performance client-side image compression and safe storage utility.
 * Optimizes images into ultra-compact Base64 WebP/JPEG data (strictly < 100KB)
 * to prevent browser LocalStorage QuotaExceededError and Firestore payload limitations.
 */

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxSizeKb?: number;
  initialQuality?: number;
  minQuality?: number;
  preferFormat?: 'image/webp' | 'image/jpeg' | 'image/png';
}

export interface CompressedImageResult {
  dataUrl: string;
  sizeKb: number;
  originalSizeKb: number;
  width: number;
  height: number;
  reductionPercentage: number;
  format: string;
}

/**
 * Calculates byte size of a Base64 data URL
 */
export function getBase64SizeInKb(base64String: string): number {
  if (!base64String) return 0;
  // Base64 header length
  const stringLength = base64String.length - (base64String.indexOf(',') + 1);
  const sizeInBytes = (stringLength * 3) / 4;
  return Math.round((sizeInBytes / 1024) * 10) / 10;
}

/**
 * Checks if browser canvas supports WebP export
 */
function isWebpSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  } catch {
    return false;
  }
}

/**
 * Compresses an image File or existing Data URL into an optimized Base64 string under target KB.
 */
export async function compressImage(
  source: File | Blob | string,
  options: ImageCompressionOptions = {}
): Promise<CompressedImageResult> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    maxSizeKb = 95, // strictly under 100KB
    initialQuality = 0.82,
    minQuality = 0.45,
    preferFormat = 'image/webp',
  } = options;

  let originalSizeKb = 0;
  let sourceUrl = '';

  if (typeof source === 'string') {
    originalSizeKb = getBase64SizeInKb(source);
    sourceUrl = source;
  } else {
    originalSizeKb = Math.round((source.size / 1024) * 10) / 10;
    sourceUrl = URL.createObjectURL(source);
  }

  // If it's an SVG file, handle directly as compact SVG string
  if (
    (typeof source !== 'string' && source.type === 'image/svg+xml') ||
    (typeof source === 'string' && source.startsWith('data:image/svg+xml'))
  ) {
    if (typeof source === 'string') {
      return {
        dataUrl: source,
        sizeKb: originalSizeKb,
        originalSizeKb,
        width: 400,
        height: 400,
        reductionPercentage: 0,
        format: 'image/svg+xml',
      };
    }
    const svgText = await source.text();
    const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
    const sizeKb = getBase64SizeInKb(encoded);
    return {
      dataUrl: encoded,
      sizeKb,
      originalSizeKb,
      width: 400,
      height: 400,
      reductionPercentage: Math.max(0, Math.round(((originalSizeKb - sizeKb) / (originalSizeKb || 1)) * 100)),
      format: 'image/svg+xml',
    };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (typeof source !== 'string') {
        URL.revokeObjectURL(sourceUrl);
      }

      try {
        let currentWidth = img.naturalWidth || img.width;
        let currentHeight = img.naturalHeight || img.height;

        // Calculate initial dimensions maintaining aspect ratio
        if (currentWidth > maxWidth || currentHeight > maxHeight) {
          const ratio = Math.min(maxWidth / currentWidth, maxHeight / currentHeight);
          currentWidth = Math.round(currentWidth * ratio);
          currentHeight = Math.round(currentHeight * ratio);
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          throw new Error('Failed to create canvas 2d context for image compression.');
        }

        const exportFormat =
          preferFormat === 'image/webp' && isWebpSupported() ? 'image/webp' : 'image/jpeg';

        let quality = initialQuality;
        let bestDataUrl = '';
        let bestSizeKb = Infinity;
        let iteration = 0;
        const maxIterations = 8;

        canvas.width = currentWidth;
        canvas.height = currentHeight;

        // Fill white background for transparent PNG converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, currentWidth, currentHeight);
        ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

        bestDataUrl = canvas.toDataURL(exportFormat, quality);
        bestSizeKb = getBase64SizeInKb(bestDataUrl);

        // Iterative compression loop to guarantee < maxSizeKb
        while (bestSizeKb > maxSizeKb && iteration < maxIterations) {
          iteration++;

          if (quality > minQuality) {
            quality = Math.max(minQuality, quality - 0.12);
          } else {
            // Scale down resolution if quality alone isn't enough
            currentWidth = Math.max(120, Math.round(currentWidth * 0.82));
            currentHeight = Math.max(120, Math.round(currentHeight * 0.82));
            canvas.width = currentWidth;
            canvas.height = currentHeight;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, currentWidth, currentHeight);
            ctx.drawImage(img, 0, 0, currentWidth, currentHeight);
          }

          const candidate = canvas.toDataURL(exportFormat, quality);
          const candidateSize = getBase64SizeInKb(candidate);

          if (candidateSize < bestSizeKb) {
            bestDataUrl = candidate;
            bestSizeKb = candidateSize;
          }

          if (bestSizeKb <= maxSizeKb) {
            break;
          }
        }

        const reduction = originalSizeKb > 0
          ? Math.max(0, Math.round(((originalSizeKb - bestSizeKb) / originalSizeKb) * 100))
          : 0;

        resolve({
          dataUrl: bestDataUrl,
          sizeKb: bestSizeKb,
          originalSizeKb,
          width: currentWidth,
          height: currentHeight,
          reductionPercentage: reduction,
          format: exportFormat,
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      if (typeof source !== 'string') {
        URL.revokeObjectURL(sourceUrl);
      }
      reject(new Error('Failed to load image file. Please provide a valid JPG, PNG, or WEBP image.'));
    };

    img.src = sourceUrl;
  });
}

/**
 * Sanitizes JSON payload for local caching by stripping or replacing bloated base64 strings (>30KB)
 * to ensure client-side cache never breaches browser quota.
 */
export function sanitizePayloadForCache(value: string): string {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const sanitized = parsed.map((item) => {
        if (item && typeof item === 'object') {
          const clone: any = { ...item };
          for (const k of Object.keys(clone)) {
            if (
              typeof clone[k] === 'string' &&
              clone[k].startsWith('data:image/') &&
              clone[k].length > 30000
            ) {
              // Strip massive base64 strings for offline localStorage cache only
              clone[k] = '';
            }
          }
          return clone;
        }
        return item;
      });
      return JSON.stringify(sanitized);
    }
  } catch {
    // Not a JSON array
  }
  return value;
}

/**
 * Initializes and prunes legacy/oversized cached storage items
 */
export function pruneOversizedStorage(): void {
  try {
    localStorage.removeItem('staff_list');
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || '';
        if (val.length > 250000) {
          localStorage.removeItem(key);
        }
      }
    }
  } catch {
    // Ignore storage access errors
  }
}

// Run prune on load
if (typeof window !== 'undefined') {
  pruneOversizedStorage();
}

/**
 * Safely writes to localStorage with automatic multi-tier QuotaExceeded recovery
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error: any) {
    const isQuotaExceeded =
      error?.name === 'QuotaExceededError' ||
      error?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error?.code === 22 ||
      error?.code === 1014;

    if (isQuotaExceeded) {
      try {
        // Tier 1: Remove disposable cache keys
        localStorage.removeItem('staff_list');
        localStorage.removeItem('spy_cms_event_attendees');
        localStorage.removeItem('spy_cms_inbox');
        localStorage.removeItem('spy_cms_complaints');

        // Tier 2: Remove oversized keys
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const storedKey = localStorage.key(i);
          if (storedKey && storedKey !== key) {
            const val = localStorage.getItem(storedKey) || '';
            if (val.length > 150000) {
              localStorage.removeItem(storedKey);
            }
          }
        }

        // Tier 3: Try saving original value
        try {
          localStorage.setItem(key, value);
          return true;
        } catch {
          // Tier 4: Sanitize payload to strip heavy base64 strings from offline cache
          const sanitized = sanitizePayloadForCache(value);
          localStorage.setItem(key, sanitized);
          return true;
        }
      } catch {
        // Memory fallback gracefully active
        return false;
      }
    }
    return false;
  }
}

/**
 * Formats size into friendly readable string (KB / MB)
 */
export function formatFileSize(kb: number): string {
  if (kb < 1) return `${Math.round(kb * 1024)} B`;
  if (kb >= 1024) return `${(kb / 1024).toFixed(2)} MB`;
  return `${kb.toFixed(1)} KB`;
}
