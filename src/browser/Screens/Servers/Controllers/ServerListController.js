import * as React from "react";
import Masonry from "@mui/lab/Masonry";

import ServerTerminalController from "./ServerTerminalController";
import ServerEmptyListController from "./ServerEmptyListController";
import { useServersContextContext } from "../Context/ServersContext";
import { listAllServer } from "../Service/ServerService";

export default function ServerListController({ collectionId, collection }) {
  const { serversContextState, serversContextDispatch } =
    useServersContextContext();
  const effectRan = React.useRef(false);
  console.log(collectionId);
  React.useEffect(() => {
    // if (effectRan.current === false) {
    listAllServer(collectionId, serversContextDispatch);
    //   return () => {
    //     effectRan.current = true;
    //   };
    // }
  }, [collectionId]);

  if (serversContextState.data.length === 0) {
    return <ServerEmptyListController collection={collection} />;
  }
  let serverList = serversContextState.data.map((selectedServer, index) => {
    return (
      <ServerTerminalController
        server={selectedServer}
        collectionId={collectionId}
        key={collectionId + "-" + index}
        instanceId={selectedServer.id}
      />
    );
  });
  return (
    <Masonry columns={{ lg: 2, sm: 1 }} spacing={1}>
      {serverList}
    </Masonry>
  );
}
