import * as React from "react";
import { orderBy } from "lodash";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DashboardCollectionContextContext = React.createContext();
const initState = {
  error: false,
  message: "",
  data: [],
};

function dashboardCollectionContextReducer(state = initState, actions) {
  if (actions.error) {
    return { ...state, ...actions };
  }
  const { action, data, message = "" } = actions;
  switch (action) {
    case "list:collection":
      let sorted = orderBy(data, ["modifiedDate"], ["desc"]);
      sorted.forEach((e) => console.log(e.modifiedDate));
      return { ...state, message, error: false, data: [...sorted] };
    case "edit:collection":
      let edit = state.data.map((i) => (i.id === data.id ? data : i));

      return { ...state, message, error: false, data: [...edit] };
    case "add:collection":
      return { ...state, message, error: false, data: [...state.data, data] };
    default:
      return { ...state, message, error: false, data: [...data] };
  }
}

function DashboardCollectionContextProvider({ children }) {
  const [dashboardCollectionContextState, dashboardCollectionContextDispatch] =
    React.useReducer(dashboardCollectionContextReducer, initState);
  const [open, setOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    setOpen(true);
  }, [dashboardCollectionContextState]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const value = {
    dashboardCollectionContextState,
    dashboardCollectionContextDispatch,
    isLoading,
    setIsLoading,
  };
  return (
    <DashboardCollectionContextContext.Provider value={value}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          variant="outlined"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          onClose={handleClose}
          severity={dashboardCollectionContextState.error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {dashboardCollectionContextState.message}
        </Alert>
      </Snackbar>
      {children}
    </DashboardCollectionContextContext.Provider>
  );
}
function useDashboardCollectionContextContext() {
  const context = React.useContext(DashboardCollectionContextContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardCollectionContextContext must be used within a DashboardCollectionContextProvider"
    );
  }
  return context;
}
export {
  DashboardCollectionContextProvider,
  useDashboardCollectionContextContext,
};
