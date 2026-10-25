import React from "react";

function ListTodo({ children }) {

  return (
    <div className="student-table">

      <div className="student-table-head">

        <span>Roll No</span>
        <span>Student Name</span>
        <span>Branch</span>
        <span>Year</span>
        <span>Sem</span>
        <span>Attendance</span>
        <span>Marks</span>
        <span>Grade</span>
        <span>Status</span>
        <span>Action</span>

      </div>

      <div className="student-table-body">
        {children}
      </div>

    </div>
  );
}

export default ListTodo;