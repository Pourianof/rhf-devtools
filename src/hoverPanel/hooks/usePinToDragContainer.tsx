import { useRef, useState, useCallback, useEffect } from "react";
import { useDragNDropContext } from "../../hooks/DragNDropController";
import { getViewportOverflowProtectedPosition } from "../../hooks/useDnd";

export function usePinToDraggableContainer() {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    left: number;
    bottom?: number;
    top?: number;
    maxHeight?: number;
  }>();

  const containerGap = 10; // 10px space between box and its hover container
  const vpBorderGap = 20; // gap between panel box and y-axis borders

  const dndCtx = useDragNDropContext(() => {
    calculatePosition();
  });

  const calculatePosition = useCallback(
    function (suggestingPosition?: {
      left: number;
      top: number;
      onTop: boolean;
    }) {
      if (!ref.current || !dndCtx.containerRef.current) return;

      const containerRect = dndCtx.containerRef.current.getBoundingClientRect();
      const { top, bottom, height, width } =
        ref.current.getBoundingClientRect();

      function calculatePreferYOffsetFromContainer() {
        return containerRect.height + containerGap;
      }

      const protectedPosition = getViewportOverflowProtectedPosition({
        ...(suggestingPosition
          ? {
              targetRect: { ...suggestingPosition, height, width },
            }
          : { element: ref.current }),
        innerBorderGap: vpBorderGap,
        borderGap: vpBorderGap,
      });

      if (!ref.current) return;

      if (protectedPosition) {
        // if box should move down then we prevent this to overlap on container button
        // actualy translateY tell that is protection-y is different from current y or not
        const translateY = protectedPosition.y - top;

        const containerBoundTop = containerRect.top - containerGap;
        const containerBoundBottom = containerRect.bottom + containerGap;

        const willOverlapOnContainer = !(
          containerBoundTop >= protectedPosition.bottom ||
          containerBoundBottom <= protectedPosition.y
        );

        setPosition((p) => {
          const x = protectedPosition.x - containerRect.left;
          const y = calculatePreferYOffsetFromContainer();

          const isOnTopOfContainer = !!suggestingPosition || !p || p.bottom;

          if (willOverlapOnContainer) {
            if (isOnTopOfContainer) {
              // vp top overflow
              // predict if we flip the position, is new position will be ok or overflow viewport again
              const flippedBottomPredict =
                containerRect.bottom + containerGap + height;

              if (flippedBottomPredict <= window.innerHeight) {
                // Container Flipping to bottom and height will grow to cover available space

                return {
                  left: x,
                  bottom: undefined,
                  top: y,
                  maxHeight:
                    height +
                    window.innerHeight -
                    flippedBottomPredict -
                    vpBorderGap,
                };
              } else {
                // box stay in top and height will shrink

                return {
                  ...p,
                  bottom: calculatePreferYOffsetFromContainer(),
                  left: x,
                  maxHeight: height - translateY - vpBorderGap,
                };
              }
            } else {
              // vp bottom overflow
              //bottom-overflow - bottom of container'n
              const flippedTopPredict =
                top - (containerRect.height + 2 * containerGap + height);

              if (flippedTopPredict >= 0) {
                // box Flip to top and height will grow

                return {
                  left: x,
                  top: undefined,
                  bottom: y,
                  maxHeight: height + flippedTopPredict - vpBorderGap,
                };
              } else {
                // box stay in bottom and height will shrink

                return {
                  ...p,
                  top: calculatePreferYOffsetFromContainer(),
                  left: x,
                  maxHeight: height + translateY - vpBorderGap,
                };
              }
            }
          }

          return {
            ...p,
            ...(isOnTopOfContainer
              ? { bottom: calculatePreferYOffsetFromContainer() }
              : { top: calculatePreferYOffsetFromContainer() }),
            left:
              containerRect.left > protectedPosition.leftMaxBound // if dnd container is further of panel's max left position, so we pin it at safe-point
                ? protectedPosition.leftMaxBound - containerRect.left
                : containerRect.left < protectedPosition.leftMinBound
                  ? protectedPosition.leftMinBound
                  : 0,
            maxHeight: !isOnTopOfContainer
              ? height + window.innerHeight - bottom - vpBorderGap
              : height + top - vpBorderGap,
          };
        });
      }
    },
    [dndCtx.containerRef],
  );

  useEffect(() => {
    if (!ref.current || !dndCtx.containerRef.current) {
      return;
    }

    // calculate initial interested position
    const { top: containerTop, left: containerLeft } =
      dndCtx.containerRef.current.getBoundingClientRect();

    const { height } = ref.current.getBoundingClientRect();
    const top = containerTop - containerGap - height;

    // validate and correct position if needed
    calculatePosition({
      top,
      left: containerLeft,
      onTop: true,
    });
  }, [calculatePosition, dndCtx.containerRef]);

  return { position, pinningBoxRef: ref };
}
