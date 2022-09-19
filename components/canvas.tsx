import { RefObject } from "react";

interface CanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}

export function Canvas({ canvasRef }: CanvasProps) {
  return (
    <canvas ref={canvasRef} width={window.innerWidth * 0.75} height={480} />
  );
}
