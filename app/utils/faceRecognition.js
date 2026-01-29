import * as faceapi from '@vladmandic/face-api';
import { Canvas, Image, ImageData } from 'canvas';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Monkey patch for Node.js environment
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

/**
 * Load Face API models
 */
export async function loadModels() {
  if (modelsLoaded) {
    return;
  }

  try {
    // Get absolute path to models directory
    const modelsPath = join(process.cwd(), 'app/models/faceid');
    
    // Check if models directory exists
    if (!existsSync(modelsPath)) {
      console.warn('⚠️  Face recognition models directory not found. Face recognition features will not work.');
      return;
    }

    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath),
      faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),
      faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath)
    ]);

    modelsLoaded = true;
    console.log('✅ Face recognition models loaded successfully');
  } catch (error) {
    console.error('❌ Error loading face recognition models:', error);
    throw error;
  }
}

/**
 * Extract face descriptor from base64 image
 */
export async function extractFaceDescriptor(imageBase64) {
  if (!modelsLoaded) {
    await loadModels();
  }

  try {
    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const img = new Image();
    img.src = buffer;

    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw new Error('No face detected in the image');
    }

    // Convert Float32Array to regular array for JSON storage
    return Array.from(detection.descriptor);
  } catch (error) {
    console.error('Error extracting face descriptor:', error);
    throw error;
  }
}

/**
 * Compare two face descriptors
 * Returns the euclidean distance (lower = more similar)
 */
export function compareDescriptors(descriptor1, descriptor2) {
  if (!descriptor1 || !descriptor2) {
    throw new Error('Descriptors are required');
  }

  const desc1 = descriptor1 instanceof Float32Array 
    ? descriptor1 
    : new Float32Array(descriptor1);
  
  const desc2 = descriptor2 instanceof Float32Array 
    ? descriptor2 
    : new Float32Array(descriptor2);

  if (desc1.length !== desc2.length) {
    throw new Error('Descriptors must have the same length');
  }

  return faceapi.euclideanDistance(desc1, desc2);
}

/**
 * Verify face match
 */
export function verifyFace(savedDescriptor, currentDescriptor, threshold = 0.6) {
  const distance = compareDescriptors(savedDescriptor, currentDescriptor);
  return {
    match: distance < threshold,
    distance,
    threshold
  };
}
