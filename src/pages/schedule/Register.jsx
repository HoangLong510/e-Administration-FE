import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { CreateScheduleAPI,  GetAllScheduleAPI } from "./service"; 

export default function Register() {
  const [courseCode, setCourseCode] = useState("");
  const [course, setCourse] = useState("");
  const [userName, setUserName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "CourseCode":
        setCourseCode(value);
        break;
      case "Course":
        setCourse(value);
        break;
      case "UserName":
        setUserName(value);
        break;
      case "Date":
        setDate(value);
        break;
      case "StartTime":
        setStartTime(value);
        break;
      case "Room":
        setRoom(value);
        break;
      case "Description":
        setDescription(value);
        break;
      case "Duration":
        setDuration(value);
        break;
      default:
        break;
    }
  };

  
  useEffect(() => {
    if (startTime && duration) {
      const startDate = new Date(`2000-01-01T${startTime}:00Z`);
      startDate.setMinutes(startDate.getMinutes() + parseInt(duration, 10));
      setEndTime(startDate.toISOString().substring(11, 16));
    } else {
      setEndTime("");
    }
  }, [startTime, duration]);

  const validateFields = () => {
    const newErrors = {};
    if (!courseCode.trim()) newErrors.CourseCode = "Please enter the course code.";
    if (!course.trim()) newErrors.Course = "Please enter the course name.";
    if (!userName.trim()) newErrors.UserName = "Please enter the instructor name.";
    if (!date.trim()) newErrors.Date = "Please select a date.";
    if (!startTime.trim()) newErrors.StartTime = "Please select a start time.";
    if (!duration) newErrors.Duration = "Please select a duration.";
    if (!room.trim()) newErrors.Room = "Please enter the room.";
    return newErrors;
  };

  useEffect(() => {
    const newErrors = validateFields();
    setErrors(newErrors);
    setIsSubmitDisabled(Object.keys(newErrors).length > 0);
  }, [courseCode, course, userName, date, startTime, duration, room]);

  const [allSchedule ,setAllSchedule] =  useState()
  const handleGetAllSchedule = async () => {
      try {
        const res = await GetAllScheduleAPI();
        const allSchedule = res?.allSchedule || [];
        setAllSchedule(allSchedule)
      } catch (err) {}
    };
    useEffect(() => {
      handleGetAllSchedule();
    }, []);
const handleSubmit = async (event) => {
  event.preventDefault();

  const [year, month, day] = date.split("-");

  const scheduleData = {
    courseCode,
    course,
    userName,
    startTime: `${date}T${startTime}:00Z`,
    endTime: `${date}T${endTime}:00Z`,
    room,
    description,
  };
  try {
    const newStartTime = new Date(year, month - 1, day, ...startTime.split(":"));
    const newEndTime = new Date(year, month - 1, day, ...endTime.split(":"));
    
    let isConflict = false;
    for(let i = 0; i <= allSchedule.length; i++){
      const dataStartTime = allSchedule[i]?.schedule?.startTime;
      const dataEndTime = allSchedule[i]?.schedule?.endTime;
      const existingStartTime = new Date(dataStartTime);
      const existingEndTime = new Date(dataEndTime); 
      if (
        (newStartTime >= existingStartTime && newStartTime < existingEndTime) || 
        (newEndTime > existingStartTime && newEndTime <= existingEndTime) || 
        (newStartTime <= existingStartTime && newEndTime >= existingEndTime) 
      ) {
        isConflict = true;
      }
    }
// Handle conflict result
if (isConflict) {
  alert("This time is already booked. Please choose another time.");
  return;
}

    // If no conflict, submit the schedule
    await CreateScheduleAPI(scheduleData);
    alert("Schedule created successfully!");
  } catch (error) {
    console.error("Error checking schedule conflicts:", error);
    alert("An error occurred while checking or creating the schedule.");
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
                label="Course Code"
                name="CourseCode"
                value={courseCode}
                onChange={handleChange}
                error={!!errors.CourseCode}
                helperText={errors.CourseCode}
              />
            </Grid>
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

            {/* Other Inputs */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instructor Name"
                name="UserName"
                value={userName}
                onChange={handleChange}
                error={!!errors.UserName}
                helperText={errors.UserName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Room"
                name="Room"
                value={room}
                onChange={handleChange}
                error={!!errors.Room}
                helperText={errors.Room}
              />
            </Grid>

            {/* Time Selection */}
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
              <FormControl fullWidth>
                <InputLabel>Duration (Minutes)</InputLabel>
                <Select
                  name="Duration"
                  value={duration}
                  onChange={handleChange}
                  error={!!errors.Duration}
                >
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={60}>60 minutes</MenuItem>
                  <MenuItem value={90}>90 minutes</MenuItem>
                  <MenuItem value={120}>120 minutes</MenuItem>
                </Select>
                {errors.Duration && (
                  <Typography variant="body2" color="error">
                    {errors.Duration}
                  </Typography>
                )}
              </FormControl>
            </Grid>

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
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitDisabled}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
