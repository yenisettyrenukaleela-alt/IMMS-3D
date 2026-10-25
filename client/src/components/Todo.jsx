import React from "react";

function Todo({ student }) {

  return (
    <div className="student-row">

      <span>{student.rollNo}</span>

      <strong>{student.name}</strong>

      <span>{student.branch}</span>

      <span>{student.year}</span>

      <span>{student.sem}</span>

      <span>{student.attendance}%</span>

      <span>{student.marks}</span>

      <span>
        <b className={`grade grade-${student.grade}`}>
          {student.grade}
        </b>
      </span>

      <span>
        <b
          className={
            student.status === "Pass"
              ? "status-pass"
              : "status-fail"
          }
        >
          {student.status}
        </b>
      </span>

      <span className="row-actions">
        <button>✎</button>
        <button>⌫</button>
      </span>

    </div>
  );
}

export default Todo;