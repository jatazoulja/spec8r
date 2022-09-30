import * as React from "react";
import _, { orderBy } from "lodash";
const DashboardCollectionContextContext = React.createContext();
const initState = [];

function dashboardCollectionContextReducer(state = initState, actions) {
  const { action, data } = actions;
  switch (action) {
    case "list:collection":
      let sorted = orderBy(data, ["modifiedDate"], ["desc"]);
      sorted.forEach((e) => console.log(e.modifiedDate));
      return [...sorted];
    case "edit:collection":
      let edit = state.map((i) => (i.id === data.id ? data : i));

      return [...edit];
    case "add:collection":
      return [...state, data];
    default:
      return [...data];
  }
}

function DashboardCollectionContextProvider({ children }) {
  const [dashboardCollectionContextState, dashboardCollectionContextDispatch] =
    React.useReducer(dashboardCollectionContextReducer, initState);

  const [isLoading, setIsLoading] = React.useState(false);
  const value = {
    dashboardCollectionContextState,
    dashboardCollectionContextDispatch,
    isLoading,
    setIsLoading,
  };
  return (
    <DashboardCollectionContextContext.Provider value={value}>
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
