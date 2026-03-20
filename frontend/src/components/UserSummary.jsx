import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Modal,
  Box,
  Grid,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: '#1e1e2f',
  color: '#fff',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px'
};

const UserSummaries = () => {
  const [summaries, setSummaries] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (summary) => {
    setSelectedSummary(summary);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchSummaries = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/summary/user-summaries/${user._id}`);
        setSummaries(res.data);
      } catch (err) {
        console.error('Error fetching summaries', err);
      }
    };

    if (user?._id) {
      fetchSummaries();
    }
  }, []);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
        Your Saved Summaries
      </Typography>
      <Grid container spacing={2}>
        {summaries.map((s, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card onClick={() => handleOpen(s)} sx={{ cursor: 'pointer', backgroundColor: '#2b2b3d', color: '#fff' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {s.pdfUrl.split('/').pop()}
                </Typography>
                <Typography variant="body2" noWrap>
                  {s.summary}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
            {/* PDF Link with Icon */}
            {selectedSummary?.pdfUrl && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
                <a
                href={selectedSummary.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#90caf9', textDecoration: 'underline' }}
                >
                Open PDF
                </a>
            </Box>
            )}

            <Typography variant="h6" gutterBottom>
            Full Summary
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
            {selectedSummary?.summary}
            </Typography>
        </Box>
        </Modal>
    </Box>
  );
};

export default UserSummaries;
