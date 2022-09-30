const { ipcRenderer } = window;

export async function listAllServer(collectionId, dispatch) {
  const response = await ipcRenderer.sendSync("Servers", {
    action: "list:server",
    data: { collectionId },
  });
  console.log(response);
  dispatch(response);
}
export async function loadServerJson(server, dispatch) {
  const { path, id } = server;
  const json = await ipcRenderer.sendSync("Servers", {
    action: "load:json",
    data: { filepath: path },
  });
  dispatch({ ...json, id });
}

export async function addServer(collectionId, data, dispatch) {
  const response = await ipcRenderer.sendSync("Servers", {
    action: "add:server",
    data: data,
    collectionId,
  });
  console.log({ response });
  dispatch({
    ...response,
    message: response.message || `${data.name} added as server`,
  });
}
