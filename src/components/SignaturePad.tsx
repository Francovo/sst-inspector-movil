import { IonButton, IonIcon } from '@ionic/react';
import { saveOutline, trashOutline } from 'ionicons/icons';
import type { JSX, PointerEvent } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import './SignaturePad.css';

type SignaturePadProps = {
  /** Called with the PNG data URL of the drawing. */
  onSave?: (dataUrl: string) => void;
  onClear?: () => void;
};

const INK_COLOR = '#0f172a';
const INK_WIDTH = 2.4;

const SignaturePad = ({ onSave, onClear }: SignaturePadProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  const prepareCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Match the backing store to the CSS size so strokes stay crisp on retina.
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = INK_WIDTH;
    context.strokeStyle = INK_COLOR;
    context.fillStyle = INK_COLOR;
  }, []);

  useEffect(() => {
    prepareCanvas();

    // The outlet may mount the page before it has a measurable size (route
    // transitions), so observe the canvas instead of only listening to resize.
    const canvas = canvasRef.current;
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(prepareCanvas);

    if (canvas) observer?.observe(canvas);
    window.addEventListener('resize', prepareCanvas);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', prepareCanvas);
    };
  }, [prepareCanvas]);

  const toCanvasPoint = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const startStroke = (event: PointerEvent<HTMLCanvasElement>) => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawing.current = true;
    lastPoint.current = toCanvasPoint(event);

    // A tap should leave a visible dot, not nothing.
    context.beginPath();
    context.arc(lastPoint.current.x, lastPoint.current.y, INK_WIDTH / 2, 0, Math.PI * 2);
    context.fill();
  };

  const extendStroke = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;

    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    const point = toCanvasPoint(event);
    context.beginPath();
    context.moveTo(lastPoint.current.x, lastPoint.current.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPoint.current = point;
  };

  const endStroke = () => {
    isDrawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.restore();
    }

    onClear?.();
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (canvas) onSave?.(canvas.toDataURL('image/png'));
  };

  return (
    <div className="sst-signature">
      <div className="sst-signature__box">
        <canvas
          className="sst-signature__canvas"
          onPointerCancel={endStroke}
          onPointerDown={startStroke}
          onPointerLeave={endStroke}
          onPointerMove={extendStroke}
          onPointerUp={endStroke}
          ref={canvasRef}
        />
        <span aria-hidden="true" className="sst-signature__guide" />
      </div>

      <div className="sst-signature__actions">
        <IonButton className="sst-action sst-action--ghost" fill="outline" onClick={clear}>
          <IonIcon aria-hidden="true" icon={trashOutline} slot="start" />
          Limpiar firma
        </IonButton>

        <IonButton className="sst-action" color="success" onClick={save}>
          <IonIcon aria-hidden="true" icon={saveOutline} slot="start" />
          Guardar firma
        </IonButton>
      </div>
    </div>
  );
};

export default SignaturePad;
