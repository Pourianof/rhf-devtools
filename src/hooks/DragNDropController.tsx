import Notifier, { Listener } from "@pourianof/notifier";
import {
  createContext,
  HTMLAttributes,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useRef,
} from "react";
import { twMerge } from "tailwind-merge";
import { useDnd } from "./useDnd";

type MoveHandler = (state: ContainerPositionState) => void;

type IDragNDropContext = {
  addListener: (litener: MoveHandler) => Listener;
  containerRef: RefObject<HTMLElement | null>;
};

const DragNDropContext = createContext<IDragNDropContext>(
  {} as unknown as IDragNDropContext,
);

export function useDragNDropContext(onMove: MoveHandler) {
  const { addListener, ...ctx } = useContext(DragNDropContext);

  useEffect(() => {
    const sub = addListener(onMove);

    return () => sub.cancel();
  }, [addListener, onMove]);

  return ctx;
}

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, "onClick">;

type ContainerPositionState = {
  containerRect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
};

export function DragNDropController({
  children,
  whenDraggingProps,
  onClick,
  ...props
}: {
  children: ReactNode;
  onClick?: VoidFunction;
  whenDraggingProps?: ElementProps;
} & ElementProps) {
  const notifier = useRef(
    new Notifier<{
      move: { x: number; y: number };
    }>(),
  );
  const ref = useRef<HTMLDivElement>(null);

  const { handleMouseDown, isDragging, position } = useDnd({
    containerRef: ref,
    handlers: {
      onClick,

      onMove: (pos) => {
        notifier.current.trigger("move", pos);
      },
    },
  });

  return (
    <div
      ref={ref}
      {...((isDragging ? whenDraggingProps : props) ?? {})}
      className={twMerge("fixed z-9999", props.className ?? "")}
      onMouseDown={handleMouseDown}
      style={{
        ...(isDragging ? whenDraggingProps?.style : props.style),
        top: position.y,
        left: position.x,
      }}
    >
      <DragNDropContext.Provider
        value={{
          addListener(listener) {
            return notifier.current.addListener("move", (e) => {
              if (!ref.current) return;

              const { width, height } = ref.current.getBoundingClientRect();
              listener({
                containerRect: {
                  top: e.data.y,
                  left: e.data.x,
                  width,
                  height,
                },
              });
            });
          },
          containerRef: ref,
        }}
      >
        {children}
      </DragNDropContext.Provider>
    </div>
  );
}
