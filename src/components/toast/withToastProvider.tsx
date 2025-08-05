import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import RenderCompleted from "@/hooks/RenderCompleted";
import ToastContext from "@/context/Toast";
import Toast from "./Toast";

// Create a random ID
function generateUEID() {
  let first: string | number = (Math.random() * 46656) | 0;
  let second: string | number = (Math.random() * 46656) | 0;
  first = ("000" + first.toString(36)).slice(-3);
  second = ("000" + second.toString(36)).slice(-3);

  return first + second;
}

function withToastProvider(Component: any) {
  function WithToastProvider(props: any) {
    const [toasts, setToasts] = useState<any[]>([]);
    const isMounted = RenderCompleted()

    const add = (content: any, color: any) => {
      const id = generateUEID();
      setToasts([...toasts, { id, content, color }]);
    };

    const remove = (id: any) => setToasts(toasts.filter(t => t.id !== id));
    const providerValue = useMemo(() => { return { add, remove } }, [toasts]);

    return isMounted ? (
      <ToastContext.Provider value={ providerValue }>
        <Component {...props} />
        {createPortal(
          <div className="toasts-wrapper">
            { toasts.map(t => (
                <Toast color={t.color} key={t.id} remove={() => remove(t.id)}>
                  {Array.isArray(t.content) ? t.content.join(" - ") : t.content}
                </Toast>
            )) }
          </div>,
          document.body
        )}
      </ToastContext.Provider>
    ) : null;
  }

  return WithToastProvider;
}

export default withToastProvider;