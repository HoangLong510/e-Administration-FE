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
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import GridOn from "@mui/icons-material/GridOn";
import Print from "@mui/icons-material/Print";
import { CheckCircle, Cancel, AccessTime } from "@mui/icons-material";
import { GetAllScheduleAPI } from "./service";
import { format, startOfWeek } from "date-fns";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default function ScheduleFull() {
  const user = useSelector((state) => state.user.value);

  const [years, setYears] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [weeks, setWeeks] = useState([]);
  const [week, setWeek] = useState(startOfWeek(new Date())); //"Sun Dec 15 2024 00:00:00 GMT+0700 (Indochina Time)"
  const [showWeek, setShowWeek] = useState();
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

  const handleWeekChange = (event) => {
    //dd/mm-dd/mm
    const [Font, Back] = event.target.value.split("-");
    const [startDay, startMonth] = Font.split("/");
    const firstofWeek = new Date(
      Date.UTC(year, parseInt(startMonth) - 1, parseInt(startDay))
    );
    const formatdow = firstofWeek.toString();
    setWeek(formatdow);
    setShowWeek(event.target.value);
    console.log(event.target.value)
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handlePrevWeek = () => {
    const currentWeekIndex = weeks.indexOf(showWeek);
    if (currentWeekIndex > 0) {
      const currentYear = new Date().getFullYear();
      const a = weeks[currentWeekIndex - 1];
      const [Font, Back] = a.split("-");
      const [startDay, startMonth] = Font.split("/");
      const FOSelectweek = new Date(
        Date.UTC(currentYear, parseInt(startMonth) - 1, parseInt(startDay))
      );
      setWeek(FOSelectweek);
      setShowWeek(weeks[currentWeekIndex - 1]);
    }
  };

  const canGoNextWeek = weeks.indexOf(showWeek) < weeks.length - 1;

  const handleNextWeek = () => {
    const currentWeekIndex = weeks.indexOf(showWeek);

    if (canGoNextWeek) {
      const currentYear = new Date().getFullYear();
      const a = weeks[currentWeekIndex + 1];
      const [Font, Back] = a.split("-");
      const [startDay, startMonth] = Font.split("/");
      const FOSelectweek = new Date(
        Date.UTC(currentYear, parseInt(startMonth) - 1, parseInt(startDay))
      );
      setWeek(FOSelectweek);
      setShowWeek(weeks[currentWeekIndex + 1]);
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
        const startOfWeek = new Date(startDate);
        const dayOfWeek = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - dayOfWeek;
        startOfWeek.setDate(diff);
        startOfWeek.setDate(startOfWeek.getDate() + 1);
        setWeek(startOfWeek);
        setShowWeek(week);
        console.log(week)
      }
    });
  };
  useEffect(() => {}, [showWeek]);

  const notes = [
    {
      status: "Pending",
      description: "no data was given",
      color: "orange",
    },
    {
      status: "Attended",
      description: "had attended this activity ",
      color: "green",
    },
    {
      status: "Absent",
      description: " had NOT attended this activity",
      color: "red",
    },
    {
      status: "-",
      description: "No data was given",
      color: "grey",
    },
  ];

  const [daysOfWeek, setDaysOfWeek] = useState([]);
  useEffect(() => {
    const days = getDaysInWeek(week);
    setDaysOfWeek(days);
  }, [week]);

  const getDaysInWeek = (week) => {
    const startDate = new Date(week);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Function to format the date as dd/mm
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}`;
    };

    const formattedRange = `${formatDate(startDate)}-${formatDate(endDate)}`;
    const days = [];

    let currentDate = startDate;

    while (currentDate <= endDate) {
      days.push({
        date: formatDate(currentDate),
        dayOfWeek: currentDate.toLocaleString("en-us", { weekday: "long" }),
        week: formattedRange,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const [scheduleData, setScheduleData] = useState({});
  useEffect(() => {
    handleGetAllSchedule();
  }, [year]);
  const handleGetAllSchedule = async () => {
    try {
      const res = await GetAllScheduleAPI();
      const allSchedule = res?.allSchedule || [];
      const filteredSchedules = allSchedule.filter((schedule) => {
        const startTime = new Date(schedule?.schedule?.startTime);
        const day = startTime.getDate();
        const month = startTime.getMonth() + 1;
        const scheduleYear = startTime.getFullYear();
        if (scheduleYear !== year) return false;
        const [start, end] = showWeek.split("-");
        const [startDay, startMonth] = start.split("/").map(Number);
        const [endDay, endMonth] = end.split("/").map(Number);

        return (
          (month > startMonth || (month === startMonth && day >= startDay)) &&
          (month < endMonth || (month === endMonth && day <= endDay))
        );
      });
      const schedulesByDayAndSlot = {};
      daysOfWeek.forEach((day) => {
        schedulesByDayAndSlot[day.date] = [];
      });

      filteredSchedules.forEach((schedule) => {
        const startTime = new Date(schedule?.schedule?.startTime);
        const endTime = new Date(schedule?.schedule?.endTime);
        const day = startTime.toISOString().split("T")[0];
        if (!schedulesByDayAndSlot[day]) {
          schedulesByDayAndSlot[day] = [];
        }

        const existingSlotIndex = schedulesByDayAndSlot[day].findIndex(
          (slot) =>
            slot &&
            slot.starttime ===
              `${startTime.getHours()}:${startTime
                .getMinutes()
                .toString()
                .padStart(2, "0")}`
        );

        if (existingSlotIndex === -1) {
          schedulesByDayAndSlot[day].push({
            code: schedule?.schedule?.courseCode || "Unknown",
            course: schedule?.schedule?.course || "Unknown",
            room: schedule?.schedule?.room || "Unknown",
            status: schedule?.status || "Unknown",
            starttime: `${startTime.getHours()}:${startTime
              .getMinutes()
              .toString()
              .padStart(2, "0")}`,
            endTime: `${endTime.getHours()}:${endTime
              .getMinutes()
              .toString()
              .padStart(2, "0")}`,
          });
        }
      });

      setScheduleData(schedulesByDayAndSlot);
      console.log(schedulesByDayAndSlot);
    } catch (err) {}
  };

  useEffect(() => {
    handleGetAllSchedule();
  }, [year, week]);
  //Download time table (excel)
  const processScheduleData = (data) => {
    const formattedData = [];
  
    data?.allSchedule.forEach((item) => {
      const schedule = item.schedule;
      const startTime = new Date(schedule.startTime);
      const endTime = new Date(schedule.endTime);

      const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
      const slots = Array.from({ length: Math.ceil(durationInHours) }, (_, i) => i + 1);
  
      slots.forEach((slot) => {
        formattedData.push({
          Date: startTime.toISOString().split("T")[0], 
          Slot: `Tiết ${slot}`,
          "Course Code": schedule.courseCode,
          Course: schedule.course,
          Room: schedule.room,
          Status: item.status,
        });
      });
    });
  
    return formattedData;
  };
  const handleClickDownload = async () =>{
    const res = await GetAllScheduleAPI();
    exportScheduleToExcel(res)
  }
  const exportScheduleToExcel = (scheduleData) => {
    const processedData = processScheduleData(scheduleData);
  
    // Tạo worksheet từ dữ liệu đã xử lý
    const worksheet = XLSX.utils.json_to_sheet(processedData);
  
    // Định dạng tiêu đề (hàng đầu tiên)
  const headerRange = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    const cell = worksheet[cellAddress];
    if (cell) {
      cell.s = {
        font: { bold: true, color: { rgb: "FFFFFF" } }, 
        alignment: { horizontal: "center", vertical: "center" }, 
        fill: { fgColor: { rgb: "D3D3D3" } }, 
      };
    }
  }
  
    // Định dạng toàn bộ dữ liệu
  const cellRange = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let row = 1; row <= cellRange.e.r; row++) { 
    for (let col = cellRange.s.c; col <= cellRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellAddress];
      if (cell) {
        cell.s = {
          alignment: { horizontal: "center", vertical: "center" }, 
          fill: { fgColor: { rgb: row % 2 === 0 ? "E8F5E9" : "FFFFFF" } }, 
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    }
  }
  
    // Thiết lập kích thước cột
    worksheet["!cols"] = [
      { wch: 17 }, 
      { wch: 10 }, 
      { wch: 15 }, 
      { wch: 20 }, 
      { wch: 10 }, 
      { wch: 13 }, 
    ];
    worksheet["!rows"] = [
      { hpx: 40 }, 
    ];
    // Tạo workbook và thêm worksheet vào
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");
  
    // Xuất workbook ra tệp Excel
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  
    // Lưu file với tên "Schedule.xlsx"
    saveAs(blob, "Schedule.xlsx");
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
                value={showWeek}
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
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              {/* Table Head */}
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
                      padding: "16px",
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
                        minWidth: 150,
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
                      const formattedDate = `2024-${day.date.split("/")[1]}-${
                        day.date.split("/")[0]
                      }`;
                      const daySchedule = scheduleData[formattedDate] || [];
                      const slotData = daySchedule[slotIndex];
                      const getStatusColor = (status) => {
                        if (status === "Absent") return "red";
                        if (status === "Pending") return "orange";
                        if (status === "Attended") return "green";
                        return "black";
                      };
                      return (
                        <TableCell
                          key={day.date}
                          align="center"
                          sx={{
                            minWidth: 200,
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
                                  <strong>Code:</strong> {slotData.code}
                                </Typography>
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
                                  <strong>Room:</strong> {slotData.room}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: 16, mb: 1 }}
                                >
                                  <strong> Time:</strong> {slotData.starttime} -{" "}
                                  {slotData.endTime}
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
            {notes && notes.length > 0 ? (
              notes.map((note, index) => (
                <Typography key={index} sx={{ color: note.color }}>
                  ({note.status}):{" "}
                  {index < notes.length - 1 ? `${user.data.fullName} ` : ""}
                  {note.description}
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
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => handleClickDownload()}>
              <Print sx={{ mr: 1 }} />
              Download Timetable
            </Button>
          </Box>
        </>
      </Box>
    </>
  );
}
