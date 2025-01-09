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
  Button,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import Print from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import Register from "./Register";
import ScheduleFull from "./ScheduleFull";
import { format } from "date-fns";
import {
  GetAllScheduleAPI,
  DeleteScheduleAPI,
  GetSchedulesByLabAPI,
  GetScheduleByFullNameAPI,
  GetScheduleByIdAPI,
} from "./service";

const Schedule = () => {
  const [years, setYears] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [weeks, setWeeks] = useState([]);
  const [week, setWeek] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  const user = useSelector((state) => state.user.value);
  // Generate year options
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = currentYear - 4; i <= currentYear; i++) {
      yearOptions.push(i);
    }
    setYears(yearOptions);
  }, []);
  // Generate week options
  useEffect(() => {
    const weekOptions = [];
    let startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    while (startDate <= endDate) {
      const weekStart = format(startDate, "dd/MM");
      const weekEnd = format(
        new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000),
        "dd/MM"
      );
      weekOptions.push(`${weekStart}-${weekEnd}`);
      startDate.setDate(startDate.getDate() + 7);
    }

    setWeeks(weekOptions);
  }, [year]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleWeekChange = (event) => {
    setWeek(event.target.value);
  };
  const handleYearChange = (event) => {
    setYear(event.target.value);
    setWeek();
  };

  const handlePrevWeek = async () => {
    const currentWeekIndex = weeks.indexOf(week);
    if (currentWeekIndex > 0) {
      setWeek(weeks[currentWeekIndex - 1]);
    }
  };
  const canGoPrevWeek = weeks.indexOf(week) > 0;

  const handleNextWeek = () => {
    const currentWeekIndex = weeks.indexOf(week);
    if (currentWeekIndex < weeks.length - 1) {
      setWeek(weeks[currentWeekIndex + 1]);
    }
  };
  const canGoNextWeek = weeks.indexOf(week) < weeks.length - 1;
  
  const handleCurrentWeek = () => {
    const currentYear = new Date().getFullYear();
    setYear(currentYear);
    const currentDay = new Date();
    const formattedDate = format(currentDay, "dd/MM");

    for (const week of weeks) {
      const [startRange, endRange] = week.split("-");
      const [startDay, startMonth] = startRange.split("/");
      const [endDay, endMonth] = endRange.split("/");
      const startDate = new Date(
        Date.UTC(currentYear, parseInt(startMonth) - 1, parseInt(startDay))
      );

      const endDate = new Date(
        Date.UTC(
          parseInt(endMonth) < parseInt(startMonth)
            ? currentYear + 1
            : currentYear,
          parseInt(endMonth) - 1,
          parseInt(endDay)
        )
      );

      const [currentDay, currentMonth] = formattedDate.split("/");
      const checkDate = new Date(
        Date.UTC(currentYear, parseInt(currentMonth) - 1, parseInt(currentDay))
      );

      if (checkDate >= startDate && checkDate <= endDate) {
        setWeek(week);
        return;
      }
    }
  };
  useEffect(() => {
    handleCurrentWeek()
  }, []);
  const [scheduleData, setScheduleData] = useState([]);

  const handleGetAllSchedule = async () => {
    try {
      const res = await GetAllScheduleAPI();
      const formattedData = formatScheduleData(res || [], year, week);
      setScheduleData(formattedData);
    } catch (err) {
      console.error("Error fetching all schedules:", err);
    }
  };

  const formatScheduleData = async (schedules, year, week) => {
    if (!schedules || !Array.isArray(schedules)) return [];

    const filteredSchedules = [];

    for (const schedule of schedules) {
      const ID = schedule?.id;

      try {
        const ScheduleById = await GetScheduleByIdAPI(ID);
        const fullname = ScheduleById?.fullName || "Unknown";
        const updatedSchedule = {
          ...schedule,
          fullname,
        };
        const startTime = schedule?.startTime;
        const date = new Date(startTime);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const yeardata = date.getFullYear();

        if (yeardata === year) {
          const [start, end] = week ? week.split("-") : [];
          if (!start || !end) continue;

          const [startDay, startMonth] = start.split("/").map(Number);
          const [endDay, endMonth] = end.split("/").map(Number);

          const isInWeek =
            (month > startMonth || (month === startMonth && day >= startDay)) &&
            (month < endMonth || (month === endMonth && day <= endDay));

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

      if (lab.trim()) {
        data = await GetSchedulesByLabAPI(lab);
      } else if (lecturer.trim()) {
        data = await GetScheduleByFullNameAPI(lecturer);
      } else {
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

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this schedule?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await DeleteScheduleAPI(id);
      if (response.success) {
        alert(response.message);
        const updatedScheduleData = scheduleData.filter(
          (schedule) => schedule.id !== id
        );
        setScheduleData(updatedScheduleData);
      } else {
        alert("Failed to delete schedule: " + response.message);
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert(
        "An error occurred while deleting the schedule. Please check the console for details."
      );
    }
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
      {/* Tab Timetable */}
      {tabValue === 0 && user.data.role === "Admin" && (
        <Box sx={{ mt: 3 }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexGrow: 1,
              }}
            >
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  value={year}
                  onChange={handleYearChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Year" }}
                >
                  {years.map((yearOption) => (
                    <MenuItem key={yearOption} value={yearOption}>
                      {yearOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={week}
                  onChange={handleWeekChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Week" }}
                >
                  {weeks.map((weekOption) => (
                    <MenuItem key={weekOption} value={weekOption}>
                      {weekOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={handlePrevWeek}
                  color="primary"
                  aria-label="previous week"
                  disabled={!canGoPrevWeek}
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
                  disabled={!canGoNextWeek}
                >
                  <ArrowRight />
                </IconButton>
              </Box>
            </Box>

            {/* Right side: Input fields */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexGrow: 1,
                justifyContent: "flex-end",
              }}
            >
              <TextField
                id="lab-input"
                label="Lab"
                variant="outlined"
                size="small"
                value={lab}
                onChange={handleLabChange}
                sx={{ flexGrow: 1, maxWidth: 200 }}
              />
              <TextField
                id="lecturer-input"
                label="Lecturer"
                variant="outlined"
                size="small"
                value={lecturer}
                onChange={handleLecturerChange}
                sx={{ flexGrow: 1, maxWidth: 200 }}
              />
            </Box>
          </Box>
          {/* Timetable  */}
          <TableContainer
            component={Paper}
            sx={{ mt: 3, border: "1px solid #e0e0e0", borderRadius: 1 }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 17,
                    }}
                  >
                    Course
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 17,
                    }}
                  >
                    Lab
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 17,
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 17,
                    }}
                  >
                    Time
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 17,
                    }}
                  >
                    Lecturer
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 17,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleData.map((scheduleItem, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      border: "1px solid #ccc",
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <TableCell sx={{ textAlign: "center", fontSize: 17 }}>
                      {scheduleItem.course}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: 17 }}>
                      {scheduleItem.lab}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: 17 }}>
                      {new Date(scheduleItem.startTime).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: 17 }}>
                      {new Date(scheduleItem.startTime).toLocaleTimeString()}-
                      {new Date(scheduleItem.endTime).toLocaleTimeString()}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: 17 }}>
                      {scheduleItem.fullname}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: 17 }}>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(scheduleItem.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Download button */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary">
              <Print sx={{ mr: 1 }} />
              Download Timetable
            </Button>
          </Box>
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
          <Register />
        </Box>
      )}
    </Box>
  );
};

export default Schedule;
