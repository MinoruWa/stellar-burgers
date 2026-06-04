import 'react';

declare module '*.css';
declare module '*.svg';

declare module 'react' {
  interface HTMLAttributes<T> {
    onPointerEnterCapture?: (e: React.PointerEvent<T>) => void;
    onPointerLeaveCapture?: (e: React.PointerEvent<T>) => void;
  }
  interface RefAttributes<T> {
    onPointerEnterCapture?: (e: React.PointerEvent<T>) => void;
    onPointerLeaveCapture?: (e: React.PointerEvent<T>) => void;
  }
}
