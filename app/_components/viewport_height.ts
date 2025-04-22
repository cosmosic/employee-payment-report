import { RefObject, useEffect, useState } from "react";

const useViewportHeightLeft = (ref: RefObject<HTMLElement | null>) => {
  const [height, setHeight] = useState<string>("0px");

  useEffect(() => {
    const calculateHeight = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const distanceFromTop = rect.top;
      const minHeight = 64; 
      const padding = 20;
      const availableHeight = viewportHeight - distanceFromTop - padding;

      const finalHeight = Math.max(minHeight, availableHeight);
      setHeight(`${Math.floor(finalHeight)}px`);
    };

    calculateHeight();

    const handleResize = () => {
      window.requestAnimationFrame(calculateHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ref]);

  return { height };
};

export default useViewportHeightLeft;
