"use client"

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SafetyOfficerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [safetyStats, setSafetyStats] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/projects`);
      const data = await res.json();
      if (res.ok) setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchSafetyStats = async (projectId) => {
    try {
      const res = await fetch(`${apiUrl}/api/projects/${projectId}/safety-stats`);
      const data = await res.json();
      if (res.ok) setSafetyStats(data);
    } catch (error) {
      console.error("Error fetching safety stats:", error);
    }
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    if (projectId) {
      fetchSafetyStats(projectId);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl mb-4">لوحة تحكم ضابط السلامة</h3>
      <div className="mb-4">
        <label className="block text-gray-700">اختر مشروعًا:</label>
        <select
          value={selectedProject}
          onChange={handleProjectChange}
          className="block w-full p-2 border border-gray-300 rounded"
        >
          <option value="">اختر مشروعًا</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      {selectedProject && (
        <div className="mt-6">
          <h4 className="text-lg mb-4">إحصائيات السلامة</h4>
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">النوع</th>
                <th className="border p-3 text-left">عدد الحوادث</th>
                <th className="border p-3 text-left">عدد الملاحظات</th>
                <th className="border p-3 text-left">عدد التحقيقات</th>
              </tr>
            </thead>
            <tbody>
              {safetyStats.map((stat, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-3">{stat.type}</td>
                  <td className="border p-3">{stat.incidents}</td>
                  <td className="border p-3">{stat.observations}</td>
                  <td className="border p-3">{stat.investigations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SafetyOfficerDashboard;