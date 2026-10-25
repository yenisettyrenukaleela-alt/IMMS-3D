import React, { useEffect, useState, useRef } from "react";
import Signup from "./Pages/Signup";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  // =====================================================
  // AUTHENTICATION
  // =====================================================

  const [showSignup, setShowSignup] = useState(() => {
    return localStorage.getItem("immsLoggedIn") !== "true";
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("immsUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  // =====================================================
  // STUDENTS
  // =====================================================

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // =====================================================
  // OTHER DATA
  // =====================================================

  const [subjects, setSubjects] = useState([
    {
      id: 1,
      code: "CS401",
      name: "Data Structures",
      department: "CSE",
      semester: "4",
    },
    {
      id: 2,
      code: "CS402",
      name: "Database Management Systems",
      department: "CSE",
      semester: "4",
    },
    {
      id: 3,
      code: "IT401",
      name: "Web Technologies",
      department: "IT",
      semester: "4",
    },
    {
      id: 4,
      code: "EC401",
      name: "Digital Electronics",
      department: "ECE",
      semester: "4",
    },
  ]);

  const [faculty, setFaculty] = useState([
    {
      id: 1,
      facultyId: "FAC001",
      name: "Dr. Ravi Kumar",
      department: "CSE",
      subject: "Data Structures",
    },
    {
      id: 2,
      facultyId: "FAC002",
      name: "Prof. Anitha",
      department: "IT",
      subject: "Web Technologies",
    },
    {
      id: 3,
      facultyId: "FAC003",
      name: "Dr. Suresh",
      department: "ECE",
      subject: "Digital Electronics",
    },
  ]);

  const [examinations, setExaminations] = useState([
    {
      id: 1,
      name: "Internal Assessment - I",
      status: "Completed",
    },
    {
      id: 2,
      name: "Internal Assessment - II",
      status: "Scheduled",
    },
    {
      id: 3,
      name: "Semester Examination",
      status: "Upcoming",
    },
  ]);

  // =====================================================
  // ADD MODAL
  // =====================================================

  const [addModal, setAddModal] = useState({
    open: false,
    type: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    branch: "IT",
    year: "2",
    semester: "4",
    attendance: "85",
    marks: "75",

    code: "",
    department: "CSE",
    subject: "",

    status: "Scheduled",
  });

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const notifications = [
    {
      id: 1,
      title: "Internal Assessment - II",
      message: "IA-II examination is scheduled soon.",
      time: "10 min ago",
      icon: "📝",
    },
    {
      id: 2,
      title: "Attendance Alert",
      message: "3 students have attendance below 75%.",
      time: "30 min ago",
      icon: "⚠️",
    },
    {
      id: 3,
      title: "New Student Added",
      message: "A new student record was added.",
      time: "1 hour ago",
      icon: "👤",
    },
    {
      id: 4,
      title: "Marks Updated",
      message: "Internal marks have been updated.",
      time: "2 hours ago",
      icon: "📊",
    },
    {
      id: 5,
      title: "Academic Calendar",
      message: "Academic calendar has been updated.",
      time: "Today",
      icon: "📅",
    },
  ];

  // =====================================================
  // PAGE STATES
  // =====================================================

  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("All Departments");

  const [semesterFilter, setSemesterFilter] =
    useState("All Semesters");

  // =====================================================
  // DROPDOWN STATES
  // =====================================================

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  // =====================================================
  // THEME
  // =====================================================

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("immsTheme") === "dark";
  });

  // =====================================================
  // CALENDAR
  // =====================================================

  const [calendarDate, setCalendarDate] =
    useState(new Date());

  // =====================================================
  // REFS
  // =====================================================

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // =====================================================
  // THEME EFFECT
  // =====================================================

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);

    localStorage.setItem(
      "immsTheme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  // =====================================================
  // CLOSE DROPDOWNS
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);

      const response = await fetch(
        `${API_URL}/students`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();

      const formattedStudents = data.map(
        (student, index) => ({
          id: student._id,

          roll:
            student.rollNumber ||
            `STU${String(index + 1).padStart(3, "0")}`,

          name: student.name || "Unknown",

          email: student.email || "",

          branch: student.branch || "IT",

          year: student.year || "2",

          sem:
            student.semester ||
            student.sem ||
            "4",

          attendance:
            student.attendance !== undefined
              ? Number(student.attendance)
              : 85,

          marks:
            student.marks !== undefined
              ? Number(student.marks)
              : 75,

          grade:
            student.grade ||
            calculateGrade(
              student.marks !== undefined
                ? Number(student.marks)
                : 75
            ),

          status:
            student.status ||
            (
              Number(
                student.marks !== undefined
                  ? student.marks
                  : 75
              ) >= 40
                ? "Pass"
                : "Fail"
            ),
        })
      );

      setStudents(formattedStudents);
    } catch (error) {
      console.error(
        "Student fetch error:",
        error
      );

      setStudents(getDemoStudents());
    } finally {
      setLoadingStudents(false);
    }
  };

  // =====================================================
  // DEMO DATA
  // =====================================================

  const getDemoStudents = () => [
    {
      id: "demo1",
      roll: "22IT001",
      name: "Rahul Kumar",
      email: "rahul@gmail.com",
      branch: "IT",
      year: "2",
      sem: "4",
      attendance: 95,
      marks: 98,
      grade: "A+",
      status: "Pass",
    },
    {
      id: "demo2",
      roll: "22CS015",
      name: "Priya Sharma",
      email: "priya@gmail.com",
      branch: "CSE",
      year: "2",
      sem: "4",
      attendance: 90,
      marks: 85,
      grade: "A",
      status: "Pass",
    },
    {
      id: "demo3",
      roll: "22EC022",
      name: "Kiran Kumar",
      email: "kiran@gmail.com",
      branch: "ECE",
      year: "2",
      sem: "4",
      attendance: 72,
      marks: 35,
      grade: "F",
      status: "Fail",
    },
    {
      id: "demo4",
      roll: "22ME030",
      name: "Arjun Patel",
      email: "arjun@gmail.com",
      branch: "MECH",
      year: "2",
      sem: "4",
      attendance: 88,
      marks: 76,
      grade: "B",
      status: "Pass",
    },
    {
      id: "demo5",
      roll: "22CE045",
      name: "Sneha Reddy",
      email: "sneha@gmail.com",
      branch: "CIVIL",
      year: "2",
      sem: "4",
      attendance: 93,
      marks: 91,
      grade: "A+",
      status: "Pass",
    },
  ];

  // =====================================================
  // GRADE FUNCTION
  // =====================================================

  function calculateGrade(marks) {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B+";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C";
    if (marks >= 40) return "D";
    return "F";
  }

  // =====================================================
  // SIGNUP
  // =====================================================

  const handleSignup = (newUser) => {
    if (!newUser) {
      setShowSignup(false);
      return;
    }

    setUser(newUser);
    setShowSignup(false);

    localStorage.setItem(
      "immsUser",
      JSON.stringify(newUser)
    );

    localStorage.setItem(
      "immsLoggedIn",
      "true"
    );

    setActivePage("Dashboard");
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("immsLoggedIn");
    localStorage.removeItem("immsUser");

    setUser(null);

    setShowProfileMenu(false);
    setShowNotifications(false);

    setActivePage("Dashboard");

    setShowSignup(true);
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigateTo = (page) => {
    setActivePage(page);
    setSearch("");
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  // =====================================================
  // OPEN ACADEMIC CALENDAR
  // =====================================================

  const openAcademicCalendar = () => {
    navigateTo("Academic Calendar");
  };

  // =====================================================
  // CALENDAR DATA
  // =====================================================

  const calendarEvents = [
    {
      date: "2026-06-01",
      title: "Semester Begins",
      type: "Academic",
    },
    {
      date: "2026-07-15",
      title: "Internal Assessment - I",
      type: "Examination",
    },
    {
      date: "2026-08-20",
      title: "Internal Assessment - II",
      type: "Examination",
    },
    {
      date: "2026-09-05",
      title: "Faculty Development Day",
      type: "Event",
    },
    {
      date: "2026-10-10",
      title: "Mid Semester Review",
      type: "Academic",
    },
    {
      date: "2026-11-20",
      title: "Semester Examination",
      type: "Examination",
    },
    {
      date: "2026-12-15",
      title: "Semester Ends",
      type: "Academic",
    },
  ];

  // =====================================================
  // CALENDAR FUNCTIONS
  // =====================================================

  const previousMonth = () => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() + 1,
        1
      )
    );
  };

  const todayCalendar = () => {
    setCalendarDate(new Date());
  };

  const getCalendarDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(
      year,
      month,
      1
    ).getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const previousMonthDays =
      new Date(
        year,
        month,
        0
      ).getDate();

    const days = [];

    for (
      let i = firstDay - 1;
      i >= 0;
      i--
    ) {
      days.push({
        day:
          previousMonthDays - i,
        currentMonth: false,
      });
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      days.push({
        day,
        currentMonth: true,
      });
    }

    let nextDay = 1;

    while (days.length < 42) {
      days.push({
        day: nextDay++,
        currentMonth: false,
      });
    }

    return days;
  };

  const getEventForDate = (day) => {
    const year =
      calendarDate.getFullYear();

    const month = String(
      calendarDate.getMonth() + 1
    ).padStart(2, "0");

    const date = String(day).padStart(
      2,
      "0"
    );

    const dateString =
      `${year}-${month}-${date}`;

    return calendarEvents.find(
      (event) =>
        event.date === dateString
    );
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const openAddModal = (type) => {
    let defaultData = {
      name: "",
      email: "",
      rollNumber: "",
      branch: "IT",
      year: "2",
      semester: "4",
      attendance: "85",
      marks: "75",
      code: "",
      department: "CSE",
      subject: "",
      status: "Scheduled",
    };

    if (type === "student") {
      defaultData.rollNumber =
        `22IT${String(
          students.length + 1
        ).padStart(3, "0")}`;
    }

    if (type === "faculty") {
      defaultData.name = "";
      defaultData.department = "CSE";
      defaultData.subject =
        "Data Structures";
    }

    if (type === "subject") {
      defaultData.code = "";
      defaultData.name = "";
      defaultData.department = "CSE";
      defaultData.semester = "4";
    }

    if (type === "examination") {
      defaultData.name = "";
      defaultData.status = "Scheduled";
    }

    setFormData(defaultData);

    setAddModal({
      open: true,
      type,
    });
  };

  // =====================================================
  // CLOSE ADD MODAL
  // =====================================================

  const closeAddModal = () => {
    setAddModal({
      open: false,
      type: "",
    });
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleFormChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD STUDENT BUTTON
  // =====================================================

  const addStudent = () => {
    openAddModal("student");
  };

  // =====================================================
  // SUBMIT STUDENT
  // =====================================================

  const submitStudent = async () => {
    const name =
      formData.name.trim();

    const rollNumber =
      formData.rollNumber.trim();

    if (!name) {
      alert("Please enter student name.");
      return;
    }

    if (!rollNumber) {
      alert("Please enter roll number.");
      return;
    }

    const marks =
      Number(formData.marks);

    const attendance =
      Number(formData.attendance);

    if (
      Number.isNaN(marks) ||
      marks < 0 ||
      marks > 100
    ) {
      alert(
        "Marks must be between 0 and 100."
      );
      return;
    }

    if (
      Number.isNaN(attendance) ||
      attendance < 0 ||
      attendance > 100
    ) {
      alert(
        "Attendance must be between 0 and 100."
      );
      return;
    }

    const branch =
      formData.branch;

    const year =
      formData.year;

    const semester =
      formData.semester;

    const email =
      formData.email.trim();

    const grade =
      calculateGrade(marks);

    const status =
      marks >= 40
        ? "Pass"
        : "Fail";

    const newStudent = {
      name,
      email,
      rollNumber,
      branch,
      semester,
      year,
      attendance,
      marks,
      grade,
      status,
    };

    try {
      const response =
        await fetch(
          `${API_URL}/students`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify(
                newStudent
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to add student"
        );
      }

      const formattedStudent = {
        id: data._id,

        roll:
          data.rollNumber ||
          rollNumber,

        name:
          data.name ||
          name,

        email:
          data.email ||
          email,

        branch:
          data.branch ||
          branch,

        year:
          data.year ||
          year,

        sem:
          data.semester ||
          semester,

        attendance:
          data.attendance !==
          undefined
            ? Number(
                data.attendance
              )
            : attendance,

        marks:
          data.marks !==
          undefined
            ? Number(
                data.marks
              )
            : marks,

        grade:
          data.grade ||
          grade,

        status:
          data.status ||
          status,
      };

      setStudents(
        (prev) => [
          ...prev,
          formattedStudent,
        ]
      );

      closeAddModal();

      alert(
        "Student added successfully!"
      );
    } catch (error) {
      console.error(
        "Add student error:",
        error
      );

      alert(
        "Backend connection failed.\n\n" +
        "Make sure your Node.js server is running on port 5000."
      );
    }
  };

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const deleteStudent = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmDelete) return;

    if (
      String(id).startsWith("demo")
    ) {
      setStudents((prev) =>
        prev.filter(
          (student) =>
            student.id !== id
        )
      );

      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/students/${id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Delete failed"
        );
      }

      setStudents((prev) =>
        prev.filter(
          (student) =>
            student.id !== id
        )
      );

      alert(
        "Student deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete student error:",
        error
      );

      alert(
        "Unable to delete student."
      );
    }
  };

  // =====================================================
  // ADD SUBJECT BUTTON
  // =====================================================

  const addSubject = () => {
    openAddModal("subject");
  };

  // =====================================================
  // SUBMIT SUBJECT
  // =====================================================

  const submitSubject = () => {
    const code =
      formData.code.trim();

    const name =
      formData.name.trim();

    if (!code) {
      alert(
        "Please enter subject code."
      );
      return;
    }

    if (!name) {
      alert(
        "Please enter subject name."
      );
      return;
    }

    const newSubject = {
      id: Date.now(),
      code,
      name,
      department:
        formData.department,
      semester:
        formData.semester,
    };

    setSubjects((prev) => [
      ...prev,
      newSubject,
    ]);

    closeAddModal();

    alert(
      "Subject added successfully!"
    );
  };

  // =====================================================
  // DELETE SUBJECT
  // =====================================================

  const deleteSubject = (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this subject?"
      );

    if (!confirmDelete) return;

    setSubjects((prev) =>
      prev.filter(
        (subject) =>
          subject.id !== id
      )
    );
  };

  // =====================================================
  // ADD FACULTY BUTTON
  // =====================================================

  const addFaculty = () => {
    openAddModal("faculty");
  };

  // =====================================================
  // SUBMIT FACULTY
  // =====================================================

  const submitFaculty = () => {
    const name =
      formData.name.trim();

    if (!name) {
      alert(
        "Please enter faculty name."
      );
      return;
    }

    const newFaculty = {
      id: Date.now(),

      facultyId: `FAC${String(
        faculty.length + 1
      ).padStart(3, "0")}`,

      name,

      department:
        formData.department,

      subject:
        formData.subject ||
        "Data Structures",
    };

    setFaculty((prev) => [
      ...prev,
      newFaculty,
    ]);

    closeAddModal();

    alert(
      "Faculty added successfully!"
    );
  };

  // =====================================================
  // ADD EXAMINATION BUTTON
  // =====================================================

  const addExamination = () => {
    openAddModal(
      "examination"
    );
  };

  // =====================================================
  // SUBMIT EXAMINATION
  // =====================================================

  const submitExamination = () => {
    const name =
      formData.name.trim();

    if (!name) {
      alert(
        "Please enter examination name."
      );
      return;
    }

    const newExam = {
      id: Date.now(),
      name,
      status:
        formData.status ||
        "Scheduled",
    };

    setExaminations(
      (prev) => [
        ...prev,
        newExam,
      ]
    );

    closeAddModal();

    alert(
      "Examination added successfully!"
    );
  };

  // =====================================================
  // SUBMIT ADD MODAL
  // =====================================================

  const handleAddSubmit = () => {
    if (
      addModal.type ===
      "student"
    ) {
      submitStudent();
      return;
    }

    if (
      addModal.type ===
      "subject"
    ) {
      submitSubject();
      return;
    }

    if (
      addModal.type ===
      "faculty"
    ) {
      submitFaculty();
      return;
    }

    if (
      addModal.type ===
      "examination"
    ) {
      submitExamination();
      return;
    }
  };

  // =====================================================
  // REPORT GENERATION
  // =====================================================

  const generateReport = (type) => {
    if (students.length === 0) {
      alert(
        "No student data available."
      );
      return;
    }

    let csv = "";

    if (type === "student") {
      csv =
        "Roll No,Name,Email,Branch,Year,Semester,Attendance,Marks,Grade,Status\n";

      students.forEach((student) => {
        csv +=
          `"${student.roll}","${student.name}","${student.email || ""}","${student.branch}","${student.year}","${student.sem}","${student.attendance}%","${student.marks}","${student.grade}","${student.status}"\n`;
      });
    }

    if (type === "marks") {
      csv =
        "Roll No,Student Name,Branch,Marks,Grade,Result\n";

      students.forEach((student) => {
        csv +=
          `"${student.roll}","${student.name}","${student.branch}","${student.marks}","${student.grade}","${student.status}"\n`;
      });
    }

    if (type === "attendance") {
      csv =
        "Roll No,Student Name,Branch,Attendance,Status\n";

      students.forEach((student) => {
        csv +=
          `"${student.roll}","${student.name}","${student.branch}","${student.attendance}%","${student.attendance >= 75 ? "Good" : "Low"}"\n`;
      });
    }

    const blob =
      new Blob([csv], {
        type:
          "text/csv;charset=utf-8;",
      });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${type}-report.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);

    alert(
      "Report generated successfully!"
    );
  };

  // =====================================================
  // EXPORT STUDENTS
  // =====================================================

  const exportStudents = () => {
    generateReport(
      "student"
    );
  };

  // =====================================================
  // FILTER STUDENTS
  // =====================================================

  const filteredStudents =
    students.filter((student) => {
      const matchesSearch =
        `${student.name} ${student.roll} ${student.branch}`
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesDepartment =
        departmentFilter ===
          "All Departments" ||
        student.branch ===
          departmentFilter;

      const matchesSemester =
        semesterFilter ===
          "All Semesters" ||
        student.sem ===
          semesterFilter.charAt(
            0
          );

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesSemester
      );
    });

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalStudents =
    students.length;

  const averageMarks =
    students.length > 0
      ? (
          students.reduce(
            (sum, student) =>
              sum +
              Number(
                student.marks || 0
              ),
            0
          ) /
          students.length
        ).toFixed(2)
      : "0.00";

  const averageAttendance =
    students.length > 0
      ? Math.round(
          students.reduce(
            (sum, student) =>
              sum +
              Number(
                student.attendance ||
                  0
              ),
            0
          ) /
            students.length
        )
      : 0;

  const passedStudents =
    students.filter(
      (student) =>
        Number(
          student.marks
        ) >= 40
    ).length;

  const passRate =
    students.length > 0
      ? Math.round(
          (passedStudents /
            students.length) *
            100
        )
      : 0;

  const topper =
    students.length > 0
      ? students.reduce(
          (top, student) =>
            Number(
              student.marks
            ) >
            Number(
              top.marks
            )
              ? student
              : top
        )
      : null;

  const lowest =
    students.length > 0
      ? students.reduce(
          (low, student) =>
            Number(
              student.marks
            ) <
            Number(
              low.marks
            )
              ? student
              : low
        )
      : null;

  // =====================================================
  // SIGNUP SCREEN
  // =====================================================

  if (showSignup) {
    return (
      <Signup
        onSignup={handleSignup}
      />
    );
  }

  // =====================================================
  // MAIN APPLICATION
  // =====================================================

  return (
    <div
      className={
        darkMode
          ? "app-shell dark-app"
          : "app-shell"
      }
    >

      {/* SIDEBAR SCROLLBAR FIX: only affects sidebar scrolling */}
      <style>{`
        .sidebar {
          height: 100vh;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: #49699b #071d4d;
          overscroll-behavior: contain;
        }

        .sidebar .brand,
        .sidebar .sidebar-menu,
        .sidebar .sidebar-bottom {
          flex-shrink: 0;
        }

        .sidebar .sidebar-bottom {
          margin-top: auto;
        }

        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: #071d4d;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: #49699b;
          border-radius: 10px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #7da4e8;
        }
      `}</style>

      {/* BACKGROUND */}

      <div className="bg-shape shape-one"></div>
      <div className="bg-shape shape-two"></div>
      <div className="bg-shape shape-three"></div>

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-logo">
            🎓
          </div>

          <div>

            <h2>
              IMMS Pro
            </h2>

            <p>
              Academic Management
            </p>

          </div>

        </div>

        <nav className="sidebar-menu">

          {[
            ["Dashboard", "⌂"],
            ["Students", "♟"],
            ["Attendance", "✓"],
            ["Marks & Grades", "▣"],
            ["Subjects", "▤"],
            ["Examinations", "▧"],
            ["Reports", "▤"],
            ["Faculty", "♙"],
            ["Academic Calendar", "📅"],
            ["Settings", "⚙"],
          ].map(
            ([name, icon]) => (
              <button
                key={name}
                className={
                  activePage ===
                  name
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  navigateTo(
                    name
                  )
                }
              >

                <span>
                  {icon}
                </span>

                {name}

              </button>
            )
          )}

        </nav>

        <div className="sidebar-bottom">

          <button
            className="logout-button"
            onClick={
              handleLogout
            }
          >
            ↪ Logout
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="main-content">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="topbar">

          <div className="topbar-left">

            <button
              className="menu-button"
              onClick={() =>
                navigateTo(
                  "Dashboard"
                )
              }
            >
              ☰
            </button>

            <div>

              <h1>
                Internal Marks
                Management System
              </h1>

              <p>
                Academic Performance
                Dashboard
              </p>

            </div>

          </div>

          <div className="topbar-right">

            {/* THEME */}

            <button
              className="icon-button"
              title={
                darkMode
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
              onClick={() =>
                setDarkMode(
                  (prev) =>
                    !prev
                )
              }
            >
              {darkMode
                ? "☀"
                : "☾"}
            </button>

            {/* NOTIFICATIONS */}

            <div
              className="dropdown-container"
              ref={
                notificationRef
              }
            >

              <button
                className="icon-button notification"
                title="Notifications"
                onClick={() => {

                  setShowNotifications(
                    (prev) =>
                      !prev
                  );

                  setShowProfileMenu(
                    false
                  );

                }}
              >

                🔔

                <span>
                  5
                </span>

              </button>

              {showNotifications && (
                <div className="notification-dropdown">

                  <div className="dropdown-header">

                    <div>

                      <h3>
                        Notifications
                      </h3>

                      <small>
                        5 new notifications
                      </small>

                    </div>

                    <button
                      onClick={() =>
                        setShowNotifications(
                          false
                        )
                      }
                    >
                      ✕
                    </button>

                  </div>

                  <div className="notification-list">

                    {notifications.map(
                      (
                        notification
                      ) => (
                        <div
                          className="notification-item"
                          key={
                            notification.id
                          }
                        >

                          <div className="notification-icon">
                            {
                              notification.icon
                            }
                          </div>

                          <div className="notification-content">

                            <strong>
                              {
                                notification.title
                              }
                            </strong>

                            <p>
                              {
                                notification.message
                              }
                            </p>

                            <small>
                              {
                                notification.time
                              }
                            </small>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* PROFILE */}

            <div
              className="profile-container"
              ref={
                profileRef
              }
            >

              <button
                className="profile"
                onClick={() => {

                  setShowProfileMenu(
                    (prev) =>
                      !prev
                  );

                  setShowNotifications(
                    false
                  );

                }}
              >

                <div className="avatar">

                  {user?.fullName
                    ? user.fullName
                        .charAt(
                          0
                        )
                        .toUpperCase()
                    : "A"}

                </div>

                <div>

                  <strong>
                    {user?.fullName ||
                      "Admin User"}
                  </strong>

                  <small>
                    {user?.role ||
                      "Administrator"}
                  </small>

                </div>

                <span>
                  ⌄
                </span>

              </button>

              {showProfileMenu && (
                <div className="profile-dropdown">

                  <div className="profile-dropdown-header">

                    <div className="large-avatar">

                      {user?.fullName
                        ? user.fullName
                            .charAt(
                              0
                            )
                            .toUpperCase()
                        : "A"}

                    </div>

                    <div>

                      <strong>
                        {user?.fullName ||
                          "Admin User"}
                      </strong>

                      <small>
                        {user?.email ||
                          "admin@imms.com"}
                      </small>

                      <span>
                        {user?.role ||
                          "Administrator"}
                      </span>

                    </div>

                  </div>

                  <div className="profile-menu-divider"></div>

                  <button
                    onClick={() => {

                      setShowProfileMenu(
                        false
                      );

                      navigateTo(
                        "Settings"
                      );

                    }}
                  >
                    👤 Profile & Settings
                  </button>

                  <button
                    className="profile-logout"
                    onClick={
                      handleLogout
                    }
                  >
                    ↪ Logout
                  </button>

                </div>
              )}

            </div>

          </div>

        </header>

        {/* =================================================
            ACADEMIC CALENDAR
        ================================================= */}

        {activePage ===
          "Academic Calendar" && (
          <section className="dashboard">

            <div className="welcome-section">

              <div>

                <h2>
                  Academic Calendar
                </h2>

                <p>
                  View academic events,
                  examinations and
                  important dates.
                </p>

              </div>

              <button
                className="add-btn"
                onClick={() =>
                  navigateTo(
                    "Dashboard"
                  )
                }
              >
                ← Back to Dashboard
              </button>

            </div>

            <div className="calendar-layout">

              <div className="student-panel calendar-panel">

                <div className="calendar-header">

                  <button
                    className="calendar-arrow"
                    onClick={
                      previousMonth
                    }
                  >
                    ‹
                  </button>

                  <div>

                    <h2>
                      {calendarDate.toLocaleString(
                        "default",
                        {
                          month:
                            "long",
                          year:
                            "numeric",
                        }
                      )}
                    </h2>

                    <button
                      className="today-btn"
                      onClick={
                        todayCalendar
                      }
                    >
                      Today
                    </button>

                  </div>

                  <button
                    className="calendar-arrow"
                    onClick={
                      nextMonth
                    }
                  >
                    ›
                  </button>

                </div>

                <div className="calendar-weekdays">

                  {[
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                  ].map(
                    (day) => (
                      <div
                        key={
                          day
                        }
                      >
                        {day}
                      </div>
                    )
                  )}

                </div>

                <div className="calendar-grid">

                  {getCalendarDays().map(
                    (
                      item,
                      index
                    ) => {

                      const event =
                        item.currentMonth
                          ? getEventForDate(
                              item.day
                            )
                          : null;

                      const today =
                        new Date();

                      const isToday =
                        item.currentMonth &&
                        item.day ===
                          today.getDate() &&
                        calendarDate.getMonth() ===
                          today.getMonth() &&
                        calendarDate.getFullYear() ===
                          today.getFullYear();

                      return (
                        <div
                          className={
                            `calendar-day ${
                              item.currentMonth
                                ? ""
                                : "other-month"
                            } ${
                              isToday
                                ? "today"
                                : ""
                            } ${
                              event
                                ? "has-event"
                                : ""
                            }`
                          }
                          key={
                            index
                          }
                          title={
                            event
                              ? event.title
                              : ""
                          }
                        >

                          <span>
                            {
                              item.day
                            }
                          </span>

                          {event && (
                            <div className="calendar-event-dot">
                              •
                            </div>
                          )}

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

              <div className="student-panel upcoming-events">

                <div className="student-heading">

                  <div>

                    <h3>
                      Important Dates
                    </h3>

                    <p>
                      Academic year
                      schedule
                    </p>

                  </div>

                </div>

                {calendarEvents.map(
                  (
                    event
                  ) => (
                    <div
                      className="event-item"
                      key={
                        event.date
                      }
                    >

                      <div className="event-date">

                        <strong>
                          {new Date(
                            event.date
                          ).getDate()}
                        </strong>

                        <span>
                          {new Date(
                            event.date
                          ).toLocaleString(
                            "default",
                            {
                              month:
                                "short",
                            }
                          )}
                        </span>

                      </div>

                      <div className="event-details">

                        <strong>
                          {
                            event.title
                          }
                        </strong>

                        <small>
                          {
                            event.type
                          }
                        </small>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            DASHBOARD
        ================================================= */}

        {activePage ===
          "Dashboard" && (
          <section className="dashboard">

            <div className="welcome-section">

              <div>

                <h2>
                  Welcome back,{" "}
                  {user?.fullName ||
                    "Admin"}! 👋
                </h2>

                <p>
                  Monitor academic
                  performance and
                  student progress.
                </p>

              </div>

              <button
                className="year-box"
                onClick={
                  openAcademicCalendar
                }
                title="Open Academic Calendar"
              >

                <span>
                  📅
                </span>

                <div>

                  <small>
                    Academic Year
                  </small>

                  <strong>
                    2025 - 2026
                  </strong>

                </div>

              </button>

            </div>

            {/* STATISTICS */}

            <div className="stats-grid">

              <div className="stat-card blue">

                <div className="stat-icon">
                  ♟
                </div>

                <div>

                  <span>
                    Total Students
                  </span>

                  <strong>
                    {totalStudents}
                  </strong>

                  <small>
                    ↑ Active records
                  </small>

                </div>

              </div>

              <div className="stat-card green">

                <div className="stat-icon">
                  ↗
                </div>

                <div>

                  <span>
                    Average Marks
                  </span>

                  <strong>
                    {averageMarks}
                  </strong>

                  <small>
                    ↑ Academic
                    performance
                  </small>

                </div>

              </div>

              <div className="stat-card orange">

                <div className="stat-icon">
                  ◔
                </div>

                <div>

                  <span>
                    Pass Rate
                  </span>

                  <strong>
                    {passRate}%
                  </strong>

                  <small>
                    ↑ Overall result
                  </small>

                </div>

              </div>

              <div className="stat-card purple">

                <div className="stat-icon">
                  🎓
                </div>

                <div>

                  <span>
                    Passed Students
                  </span>

                  <strong>
                    {passedStudents}
                  </strong>

                  <small>
                    Current semester
                  </small>

                </div>

              </div>

              <div className="stat-card cyan">

                <div className="stat-icon">
                  🏆
                </div>

                <div>

                  <span>
                    Topper
                  </span>

                  <strong>
                    {topper?.name ||
                      "N/A"}
                  </strong>

                  <small>
                    {topper?.marks ||
                      0} Marks
                  </small>

                </div>

              </div>

              <div className="stat-card red">

                <div className="stat-icon">
                  ↘
                </div>

                <div>

                  <span>
                    Lowest Marks
                  </span>

                  <strong>
                    {lowest?.name ||
                      "N/A"}
                  </strong>

                  <small>
                    {lowest?.marks ||
                      0} Marks
                  </small>

                </div>

              </div>

            </div>

            {/* FILTER BAR */}

            <div className="filter-bar">

              <div className="search-box">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search student..."
                  value={
                    search
                  }
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

              <select
                value={
                  departmentFilter
                }
                onChange={(e) =>
                  setDepartmentFilter(
                    e.target.value
                  )
                }
              >

                <option>
                  All Departments
                </option>

                <option>
                  IT
                </option>

                <option>
                  CSE
                </option>

                <option>
                  ECE
                </option>

                <option>
                  MECH
                </option>

                <option>
                  CIVIL
                </option>

              </select>

              <select
                value={
                  semesterFilter
                }
                onChange={(e) =>
                  setSemesterFilter(
                    e.target.value
                  )
                }
              >

                <option>
                  All Semesters
                </option>

                <option>
                  1st Semester
                </option>

                <option>
                  2nd Semester
                </option>

                <option>
                  3rd Semester
                </option>

                <option>
                  4th Semester
                </option>

              </select>

              <button
                className="export-btn"
                onClick={
                  exportStudents
                }
              >
                ⇩ Export Excel
              </button>

              <button
                className="add-btn"
                onClick={
                  addStudent
                }
              >
                + Add Student
              </button>

            </div>

            {/* ANALYTICS */}

            <div className="analytics-grid">

              <div className="panel">

                <div className="panel-heading">

                  <div>

                    <h3>
                      Marks Distribution
                    </h3>

                    <p>
                      Student performance
                      overview
                    </p>

                  </div>

                </div>

                <div className="donut-wrapper">

                  <div className="donut">

                    <div>

                      <strong>
                        {totalStudents}
                      </strong>

                      <span>
                        Students
                      </span>

                    </div>

                  </div>

                  <div className="legend">

                    <p>
                      <i className="dot green-dot"></i>
                      90-100 (A+)
                    </p>

                    <p>
                      <i className="dot blue-dot"></i>
                      80-89 (A)
                    </p>

                    <p>
                      <i className="dot orange-dot"></i>
                      70-79 (B+)
                    </p>

                    <p>
                      <i className="dot purple-dot"></i>
                      60-69 (B)
                    </p>

                    <p>
                      <i className="dot red-dot"></i>
                      Below 60 (F)
                    </p>

                  </div>

                </div>

              </div>

              <div className="panel">

                <div className="panel-heading">

                  <div>

                    <h3>
                      Department
                      Performance
                    </h3>

                    <p>
                      Average marks by
                      branch
                    </p>

                  </div>

                </div>

                <div className="bar-chart">

                  {[
                    ["IT", 86],
                    ["CSE", 82],
                    ["ECE", 74],
                    ["EEE", 70],
                    ["MECH", 68],
                  ].map(
                    (
                      [branch, value]
                    ) => (
                      <div
                        className="bar-item"
                        key={
                          branch
                        }
                      >

                        <strong>
                          {value}%
                        </strong>

                        <div className="bar-background">

                          <div
                            className="bar-fill"
                            style={{
                              height:
                                `${value}%`,
                            }}
                          ></div>

                        </div>

                        <span>
                          {branch}
                        </span>

                      </div>
                    )
                  )}

                </div>

              </div>

              <div className="panel">

                <div className="panel-heading">

                  <div>

                    <h3>
                      Attendance
                      Overview
                    </h3>

                    <p>
                      Overall student
                      attendance
                    </p>

                  </div>

                </div>

                <div className="attendance-circle">

                  <div>

                    <strong>
                      {averageAttendance}%
                    </strong>

                    <span>
                      Average
                    </span>

                  </div>

                </div>

                <div className="attendance-info">

                  <p>
                    <i className="dot green-dot"></i>
                    Good Attendance
                  </p>

                  <strong>
                    {
                      students.filter(
                        (s) =>
                          Number(
                            s.attendance
                          ) >= 75
                      ).length
                    } Students
                  </strong>

                  <p>
                    <i className="dot red-dot"></i>
                    Low Attendance
                  </p>

                  <strong>
                    {
                      students.filter(
                        (s) =>
                          Number(
                            s.attendance
                          ) < 75
                      ).length
                    } Students
                  </strong>

                </div>

              </div>

              <div className="panel quick-actions">

                <h3>
                  Quick Actions
                </h3>

                <button
                  onClick={
                    addStudent
                  }
                >
                  👤 Add New Student
                </button>

                <button
                  onClick={() =>
                    navigateTo(
                      "Marks & Grades"
                    )
                  }
                >
                  📊 Manage Marks
                </button>

                <button
                  onClick={() =>
                    navigateTo(
                      "Attendance"
                    )
                  }
                >
                  ✓ Attendance
                </button>

                <button
                  onClick={() =>
                    navigateTo(
                      "Reports"
                    )
                  }
                >
                  📄 Generate Report
                </button>

                <button
                  onClick={
                    openAcademicCalendar
                  }
                >
                  📅 Academic Calendar
                </button>

              </div>

            </div>

            {/* RECENT STUDENTS */}

            <div className="student-panel">

              <div className="student-heading">

                <div>

                  <h3>
                    Recent Students
                  </h3>

                  <p>
                    Latest student
                    academic records
                  </p>

                </div>

                <button
                  onClick={() =>
                    navigateTo(
                      "Students"
                    )
                  }
                >
                  View All
                </button>

              </div>

              <StudentTable
                students={
                  filteredStudents
                }
                deleteStudent={
                  deleteStudent
                }
              />

              <div className="table-footer">

                Showing{" "}
                {
                  filteredStudents.length
                }{" "}
                of{" "}
                {students.length}{" "}
                students

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            STUDENTS
        ================================================= */}

        {activePage ===
          "Students" && (
          <section className="dashboard">

            <div className="welcome-section">

              <div>

                <h2>
                  Students
                </h2>

                <p>
                  Manage student records
                  and academic
                  information.
                </p>

              </div>

              <button
                className="add-btn"
                onClick={
                  addStudent
                }
              >
                + Add Student
              </button>

            </div>

            <div className="filter-bar">

              <div className="search-box">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search student..."
                  value={
                    search
                  }
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

              <button
                className="export-btn"
                onClick={
                  exportStudents
                }
              >
                ⇩ Export
              </button>

            </div>

            <div className="student-panel">

              <div className="student-heading">

                <div>

                  <h3>
                    All Students
                  </h3>

                  <p>
                    Student academic
                    records
                  </p>

                </div>

              </div>

              {loadingStudents ? (
                <div
                  style={{
                    padding:
                      "40px",
                    textAlign:
                      "center",
                  }}
                >
                  Loading students...
                </div>
              ) : (
                <StudentTable
                  students={
                    filteredStudents
                  }
                  deleteStudent={
                    deleteStudent
                  }
                />
              )}

              <div className="table-footer">

                Showing{" "}
                {
                  filteredStudents.length
                }{" "}
                of{" "}
                {students.length}{" "}
                students

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            ATTENDANCE
        ================================================= */}

        {activePage ===
          "Attendance" && (
          <section className="dashboard">

            <div className="welcome-section">

              <div>

                <h2>
                  Attendance
                </h2>

                <p>
                  Monitor student
                  attendance.
                </p>

              </div>

              <div className="year-box">

                <span>
                  ✓
                </span>

                <div>

                  <small>
                    Average Attendance
                  </small>

                  <strong>
                    {averageAttendance}%
                  </strong>

                </div>

              </div>

            </div>

            <div className="student-panel">

              <div className="student-heading">

                <div>

                  <h3>
                    Attendance Records
                  </h3>

                  <p>
                    Student-wise
                    attendance
                  </p>

                </div>

              </div>

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>
                      <th>
                        Roll No
                      </th>

                      <th>
                        Student
                      </th>

                      <th>
                        Branch
                      </th>

                      <th>
                        Year
                      </th>

                      <th>
                        Semester
                      </th>

                      <th>
                        Attendance
                      </th>

                      <th>
                        Status
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {students.map(
                      (
                        student
                      ) => (
                        <tr
                          key={
                            student.id
                          }
                        >

                          <td>
                            {
                              student.roll
                            }
                          </td>

                          <td className="student-name">
                            {
                              student.name
                            }
                          </td>

                          <td>
                            {
                              student.branch
                            }
                          </td>

                          <td>
                            {
                              student.year
                            }
                          </td>

                          <td>
                            {
                              student.sem
                            }
                          </td>

                          <td>

                            <strong>
                              {
                                student.attendance
                              }%
                            </strong>

                          </td>

                          <td>

                            <span
                              className={
                                Number(
                                  student.attendance
                                ) >= 75
                                  ? "status pass"
                                  : "status fail"
                              }
                            >
                              {Number(
                                student.attendance
                              ) >= 75
                                ? "Good"
                                : "Low"}
                            </span>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            MARKS
        ================================================= */}

        {activePage ===
          "Marks & Grades" && (
          <section className="dashboard">

            <div className="welcome-section">

              <div>

                <h2>
                  Marks & Grades
                </h2>

                <p>
                  Manage internal marks
                  and grades.
                </p>

              </div>

              <div className="year-box">

                <span>
                  ▣
                </span>

                <div>

                  <small>
                    Average Marks
                  </small>

                  <strong>
                    {averageMarks}
                  </strong>

                </div>

              </div>

            </div>

            <div className="student-panel">

              <div className="student-heading">

                <div>

                  <h3>
                    Marks Records
                  </h3>

                  <p>
                    Internal examination
                    marks
                  </p>

                </div>

              </div>

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Roll No
                      </th>

                      <th>
                        Student
                      </th>

                      <th>
                        Branch
                      </th>

                      <th>
                        Marks
                      </th>

                      <th>
                        Grade
                      </th>

                      <th>
                        Result
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {students.map(
                      (
                        student
                      ) => (
                        <tr
                          key={
                            student.id
                          }
                        >

                          <td>
                            {
                              student.roll
                            }
                          </td>

                          <td className="student-name">
                            {
                              student.name
                            }
                          </td>

                          <td>
                            {
                              student.branch
                            }
                          </td>

                          <td>

                            <strong>
                              {
                                student.marks
                              }
                            </strong>

                          </td>

                          <td>

                            <span className="grade">
                              {
                                student.grade
                              }
                            </span>

                          </td>

                          <td>

                            <span
                              className={
                                student.status ===
                                "Pass"
                                  ? "status pass"
                                  : "status fail"
                              }
                            >
                              {
                                student.status
                              }
                            </span>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            SUBJECTS
        ================================================= */}

        {activePage ===
          "Subjects" && (
          <section className="dashboard">

            <div className="welcome-section">

              <div>

                <h2>
                  Subjects
                </h2>

                <p>
                  Manage academic
                  subjects.
                </p>

              </div>

              <button
                className="add-btn"
                onClick={
                  addSubject
                }
              >
                + Add Subject
              </button>

            </div>

            <div className="student-panel">

              <div className="student-heading">

                <div>

                  <h3>
                    Subject List
                  </h3>

                  <p>
                    Current semester
                    subjects
                  </p>

                </div>

              </div>

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Subject Code
                      </th>

                      <th>
                        Subject Name
                      </th>

                      <th>
                        Department
                      </th>

                      <th>
                        Semester
                      </th>

                      <th>
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {subjects.map(
                      (
                        subject
                      ) => (
                        <tr
                          key={
                            subject.id
                          }
                        >

                          <td>
                            {
                              subject.code
                            }
                          </td>

                          <td className="student-name">
                            {
                              subject.name
                            }
                          </td>

                          <td>
                            {
                              subject.department
                            }
                          </td>

                          <td>
                            {
                              subject.semester
                            }
                          </td>

                          <td>

                            <button
                              className="delete-btn"
                              onClick={() =>
                                deleteSubject(
                                  subject.id
                                )
                              }
                            >
                              🗑
                            </button>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            EXAMINATIONS
        ================================================= */}

        {activePage ===
          "Examinations" && (
          <section className="dashboard">

            <div className="welcome-section">

              <div>

                <h2>
                  Examinations
                </h2>

                <p>
                  Manage internal
                  examinations.
                </p>

              </div>

              <button
                className="add-btn"
                onClick={
                  addExamination
                }
              >
                + Add Examination
              </button>

            </div>

            <div className="analytics-grid">

              {examinations.map(
                (
                  exam
                ) => (
                  <div
                    className="panel"
                    key={
                      exam.id
                    }
                  >

                    <h3>
                      {
                        exam.name
                      }
                    </h3>

                    <p>
                      Examination status
                    </p>

                    <h2>
                      {
                        exam.status
                      }
                    </h2>

                    <button
                      className="delete-btn"
                      onClick={() => {

                        const confirmDelete =
                          window.confirm(
                            "Delete this examination?"
                          );

                        if (
                          !confirmDelete
                        )
                          return;

                        setExaminations(
                          (
                            prev
                          ) =>
                            prev.filter(
                              (
                                item
                              ) =>
                                item.id !==
                                exam.id
                            )
                        );

                      }}
                    >
                      🗑 Delete
                    </button>

                  </div>
                )
              )}

            </div>

          </section>
        )}

        {/* =================================================
            REPORTS
        ================================================= */}

        {activePage ===
          "Reports" && (
          <section className="dashboard">

            <div className="welcome-section">

              <div>

                <h2>
                  Reports
                </h2>

                <p>
                  Generate academic
                  performance reports.
                </p>

              </div>

            </div>

            <div className="analytics-grid">

              <div className="panel quick-actions">

                <h3>
                  Student Report
                </h3>

                <p>
                  Generate student-wise
                  academic report.
                </p>

                <button
                  onClick={() =>
                    generateReport(
                      "student"
                    )
                  }
                >
                  📄 Generate Report
                </button>

              </div>

              <div className="panel quick-actions">

                <h3>
                  Marks Report
                </h3>

                <p>
                  Generate marks and
                  grades report.
                </p>

                <button
                  onClick={() =>
                    generateReport(
                      "marks"
                    )
                  }
                >
                  📊 Generate Report
                </button>

              </div>

              <div className="panel quick-actions">

                <h3>
                  Attendance Report
                </h3>

                <p>
                  Generate attendance
                  report.
                </p>

                <button
                  onClick={() =>
                    generateReport(
                      "attendance"
                    )
                  }
                >
                  ✓ Generate Report
                </button>

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            FACULTY
        ================================================= */}

        {activePage ===
          "Faculty" && (
          <section className="dashboard">

            <div className="welcome-section">

              <div>

                <h2>
                  Faculty
                </h2>

                <p>
                  Manage faculty
                  information.
                </p>

              </div>

              <button
                className="add-btn"
                onClick={
                  addFaculty
                }
              >
                + Add Faculty
              </button>

            </div>

            <div className="student-panel">

              <div className="student-heading">

                <div>

                  <h3>
                    Faculty Records
                  </h3>

                  <p>
                    Faculty information
                  </p>

                </div>

              </div>

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Faculty ID
                      </th>

                      <th>
                        Faculty Name
                      </th>

                      <th>
                        Department
                      </th>

                      <th>
                        Subject
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {faculty.map(
                      (
                        member
                      ) => (
                        <tr
                          key={
                            member.id
                          }
                        >

                          <td>
                            {
                              member.facultyId
                            }
                          </td>

                          <td className="student-name">
                            {
                              member.name
                            }
                          </td>

                          <td>
                            {
                              member.department
                            }
                          </td>

                          <td>
                            {
                              member.subject
                            }
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            SETTINGS
        ================================================= */}

        {activePage ===
          "Settings" && (
          <section className="dashboard">

            <div className="welcome-section">

              <div>

                <h2>
                  Settings
                </h2>

                <p>
                  Manage application
                  settings.
                </p>

              </div>

              <button
                className="logout-button"
                onClick={
                  handleLogout
                }
              >
                ↪ Logout
              </button>

            </div>

            <div className="analytics-grid">

              <div className="panel">

                <h3>
                  Academic Year
                </h3>

                <p>
                  Current Academic
                  Year
                </p>

                <strong>
                  2025 - 2026
                </strong>

              </div>

              <div className="panel">

                <h3>
                  User Role
                </h3>

                <p>
                  Current user role
                </p>

                <strong>
                  {user?.role ||
                    "Administrator"}
                </strong>

              </div>

              <div className="panel">

                <h3>
                  Account
                </h3>

                <p>
                  Logged in user
                </p>

                <strong>
                  {user?.fullName ||
                    "Admin User"}
                </strong>

              </div>

              <div className="panel">

                <h3>
                  Appearance
                </h3>

                <p>
                  Application theme
                </p>

                <button
                  className="calendar-small-btn"
                  onClick={() =>
                    setDarkMode(
                      (prev) =>
                        !prev
                    )
                  }
                >
                  {darkMode
                    ? "☀ Light Mode"
                    : "☾ Dark Mode"}
                </button>

              </div>

            </div>

          </section>
        )}

      </main>

      {/* =====================================================
          UNIVERSAL ADD MODAL
          STUDENT / SUBJECT / FACULTY / EXAMINATION
      ===================================================== */}

      {addModal.open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15, 23, 42, 0.45)",
            backdropFilter:
              "blur(4px)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeAddModal();
            }
          }}
        >

          <div
            style={{
              width:
                "min(900px, 100%)",
              maxHeight:
                "90vh",
              overflowY:
                "auto",
              background:
                darkMode
                  ? "#172033"
                  : "#ffffff",
              borderRadius:
                "14px",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.25)",
              padding:
                "28px",
              color:
                darkMode
                  ? "#ffffff"
                  : "#10213f",
            }}
          >

            {/* MODAL HEADER */}

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start",
                marginBottom:
                  "28px",
              }}
            >

              <div>

                <h2
                  style={{
                    margin:
                      "0 0 8px",
                    fontSize:
                      "24px",
                  }}
                >
                  {addModal.type ===
                    "student" &&
                    "Add New Student"}

                  {addModal.type ===
                    "subject" &&
                    "Add New Subject"}

                  {addModal.type ===
                    "faculty" &&
                    "Add New Faculty"}

                  {addModal.type ===
                    "examination" &&
                    "Add New Examination"}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color:
                      darkMode
                        ? "#aebbd0"
                        : "#718096",
                  }}
                >
                  {addModal.type ===
                    "student" &&
                    "Enter student academic information"}

                  {addModal.type ===
                    "subject" &&
                    "Enter subject information"}

                  {addModal.type ===
                    "faculty" &&
                    "Enter faculty information"}

                  {addModal.type ===
                    "examination" &&
                    "Enter examination information"}
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeAddModal
                }
                style={{
                  width:
                    "40px",
                  height:
                    "40px",
                  border:
                    "1px solid #d8e0eb",
                  borderRadius:
                    "8px",
                  background:
                    "transparent",
                  cursor:
                    "pointer",
                  fontSize:
                    "22px",
                  color:
                    darkMode
                      ? "#ffffff"
                      : "#52627a",
                }}
              >
                ×
              </button>

            </div>

            {/* =================================================
                STUDENT FORM
            ================================================= */}

            {addModal.type ===
              "student" && (
              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(4, minmax(0, 1fr))",
                  gap:
                    "20px",
                }}
              >

                <FormField
                  label="Student Name *"
                  name="name"
                  placeholder="Enter student name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                />

                <FormField
                  label="Roll Number *"
                  name="rollNumber"
                  placeholder="Example: 22IT001"
                  value={
                    formData.rollNumber
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                />

                <SelectField
                  label="Branch *"
                  name="branch"
                  value={
                    formData.branch
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                  options={[
                    "IT",
                    "CSE",
                    "ECE",
                    "EEE",
                    "MECH",
                    "CIVIL",
                  ]}
                />

                <SelectField
                  label="Year *"
                  name="year"
                  value={
                    formData.year
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                  options={[
                    "1",
                    "2",
                    "3",
                    "4",
                  ]}
                  labels={[
                    "1st Year",
                    "2nd Year",
                    "3rd Year",
                    "4th Year",
                  ]}
                />

                <SelectField
                  label="Semester *"
                  name="semester"
                  value={
                    formData.semester
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                  options={[
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                  ]}
                  labels={[
                    "Semester 1",
                    "Semester 2",
                    "Semester 3",
                    "Semester 4",
                    "Semester 5",
                    "Semester 6",
                    "Semester 7",
                    "Semester 8",
                  ]}
                />

                <FormField
                  label="Attendance % *"
                  name="attendance"
                  type="number"
                  placeholder="Example: 85"
                  value={
                    formData.attendance
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                />

                <FormField
                  label="Marks *"
                  name="marks"
                  type="number"
                  placeholder="Enter marks"
                  value={
                    formData.marks
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                />

                {/* Email is retained for backend compatibility,
                    but kept on the next row. */}

                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter student email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                />

              </div>
            )}

            {/* =================================================
                SUBJECT FORM
            ================================================= */}

            {addModal.type ===
              "subject" && (
              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap:
                    "20px",
                }}
              >

                <FormField
                  label="Subject Code *"
                  name="code"
                  placeholder="Example: CS401"
                  value={
                    formData.code
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                />

                <FormField
                  label="Subject Name *"
                  name="name"
                  placeholder="Enter subject name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                />

                <SelectField
                  label="Department *"
                  name="department"
                  value={
                    formData.department
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                  options={[
                    "CSE",
                    "IT",
                    "ECE",
                    "EEE",
                    "MECH",
                    "CIVIL",
                  ]}
                />

                <SelectField
                  label="Semester *"
                  name="semester"
                  value={
                    formData.semester
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                  options={[
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                  ]}
                  labels={[
                    "Semester 1",
                    "Semester 2",
                    "Semester 3",
                    "Semester 4",
                    "Semester 5",
                    "Semester 6",
                    "Semester 7",
                    "Semester 8",
                  ]}
                />

              </div>
            )}

            {/* =================================================
                FACULTY FORM
            ================================================= */}

            {addModal.type ===
              "faculty" && (
              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap:
                    "20px",
                }}
              >

                <FormField
                  label="Faculty Name *"
                  name="name"
                  placeholder="Enter faculty name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                />

                <SelectField
                  label="Department *"
                  name="department"
                  value={
                    formData.department
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                  options={[
                    "CSE",
                    "IT",
                    "ECE",
                    "EEE",
                    "MECH",
                    "CIVIL",
                  ]}
                />

                <FormField
                  label="Subject *"
                  name="subject"
                  placeholder="Enter subject"
                  value={
                    formData.subject
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                />

              </div>
            )}

            {/* =================================================
                EXAMINATION FORM
            ================================================= */}

            {addModal.type ===
              "examination" && (
              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap:
                    "20px",
                }}
              >

                <FormField
                  label="Examination Name *"
                  name="name"
                  placeholder="Enter examination name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                />

                <SelectField
                  label="Status *"
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleFormChange
                  }
                  darkMode={
                    darkMode
                  }
                  options={[
                    "Scheduled",
                    "Completed",
                    "Upcoming",
                  ]}
                />

              </div>
            )}

            {/* =================================================
                MODAL BUTTONS
            ================================================= */}

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "flex-end",
                gap:
                  "12px",
                marginTop:
                  "30px",
                paddingTop:
                  "20px",
                borderTop:
                  darkMode
                    ? "1px solid #334155"
                    : "1px solid #e2e8f0",
              }}
            >

              <button
                type="button"
                onClick={
                  closeAddModal
                }
                style={{
                  padding:
                    "12px 24px",
                  border:
                    darkMode
                      ? "1px solid #475569"
                      : "1px solid #d5deea",
                  borderRadius:
                    "8px",
                  background:
                    "transparent",
                  color:
                    darkMode
                      ? "#ffffff"
                      : "#334155",
                  fontWeight:
                    "600",
                  cursor:
                    "pointer",
                  fontSize:
                    "14px",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleAddSubmit
                }
                style={{
                  padding:
                    "12px 26px",
                  border:
                    "none",
                  borderRadius:
                    "8px",
                  background:
                    "#2563eb",
                  color:
                    "#ffffff",
                  fontWeight:
                    "600",
                  cursor:
                    "pointer",
                  fontSize:
                    "14px",
                }}
              >

                {addModal.type ===
                  "student" &&
                  "Add Student"}

                {addModal.type ===
                  "subject" &&
                  "Add Subject"}

                {addModal.type ===
                  "faculty" &&
                  "Add Faculty"}

                {addModal.type ===
                  "examination" &&
                  "Add Examination"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// =========================================================
// REUSABLE FORM FIELD
// =========================================================

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  darkMode,
}) {
  return (
    <div
      style={{
        display:
          "flex",
        flexDirection:
          "column",
        gap:
          "8px",
      }}
    >

      <label
        style={{
          fontSize:
            "14px",
          fontWeight:
            "600",
          color:
            darkMode
              ? "#e5edf8"
              : "#10213f",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width:
            "100%",
          boxSizing:
            "border-box",
          padding:
            "13px 14px",
          border:
            darkMode
              ? "1px solid #475569"
              : "1px solid #d5deea",
          borderRadius:
            "8px",
          outline:
            "none",
          background:
            darkMode
              ? "#0f172a"
              : "#ffffff",
          color:
            darkMode
              ? "#ffffff"
              : "#243b5a",
          fontSize:
            "14px",
        }}
      />

    </div>
  );
}

// =========================================================
// REUSABLE SELECT FIELD
// =========================================================

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  labels,
  darkMode,
}) {
  return (
    <div
      style={{
        display:
          "flex",
        flexDirection:
          "column",
        gap:
          "8px",
      }}
    >

      <label
        style={{
          fontSize:
            "14px",
          fontWeight:
            "600",
          color:
            darkMode
              ? "#e5edf8"
              : "#10213f",
        }}
      >
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width:
            "100%",
          boxSizing:
            "border-box",
          padding:
            "13px 14px",
          border:
            darkMode
              ? "1px solid #475569"
              : "1px solid #d5deea",
          borderRadius:
            "8px",
          outline:
            "none",
          background:
            darkMode
              ? "#0f172a"
              : "#ffffff",
          color:
            darkMode
              ? "#ffffff"
              : "#243b5a",
          fontSize:
            "14px",
          cursor:
            "pointer",
        }}
      >

        {options.map(
          (
            option,
            index
          ) => (
            <option
              key={
                option
              }
              value={
                option
              }
            >
              {labels
                ? labels[
                    index
                  ]
                : option}
            </option>
          )
        )}

      </select>

    </div>
  );
}

// =========================================================
// STUDENT TABLE
// =========================================================

function StudentTable({
  students,
  deleteStudent,
}) {
  return (
    <div className="table-wrapper">

      <table>

        <thead>

          <tr>

            <th>
              Roll No
            </th>

            <th>
              Student Name
            </th>

            <th>
              Branch
            </th>

            <th>
              Year
            </th>

            <th>
              Sem
            </th>

            <th>
              Attendance
            </th>

            <th>
              Marks
            </th>

            <th>
              Grade
            </th>

            <th>
              Status
            </th>

            <th>
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {students.length ===
          0 ? (

            <tr>

              <td
                colSpan="10"
                style={{
                  textAlign:
                    "center",
                  padding:
                    "30px",
                }}
              >
                No students found
              </td>

            </tr>

          ) : (

            students.map(
              (
                student
              ) => (

                <tr
                  key={
                    student.id
                  }
                >

                  <td>
                    {
                      student.roll
                    }
                  </td>

                  <td className="student-name">
                    {
                      student.name
                    }
                  </td>

                  <td>
                    {
                      student.branch
                    }
                  </td>

                  <td>
                    {
                      student.year
                    }
                  </td>

                  <td>
                    {
                      student.sem
                    }
                  </td>

                  <td>

                    <div className="attendance-cell">

                      <span>
                        {
                          student.attendance
                        }%
                      </span>

                      <div className="attendance-bar">

                        <div
                          style={{
                            width:
                              `${student.attendance}%`,
                          }}
                        ></div>

                      </div>

                    </div>

                  </td>

                  <td>

                    <strong>
                      {
                        student.marks
                      }
                    </strong>

                  </td>

                  <td>

                    <span className="grade">
                      {
                        student.grade
                      }
                    </span>

                  </td>

                  <td>

                    <span
                      className={
                        student.status ===
                        "Pass"
                          ? "status pass"
                          : "status fail"
                      }
                    >
                      {
                        student.status
                      }
                    </span>

                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        title="Edit"
                        onClick={() =>
                          alert(
                            "Edit functionality will be connected to the backend next."
                          )
                        }
                      >
                        ✎
                      </button>

                      <button
                        className="delete-btn"
                        title="Delete"
                        onClick={() =>
                          deleteStudent(
                            student.id
                          )
                        }
                      >
                        🗑️
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )

          )}

        </tbody>

      </table>

    </div>
  );
}

export default App;