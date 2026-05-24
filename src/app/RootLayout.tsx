"use client";

import { ReactNode, useState } from "react";
import { AppStore, makeStore } from "../store/store";
import { Provider } from "react-redux";

type Props = {
  children: ReactNode;
};
export const AppLayout = ({ children }: Props) => {
  const [store] = useState<AppStore>(() => makeStore());
  return (
    <div>
      <Provider store={store}>{children}</Provider>
    </div>
  );
};
