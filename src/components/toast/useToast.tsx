import React, { useContext } from "react";
import ToastContext from "@/context/Toast";

function useToast() {
  const context: any = useContext(ToastContext);

  return { add: context.add, color: context.color, remove: context.remove };
}

export default useToast;