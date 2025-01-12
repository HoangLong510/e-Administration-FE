import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
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
} from "@mui/material";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import Print from "@mui/icons-material/Print";
import {
  GetAllScheduleAPI,
  GetScheduleByIdAPI,
  ExportSchedulesToExcelAPI,
} from "./service";
import { format } from "date-fns";
import { useSelector } from "react-redux";

export default function ScheduleFull() {
  const user = useSelector((state) => state.user.value);
  const [years, setYears] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [weeks, setWeeks] = useState([]);
  const [week, setWeek] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  // Generate year options
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = currentYear - 4; i <= currentYear + 2; i++) {
      yearOptions.push(i);
    }
    setYears(yearOptions);
  }, []);
  // Generate week options
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
      //weekOptions: {label: dd/mm/yyyy-dd/mm/yyyy, startDate: DateTime(), endDate: DateTime()}
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
    }
  };

  useEffect(() => {
    handleCurrentWeek();
  }, []);

  const [daysOfWeek, setDaysOfWeek] = useState([]);
  useEffect(() => {
    const days = getDaysInWeek(week);
    setDaysOfWeek(days);
  }, [week]);

  const getDaysInWeek = (week) => {
    if (!week || !week.startDate || !week.endDate) {
      return [];
    }

    const days = [];
    const startDate = new Date(week.startDate);
    const endDate = new Date(week.endDate);

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      days.push({
        date: format(currentDate, "dd/MM/yyyy"),
        dayOfWeek: currentDate.toLocaleString("en-us", { weekday: "long" }),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const [scheduleData, setScheduleData] = useState({});

  const handleGetAllSchedule = async () => {
    try {
      const res = await GetAllScheduleAPI();
      const formattedData = await formatScheduleData(res || [], year, week);

      setScheduleData(formattedData);
    } catch (err) {
    }
  };

  useEffect(() => {
    
    handleGetAllSchedule();
  }, [week, year]);

  const formatScheduleData = async (schedules, year, week) => {
    if (!schedules || !Array.isArray(schedules)) return {};
  
    const groupedSchedules = {};
  
    const startOfWeek = new Date(week.startDate);
    const endOfWeek = new Date(week.endDate);
    endOfWeek.setHours(23, 59, 59, 999);
  
    try {
      const schedulePromises = schedules.map(async (schedule) => {
        const ID = schedule?.id;
        let fullname = "Unknown";
  
        try {
          const ScheduleById = await GetScheduleByIdAPI(ID);
          fullname = ScheduleById?.fullName || "Unknown";
        } catch (err) {
        }
  
        const updatedSchedule = {
          ...schedule,
          fullname,
        };
  
        const startTime = new Date(schedule?.startTime);
        const endTime = new Date(schedule?.endTime);
        const dayKey = format(startTime, "dd/MM/yyyy");
  
        if (startTime >= startOfWeek && endTime <= endOfWeek) {
          if (!groupedSchedules[dayKey]) {
            groupedSchedules[dayKey] = [];
          }
  
          const status = getStatus(startTime, endTime);
          updatedSchedule.status = status;
  
          groupedSchedules[dayKey].push(updatedSchedule);
        }
      });
  
      await Promise.all(schedulePromises);
  
      for (let day in groupedSchedules) {
        groupedSchedules[day].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      }
    } catch (err) {
    }
  
    return groupedSchedules;
  };

  const getStatus = (startTime, endTime) => {
    const currentDate = new Date();

    if (endTime < currentDate) {
      return "Past";
    }

    if (
      startTime.toDateString() === currentDate.toDateString() &&
      startTime <= currentDate &&
      currentDate <= endTime
    ) {
      return "Current";
    }

    return "Upcoming";
  };

  const handleExport = () => {
    ExportSchedulesToExcelAPI(user.data.id);
  };
  const getStatusDescription = (status, fullName) => {
    switch (status) {
      case "Past":
        return `The class of ${fullName} has ended.`;
      case "Current":
        return `The class of ${fullName} is happening now.`;
      case "Upcoming":
        return `The class of ${fullName} will take place soon.`;
      case "-":
        return "No content available for this activity.";
      default:
        return "No data was provided for this activity.";
    }
  };

  const getColorForStatus = (status) => {
    const statusColors = {
      Past: "red",
      Current: "green",
      Upcoming: "orange",
      "-": "grey",
    };

    return statusColors[status] || "grey";
  };

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <>
          {/* Toolbar */}
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
          </Grid>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: 17,
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      border: "1px solid #000",
                      padding: "12px",
                      borderRadius: "4px",
                      textAlign: "center",
                    }}
                  >
                    Slot
                  </TableCell>
                  {daysOfWeek.map((day) => (
                    <TableCell
                      key={day.date}
                      sx={{
                        backgroundColor: "primary.main",
                        fontSize: 17,
                        color: "#fff",
                        border: "1px solid #000",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    >
                      {day.dayOfWeek}
                      <br />
                      {day.date}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {Array.from({
                  length: Math.max(
                    ...daysOfWeek.map(
                      (day) => scheduleData[day.date]?.length || 0
                    )
                  ),
                }).map((_, slotIndex) => (
                  <TableRow key={`slot-${slotIndex}`}>
                    <TableCell
                      sx={{
                        fontSize: 17,
                        minWidth: 100,
                        height: 50,
                        border: "1px solid #000",
                        fontWeight: "bold",
                        backgroundColor: "primary.main",
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      Slot {slotIndex + 1}
                    </TableCell>

                    {daysOfWeek.map((day) => {
                      const formattedDate = day.date;
                      const daySchedule = scheduleData[formattedDate] || [];
                      const slotData = daySchedule[slotIndex];

                      return (
                        <TableCell
                          key={day.date}
                          sx={{
                            minWidth: 190,
                            height: 150,
                            fontSize: 15,
                            border: "1px solid #ccc",
                            "&:hover": {
                              backgroundColor: "#d3d3d3",
                              cursor: "pointer",
                            },
                            backgroundColor: "#fafafa",
                            textAlign: "left",
                          }}
                        >
                          <Box sx={{ p: 1, backgroundColor: "#f0f0f0" }}>
                            {slotData ? (
                              <Grid
                                container
                                direction="column"
                                alignItems="flex-start"
                                spacing={1}
                              >
                                <Grid item sx={{ minWidth: "250px" }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: 16 }}
                                  >
                                    <strong>Course:</strong> {slotData.course}
                                  </Typography>
                                </Grid>
                                <Grid item sx={{ minWidth: "250px" }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: 16 }}
                                  >
                                    <strong>Lab:</strong> {slotData.lab}
                                  </Typography>
                                </Grid>
                                {user.data.role === "Student" && (
                                  <Grid item sx={{ minWidth: "250px" }}>
                                    <Typography
                                      variant="body2"
                                      sx={{ fontSize: 16 }}
                                    >
                                      <strong>Lecturer:</strong>{" "}
                                      {slotData.fullname}
                                    </Typography>
                                  </Grid>
                                )}
                                <Grid item sx={{ minWidth: "250px" }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: 16 }}
                                  >
                                    <strong>Time:</strong>{" "}
                                    {new Date(
                                      slotData.startTime
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {new Date(
                                      slotData.endTime
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </Typography>
                                </Grid>
                                <Grid item sx={{ minWidth: "250px" }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: 16,
                                      color: getColorForStatus(slotData.status),
                                    }}
                                  >
                                    <strong>Status:</strong> {slotData.status}
                                  </Typography>
                                </Grid>
                              </Grid>
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{ fontSize: 16, textAlign: "center" }}
                              >
                                -
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Notes */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              More note:
            </Typography>
            {["Past", "Current", "Upcoming", "-"].map((status) => {
              const description = getStatusDescription(
                status,
                user.data.fullName
              );
              const color = getColorForStatus(status);

              return (
                <Typography key={status} sx={{ color }}>
                  ({status}): {description}
                </Typography>
              );
            })}
          </Box>

          {/* Download button */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary" onClick={handleExport}>
              <Print sx={{ mr: 1 }} />
              Export Schedules to Excel
            </Button>
          </Box>
        </>
      </Box>
    </>
  );
}
