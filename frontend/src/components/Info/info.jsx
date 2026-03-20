import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons';
import './info.css';

const InfoMessage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const userName = JSON.parse(localStorage.getItem("user"))
  const user = {
    name: userName?.name || '',
  };
  const navigate = useNavigate();
  // Extract initials from user's name
  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');      
    localStorage.removeItem('user');       
    localStorage.clear();

    handleClose();
    window.location.href = "/";
    navigate('/')
  };

  const handleSummaries = () => {
    navigate('/user-summaries');
    handleClose();
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Top-right avatar */}
      {
        user.name && (
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton onClick={handleAvatarClick}>
          <Avatar>{getInitials(user.name)}</Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleSummaries}>Summaries</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
        )
      }

      {/* Main content */}
      <div className="card-container">
        <Card className="card">
          <CardContent>
            <div className="header-with-icon">
              <FontAwesomeIcon
                icon={faNewspaper}
                size="4x"
                style={{ marginRight: '16px', color: 'black' }}
              />
              <NavLink to={'/'}><h1>Research Paper Summarizer</h1></NavLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </Box>
  );
};

export default InfoMessage;
