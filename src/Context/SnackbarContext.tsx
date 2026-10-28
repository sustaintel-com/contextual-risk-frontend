
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import successImage from "../assets/green-tick.png";
import warningImage from "../assets/warning_icon.png";
import infoImage from "../assets/info_image.png";
import errorImage from "../assets/close_icon.png";
import type { ReactNode } from "react";

type SnackbarType = "success" | "info" | "warning" | "error" | "loading";
type SnackbarPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";


type SnackbarAnimation = "slide" | "fade" | "scale" | "bounce";

interface Snackbar {
  id: number;
  message: string;
  type: SnackbarType;
  duration: number;
  progress?: number;
  code?: string | number;
  animation?: SnackbarAnimation;

  removing?: boolean;
}

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    code?: any,
    options?: {
      type?: SnackbarType;
      duration?: number;
      progress?: number;
      animation?: SnackbarAnimation;
    }
  ) => number; 
  showPromiseSnackbar: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string; 
    },
    id?: number,
    options?: { animation?: SnackbarAnimation }
  ) => Promise<T>;
  updateSnackbarProgress: (id: number, progress: number) => void;

  hideSnackbar: (id: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar must be used within SnackbarProvider");
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
  position?: SnackbarPosition;
  animation?: SnackbarAnimation; 
}


const EXIT_ANIMATION_MS = 280;


export const extractErrorMessage = (err: any, fallback: string): string => {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.data?.message ||
    err?.message ||
    fallback
  );
};

const extractErrorCode = (err: any): string | number | undefined => {
  return err?.response?.status ?? err?.status ?? err?.code ?? undefined;
};

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
  position = "top-center",
  animation = "slide",
}) => {
  const [snackbars, setSnackbars] = useState<Snackbar[]>([]);


  const removeSnackbar = useCallback((id: number) => {
    setSnackbars((prev) =>
      prev.map((s) => (s.id === id ? { ...s, removing: true } : s))
    );
    setTimeout(() => {
      setSnackbars((prev) => prev.filter((s) => s.id !== id));
    }, EXIT_ANIMATION_MS);
  }, []);

  const showSnackbar = useCallback(
    (
      message: string,
      codeOrOptions?: any,
      maybeOptions?: {
        type?: SnackbarType;
        duration?: number;
        progress?: number;
        animation?: SnackbarAnimation;
      }
    ): number => {

      let code: string | number | undefined;
      let options: {
        type?: SnackbarType;
        duration?: number;
        progress?: number;
        animation?: SnackbarAnimation;
      } = {};


      if (typeof codeOrOptions === "object") {
        options = codeOrOptions;
      } else {
        code = codeOrOptions;
        options = maybeOptions || {};
      }

      const id = Date.now();
      const type = options.type ?? "info";
      const duration = options.duration ?? 4000;
      const progress = options.progress;

      const newSnackbar: Snackbar = {
        id,
        message,
        type,
        duration,
        progress,
        code, 
        animation: options.animation ?? animation,
      };

      setSnackbars((prev) => [...prev, newSnackbar]);

      if (duration > 0 && type !== "loading") {
        setTimeout(() => {
          removeSnackbar(id);
        }, duration);
      }

      return id;
    },
    [removeSnackbar, animation]
  );

  const updateSnackbarProgress = useCallback((id: number, progress: number) => {
    setSnackbars((prev) =>
      prev.map((s) => (s.id === id ? { ...s, progress } : s))
    );
  }, []);

  const showPromiseSnackbar = useCallback(
    async <T,>(
      promise: Promise<T>,
      messages: { loading: string; success: string; error: string },
      id?: number,
      options?: { animation?: SnackbarAnimation }
    ): Promise<T> => {
      const snackbarId = id ?? Date.now();
      const toastAnimation = options?.animation ?? animation;


      if (!id) {
        setSnackbars((prev) => [
          ...prev,
          {
            id: snackbarId,
            message: messages.loading,
            type: "loading",
            duration: 0,
            progress: undefined,
            animation: toastAnimation,
          },
        ]);
      }

      try {
        const result = await promise;


        removeSnackbar(snackbarId);

        showSnackbar(messages.success, { type: "success", animation: toastAnimation });
        return result;
      } catch (err) {

        removeSnackbar(snackbarId);


        const errorMessage = extractErrorMessage(err, messages.error);
        const errorCode = extractErrorCode(err);
        showSnackbar(errorMessage, errorCode, {
          type: "error",
          animation: toastAnimation,
        });
        throw err;
      }
    },
    [showSnackbar, removeSnackbar, animation]
  );

  const getPositionClasses = () => {
    const base = "fixed z-[99999] p-4 flex flex-col gap-3 pointer-events-none";
    const map: Record<SnackbarPosition, string> = {
      "top-left": "top-4 left-4 items-start",
      "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
      "top-right": "top-4 right-10 items-end",
      "bottom-left": "bottom-4 left-4 items-start flex-col-reverse",
      "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center flex-col-reverse",
      "bottom-right": "bottom-4 right-4 items-end flex-col-reverse",
    };
    return `${base} ${map[position]}`;
  };

  const isBottom = position.startsWith("bottom");

  return (
    <SnackbarContext.Provider
      value={{
        showSnackbar,
        showPromiseSnackbar,
        updateSnackbarProgress,
        hideSnackbar: removeSnackbar,
      }}
    >
      {children}
      <div className={getPositionClasses()}>
        {snackbars.map((snack) => (
          <SnackbarItem
            key={snack.id}
            {...snack}
            fromBottom={isBottom}
            onClose={() => removeSnackbar(snack.id)}
          />
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};

interface SnackbarItemProps extends Snackbar {
  fromBottom: boolean;
  onClose: () => void;
}

const typeStyles = {
  success: {
    border: "border-green-500",
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    text: "text-green-800",
    ring: "ring-green-500/10",
    icon: successImage,
  },
  info: {
    border: "border-blue-500",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    text: "text-blue-800",
    ring: "ring-blue-500/10",
    icon: infoImage,
  },
  warning: {
    border: "border-yellow-500",
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    text: "text-yellow-800",
    ring: "ring-yellow-500/10",
    icon: warningImage,
  },
  error: {
    border: "border-red-500",
    bg: "bg-red-50",
    iconBg: "bg-red-100",
    text: "text-red-800",
    ring: "ring-red-500/10",
    icon: errorImage,
  },
  loading: {
    border: "border-blue-500",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    text: "text-blue-800",
    ring: "ring-blue-500/10",
    icon: "",
  },
};

// Computes the enter/exit classes + easing for each animation preset.
// Kept as one small pure function so adding a new preset later is a
// one-line addition, not a rewrite of the item component.
const getAnimationStyle = (
  animation: SnackbarAnimation,
  fromBottom: boolean,
  show: boolean
): { className: string; style?: React.CSSProperties } => {
  const offset = fromBottom ? "translate-y-3" : "-translate-y-3";

  switch (animation) {
    case "fade":
      return {
        className: [
          "transition-opacity ease-out",
          show ? "duration-300 opacity-100" : "duration-200 opacity-0",
        ].join(" "),
      };

    case "scale":
      return {
        className: [
          "transition-all ease-out",
          show
            ? "duration-250 opacity-100 scale-100"
            : "duration-200 opacity-0 scale-90",
        ].join(" "),
      };

    case "bounce":
      return {
        className: [
          "transition-all",
          show ? "opacity-100 translate-y-0 scale-100" : `opacity-0 scale-90 ${offset}`,
        ].join(" "),
        style: {
          transitionDuration: show ? "420ms" : "180ms",
          transitionTimingFunction: show
            ? "cubic-bezier(0.34, 1.56, 0.64, 1)" // springy overshoot on the way in
            : "cubic-bezier(0.4, 0, 1, 1)", // quick ease-in on the way out
        },
      };

    case "slide":
    default:
      return {
        className: [
          "transition-all ease-out",
          show ? "duration-300" : "duration-200",
          show ? "opacity-100 translate-y-0 scale-100" : `opacity-0 scale-95 ${offset}`,
        ].join(" "),
      };
  }
};

const SnackbarItem: React.FC<SnackbarItemProps> = ({
  message,
  type,
  progress,
  code,
  removing,
  animation = "slide",
  fromBottom,
  onClose,
}) => {
  const { border, bg, iconBg, text, ring, icon } = typeStyles[type];

  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const show = entered && !removing;
  const { className: animationClass, style: animationStyle } = getAnimationStyle(
    animation,
    fromBottom,
    show
  );

  return (
    <div
      style={animationStyle}
      className={[
        "pointer-events-auto flex flex-col min-w-[300px] max-w-sm px-4 py-3",
        "rounded-lg border-l-4 shadow-lg ring-1 backdrop-blur-sm",
        bg,
        border,
        text,
        ring,
        animationClass,
      ].join(" ")}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {type === "loading" ? (
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
          ) : (
            icon && (
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
              >
                <img src={icon} alt="" className="w-4 h-4" />
              </span>
            )
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-snug">{message}</span>

            {code && (
              <span className="text-[11px] mt-0.5 font-mono font-semibold opacity-70 tracking-wide">
                Code: {code}
              </span>
            )}
          </div>
        </div>

        {type !== "loading" && (
          <button
            onClick={onClose}
            aria-label="Dismiss"
            className="ml-4 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-lg leading-none font-bold opacity-60 hover:opacity-100 hover:bg-black/5 transition"
          >
            ×
          </button>
        )}
      </div>

      {/* Progress Bar for loading */}
      {type === "loading" && progress !== undefined && (
        <div className="w-full mt-2.5">
          <div className="w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-blue-700 font-semibold mt-1 inline-block">
            {progress}%
          </span>
        </div>
      )}
    </div>
  );
};