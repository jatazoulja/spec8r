const { ipcRenderer } = window;

export async function listAllCollections(dispatch) {
  const response = await ipcRenderer.sendSync("Collection", {
    action: "list:collection",
    data: {},
  });
  dispatch(response);
}

export async function setFavorite(data, dispatch) {
  const response = await ipcRenderer.sendSync("Collection", {
    action: "edit:collection",
    data: data,
  });
  console.log(response);
  dispatch(response);
}
export async function setArchived(data, dispatch) {
  const response = await ipcRenderer.sendSync("Collection", {
    action: "edit:collection",
    data: data,
  });
  console.log(response);
  dispatch(response);
}
export async function addCollection(data, dispatch) {
  const response = await ipcRenderer.sendSync("Collection", {
    action: "add:collection",
    data: data,
  });
  console.log(response);
  dispatch(response);
}
