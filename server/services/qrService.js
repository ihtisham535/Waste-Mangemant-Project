import QRCode from "qrcode";

/**
 * QR Code Service
 * Provides utility functions for QR code generation
 * Can be extended with additional methods (save to file, batch generation, etc.)
 */

/**
 * Generate QR code as Data URL
 * @param {string} data - The data to encode (usually an order ID or URL)
 * @param {object} options - Optional configuration
 * @returns {Promise<string>} - Base64 encoded PNG image as data URL
 */
export const generateQRDataURL = async (data, options = {}) => {
  const defaultOptions = {
    errorCorrectionLevel: "H",
    type: "image/png",
    width: 300,
    margin: 1,
    color: {
      dark: "#0f1c3f", // Navy blue
      light: "#cce7ff", // Light accent
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const qrDataUrl = await QRCode.toDataURL(data, mergedOptions);
    return qrDataUrl;
  } catch (error) {
    throw new Error(`QR generation failed: ${error.message}`);
  }
};

/**
 * Generate QR code and save to file (optional)
 * @param {string} data - The data to encode
 * @param {string} filePath - Path to save the QR code
 * @returns {Promise<string>} - File path where QR code was saved
 */
export const generateQRFile = async (data, filePath) => {
  try {
    await QRCode.toFile(filePath, data, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 300,
      margin: 1,
      color: {
        dark: "#0f1c3f",
        light: "#cce7ff",
      },
    });
    return filePath;
  } catch (error) {
    throw new Error(`Failed to save QR code: ${error.message}`);
  }
};

/**
 * Generate QR code for a full URL (e.g., redirect link)
 * Useful for scanning and going to a specific page
 * @param {string} baseURL - The base URL (e.g., http://localhost:3000)
 * @param {string} orderId - The order ID to append
 * @returns {Promise<string>} - Data URL of QR code
 */
export const generateQRForURL = async (baseURL, orderId) => {
  const fullURL = `${baseURL}/order/${orderId}`;
  return generateQRDataURL(fullURL);
};
