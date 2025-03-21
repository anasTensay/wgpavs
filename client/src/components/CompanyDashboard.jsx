"use client"

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { FaEdit, FaTrash } from "react-icons/fa";
import SafetyReport from "./SafetyReport";
import AttendanceReport from "./AttendanceReport";
import { useSelector } from "react-redux";

Chart.register(...registerables);

const CompanyDashboard = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [contractors, setContractors] = useState([]);
  const [contractorsProject, setContractorsProject] = useState([]);
  const [projects, setProjects] = useState([]);
  const [attendanceReports, setAttendanceReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const companyId = currentUser?._id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contractorsRes, projectsRes, reportsRes] = await Promise.all([
          fetch(`${apiUrl}/api/contractors/${companyId}`).then((res) => res.json()),
          fetch(`${apiUrl}/api/projects/company/${companyId}`).then((res) => res.json()),
          fetch(`${apiUrl}/api/attendance`).then((res) => res.json()),
        ]);

        setContractors(contractorsRes);
        setProjects(projectsRes);
        setAttendanceReports(reportsRes);
      } catch (err) {
        setError("An error occurred while fetching data");
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, companyId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contractorsRes = await fetch(
          `${apiUrl}/api/projects/project-counts?companyId=${companyId}`
        ).then((res) => res.json());

        setContractorsProject(contractorsRes);
      } catch (err) {
        setError("An error occurred while fetching data");
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, companyId]);

  const chartData = {
    labels: attendanceReports?.map((report) => report.project_name),
    datasets: [
      {
        label: "Attendance",
        data: attendanceReports?.map((report) => report.attendance_count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Absence",
        data: attendanceReports?.map((report) => report.absence_count),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">
        Company Owner Dashboard
      </h1>

      {/* Project Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Project Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">Company</th>
                <th className="border p-3 text-left">Project ID</th>
                <th className="border p-3 text-left">Project Name</th>
                <th className="border p-3 text-left">Location</th>
                <th className="border p-3 text-left">End User</th>

                <th className="border p-3 text-left">Project Status</th>
                <th className="border p-3 text-left">Start Date</th>
                <th className="border p-3 text-left">End Date</th>
                <th className="border p-3 text-left">Will Work Next Week</th>
                <th className="border p-3 text-left">Upcoming Week Schedule</th>
              </tr>
            </thead>
            <tbody>
              {projects?.map((project) => (
                <tr key={project._id} className="border-b hover:bg-gray-50">
                  <td className="border p-3">{currentUser.name || "N/A"}</td>
                  <td className="border p-3">{project.project_number}</td>
                  <td className="border p-3">{project.name}</td>
                  <td className="border p-3">{project.location}</td>
                  <td className="border p-3">{project.contractor_id?.name || "N/A"}</td>
                  <td className="border p-3">{project.status}</td>
                  <td className="border p-3">{new Date(project.start_date).toLocaleDateString()}</td>
                  <td className="border p-3">{new Date(project.end_date).toLocaleDateString()}</td>
                  <td className="border p-3">{project.contractorWillWorkNextWeek ? "Yes" : "No"}</td>
                  <td className="border p-3">{project.upcomingWeekSchedule || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contractor Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Contractor Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="border p-3 text-left">
                  Cybersecurity Cert expire date
                </th>
                <th className="border p-3 text-left">
                  Pre-Qualification expire date
                </th>
                <th className="border p-3 text-left">Saudizaion</th>
                <th className="border p-3 text-left">Iktva</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contractors?.map((contractor) => (
                <tr key={contractor._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{contractor.name}</td>
                  <td className="p-3">{contractor.email}</td>
                  <td className="p-3">{contractor.phoneNumber}</td>
                  <td className="border p-3">
                    {new Date(contractor.start_date).toLocaleDateString()}
                  </td>
                  <td className="border p-3">
                    {new Date(contractor.end_date).toLocaleDateString()}
                  </td>
                  <td className="border p-3">
                    <p>{contractor.amount}%</p>
                  </td>
                  <td className="border p-3">
                    <p>{contractor.Iktva}%</p>
                  </td>
                  <td className="p-3">
                    <button className="text-blue-500 hover:text-blue-700 mr-2">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Contractor Projects Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Contractor Name</th>
                <th className="p-3 text-left">Contractor ID</th>
                <th className="p-3 text-left">Total Projects</th>
                <th className="p-3 text-left">Active Projects</th>
                <th className="p-3 text-left">Expired Projects</th>
                <th className="p-3 text-left">Completed Projects</th>
              </tr>
            </thead>
            <tbody>
              {contractorsProject.map((contractor) => {
                // حساب عدد المشاريع لكل مقاول
                const contractorProjects = projects.filter(
                  (project) => project.contractor_id === contractor._id
                );

                const totalProjects = contractorProjects.length;
                const activeProjects = contractorProjects.filter(
                  (project) => project.status === "Active"
                ).length;
                const expiredProjects = contractorProjects.filter(
                  (project) => project.status === "Expired"
                ).length;
                const completedProjects = contractorProjects.filter(
                  (project) => project.status === "Completed"
                ).length;

                return (
                  <tr
                    key={contractor._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{contractor.name}</td>
                    <td className="p-3">{contractor._id}</td>
                    <td className="p-3">{totalProjects}</td>
                    <td className="p-3">{activeProjects}</td>
                    <td className="p-3">{expiredProjects}</td>
                    <td className="p-3">{completedProjects}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <SafetyReport />
      {/* Attendance Reports */}
      <AttendanceReport apiUrl={apiUrl} />
    </div>
  );
};

export default CompanyDashboard;