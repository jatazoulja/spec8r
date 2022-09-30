import * as React from "react";
import Grid from "@mui/material/Grid";
import { useParams, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";

import ServerCreateController from "./Controllers/ServerCreateController";
import ServerListController from "./Controllers/ServerListController";
import { ServersContextProvider } from "./Context/ServersContext";

export default function AlignItemsList() {
  const [openCreateServer, setOpenCreateServer] = React.useState(false);
  let { collectionId } = useParams();
  const location = useLocation();
  const collection = location.state;

  React.useEffect(() => {
    console.log(collectionId);
  }, [collectionId]);

  if (!collectionId) {
    return null;
  }

  return (
    <ServersContextProvider>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <ServerCreateController
            close={() => setOpenCreateServer(false)}
            open={openCreateServer}
            collection={collection}
          />
          <Button size="small" onClick={() => setOpenCreateServer(true)}>
            Add Server
          </Button>
        </Grid>
        <Grid item xs={12}>
          <ServerListController
            collectionId={collectionId}
            collection={collection}
          />
        </Grid>
      </Grid>
    </ServersContextProvider>
  );
}
