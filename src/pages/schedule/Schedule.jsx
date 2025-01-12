import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Button,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { setPopup } from "~/libs/features/popup/popupSlice";
import { format } from "date-fns";
import {
  GetAllScheduleAPI,
  DeleteScheduleAPI,
  GetSchedulesByLabAPI,
  GetScheduleByFullNameAPI,
  GetScheduleByIdAPI,
  GetScheduleByConditionAPI,
} from "./service";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ScheduleFull from "./ScheduleFull";
import Register from "./Register";

const Schedule = () => {
  const [years, setYears] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [weeks, setWeeks] = useState([]);
  const [week, setWeek] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  
  const user = useSelector((state) => state.user.value);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = currentYear - 4; i <= currentYear + 2; i++) {
      yearOptions.push(i);
    }
    setYears(yearOptions);
  }, []);

  const generateWeeksForYear = (year) => {
    const weekOptions = [];
    let startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const dayOfWeek = startDate.getDay();
    if (dayOfWeek !== 0) {
      startDate.setDate(startDate.getDate() - dayOfWeek);
    }

    while (startDate <= endDate) {
      const weekStart = format(startDate, "dd/MM/yyyy");
      const weekEnd = format(
        new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000),
        "dd/MM/yyyy"
      );
      weekOptions.push({
        label: `${weekStart} - ${weekEnd}`,
        startDate: new Date(startDate),
        endDate: new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000),
      });
      startDate.setDate(startDate.getDate() + 7);
    }
    return weekOptions;
  };

  useEffect(() => {
    const weeksForYear = generateWeeksForYear(year);
    setWeeks(weeksForYear);
  }, [year]);

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setYear(newYear);
    setWeeks(generateWeeksForYear(newYear));
    setWeek("");
  };

  const handleWeekChange = (event) => {
    const selectedWeek = weeks.find((w) => w.label === event.target.value);
    if (selectedWeek) {
      setWeek(selectedWeek);
    }
  };

  const handlePrevWeek = () => {
    const currentIndex = weeks.findIndex((w) => w.label === week.label);
    if (currentIndex > 0) {
      setWeek(weeks[currentIndex - 1]);
    } else {
      const prevYear = year - 1;
      const prevYearWeeks = generateWeeksForYear(prevYear);
      setYear(prevYear);
      setWeeks(prevYearWeeks);
      setWeek(prevYearWeeks[prevYearWeeks.length - 2]);
    }
  };

  const handleNextWeek = () => {
    const currentIndex = weeks.findIndex((w) => w.label === week.label);
    if (currentIndex < weeks.length - 1) {
      setWeek(weeks[currentIndex + 1]);
    } else {
      const nextYear = year + 1;
      const nextYearWeeks = generateWeeksForYear(nextYear);
      setYear(nextYear);
      setWeeks(nextYearWeeks);
      setWeek(nextYearWeeks[1]);
    }
  };

  const handleCurrentWeek = () => {
    const currentYear = new Date().getFullYear();
    const currentDay = new Date();
    const currentDayOnly = new Date(
      currentDay.getFullYear(),
      currentDay.getMonth(),
      currentDay.getDate()
    );
    const currentYearWeeks = generateWeeksForYear(currentYear);
    let foundCurrentWeek = false;
    for (const week of currentYearWeeks) {
      const startDate = new Date(week.startDate);
      const endDate = new Date(week.endDate);
      const startDateOnly = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      const endDateOnly = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );
      if (currentDayOnly >= startDateOnly && currentDayOnly <= endDateOnly) {
        setYear(currentYear);
        setWeeks(currentYearWeeks);
        setWeek(week);
        foundCurrentWeek = true;
        break;
      }
    }
    if (!foundCurrentWeek) {
      console.error("Current week not found in generated weeks.");
    }
  };

  useEffect(() => {
    handleCurrentWeek();
  }, []);

  const [scheduleData, setScheduleData] = useState([]);

  const handleGetAllSchedule = async () => {
    try {
      const res = await GetAllScheduleAPI();
      const formattedData = await formatScheduleData(res || [], year, week);
      setScheduleData(formattedData);
    } catch (err) {
      console.error("Error fetching all schedules:", err);
    }
  };
  useEffect(() => {
    handleGetAllSchedule();
  }, []);

  const formatScheduleData = async (schedules, year, week) => {
    if (!schedules || !Array.isArray(schedules)) return [];
    const filteredSchedules = [];
    const startOfWeek = new Date(week.startDate);
    const endOfWeek = new Date(week.endDate);
    endOfWeek.setHours(23, 59, 59, 999);
    for (const schedule of schedules) {
      const ID = schedule?.id;
      try {
        const ScheduleById = await GetScheduleByIdAPI(ID);
        const fullname = ScheduleById?.fullName || "Unknown";
        const updatedSchedule = { ...schedule, fullname };
        const startTime = schedule?.startTime;
        const date = new Date(startTime);
        const yeardata = date.getFullYear();
        if (yeardata === year) {
          const scheduleDate = new Date(startTime);
          const isInWeek =
            scheduleDate >= startOfWeek && scheduleDate <= endOfWeek;
          if (isInWeek) {
            filteredSchedules.push(updatedSchedule);
          }
        }
      } catch (err) {
        console.error(`Error fetching fullname for ID ${ID}:`, err);
      }
    }
    return filteredSchedules;
  };

  const [lab, setLab] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [error, setError] = useState(null);

  const fetchSchedules = async () => {
    try {
      let data;
      if (lab.trim() && lecturer.trim()) {
        data = await GetScheduleByConditionAPI(lecturer, lab);
      }
      else if (lab.trim()) {
        data = await GetSchedulesByLabAPI(lab);
      }
      else if (lecturer.trim()) {
        data = await GetScheduleByFullNameAPI(lecturer);
      }
      else {
        data = await GetAllScheduleAPI();
      }
      if (data) {
        const formattedData = await formatScheduleData(data, year, week);
        setScheduleData(formattedData);
      } else {
        setScheduleData([]);
      }
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Error fetching schedules");
    }
  };
  
  useEffect(() => {
    fetchSchedules();
  }, [lab, lecturer, year, week]);
  
  const handleLabChange = (event) => {
    setLab(event.target.value);
  };
  
  const handleLecturerChange = (event) => {
    setLecturer(event.target.value);
  };
  //Delete
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  const dispatch = useDispatch();

  const handleOpenDeleteDialog = (id) => {
    setScheduleToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setScheduleToDelete(null);
    setOpenDeleteDialog(false);
  };
  const DeleteConfirmationDialog = ({ open, onClose, onConfirm }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this schedule? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const handleDelete = async () => {
    if (scheduleToDelete) {
      try {
        const response = await DeleteScheduleAPI(scheduleToDelete);
        console.log(response)
        if (response.success) {
          const dataPopup = {
            type: "success",
            message: ` Deleted successfully!`,
          };
          dispatch(setPopup(dataPopup));
          const updatedScheduleData = scheduleData.filter(
            (schedule) => schedule.id !== scheduleToDelete
          );
          setScheduleData(updatedScheduleData);
        } else {
          const dataPopup = {
            type: "error",
            message: ` Failed to delete` + response.message,
          };
          dispatch(setPopup(dataPopup));
        }
      } catch (error) {
        console.error("Error deleting schedule:", error);
        alert(
          "An error occurred while deleting the schedule. Please check the console for details."
        );
      }
    }
    handleCloseDeleteDialog();
  };

  return (
    <Box sx={{ p: 2, bgcolor: "#fff", color: "white", minHeight: "100vh" }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mt: 3 }}
      >
        {(user.data.role === "Admin") 
        && (<Tab label="Schedule List" />)}
        {(user.data.role === "Student" || user.data.role === "Instructor") 
        && (<Tab label="Timetable" />)}
        {user.data.role === "Instructor" 
        && (<Tab label="Register Teaching Schedule" />)}
      </Tabs>
      {tabValue === 0 && user.data.role === "Admin" && (
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={7} md={5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={year}
                  onChange={handleYearChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Year" }}
                >
                  {years.slice(0, 10).map((yearOption) => (
                    <MenuItem key={yearOption} value={yearOption}>
                      {yearOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 300 }}>
                <Select
                  value={week?.label || ""}
                  onChange={handleWeekChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Week" }}
                >
                  {weeks.map((weekOption) => (
                    <MenuItem key={weekOption.label} value={weekOption.label}>
                      {weekOption.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={handlePrevWeek}
                  color="primary"
                  aria-label="previous week"
                >
                  <ArrowLeft />
                </IconButton>
                <Button
                  onClick={handleCurrentWeek}
                  variant="outlined"
                  size="small"
                  startIcon={<LayoutGrid />}
                >
                  Current
                </Button>
                <IconButton
                  onClick={handleNextWeek}
                  color="primary"
                  aria-label="next week"
                >
                  <ArrowRight />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={5} md={7}>
            {/* Align inputs to the right */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2,
              }}
            >
              <TextField
                id="lab-input"
                label="Lab"
                variant="outlined"
                size="small"
                value={lab}
                onChange={handleLabChange}
                sx={{ maxWidth: 200 }}
              />
              <TextField
                id="lecturer-input"
                label="Lecturer"
                variant="outlined"
                size="small"
                value={lecturer}
                onChange={handleLecturerChange}
                sx={{ maxWidth: 200 }}
              />
            </Box>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Lab</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Lecturer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduleData.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.course}</TableCell>
                  <TableCell>{schedule.lab}</TableCell>
                  <TableCell>{schedule.class}</TableCell>
                  <TableCell>{schedule.fullname}</TableCell>
                  <TableCell>
                    {new Date(schedule.startTime).toLocaleDateString()} -{" "}
                    {new Date(schedule.endTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(schedule.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -
                    {new Date(schedule.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpenDeleteDialog(schedule.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <DeleteConfirmationDialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDelete}
        />
      </Box>
      )}
      {tabValue === 0 &&
        (user.data.role === "Student" || user.data.role === "Instructor") && (
          <Box sx={{ mt: 3 }}>
            <ScheduleFull />
          </Box>
        )}
      {/* Tab  Register */}
      {tabValue === 1 && user.data.role === "Instructor" && (
        <Box sx={{ mt: 3 }}>
          <Register setTabValue={setTabValue} />
        </Box>
      )}
    </Box>
  );
};

export default Schedule;
