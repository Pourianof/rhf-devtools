import { useState, useCallback, useEffect, RefObject, useRef } from "react";

type Position = { x: number; y: number };
export type DragHandler = (pos: Position) => void;

export function useDnd({
  containerRef,
  borderGap = 20,
  innerBorderGap = 20,
  initialPosition = { x: 20, y: 100 },
  handlers,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  borderGap?: number;
  innerBorderGap?: number;
  initialPosition?: Position;
  handlers?: {
    onMove?: DragHandler;
    onDragStart?: DragHandler;
    onDragEnd?: DragHandler;
    onClick?: VoidFunction;
  };
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const isMoving = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".panel-content")) return;
    if ((e.target as HTMLElement).closest(".no-drag")) return;

    if (containerRef.current) containerRef.current.style.transition = "none";

    setIsDragging(true);

    const pos = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    setDragStart(pos);

    handlers?.onDragStart?.(pos);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      isMoving.current = newX != position.x || newY != position.y;

      const newPos = { x: newX, y: newY };
      setPosition(newPos);

      handlers?.onMove?.({ ...newPos });
    },
    [isDragging, dragStart.x, dragStart.y, position.x, position.y, handlers],
  );

  const handleMouseUp = useCallback(() => {
    let pos = position;
    if (!isMoving.current) {
      handlers?.onClick?.();
    } else if (containerRef.current) {
      const protectedPos =
        getViewportOverflowProtectedPosition({
          element: containerRef.current,
          borderGap,
          innerBorderGap,
        }) ?? pos;

      if (protectedPos) {
        setPosition(protectedPos);
        pos = protectedPos;
      }
    }
    isMoving.current = false;
    setIsDragging(false);
    handlers?.onDragEnd?.({ ...pos });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handlers?.onClick, handlers?.onDragEnd, position]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    function handleResize() {
      if (!containerRef.current) return;

      const newPos = getViewportOverflowProtectedPosition({
        element: containerRef.current,
        borderGap,
        innerBorderGap,
      });

      if (newPos) {
        setPosition(newPos);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borderGap, containerRef.current, innerBorderGap]);

  return { position, handleMouseDown, isDragging };
}

type SpacingOptions = {
  innerBorderGap?: number;
  borderGap?: number;
};

type Elemental = {
  element?: HTMLElement;
};

type TargetElementRect = {
  targetRect?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
};

export function getViewportOverflowProtectedPosition({
  borderGap = 0,
  innerBorderGap = 0,
  ...opts
}: (Elemental | TargetElementRect) & SpacingOptions) {
  const element = (opts as Elemental).element;
  const targetRect = (opts as TargetElementRect).targetRect;

  if (!element && !targetRect) {
    return;
  }

  let finalPos:
    | (Position & {
        right: number | null;
        bottom: number;
        shouldCorrectX: boolean;
        shouldCorrectY: boolean;
        leftMinBound: number;
        leftMaxBound: number;
        topMinBound: number;
        topMaxBound: number;
      })
    | undefined = undefined;

  let top: number,
    bottom: number,
    left: number,
    right: number,
    width: number,
    height: number;

  if (element) {
    const pos = element.getBoundingClientRect();
    top = pos.top;
    bottom = pos.bottom;
    left = pos.left;
    right = pos.right;
    width = pos.width;
    height = pos.height;
  } else {
    top = targetRect!.top;
    left = targetRect!.left;
    width = targetRect!.width;
    height = targetRect!.height;
    right = left + width;
    bottom = top + height;
  }

  let newY: number | null = null;
  let newX: number | null = null;

  let shouldCorrectX = false,
    shouldCorrectY = false;

  const topMinBound = innerBorderGap,
    topMaxBound = window.innerHeight - innerBorderGap - height;

  const leftMinBound = innerBorderGap,
    leftMaxBound = window.innerWidth - innerBorderGap - width;

  if (top < innerBorderGap) {
    newY = borderGap;
    shouldCorrectY = true;
  } else if (bottom > window.innerHeight - innerBorderGap) {
    newY = window.innerHeight - borderGap - height;
    shouldCorrectY = true;
  }

  if (left < innerBorderGap) {
    newX = borderGap;
    shouldCorrectX = true;
  } else if (right > window.innerWidth - innerBorderGap) {
    newX = window.innerWidth - borderGap - width;
    shouldCorrectX = true;
  }

  if (typeof newX != "number" || typeof newY != "number") {
    if (element) element.style.transition = "300ms";
    const x = newX ?? left,
      y = newY ?? top;
    finalPos = {
      x,
      y,
      bottom: y + height,
      right: x + width,
      shouldCorrectX,
      shouldCorrectY,
      topMinBound,
      topMaxBound,
      leftMinBound,
      leftMaxBound,
    };
  }

  return finalPos;
}
