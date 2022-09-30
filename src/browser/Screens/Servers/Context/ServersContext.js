import * as React from "react";
import _, { orderBy } from "lodash";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ServersContextContext = React.createContext();
const initState = {
  error: false,
  message: "",
  data: [],
};

function serversContextReducer(state = initState, actions) {
  if (actions.error) {
    return { ...state, ...actions };
  }
  const { action, data, message = "" } = actions;
  switch (action) {
    case "list:server":
      let sorted = orderBy(data, ["modifiedDate"], ["desc"]);
      sorted.forEach((e) => console.log(e.modifiedDate));
      return { ...state, message, error: false, data: [...sorted] };
    case "edit:server":
      let edit = state.data.map((i) => (i.id === data.id ? data : i));

      return { ...state, message, error: false, data: [...edit] };
    case "load:json":
      let json = state.data.map((i) => {
        if (i.id !== actions.id) return i;
        console.log(Object.keys(data.scripts));
        return {
          ...i,
          package: data,
          scripts: Object.keys(data.scripts),
        };
      });
      console.log(json);
      return { ...state, message, error: false, data: [...json] };
    case "add:server":
      return {
        ...state,
        message,
        error: false,
        data: [...state.data, data],
      };
    default:
      return { ...state, message, error: false, data: [...data] };
  }
}

function ServersContextProvider({ children }) {
  const [serversContextState, serversContextDispatch] = React.useReducer(
    serversContextReducer,
    initState
  );
  const [open, setOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    setOpen(true);
  }, [serversContextState]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const value = {
    serversContextState,
    serversContextDispatch,
    isLoading,
    setIsLoading,
  };
  return (
    <ServersContextContext.Provider value={value}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          variant="outlined"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          onClose={handleClose}
          severity={serversContextState.error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {serversContextState.message}
        </Alert>
      </Snackbar>
      {children}
    </ServersContextContext.Provider>
  );
}
function useServersContextContext() {
  const context = React.useContext(ServersContextContext);
  if (context === undefined) {
    throw new Error(
      "useServersContextContext must be used within a ServersContextProvider"
    );
  }
  return context;
}
export { ServersContextProvider, useServersContextContext };
