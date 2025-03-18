"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useQuery } from "@tanstack/react-query";

Chart.register(...registerables);

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchData = async (endpoint) => {
  try {
    const res = await fetch(`${apiUrl}${endpoint}`);
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  } catch (error) {
    throw new Error("An error occurred while fetching data");
  }
};

const ContractorDashboard = () => {
  const [activeTab, setActiveTab] = useState("workforce");

  // Query configurations
  const {
    data: contractors = [],
    isLoading: contractorsLoading,
    isError: contractorsError,
  } = useQuery({
    queryKey: ["contractors"],
    queryFn: () => fetchData("/api/workers/worker-counts"),
  });

  const {
    data: workers,
    isLoading: workersLoading,
    isError: workersError,
  } = useQuery({
    queryKey: ["workers"],
    queryFn: () => fetchData("/api/workers"),
  });

  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchData("/api/projects"),
  });

  const {
    data: dailyReports = [],
    isLoading: dailyReportsLoading,
    isError: dailyReportsError,
  } = useQuery({
    queryKey: ["dailyReports"],
    queryFn: () => fetchData("/api/attendance"),
  });

  const {
    data: safetyReports = [],
    isLoading: safetyReportsLoading,
    isError: safetyReportsError,
  } = useQuery({
    queryKey: ["safetyReports"],
    queryFn: () => fetchData("/api/projects/safety-report"),
  });

  // Show toast notifications when errors occur
  useEffect(() => {
    if (contractorsError || workersError || projectsError || dailyReportsError || safetyReportsError) {
      toast.error("An error occurred while fetching data");
    }
  }, [contractorsError, workersError, projectsError, dailyReportsError, safetyReportsError]);

  // Loading state check
  if (
    contractorsLoading ||
    workersLoading ||
    projectsLoading ||
    dailyReportsLoading ||
    safetyReportsLoading
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state check (without toast here)
  if (contractorsError || workersError || projectsError || dailyReportsError || safetyReportsError) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl text-red-500 font-bold mb-2">Error</h2>
          <p>Failed to load dashboard data. Please try again later.</p>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare charts data
  const attendanceData = {
    labels: dailyReports.map((report) => new Date(report.date).toLocaleDateString()),
    datasets: [
      {
        label: "Daily Attendance",
        data: dailyReports.map((report) => report.attendance_count),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Workforce distribution data (Saudi vs Non-Saudi)
  const workforceData = {
    labels: ["Saudi", "Non-Saudi"],
    datasets: [
      {
        label: "Worker Distribution",
        data: [
          contractors.reduce((total, c) => total + c.saudiWorkers, 0),
          contractors.reduce((total, c) => total + c.nonSaudiWorkers, 0)
        ],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Prepare job title distribution data
  const jobTitlesData = {
    labels: ["WPR", "Supervisor", "Safety Officer", "Helper", "HVAC", "Elect", "PCST", "Welder", "Fabricator", "Metal", "Machinist"],
    datasets: [
      {
        label: "Workers by Job Title",
        data: [
          contractors.reduce((total, c) => total + c.wprWorkers, 0),
          contractors.reduce((total, c) => total + c.supervisorWorkers, 0),
          contractors.reduce((total, c) => total + c.safetyOfficerWorkers, 0),
          contractors.reduce((total, c) => total + c.helperWorkers, 0),
          contractors.reduce((total, c) => total + c.hvacWorkers, 0),
          contractors.reduce((total, c) => total + c.electWorkers, 0),
          contractors.reduce((total, c) => total + c.pcstWorkers, 0),
          contractors.reduce((total, c) => total + c.welderWorkers, 0),
          contractors.reduce((total, c) => total + c.fabricatorWorkers, 0),
          contractors.reduce((total, c) => total + c.metalWorkers, 0),
          contractors.reduce((total, c) => total + c.machinistWorkers, 0),
        ],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Safety incidents data
  const mergeSafetyData = (data) => {
    return data.reduce((acc, curr) => {
      const existingContractor = acc.find(
        (item) => item.contractorName === curr.contractorName
      );

      if (existingContractor) {
        existingContractor.ytdFAI += curr.ytdFAI;
        existingContractor.ofFAINotCompleted += curr.ofFAINotCompleted;
        existingContractor.ytdObservation += curr.ytdObservation;
        existingContractor.ofObservationNotCompleted += curr.ofObservationNotCompleted;
        existingContractor.ytdIncident += curr.ytdIncident;
        existingContractor.ofIncidentNotCompleted += curr.ofIncidentNotCompleted;
        existingContractor.totalNotClosed += curr.totalNotClosed;
      } else {
        acc.push({ ...curr });
      }

      return acc;
    }, []);
  };

  // Safety chart data preparation
  const safetyData = {
    labels: mergeSafetyData(safetyReports).map((report) => report.contractorName),
    datasets: [
      {
        label: "FAI",
        data: mergeSafetyData(safetyReports).map((report) => report.ytdFAI),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Observations",
        data: mergeSafetyData(safetyReports).map((report) => report.ytdObservation),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Incidents",
        data: mergeSafetyData(safetyReports).map((report) => report.ytdIncident),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "Near-miss",
        data: mergeSafetyData(safetyReports).map((report) => report.ytdIncident),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Calculate summary statistics
  const totalWorkers = contractors.reduce((sum, contractor) => sum + contractor.totalWorkers, 0);
  const totalSaudiWorkers = contractors.reduce((sum, contractor) => sum + contractor.saudiWorkers, 0);
  const totalNonSaudiWorkers = contractors.reduce((sum, contractor) => sum + contractor.nonSaudiWorkers, 0);
  const saudiPercentage = totalWorkers > 0 ? ((totalSaudiWorkers / totalWorkers) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Contractor Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Workers</h3>
          <p className="text-3xl font-bold text-blue-600">{totalWorkers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Saudi Workers</h3>
          <p className="text-3xl font-bold text-green-600">{totalSaudiWorkers} <span className="text-sm text-gray-500">({saudiPercentage}%)</span></p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Non-Saudi Workers</h3>
          <p className="text-3xl font-bold text-purple-600">{totalNonSaudiWorkers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Contractors</h3>
          <p className="text-3xl font-bold text-orange-600">{contractors.length}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex overflow-x-auto">
          <button
            className={`px-6 py-3 text-lg font-medium border-b-2 ${activeTab === "workforce" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab("workforce")}
          >
            Workforce
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium border-b-2 ${activeTab === "attendance" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab("attendance")}
          >
            Attendance
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium border-b-2 ${activeTab === "safety" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab("safety")}
          >
            Safety
          </button>
        </div>
      </div>

      {/* Workforce Tab Content */}
      {activeTab === "workforce" && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Workforce Report</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 text-left">Contractor Name</th>
                    <th className="p-3 text-left">Total Workers</th>
                    <th className="p-3 text-left">Saudi Workers</th>
                    <th className="p-3 text-left">Non-Saudi Workers</th>
                  </tr>
                </thead>
                <tbody>
                  {contractors.slice(0, 30).map((contractor) => (
                    <tr key={contractor._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{contractor.name}</td>
                      <td className="p-3">{contractor.totalWorkers}</td>
                      <td className="p-3">{contractor.saudiWorkers}</td>
                      <td className="p-3">{contractor.nonSaudiWorkers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Saudi vs Non-Saudi Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Workforce Nationality Distribution</h2>
              <div className="h-64">
                <Bar
                  data={workforceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Saudi vs Non-Saudi Workers'
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Job Titles Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Job Title Distribution</h2>
              <div className="h-64">
                <Bar
                  data={jobTitlesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Worker Management Table */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Workforce Management</h2>
              <div className="flex">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2">
                  Export to Excel
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                  Print Report
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left font-semibold">Contractor Name</th>
                    <th className="p-3 text-left font-semibold">Total Workers</th>
                    <th className="p-3 text-left font-semibold">Saudi</th>
                    <th className="p-3 text-left font-semibold">Non-Saudi</th>
                    <th className="p-3 text-left font-semibold">WPR</th>
                    <th className="p-3 text-left font-semibold">Supervisor</th>
                    <th className="p-3 text-left font-semibold">Safety Officer</th>
                    <th className="p-3 text-left font-semibold">Helper</th>
                    <th className="p-3 text-left font-semibold">HVAC</th>
                    <th className="p-3 text-left font-semibold">Elect</th>
                    <th className="p-3 text-left font-semibold">PCST</th>
                    <th className="p-3 text-left font-semibold">Welder</th>
                    <th className="p-3 text-left font-semibold">Fabricator</th>
                    <th className="p-3 text-left font-semibold">Metal</th>
                    <th className="p-3 text-left font-semibold">Machinist</th>
                  </tr>
                </thead>
                <tbody>
                  {contractors.map((contractor, index) => (
                    <tr
                      key={contractor._id || index}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium">{contractor.name}</td>
                      <td className="p-3">{contractor.totalWorkers}</td>
                      <td className="p-3">{contractor.saudiWorkers}</td>
                      <td className="p-3">{contractor.nonSaudiWorkers}</td>
                      <td className="p-3">{contractor.wprWorkers}</td>
                      <td className="p-3">{contractor.supervisorWorkers}</td>
                      <td className="p-3">{contractor.safetyOfficerWorkers}</td>
                      <td className="p-3">{contractor.helperWorkers}</td>
                      <td className="p-3">{contractor.hvacWorkers}</td>
                      <td className="p-3">{contractor.electWorkers}</td>
                      <td className="p-3">{contractor.pcstWorkers}</td>
                      <td className="p-3">{contractor.welderWorkers}</td>
                      <td className="p-3">{contractor.fabricatorWorkers}</td>
                      <td className="p-3">{contractor.metalWorkers}</td>
                      <td className="p-3">{contractor.machinistWorkers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Attendance Tab Content */}
      {activeTab === "attendance" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Daily Attendance Report</h2>
          <div className="w-full h-96">
            <Line
              data={attendanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Workers'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Date'
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `Attendance: ${context.parsed.y} workers`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Safety Tab Content */}
      {activeTab === "safety" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Safety Incidents by Contractor
          </h2>
          <div className="w-full h-96">
            <Bar
              data={safetyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Number of Incidents",
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Contractor",
                    },
                  },
                },
              }}
            />
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Safety Incidents Summary
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left font-semibold">Contractor</th>
                    <th className="p-3 text-left font-semibold">YTD FAI</th>
                    <th className="p-3 text-left font-semibold">
                      FAI Not Completed
                    </th>
                    <th className="p-3 text-left font-semibold">
                      YTD Observations
                    </th>
                    <th className="p-3 text-left font-semibold">
                      Observations Not Completed
                    </th>
                    <th className="p-3 text-left font-semibold">
                      YTD Incidents
                    </th>
                    <th className="p-3 text-left font-semibold">
                      Incidents Not Completed
                    </th>
                    <th className="p-3 text-left font-semibold">
                      Total Not Closed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mergeSafetyData(safetyReports).map((report, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">
                        {report.contractorName}
                      </td>
                      <td className="p-3">{report.ytdFAI}</td>
                      <td className="p-3">{report.ofFAINotCompleted}</td>
                      <td className="p-3">{report.ytdObservation}</td>
                      <td className="p-3">
                        {report.ofObservationNotCompleted}
                      </td>
                      <td className="p-3">{report.ytdIncident}</td>
                      <td className="p-3">{report.ofIncidentNotCompleted}</td>
                      <td className="p-3 font-medium text-red-500">
                        {report.totalNotClosed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorDashboard;