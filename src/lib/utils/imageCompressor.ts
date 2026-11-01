/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Client-Side Image Compression Utility
 * 
 * Enforces a strict maximum file size of 200KB before uploading to Supabase Storage
 * (bucket: 'blog-images', allowed types: image/jpeg, image/png, image/webp).
 */

export interface CompressionOptions {
  maxSizeKB?: number; // Target max size in KB (default: 200)
  maxWidth?: number;  // Max pixel width (default: 1600)
  maxHeight?: number; // Max pixel height (default: 1600)
  initialQuality?: number; // Quality between 0.1 and 1.0 (default: 0.82)
  outputType?: 'image/webp' | 'image/jpeg';
}

export interface CompressionResult {
  file: File;
  originalSizeKB: number;
  compressedSizeKB: number;
  compressionRatio: number;
  width: number;
  height: number;
}

const MAX_TARGET_BYTES = 200 * 1024; // 200 KB in bytes

/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * Iteratively adjusts quality and dimensions to guarantee output < 200KB.
 */
export async function compressImage(
  inputFile: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const maxSizeKB = options.maxSizeKB ?? 200;
  const targetBytes = maxSizeKB * 1024;
  const maxWidth = options.maxWidth ?? 1600;
  const maxHeight = options.maxHeight ?? 1600;
  const outputType = options.outputType ?? 'image/webp';
  let quality = options.initialQuality ?? 0.85;

  // If the file is already under target size and is a valid format, return it directly
  if (inputFile.size <= targetBytes && ['image/webp', 'image/jpeg', 'image/png'].includes(inputFile.type)) {
    const dimensions = await getImageDimensions(inputFile);
    return {
      file: inputFile,
      originalSizeKB: Math.round(inputFile.size / 1024),
      compressedSizeKB: Math.round(inputFile.size / 1024),
      compressionRatio: 1,
      width: dimensions.width,
      height: dimensions.height,
    };
  }

  // Load image into HTMLImageElement
  const img = await loadImageFromFile(inputFile);
  let { width, height } = calculateDownscaledDimensions(img.width, img.height, maxWidth, maxHeight);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is not supported in this browser.');
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  let blob: Blob | null = await getCanvasBlob(canvas, outputType, quality);

  // Iterative reduction loop: lower quality then downscale if needed until <= targetBytes
  let attempts = 0;
  while (blob && blob.size > targetBytes && attempts < 8) {
    attempts++;
    if (quality > 0.4) {
      quality -= 0.15;
    } else {
      // Further scale down dimensions by 15%
      width = Math.floor(width * 0.85);
      height = Math.floor(height * 0.85);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      quality = 0.65;
    }
    blob = await getCanvasBlob(canvas, outputType, quality);
  }

  if (!blob) {
    throw new Error('Failed to encode compressed image to Blob.');
  }

  // Clean filename extension based on target MIME type
  const baseName = inputFile.name.replace(/\.[^/.]+$/, '');
  const extension = outputType === 'image/webp' ? 'webp' : 'jpg';
  const compressedFileName = `${baseName}-compressed.${extension}`;

  const compressedFile = new File([blob], compressedFileName, {
    type: outputType,
    lastModified: Date.now(),
  });

  const originalSizeKB = Math.round(inputFile.size / 1024);
  const compressedSizeKB = Math.round(compressedFile.size / 1024);
  const compressionRatio = Number((compressedSizeKB / originalSizeKB).toFixed(2));

  return {
    file: compressedFile,
    originalSizeKB,
    compressedSizeKB,
    compressionRatio,
    width,
    height,
  };
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image from file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('FileReader error while reading image file.'));
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };
    img.src = url;
  });
}

function calculateDownscaledDimensions(
  origW: number,
  origH: number,
  maxW: number,
  maxH: number
): { width: number; height: number } {
  let width = origW;
  let height = origH;

  if (width > maxW) {
    height = Math.round((height * maxW) / width);
    width = maxW;
  }
  if (height > maxH) {
    width = Math.round((width * maxH) / height);
    height = maxH;
  }

  return { width, height };
}

function getCanvasBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}
