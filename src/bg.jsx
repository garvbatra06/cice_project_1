import { useEffect, useRef } from "react";

export default function Bg() {
  const vantaRef = useRef(null);

  useEffect(() => {
    const loadScripts = async () => {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/vanta/dist/vanta.net.min.js");

      if (window.VANTA) {
        window.VANTA.NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x423aa0,
          backgroundColor: 0x081122,
          points: 9.00,
          maxDistance: 0.00,
          spacing: 20.00
        });
      }
    };

    loadScripts();

    return () => {
      if (window.VANTA && window.VANTA.current) {
        window.VANTA.current.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={vantaRef} 
      style={{ 
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1
      }} 
    />
  );
}

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};