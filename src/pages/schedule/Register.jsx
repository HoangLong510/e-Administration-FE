import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import moment from "moment";
import {
  CreateScheduleAPI,
  GetAllClassAPI,
  GetAllLabAPI,
  GetAllScheduleAPI,
} from "./service";
import { useDispatch } from "react-redux";
import { setPopup } from "~/libs/features/popup/popupSlice";
import { useNavigate } from "react-router-dom";

export default function Register({setTabValue}) {
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [allSchedule, setAllSchedule] = useState([]);
  const [allClass, setAllClass] = useState([]);
  const [allLab, setAllLab] = useState([]);
  const [lab, setLab] = useState("");
  const [className, setClassName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGetAllLab = async () => {
    try {
      const res = await GetAllLabAPI();
      if (res.success) {
        const filteredLabs = res.data
          .filter((lab) => lab.status === true)
          .map((lab) => lab.name);
        setAllLab(filteredLabs);
      }
    } catch (error) {}
  };

  const handleGetAllClass = async () => {
    try {
      const res = await GetAllClassAPI();
      if (res.success) {
        const classNames = res.data.map((classItem) => classItem.name);
        setAllClass(classNames);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleGetAllClass();
    handleGetAllLab();
  }, []);

  const handleLabChange = (event) => {
    setLab(event.target.value);
  };

  const handleClassChange = (event) => {
    setClassName(event.target.value);
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
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
      case "Class":
        setClassName(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (startTime) {
      const startMoment = moment(startTime, "HH:mm").format("hh:mm A");
      const startMomentObj = moment(startMoment, "hh:mm A");
      startMomentObj.add(60, "minutes");
      setEndTime(startMomentObj.format("hh:mm A"));
    } else {
      setEndTime("");
    }
  }, [startTime]);

  const validateFields = () => {
    const newErrors = {};
    if (!course.trim()) newErrors.Course = "Please enter the course name.";
    if (!date.trim()) newErrors.Date = "Please select a date.";
    if (!startTime.trim()) newErrors.StartTime = "Please select a start time.";
    if (!lab.trim()) newErrors.Lab = "Please enter the lab.";
    if (!className.trim()) newErrors.Class = "Please enter the class.";
    return newErrors;
  };

  const validateTimeRange = (startTime) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);

    const isBeforeNoon = startDate.getHours() < 12;

    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + 60);

    const maxAllowedDuration =
      (new Date().setHours(22, 0, 0, 0) - startDate) / 60000;

    const endValid = endDate <= new Date().setHours(22, 0, 0, 0);

    let error = "";

    if (isBeforeNoon) {
      if (startDate < new Date().setHours(6, 0, 0, 0)) {
        error = "Start time must be after 06:00 AM.";
      } else if (startDate > new Date().setHours(10, 30, 0, 0)) {
        error = "Start time must be before 10:30 AM.";
      }
    } else {
      if (startDate < new Date().setHours(13, 0, 0, 0)) {
        error = "Start time must be after 01:00 PM.";
      } else if (startDate > new Date().setHours(21, 0, 0, 0)) {
        error = "Start time must be before 09:00 PM.";
      }
    }

    if (!error && 60 > maxAllowedDuration) {
      error = `Duration cannot exceed ${maxAllowedDuration} minutes to ensure the end time is before 10:00 PM.`;
    } else if (!error && !endValid) {
      error = "End time must be before 10:00 PM.";
    }

    return error;
  };

  useEffect(() => {
    const newErrors = validateFields();
    setErrors(newErrors);
    setIsSubmitDisabled(Object.keys(newErrors).length > 0);
  }, [course, date, startTime, lab, className]);

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

    const timeError = validateTimeRange(startTime);
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
    const newEndTime = new Date(newStartTime);
    newEndTime.setMinutes(newStartTime.getMinutes() + 45);

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
    };

    try {
      const res = await CreateScheduleAPI(scheduleData);
      console.log(res);
      if (res.message === "Schedule created successfully.") {
        const dataPopup = {
          type: "success",
          message: `Schedule created successfully!`,
        };
        dispatch(setPopup(dataPopup));
        handleGetAllSchedule();
        setTabValue(0)
      } else {
        const dataPopup = {
          type: "error",
          message: ` ${res.message || "Unknown error"}`,
        };
        dispatch(setPopup(dataPopup));
      }
    } catch (error) {
      const dataPopup = {
        type: "error",
        message: "An error occurred while creating the schedule.",
      };
      dispatch(setPopup(dataPopup));
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

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.Lab}>
                <InputLabel htmlFor="lab-select">Lab</InputLabel>
                <Select
                  value={lab || ""}
                  onChange={handleLabChange}
                  name="Lab"
                  label="Lab"
                  id="lab-select"
                >
                  {allLab.map((labName, index) => (
                    <MenuItem key={index} value={labName}>
                      {labName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.Lab}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.Class}>
                <InputLabel htmlFor="class-select">Class</InputLabel>
                <Select
                  value={className || ""}
                  onChange={handleClassChange}
                  name="Class"
                  label="Class"
                  id="class-select"
                >
                  {allClass.map((className, index) => (
                    <MenuItem key={index} value={className}>
                      {className}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.Class}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Date, Start Time */}
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
                inputProps={{ min: minDate }} 
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
            {/* End Time */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="End Time"
                value={endTime}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label="Description"
                name="Description"
                value={description}
                onChange={handleChange}
                error={!!errors.Description}
                helperText={errors.Description}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button
                type="submit"
                variant="contained"
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
