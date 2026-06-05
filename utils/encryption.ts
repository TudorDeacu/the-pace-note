import CryptoJS from 'crypto-js';

// We use NEXT_PUBLIC so it can be accessed in browser for Link hrefs
const SECRET_KEY = process.env.NEXT_PUBLIC_URL_SECRET || 'the-pace-note-secret-key';

export function encryptUrlParam(text: string): string {
    if (!text) return text;
    try {
        const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
        // Convert to URL-safe Base64
        return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (error) {
        console.error("Encryption error:", error);
        return text;
    }
}

export function decryptUrlParam(cipherText: string): string {
    if (!cipherText) return cipherText;
    
    // If it doesn't look like base64url, it might just be a normal unencrypted string
    if (!/^[A-Za-z0-9\-_]+$/.test(cipherText)) {
        return cipherText;
    }

    try {
        // Restore standard Base64
        let base64 = cipherText.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding back
        while (base64.length % 4) {
            base64 += '=';
        }
        
        const bytes = CryptoJS.AES.decrypt(base64, SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        
        // If decryption results in an empty string, it means the cipherText wasn't actually encrypted
        // or was encrypted with a different key. In that case, fall back to the original text.
        if (!originalText) {
            return cipherText;
        }
        
        return originalText;
    } catch (error) {
        return cipherText; // fallback to original if decryption fails
    }
}
