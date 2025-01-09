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
    const weekValue = event.target.value;
    setWeek(weekValue);
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
    handleCurrentWeek();
  }, []);
  const [daysOfWeek, setDaysOfWeek] = useState([]);

  useEffect(() => {
    const days = getDaysInWeek(week);
    setDaysOfWeek(days);
  }, [week]);

  const getDaysInWeek = (week) => {
    if (typeof week !== "string") {
      console.error("Week is not a string", week);
      return [];
    }
    const [startRange, endRange] = week.split("-");
    const [startDay, startMonth] = startRange.split("/");
    const [endDay, endMonth] = endRange.split("/");
    const currentYear = new Date().getFullYear();
    const startDate = new Date(
      Date.UTC(currentYear, parseInt(startMonth) - 1, parseInt(startDay))
    );
    const endDate = new Date(
      Date.UTC(currentYear, parseInt(endMonth) - 1, parseInt(endDay))
    );

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}`;
    };

    const days = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      days.push({
        date: formatDate(currentDate),
        dayOfWeek: currentDate.toLocaleString("en-us", { weekday: "long" }),
        week: `${formatDate(startDate)}-${formatDate(endDate)}`,
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
    const [startRange, endRange] = week.split("-");
    const [startDay, startMonth] = startRange.split("/").map(Number);
    const [endDay, endMonth] = endRange.split("/").map(Number);
    const startOfWeek = new Date(Date.UTC(year, startMonth - 1, startDay));
    const endOfWeek = new Date(Date.UTC(year, endMonth - 1, endDay));
    endOfWeek.setHours(23, 59, 59, 999);

    try {
      const schedulePromises = schedules.map(async (schedule) => {
        const ID = schedule?.id;
        let fullname = "Unknown";

        try {
          const ScheduleById = await GetScheduleByIdAPI(ID);
          fullname = ScheduleById?.fullName || "Unknown";
        } catch (err) {
          console.error(`Error fetching fullname for ID ${ID}:`, err);
        }

        const updatedSchedule = {
          ...schedule,
          fullname,
        };

        const startTime = new Date(schedule?.startTime);
        const endTime = new Date(schedule?.endTime);
        const dayKey = startTime.toISOString().split("T")[0]; // YYYY-MM-DD format
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
    } catch (err) {
      console.error("Error processing schedules:", err);
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
    switch (status) {
      case "Past":
        return "red";
      case "Current":
        return "green";
      case "Upcoming":
        return "orange";
      case "-":
        return "grey";
      default:
        return "grey";
    }
  };
  return (
    <>
      <Box sx={{ mt: 3 }}>
        <>
          {/* Box Chức Năng */}
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
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: 17,
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      border: "1px solid #000",
                      padding: "12px",
                      borderRadius: "4px",
                    }}
                  >
                    Slot
                  </TableCell>
                  {daysOfWeek.map((day) => (
                    <TableCell
                      key={day.date}
                      align="center"
                      sx={{
                        backgroundColor: "primary.main",
                        fontSize: 17,
                        color: "#fff",
                        border: "1px solid #000",
                        padding: "16px",
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
                {Array.from({ length: 2 }).map((_, slotIndex) => (
                  <TableRow key={`slot-${slotIndex}`}>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: 17,
                        minWidth: 100,
                        height: 50,
                        border: "1px solid #000",
                        fontWeight: "bold",
                        backgroundColor: "primary.main",
                        color: "#fff",
                      }}
                    >
                      Slot {slotIndex + 1}
                    </TableCell>
                    {daysOfWeek.map((day) => {
                      const formattedDate = `${year}-${
                        day.date.split("/")[1]
                      }-${day.date.split("/")[0]}`;
                      const daySchedule = scheduleData[formattedDate] || [];
                      const slotData = daySchedule[slotIndex];

                      const getStatusColor = (status) => {
                        if (status === "Past") return "red";
                        if (status === "Current") return "orange";
                        if (status === "Upcoming") return "green";
                        return "black";
                      };

                      return (
                        <TableCell
                          key={day.date}
                          align="center"
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
                          }}
                        >
                          <Box sx={{ p: 1, backgroundColor: "#f0f0f0" }}>
                            {slotData ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: 16, mb: 1 }}
                                >
                                  <strong>Course:</strong> {slotData.course}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: 16, mb: 1 }}
                                >
                                  <strong>Lab:</strong> {slotData.lab}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: 16, mb: 1 }}
                                >
                                  <strong>Lecturer:</strong> {slotData.fullname}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: 16, mb: 1 }}
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
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: 16,
                                    color: getStatusColor(slotData.status),
                                  }}
                                >
                                  <strong>Status:</strong> {slotData.status}
                                </Typography>
                              </div>
                            ) : (
                              "-"
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
          {/* Ghi chú */}
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
