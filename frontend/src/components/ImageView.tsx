import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface ImageViewProps {
    onImageSelected: (file: File) => void;
    selectedFile: File | null;
    clearFile: () => void;
}

export const ImageView: React.FC<ImageViewProps> = ({ onImageSelected, selectedFile, clearFile }) => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageSelected(e.target.files[0]);
        }
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setIsCameraOpen(true);
            // Wait for video element to be ready
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `capture_${Date.now()}.png`, { type: 'image/png' });
                        onImageSelected(file);
                        stopCamera();
                    }
                }, 'image/png');
            }
        }
    };

    if (isCameraOpen) {
        return (
            <div className="h-full flex flex-col items-center justify-center relative bg-black rounded-2xl overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                <div className="absolute bottom-6 flex gap-4 z-20">
                    <button
                        onClick={captureImage}
                        className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <div className="w-12 h-12 rounded-full bg-red-500" />
                    </button>
                    <button
                        onClick={stopCamera}
                        className="p-4 rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    }

    if (selectedFile) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-4 relative group">
                <div className="relative max-h-full max-w-full rounded-lg overflow-hidden border border-[var(--glass-border)] shadow-xl">
                    <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Selected"
                        className="max-h-[300px] object-contain"
                    />
                    <button
                        onClick={clearFile}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="mt-4 flex gap-3">
                    <p className="text-sm text-muted">{selectedFile.name}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col gap-4 items-center justify-center p-6">
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">

                {/* Upload Button */}
                <div className="relative group">
                    <input
                        type="file"
                        id="img-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="img-upload"
                        className="flex flex-col items-center justify-center p-6 h-40 border-2 border-dashed border-[var(--glass-border)] rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-[var(--glass-input-bg)] transition-all"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-medium text-main">Upload Image</span>
                    </label>
                </div>

                {/* Camera Button */}
                <button
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center p-6 h-40 border-2 border-dashed border-[var(--glass-border)] rounded-2xl cursor-pointer hover:border-blue-400/50 hover:bg-[var(--glass-input-bg)] transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="font-medium text-main">Open Camera</span>
                </button>
            </div>

            <p className="text-xs text-muted/60 text-center max-w-xs mt-2">
                Supported formats: PNG, JPG, WEBP.
            </p>
        </div>
    );
};
