import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ResearchList = () => {
  const [articlesList, setArticlesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchArticles = (query = "") => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/summary/research-list`, {
        params: { q: query },
      })
      .then((res) => {
        setArticlesList(res?.data);
      })
      .catch((err) => console.error(err));
  };

  // useLayoutEffect(() => {
  //   window.location('/')
  // }, [third])
  useEffect(() => {
    fetchArticles();
  }, []);

  const extractPdfText = (pdfUrl) => {
    navigate(`/viewer?pdfUrl=${encodeURIComponent(pdfUrl)}`);
  };

  const handleSearch = () => {
    fetchArticles(searchTerm);
  };
  console.log(process.env.REACT_APP_API_URL);
  return (
    <Box sx={{ backgroundColor: "#0F0F0F", color: "#fff", minHeight: "100vh", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Research Articles
      </Typography>

      <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search research articles..."
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: "#1e1e1e",
            borderRadius: 1,
            input: { color: "#fff" },
            fieldset: { borderColor: "#333" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#aaa" }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ backgroundColor: "#4A90E2", fontWeight: "bold" }}
        >
          Search
        </Button>
      </Box>
        
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
  <Grid
    container
    spacing={3}
    justifyContent="center"
    maxWidth="1200px"
  >
    {articlesList?.map((article, index) => (
      <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={index}>
        <Card
          sx={{
            backgroundColor: "#1E1E1E",
            color: "#fff",
            borderRadius: 2,
            width: "300px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {article?.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#aaa" }}>
              Authors: {article?.authors?.join(", ")}
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, color: "#888" }}>
              Published: {new Date(article?.published).toDateString()}
            </Typography>
          </CardContent>
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: "#7C3AED" }}
              onClick={() => extractPdfText(article?.pdfUrl)}
            >
              📄 View Full Paper
            </Button>
          </Box>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>

    </Box>
  );
};

export default ResearchList;
