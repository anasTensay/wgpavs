import React, { useState, useEffect } from "react";

const AttendanceReport = ({ apiUrl }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/attendance`);
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [apiUrl]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
            {attendanceData.map((report) => (
              <tr key={report._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{report.project_name}</td>
                <td className="p-3">{new Date(report.date).toLocaleDateString()}</td>
                <td className="p-3">{report.attendance_count}</td>
                <td className="p-3">{report.absence_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReport;