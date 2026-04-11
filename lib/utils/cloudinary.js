
const CLOUD_NAME = 'doiyevfkv';

const getSignature = async () => {
    const res = await fetch('/api/cloudinary/sign');
    if (!res.ok) throw new Error('Failed to get signature');
    return await res.json();
};

export const uploadImage = async (file) => {
    if (!file) return null;

    const { signature, timestamp, apiKey } = await getSignature();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};

export const uploadVideo = async (file) => {
    if (!file) return null;

    const { signature, timestamp, apiKey } = await getSignature();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('resource_type', 'video');
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Video upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary Video Upload Error:", error);
        throw error;
    }
};

export const uploadFile = async (file) => {
    if (!file) return null;

    const { signature, timestamp, apiKey } = await getSignature();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'File upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary File Upload Error:", error);
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
