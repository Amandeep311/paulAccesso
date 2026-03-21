import { useRef, useState, useEffect } from "react";
import { Camera, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

export function CameraCapture({ onCapture, capturedImage }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [captureTimestamp, setCaptureTimestamp] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);

  const initCamera = async () => {
    try {
      setError(null);
      setPermissionDenied(false);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error("Camera error:", err);
      if (err.name === "NotAllowedError") {
        setPermissionDenied(true);
        setError("Camera access was denied");
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device");
      } else if (err.name === "NotReadableError") {
        setError("Camera is already in use by another application");
      } else {
        setError(`Camera error: ${err.message}`);
      }
    }
  };

  useEffect(() => {
    initCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        const timestamp = new Date().toLocaleString();
        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.fillRect(0, canvas.height - 40, canvas.width, 40);
        context.fillStyle = "white";
        context.font = "16px Arial";
        context.fillText(timestamp, 10, canvas.height - 15);

        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        onCapture(imageData);

        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  const retake = () => {
    onCapture("");
    initCamera();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (capturedImage) {
      setCaptureTimestamp(new Date().toLocaleString());
    }
  }, [capturedImage]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-200 dark:border-gray-600">
        {permissionDenied && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-white dark:bg-gray-800">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Camera Access Required
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Please allow camera access in your browser settings.
              </p>
              <Button
                onClick={initCamera}
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        )}
        
        {error && !permissionDenied && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Camera Error
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button onClick={initCamera}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}
        
        {!capturedImage && !error && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded text-sm font-medium">
              {currentTime}
            </div>
          </>
        )}
        
        {capturedImage && (
          <div className="relative w-full h-full">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded text-sm font-medium">
              {captureTimestamp}
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-2">
        {!capturedImage ? (
          <Button
            onClick={capturePhoto}
            disabled={!stream || !!error}
            className="w-full"
          >
            <Camera className="w-4 h-4 mr-2" />
            Capture Photo
          </Button>
        ) : (
          <Button 
            onClick={retake} 
            variant="outline" 
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Photo
          </Button>
        )}
      </div>
    </div>
  );
}