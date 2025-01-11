import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

// Updated seed data with uploader information
const seedData = [
  { id: 1, name: 'Lecture Notes', link: '/downloads/lecture-notes.pdf', uploadDate: '2023-05-15T10:30:00', uploader: 'Dr. Smith' },
  { id: 2, name: 'Assignment 1', link: '/downloads/assignment-1.docx', uploadDate: '2023-05-14T14:45:00', uploader: 'Prof. Johnson' },
  { id: 3, name: 'Course Syllabus', link: '/downloads/syllabus.pdf', uploadDate: '2023-05-13T09:00:00', uploader: 'Dr. Brown' },
  { id: 4, name: 'Research Paper', link: '/downloads/research-paper.pdf', uploadDate: '2023-05-16T11:20:00', uploader: 'Dr. Davis' },
  { id: 5, name: 'Project Guidelines', link: '/downloads/project-guidelines.docx', uploadDate: '2023-05-17T13:15:00', uploader: 'Prof. Wilson' },
];

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    const fetchDocuments = () => {
      setTimeout(() => {
        setDocuments(seedData);
        setLoading(false);
      }, 1000); // Wait for 1 second to simulate loading time
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Admin Document List
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Uploaded Documents
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Uploader</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell align="center">Download</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.uploader}</TableCell>
                  <TableCell>{new Date(doc.uploadDate).toLocaleString()}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" aria-label="download" component="a" href={doc.link} download>
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default DocumentList;

