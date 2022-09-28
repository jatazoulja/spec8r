import * as React from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import Empty from "#ui-assets/empty.png";
import ServerCreateController from "./ServerCreateController";
export default function ServerEmptyListController({ collection }) {
  const [openCreateServer, setOpenCreateServer] = React.useState(false);

  return (
    <Container fixed style={{ textAlign: "Center" }}>
      <ServerCreateController
        close={() => setOpenCreateServer(false)}
        open={openCreateServer}
        collection={collection}
      />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <Card
            sx={{ maxWidth: 300 }}
            xl={{ maxWidth: 300 }}
            md={{ maxWidth: 300 }}
            lg={{ maxWidth: 300 }}
          >
            <CardContent>
              <img src={Empty} alt="Empty" />
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => setOpenCreateServer(true)}>
                Add Server
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
