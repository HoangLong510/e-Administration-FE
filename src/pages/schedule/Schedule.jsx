import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
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
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import GridOn from "@mui/icons-material/GridOn";
import Print from "@mui/icons-material/Print";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { CheckCircle, Cancel, AccessTime } from "@mui/icons-material";
import Register from "./Register";
import { GetAllScheduleAPI } from "./service";
import { format, startOfWeek, endOfWeek } from "date-fns";
import ScheduleFull from "./ScheduleFull";

const Schedule = () => {
  const [years, setYears] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [weeks, setWeeks] = useState([]);
  const [week, setWeek] = useState(startOfWeek(new Date()));
  const [tabValue, setTabValue] = useState(0);
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
    const currentYear = new Date().getFullYear();
    const weekOptions = [];
    let startDate = new Date(year, 0, 1);
    let endDate;
    if (year === currentYear) {
      endDate = new Date();
    } else {
      endDate = new Date(year, 11, 31);
    }
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
    setWeek(event.target.value); //dd/mm-dd/mm
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handlePrevWeek = () => {
    const currentWeekIndex = weeks.indexOf(week);
    if (currentWeekIndex > 0) {
      setWeek(weeks[currentWeekIndex - 1]);
    }
  };

  const canGoNextWeek = weeks.indexOf(week) < weeks.length - 1;

  const handleNextWeek = () => {
    const currentWeekIndex = weeks.indexOf(week);
    if (canGoNextWeek) {
      setWeek(weeks[currentWeekIndex + 1]);
    }
  };
  const handleCurrentWeek = () => {
    //Show year in Dropdown year
    const currentYear = new Date().getFullYear();
    setYear(currentYear);
    //Show week in Dropdown week
    const currentWeek = new Date();
    const formattedDate = format(currentWeek, "dd/MM");

    weeks.forEach((week) => {
      const [Font, Back] = week.split("-");
      const [startDay, startMonth] = Font.split("/");
      const [endDay, endMonth] = Back.split("/");

      const isLeapYear = (year) => {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      };
      if (!isLeapYear(currentYear)) {
        if (parseInt(startMonth) >= 3) {
        }
      }

      const startDate = new Date(
        Date.UTC(currentYear, parseInt(startMonth) - 1, parseInt(startDay))
      );
      const endDate = new Date(
        Date.UTC(currentYear, parseInt(endMonth) - 1, parseInt(endDay))
      );

      const [formattedDay, formattedMonth] = formattedDate.split("/");
      const checkDate = new Date(
        Date.UTC(
          currentYear,
          parseInt(formattedMonth) - 1,
          parseInt(formattedDay)
        )
      );

      if (checkDate >= startDate && checkDate <= endDate) {
        setWeek(week);
      }
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Absent":
        return <Cancel sx={{ color: "red" }} />;
      case "Attended":
        return <CheckCircle sx={{ color: "green" }} />;
      case "Pending":
        return <AccessTime sx={{ color: "orange" }} />;
      default:
        return <Box sx={{ color: "black" }}></Box>;
    }
  };

  const [scheduleData, setScheduleData] = useState([]);

  const handleGetAllSchedule = async () => {
    try {
      const res = await GetAllScheduleAPI();
      const allSchedule = res?.allSchedule || [];
      const filteredSchedules = [];
      for (let i = 0; i < allSchedule.length; i++) {
        const startTime = allSchedule[i]?.schedule?.startTime;
        const date = new Date(startTime);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const [start, end] = week.split("-");
        const [startDay, startMonth] = start.split("/").map(Number);
        const [endDay, endMonth] = end.split("/").map(Number);
        const isInWeek =
          (month > startMonth || (month === startMonth && day >= startDay)) &&
          (month < endMonth || (month === endMonth && day <= endDay));
        if (isInWeek) {
          filteredSchedules.push(allSchedule[i]);
        }
      }
      setScheduleData(filteredSchedules);
    } catch (err) {}
  };
  useEffect(() => {
    handleGetAllSchedule();
  }, [year, week]);

  const notes = [
    {
      status: "Pending",
      description: "Meeting with team",
      color: "orange",
    },
    {
      status: "Completed",
      description: "Submitted project report",
      color: "green",
    },
    {
      status: "Cancelled",
      description: "Weekly sync-up",
      color: "red",
    },
  ];
  return (
    <Box sx={{ p: 2, bgcolor: "#fff", color: "white", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "#f5f5f5",
          p: 1,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        {tabValue === 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "green", fontSize: 25 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowCircleRightIcon sx={{ mr: 1 }} />
                SCHEDULE
              </Box>
            </Typography>
          </Box>
        )}
        {tabValue === 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "green", fontSize: 25 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowCircleRightIcon sx={{ mr: 1 }} />
                SCHEDULE
              </Box>
            </Typography>
          </Box>
        )}
        {tabValue === 2 && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "green", fontSize: 25 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowCircleRightIcon sx={{ mr: 1 }} />
                REGISTER
              </Box>
            </Typography>
          </Box>
        )}
      </Box>

      {/* Tabs  */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mt: 3 }}
      >
        <Tab label="Timetable" />
        <Tab label="Timetable" />
        <Tab label="Register Teaching Schedule" />
      </Tabs>

      {/* Tab Timetable */}
      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
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
              >
                <ArrowBackIos />
              </IconButton>

              <Button
                onClick={() => handleCurrentWeek()}
                variant="outlined"
                sx={{ mr: 1 }}
              >
                <GridOn sx={{ mr: 1 }} />
                Current
              </Button>

              {canGoNextWeek && (
                <IconButton
                  onClick={handleNextWeek}
                  color="primary"
                  aria-label="next week"
                >
                  <ArrowForwardIos />
                </IconButton>
              )}
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
                    Code
                  </TableCell>
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
                    Room
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 17,
                    }}
                  >
                    Day
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
                    Status
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
                      {scheduleItem.schedule.courseCode}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: 17 }}>
                      {scheduleItem.schedule.course}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: 17 }}>
                      {scheduleItem.schedule.room}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: 17 }}>
                      {new Date(
                        scheduleItem.schedule.startTime
                      ).toLocaleDateString()}
                     
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: 17 }}>
                    {new Date(
                        scheduleItem.schedule.startTime
                      ).toLocaleTimeString()}-
                      {new Date(scheduleItem.schedule.endTime).toLocaleTimeString()}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: 17 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {getStatusIcon(scheduleItem.status)}
                        <Typography
                          variant="body2"
                          sx={{ marginLeft: 1, fontSize: 17 }}
                        >
                          {scheduleItem.status}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Ghi chú */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              More note:
            </Typography>
            {notes && notes.length > 0 ? (
              notes.map((note, index) => (
                <Typography key={index} sx={{ color: note.color }}>
                  ({note.status}): huypr7645@gmail.com {note.description}
                </Typography>
              ))
            ) : (
              <Typography sx={{ color: "gray" }}>
                No notes available.
              </Typography>
            )}
          </Box>
          {/* Download button */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary">
              <Print sx={{ mr: 1 }} />
              Download Timetable
            </Button>
          </Box>
        </Box>
      )}
      {tabValue === 1 && (
        <Box sx={{ mt: 3 }}>
          <ScheduleFull />
        </Box>
      )}
      {/* Tab  Register */}
      {tabValue === 2 && (
        <Box sx={{ mt: 3 }}>
          <Register />
        </Box>
      )}
    </Box>
  );
};

export default Schedule;
