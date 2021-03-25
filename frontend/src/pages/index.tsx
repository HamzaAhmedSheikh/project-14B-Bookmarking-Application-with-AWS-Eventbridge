import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import shortId from "shortid";

const MyStyle = makeStyles(() => ({
  mainContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },

  formContainer: {
    background: "#f3f3f3",
    width: "100%",
    maxWidth: "600px",
    borderRadius: "5px",
    marginTop: "35px",
  },

  contentWrapper: {
    width: "100%",
    maxWidth: "600px",
    marginTop: "20px",
  },

  Datalist: {
    background: "#f1f1f1",
    padding: "10px 20px",
    marginBottom: "4px",
  },

  loadingWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    height: "100px",
  },

  title: {
    flexGrow: 1,
    textAlign: "center",
    fontSize: "30px",
  },
}));

const BookMarksQuery = gql`
  {
    allBookmarks {
      id
      url
      description
    }
  }
`;

const AddBookMarkMutation = gql`
  mutation createBookmark($id: String!, $url: String!, $description: String!) {
    createBookmark(
      newBookmark: { id: $id, url: $url, description: $description }
    ) {
      result
    }
  }
`;

const deleteBookmark = gql`
  mutation deleteBookmark($id: String!) {
    deleteBookmark(id: $id) {
      result
    }
  }
`;

export type bookmark = {
  id: string;
  text: string;
  link: string;
};

function BookmarkApp() {
  const classes = MyStyle();
  const [url, setURL] = useState<any>();
  const [description, setDescription] = useState<any>();
  const [sendLoading, setLoading] = useState(false);
  const { loading, error, data } = useQuery(BookMarksQuery);
  const [addBookmark] = useMutation(AddBookMarkMutation);
  const [deleteTask] = useMutation(deleteBookmark);

  console.log("dataaa ==> ", data);

  if (loading) return "loading.....";

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    let data = addBookmark({
      variables: {
        id: shortId.generate(),
        url: url,
        description: description,
      },

      refetchQueries: [{ query: BookMarksQuery }],
    });

    console.log("dataaaa ==> ", data);

    setURL("");
    setDescription("");
    setLoading(false);
  };

  const handleDelete = (id: any) => {
    let deleteBookmark = deleteTask({
      variables: {
        id: id,
      },

      refetchQueries: [{ query: BookMarksQuery }],
    });

    console.log("deleteBookmark ===> ", deleteBookmark);
  };

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Bookmark Application
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <div className={classes.mainContainer}>
          <div className={classes.formContainer}>
            <Box p={4}>
              <form>
                <Box pb={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={url}
                    onChange={({ target }) => setURL(target.value)}
                    label="URL"
                    name="url"
                  />
                </Box>

                <Box pb={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={description}
                    onChange={({ target }) => setDescription(target.value)}
                    label="description"
                    name="description"
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={onSubmit}
                >
                  {!sendLoading ? "Add" : "Loading"}
                </Button>
              </form>
            </Box>
          </div>
        </div>
      </Container>

      <div className="data-container">
        <Grid className="card-container" alignItems="center">
          {data &&
            data.allBookmarks.map((d) => (
              <Grid
                key={d.id}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="dataList">
                  <div className="listBtn">
                    <h3> {d.description} </h3>
                    <Delete
                      className="deletebtn"
                      onClick={() => handleDelete(d.id)}
                    />
                  </div>

                  <div>
                    <a
                      href={d.url}
                      className="title"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {" "}
                      view my bookmark.{" "}
                    </a>
                  </div>
                </div>
              </Grid>
            ))}
        </Grid>
      </div>
    </div>
  );
}

export default BookmarkApp;
