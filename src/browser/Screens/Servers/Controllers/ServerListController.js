import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

export default function ServerListController({
  collection,
  selectedServer,
  setSelectedServer,
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setSelectedServer(collection[index]);
  };

  const listServer = collection.map((el, i) => [
    <ListItem
      key={i + el}
      alignItems="flex-start"
      selected={selectedIndex === i}
      onClick={(event) => handleListItemClick(event, i)}
    >
      <ListItemAvatar>
        <Avatar alt={el.name} src="/static/images/avatar/3.jpg" />
      </ListItemAvatar>
      <ListItemText
        primary={el.name}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {el.version}
            </Typography>
            {` PATH: ${el.path}`}
          </React.Fragment>
        }
      />
    </ListItem>,
    <Divider
      key={"divider" + i + el}
      variant="inset"
      component="li"
      hidden={i > collection.length}
    />,
  ]);

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {listServer}
    </List>
  );
}
