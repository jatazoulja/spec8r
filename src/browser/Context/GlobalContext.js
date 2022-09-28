import * as React from "react";

const GlobalIPCContext = React.createContext();
const initState = {};
window.ipcRenderer.on("list:collection", (event, arg) => {});

function globalIPCReducer(state = initState, action) {}

function GlobalIPCProvider({ children }) {
  const [globalIPCState, globalIPCDispatch] = React.useReducer(
    globalIPCReducer,
    {
      craFailure: [],
    }
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const value = { globalIPCState, globalIPCDispatch, isLoading, setIsLoading };
  return (
    <GlobalIPCContext.Provider value={value}>
      {children}
    </GlobalIPCContext.Provider>
  );
}
function useGlobalIPCContext() {
  const context = React.useContext(GlobalIPCContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalIPCContext must be used within a GlobalIPCProvider"
    );
  }
  return context;
}
export { GlobalIPCProvider, useGlobalIPCContext };
