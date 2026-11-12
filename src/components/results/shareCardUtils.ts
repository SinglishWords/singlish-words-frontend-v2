
import { toBlob } from "html-to-image";

// Convert the contribution card DOM element directly into a PNG Blob.
export const exportCardAsPng = async (
    element: HTMLElement
): Promise<Blob> => {
    try {
        const blob = await toBlob(element, {
            pixelRatio: 3,
            cacheBust: true,
            backgroundColor: "#FFFFFF",
        });

        // toBlob can return null if image generation fails.
        if (!blob) {
            throw new Error("Image generation returned an empty Blob.");
        }

        return blob;
    } catch (error) {
        console.error("html-to-image export failed:", error);
        throw error;
    }
};

// Download the generated PNG.
export const downloadBlob = (blob: Blob, fileName: string) => {
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Give the browser time to start the download before releasing the URL.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};
