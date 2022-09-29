import * as React from "react";
import Grid from "@mui/material/Grid";
import { useParams, useLocation } from "react-router-dom";
import Masonry from "@mui/lab/Masonry";
import Button from "@mui/material/Button";

import ServerCreateController from "./Controllers/ServerCreateController";
import ServerEmptyListController from "./Controllers/ServerEmptyListController";
import ServerTerminalController from "./Controllers/ServerTerminalController";
export default function AlignItemsList() {
  const [openCreateServer, setOpenCreateServer] = React.useState(false);
  let { collectionId } = useParams();
  const location = useLocation();
  const collection = location.state;
  // const [selectedServer, setSelectedServer] = React.useState({});
  if (!collectionId) {
    return null;
  }
  console.log(collection);
  if (!Object.keys(collection).includes("servers")) {
    return <ServerEmptyListController collection={collection} />;
  }
  return (
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
        <Masonry columns={{ lg: 2, sm: 1 }} spacing={1}>
          {collection.servers.map((selectedServer, index) => (
            <ServerTerminalController
              server={selectedServer}
              collectionId={collectionId}
              key={collectionId + "-" + index}
              instanceId={collectionId + "-" + index}
            />
          ))}
        </Masonry>
      </Grid>
    </Grid>
  );
  // return (
  //   <>
  //     <Grid container spacing={1}>
  //       <Grid item xs={12} md={4} lg={3}>
  //         <Paper
  //           sx={{
  //             p: 2,
  //             display: "flex",
  //             flexDirection: "column",
  //           }}
  //         >
  //           <ServerListController
  //             collection={collection.servers}
  //             selectedServer={selectedServer}
  //             setSelectedServer={setSelectedServer}
  //           />
  //         </Paper>
  //       </Grid>
  //       <Grid item xs={12} md={8} lg={9}>
  //         <Paper
  //           sx={{
  //             p: 2,
  //             display: "flex",
  //             flexDirection: "column",
  //           }}
  //         >
  //           <ServerTerminalController server={selectedServer} />
  //         </Paper>
  //       </Grid>
  //     </Grid>
  //   </>
  // );
}
