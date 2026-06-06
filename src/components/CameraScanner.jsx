import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Camera, FolderUp, Play, Square } from "lucide-react";
import { captureVideoFrame, fileToImagePayload } from "../lib/imageCapture.js";
import { useLanguage } from "../lib/LanguageContext.jsx";

const CameraScanner = forwardRef(function CameraScanner(
  { disabled, onCapture, onUpload, onReadyChange },
  ref
) {
  const { t } = useLanguage();
  const videoRef = useRef(null);
  const frameRef = useRef(null);
  const fileRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const environmentMessage = getCameraEnvironmentMessage();

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus("idle");
    onReadyChange(false);
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    capture: async () => {
      if (!videoRef.current || !streamRef.current) {
        throw new Error(t("pleaseStartCamera"));
      }
      return captureVideoFrame(videoRef.current, frameRef.current);
    }
  }));

  const startCamera = async () => {
    setMessage("");
    setStatus("starting");

    try {
      if (!isSecureCameraContext()) {
        throw createCameraError(
          "InsecureContextError",
          "Current context is HTTP. Live camera on iOS requires HTTPS."
        );
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        throw createCameraError("UnsupportedCameraError", "Camera API not available in current browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("ready");
      onReadyChange(true);
    } catch (error) {
      setStatus("error");
      onReadyChange(false);
      setMessage(getCameraErrorMessage(error));
    }
  };

  const handleCaptureClick = async () => {
    try {
      const payload = await captureVideoFrame(videoRef.current, frameRef.current);
      stopCamera();
      onCapture(payload);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Capture failed");
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const payload = await fileToImagePayload(file);
      onUpload(payload);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Image processing failed");
    }
  };

  const isReady = status === "ready";

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="camera-stage relative bg-slate-950">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          playsInline
          muted
        />
        {isReady ? (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-slate-950/35" />
            <div
              ref={frameRef}
              className="landscape-viewfinder absolute left-1/2 top-1/2 w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2"
            >
              <div className="absolute inset-0 rounded-xl border border-white/70 shadow-[0_0_0_9999px_rgba(2,6,23,0.42)]" />
              <div className="absolute left-0 top-0 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-amber-400" />
              <div className="absolute right-0 top-0 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-amber-400" />
              <div className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-amber-400" />
              <div className="absolute bottom-0 right-0 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-amber-400" />
              <div className="absolute left-4 right-4 top-1/2 border-t border-dashed border-white/40" />
              <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-lg bg-slate-950/70 px-2.5 py-1 text-xs font-semibold text-white">
                {t("viewfinder")}
              </div>
            </div>
          </div>
        ) : null}
        {!isReady ? (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <div>
              <Camera className="mx-auto h-12 w-12 text-slate-400" aria-hidden="true" />
              <p className="mt-4 text-base font-medium text-white">{t("cameraNotStarted")}</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                {environmentMessage || t("cameraMessage")}
              </p>
            </div>
          </div>
        ) : null}
        {disabled ? (
          <div className="absolute inset-0 grid place-items-center bg-slate-950/60 text-sm font-medium text-white">
            {t("analyzing")}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {isReady ? (
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleCaptureClick}
              disabled={disabled}
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
              {t("capture")}
            </button>
          ) : (
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              onClick={startCamera}
              disabled={disabled || status === "starting"}
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              {status === "starting" ? t("starting") : t("startCamera")}
            </button>
          )}

          {isReady ? (
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={stopCamera}
            >
              <Square className="h-4 w-4" aria-hidden="true" />
              {t("stop")}
            </button>
          ) : null}

          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => fileRef.current?.click()}
            disabled={disabled}
          >
            <FolderUp className="h-4 w-4" aria-hidden="true" />
            {t("uploadImage")}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <p className="min-h-5 text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
});

function getCameraErrorMessage(error) {
  if (error?.name === "InsecureContextError") {
    return "Not a secure HTTPS context. iOS live camera requires HTTPS. Please deploy to Vercel/Netlify or use 'Capture / Upload Image'.";
  }
  if (error?.name === "UnsupportedCameraError") {
    return error.message;
  }
  if (error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError") {
    return "Camera permission denied. Go to Settings to enable it.";
  }
  return "Cannot start camera. Check permissions and HTTPS.";
}

function getCameraEnvironmentMessage() {
  if (!isSecureCameraContext()) {
    return "HTTP network detected. Live preview needs HTTPS. Use 'Capture / Upload Image' instead.";
  }
  return "";
}

function isSecureCameraContext() {
  if (typeof window === "undefined") return false;
  return window.isSecureContext || ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function createCameraError(name, message) {
  const error = new Error(message);
  error.name = name;
  return error;
}

export default CameraScanner;
