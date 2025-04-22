import { cn } from "@/lib/utils";
import { useEffect } from "react";

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner3 = ({ size = 50, className, ...props }: ISVGProps) => {
  useEffect(() => {
    const body = document.body;
    body.style.pointerEvents = "none";
    body.style.overflow = "hidden";
    return () => {
      body.style.pointerEvents = "";
      body.style.overflow = "";
    };
  }, []);

  return (
    <div className="w-full h-full relative inset-0  bg-black bg-opacity-50 flex items-center justify-center z-[9999] overflow-hidden  cursor-not-allowed">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#E86C00"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};
export const LoadingSpinner2 = ({ size = 50, className, ...props }: ISVGProps) => {
  useEffect(() => {
    const body = document.body;
    body.style.pointerEvents = "none";
    body.style.overflow = "hidden";
    return () => {
      body.style.pointerEvents = "";
      body.style.overflow = "";
    };
  }, []);

  return (
    <div className="w-full h-full fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-[9999] overflow-hidden  cursor-not-allowed">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#E86C00"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};

const LoadingSpinner = ({ size = 50, className, ...props }: ISVGProps) => {
  return (
    <div className=" flex items-center justify-center z-30">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#E86C00"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};

export const LoadingBlock = ({ size = 50, className, ...props }: ISVGProps) => {
  return (
    <div className="w-full h-full min-h-[100px] max-h-[400px] flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#E86C00"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
