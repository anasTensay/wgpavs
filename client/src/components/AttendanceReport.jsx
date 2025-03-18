// AttendanceReport.js
import React from "react";

const AttendanceReport = ({ apiUrl }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Attendance Report</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Project Name</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Attendance Count</th>
              <th className="p-3 text-left">Absence Count</th>
            </tr>
          </thead>
          <tbody>
            {/* سيتم ملء البيانات هنا */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReport;