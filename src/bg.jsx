import { useEffect, useRef } from "react";

export default function Bg() {
  const vantaRef = useRef(null);

  useEffect(() => {
    const loadScripts = async () => {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/vanta/dist/vanta.dots.min.js");

      VANTA.DOTS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: true,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 100.0,
        scaleMobile: 1.0,
        color: 0x187cc3,         // Neon green dots
        color2: 0x187cc3,        // Neon cyan connecting lines
        backgroundColor: 0x0f0f0f, // Almost black background
        spacing: 100.0,           // Adjust dot spacing
        showLines: true           // Make it look more “hacker-y”
    });    
      
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
