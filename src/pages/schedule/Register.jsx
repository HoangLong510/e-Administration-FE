import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import moment from "moment";
import { CreateScheduleAPI, GetAllScheduleAPI } from "./service";

export default function Register() {
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [endTime, setEndTime] = useState("");
  const [lab, setLab] = useState("");
  const [description, setDescription] = useState("");
  const [className, setClassName] = useState("");
  const [attachment, setAttachment] = useState(null); 
  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [allSchedule, setAllSchedule] = useState([]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "Attachment" && files.length > 0) {
      const file = files[0];
  
      const supportedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!supportedTypes.includes(file.type)) {
        console.error("Unsupported file type:", file.type);
        alert("Only PDF or Word documents are supported.");
        return;
      }
  
      const reader = new FileReader();
  
      reader.onloadend = () => {
        if (reader.result) {
          console.log("File successfully read:", reader.result);
          setAttachment(reader.result);
        } else {
          console.error("Failed to read the file. The result is empty.");
        }
      };
  
      reader.onerror = () => {
        console.error("Error reading the file:", reader.error);
      };
  
      reader.readAsDataURL(file); 
    } else {
      switch (name) {
        case "Course":
          setCourse(value);
          break;
        case "Date":
          setDate(value);
          break;
        case "StartTime":
          setStartTime(value);
          break;
        case "Lab":
          setLab(value);
          break;
        case "Description":
          setDescription(value);
          break;
        case "Duration":
          setDuration(value);
          break;
        case "Class":
          setClassName(value);
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (startTime && duration) {
      const startMoment = moment(startTime, "hh:mm A");
      startMoment.add(parseInt(duration, 10), "minutes");
      setEndTime(startMoment.format("hh:mm A"));
    } else {
      setEndTime("");
    }
  }, [startTime, duration]);

  const validateFields = () => {
    const newErrors = {};
    if (!course.trim()) newErrors.Course = "Please enter the course name.";
    if (!date.trim()) newErrors.Date = "Please select a date.";
    if (!startTime.trim()) newErrors.StartTime = "Please select a start time.";
    if (!duration) newErrors.Duration = "Please select a duration.";
    if (!lab.trim()) newErrors.Lab = "Please enter the lab.";
    if (!className.trim()) newErrors.Class = "Please enter the class."; 
    return newErrors;
  };

  const validateTimeRange = (startTime, duration) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);

    const durationInMinutes = parseInt(duration, 10);
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + durationInMinutes);

    const startValid =
      startDate >= new Date().setHours(6, 0, 0, 0) &&
      startDate <= new Date().setHours(20, 0, 0, 0);
    const endValid = endDate <= new Date().setHours(20, 0, 0, 0);

    let error = "";
    if (!startValid) {
      error = "Start time must be between 06:00 AM and 08:00 PM.";
    }
    if (!endValid) {
      error = "End time must be before 08:00 PM.";
    }
    return error;
  };

  useEffect(() => {
    const newErrors = validateFields();
    setErrors(newErrors);
    setIsSubmitDisabled(Object.keys(newErrors).length > 0);
  }, [course, date, startTime, duration, lab, className]); 

  const handleGetAllSchedule = async () => {
    try {
      const res = await GetAllScheduleAPI();
      const allSchedule = res?.allSchedule || [];
      setAllSchedule(allSchedule);
    } catch (err) {
      console.error("Error fetching schedules:", err);
    }
  };

  useEffect(() => {
    handleGetAllSchedule();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const timeError = validateTimeRange(startTime, duration);
    if (timeError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        StartTime: timeError, 
      }));
      return;
    }
  
    const [year, month, day] = date.split("-");
    const [hours, minutes] = startTime.split(":");
  
    const newStartTime = new Date(
      Date.UTC(year, month - 1, day, hours, minutes)
    );
    const durationInMinutes = parseInt(duration, 10);
    const newEndTime = new Date(newStartTime);
    newEndTime.setMinutes(newStartTime.getMinutes() + durationInMinutes);
  
    const endHour = newEndTime.getHours();
    const endMinute = newEndTime.getMinutes();
    if (endHour >= 20 && endMinute > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        EndTime: "End time must be before 08:00 PM.",
      }));
      return;
    }
  
    const scheduleData = {
      course,
      lab,
      class: className,
      startTime: newStartTime.toISOString(),
      endTime: newEndTime.toISOString(),
      attachment,
    };
  
    try {
      const res = await CreateScheduleAPI(scheduleData);
      console.log("API Response:", res); 
      if (res.success) {
        alert("Schedule created successfully!");
        handleGetAllSchedule();
      } else {
        alert(`Error: ${res.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      alert("An error occurred while creating the schedule.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
          Registration Information
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Course Details */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Name"
                name="Course"
                value={course}
                onChange={handleChange}
                error={!!errors.Course}
                helperText={errors.Course}
              />
            </Grid>

            {/* Lab and Class */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lab"
                name="Lab"
                value={lab}
                onChange={handleChange}
                error={!!errors.Lab}
                helperText={errors.Lab}
              />
            </Grid>

            {/* Class Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Class"
                name="Class"
                value={className}
                onChange={handleChange}
                error={!!errors.Class}
                helperText={errors.Class}
              />
            </Grid>

            {/* Date, Start Time, Duration */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="Date"
                value={date}
                onChange={handleChange}
                error={!!errors.Date}
                helperText={errors.Date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                name="StartTime"
                value={startTime}
                onChange={handleChange}
                error={!!errors.StartTime}
                helperText={errors.StartTime}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Duration (Minutes)"
                name="Duration"
                value={duration}
                onChange={handleChange}
                error={!!errors.Duration}
                helperText={errors.Duration}
                type="number"
              />
            </Grid>

            {/* End Time Display */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="End Time"
                value={endTime}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
                error={!!errors.EndTime}
                helperText={errors.EndTime}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="Description"
                value={description}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>

            {/* File Attachment */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <OutlinedInput
                  type="file"
                  name="Attachment"
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitDisabled}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
