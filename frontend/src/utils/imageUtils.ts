// Utility functions for handling images in the CivicReport app

export interface ImageData {
  file: File;
  url: string;
  thumbnail: string;
  width?: number;
  height?: number;
  size: number;
  type: string;
}

// Create a thumbnail from an image file
export const createThumbnail = (file: File, maxWidth = 300, maxHeight = 200, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      const aspectRatio = width / height;
      
      if (width > maxWidth || height > maxHeight) {
        if (aspectRatio > maxWidth / maxHeight) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Process image file and create data object
export const processImageFile = async (file: File): Promise<ImageData> => {
  const url = URL.createObjectURL(file);
  const thumbnail = await createThumbnail(file);
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        file,
        url,
        thumbnail,
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type
      });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};

// Validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPEG, PNG, or WebP)'
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image file size must be less than 10MB'
    };
  }
  
  return { valid: true };
};

// Check if image has EXIF GPS data (simplified version)
export const hasGeoData = async (file: File): Promise<boolean> => {
  // This is a simplified check. In a real app, you'd use a library like exif-js
  // to extract actual GPS coordinates from the EXIF data
  try {
    const arrayBuffer = await file.arrayBuffer();
    const view = new DataView(arrayBuffer);
    
    // Check for EXIF marker
    if (view.getUint16(0) === 0xFFD8 && view.getUint16(2) === 0xFFE1) {
      // Very simplified check for GPS data presence
      const exifString = String.fromCharCode.apply(null, Array.from(new Uint8Array(arrayBuffer, 4, 100)));
      return exifString.includes('GPS');
    }
  } catch (error) {
    console.warn('Failed to check for GPS data:', error);
  }
  
  return false;
};

// Generate default image for category
export const getDefaultCategoryImage = (categoryId: string): string => {
  const defaultImages: Record<string, string> = {
    'infrastructure': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    'utilities': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    'sanitation': 'https://images.unsplash.com/photo-1586803884030-df8dbf5fc86c?w=800&h=600&fit=crop',
    'environment': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    'transport': 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800&h=600&fit=crop',
    'safety': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop',
    'health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    'governance': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop'
  };
  
  return defaultImages[categoryId] || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop';
};

// Convert file size to human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Clean up object URLs to prevent memory leaks
export const cleanupImageUrls = (images: ImageData[]) => {
  images.forEach(image => {
    URL.revokeObjectURL(image.url);
  });
};
