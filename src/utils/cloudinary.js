// axios import removed

// ----------------------------------------------------------------------
// ⚡ CLOUDINARY CONFIGURATION (User to Fill)
// ----------------------------------------------------------------------
// 1. Go to your Cloudinary Dashboard.
// 2. Copy your "Cloud Name".
// 3. Go to Settings > Upload > Add Upload Preset.
// 4. Name it something (e.g., 'haidar_edu_unsigned').
// 5. Set "Signing Mode" to "Unsigned".
// 6. Paste the values below:

const CLOUD_NAME = 'dybzllx8y';
const UPLOAD_PRESET = 'Haidar_course';

export const uploadImage = async (file) => {
    if (!file) return null;

    // Validation removed as credentials are provided

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};

export const optimizeImage = (url, width = 800) => {
    if (!url) return '';
    // Check if it's a Cloudinary URL to apply optimizations
    if (url.includes('cloudinary.com')) {
        // Insert transformations: f_auto (format), q_auto (quality), w_{width} (resize)
        return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
    }
    return url;
};
