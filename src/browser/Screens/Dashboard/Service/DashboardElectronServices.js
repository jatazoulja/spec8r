const { ipcRenderer } = window;

export async function listAllCollections(dispatch) {
  const response = await ipcRenderer.sendSync("ListCollection", {
    action: "list:collection",
    data: {},
  });
  dispatch(response);
}

export async function setFavorite(data, dispatch) {
  const response = await ipcRenderer.sendSync("ListCollection", {
    action: "edit:collection",
    data: data,
  });
  dispatch(response);
}
