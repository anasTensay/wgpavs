"use client"

import React, { useEffect, useState } from "react";
import AddProject from "./AddProject";
import { useSelector } from "react-redux";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    project_number: "",
    start_date: "",
    end_date: "",
    status: "Active",
    location: "",
    assigned_location: "",
    company_id: "",
    contractor_id: "",
    notes: "",
    safetyType: "FAI",
    occurredOn: "",
    description: "",
    statusOfs: "open",
    schstartDate: "",
    schendDate: "",
    remarks: "",
  });
  const [contractors, setContractors] = useState([]);
  const [companies, setCompanies] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchProjects();
    fetchContractors();
    fetchCompanies();
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

  const fetchContractors = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/contractors`);
      const data = await res.json();
      if (res.ok) setContractors(data);
    } catch (error) {
      console.error("Error fetching contractors:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/authComown`);
      const data = await res.json();
      if (res.ok) setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setEditFormData(project); // تعيين بيانات المشروع المحدد
    setShowEditPopup(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/projects/${selectedProject._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowEditPopup(false);
        fetchProjects();
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">إدارة المشاريع</h2>
      <AddProject onAdd={fetchProjects} />
      {/* عرض قائمة المشاريع */}
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Project Name</th>
              <th className="border p-3 text-left">Project Number</th>
              <th className="border p-3 text-left">Start Date</th>
              <th className="border p-3 text-left">End Date</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="hover:bg-gray-50">
                <td className="border p-3">{project.name}</td>
                <td className="border p-3">{project.project_number}</td>
                <td className="border p-3">
                  {new Date(project.start_date).toLocaleDateString()}
                </td>
                <td className="border p-3">
                  {new Date(project.end_date).toLocaleDateString()}
                </td>
                <td className="border p-3">{project.status}</td>
                <td className="border p-3">
                  <button
                    onClick={() => handleEditClick(project)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    تعديل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نافذة التعديل */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              تعديل المشروع
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleChange}
                placeholder="Project Name"
                className="block w-full p-2 mb-4 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="project_number"
                value={editFormData.project_number}
                onChange={handleChange}
                placeholder="Project Number"
                className="block w-full p-2 mb-4 border border-gray-300 rounded"
                required
              />
              <select
                name="location"
                value={editFormData.location}
                onChange={handleChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded"
              >
                <option value="">location</option>
                <option value="NGL">NGL</option>
                <option value="Flare-Area">Flare Area</option>
                <option value="SRU-HU">SRU-HU</option>
                <option value="FG">FG</option>
                <option value="UT">UT</option>
                <option value="Cogen">Cogen</option>
                <option value="Off-Site">Off Site</option>
                <option value="Sulfur-Loading">Sulfur Loading</option>
                <option value="Handlling">Handlling</option>
              </select>
              <select
                name="assigned_location"
                value={editFormData.assigned_location}
                onChange={handleChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded"
              >
                <option value="">End-User</option>
                <option value="NGL">NGL</option>
                <option value="Degital">Degital</option>
                <option value="GT">GT</option>
                <option value="SRU">SRU</option>
                <option value="FG">FG</option>
                <option value="UT">UT</option>
                <option value="Elect">Elect</option>
                <option value="PSCT">PSCT</option>
                <option value="CU">CU</option>
                <option value="T&l">T&l</option>
                <option value="Multi-Craft">Multi Craft</option>
                <option value="PZV">PZV</option>
                <option value="HVAC">HVAC</option>
              </select>
              <input
                type="date"
                name="start_date"
                value={editFormData.start_date}
                onChange={handleChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <input
                type="date"
                name="end_date"
                value={editFormData.end_date}
                onChange={handleChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <select
                name="status"
                value={editFormData.status}
                onChange={handleChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                name="company_id"
                value={editFormData.company_id}
                onChange={handleChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded"
                required
              >
                <option value={""}>Select Company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <select
                name="contractor_id"
                value={editFormData.contractor_id}
                onChange={handleChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded"
                required
              >
                <option value="">
                  {currentUser.isContractor ? currentUser.name : "Select Contractor"}
                </option>
                {contractors.map((contractor) => (
                  <option key={contractor._id} value={contractor._id}>
                    {contractor.name}
                  </option>
                ))}
              </select>
              <textarea
                name="notes"
                value={editFormData.notes}
                onChange={handleChange}
                placeholder="Notes (Optional)"
                className="block w-full p-2 mb-4 border border-gray-300 rounded"
              />
              {currentUser?.isOfficer && (
                <>
                  <div>
                    <label className="block text-gray-700">Safety Type:</label>
                    <select
                      name="safetyType"
                      value={editFormData.safetyType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    >
                      <option value="FAI">FAI</option>
                      <option value="NEAR-MISS">NEAR-MISS</option>
                      <option value="Observation">Observation</option>
                      <option value="Incident">Incident</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700">Occurred On:</label>
                    <input
                      type="date"
                      name="occurredOn"
                      value={editFormData.occurredOn}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Description:</label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Status:</label>
                    <select
                      name="statusOfs"
                      value={editFormData.statusOfs}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    >
                      <option value="open">open</option>
                      <option value="closed">closed</option>
                      <option value="under-investigation">under-investigation</option>
                    </select>
                  </div>
                </>
              )}
              {currentUser?.isContractor && (
                <>
                  <div>
                    <label className="block text-gray-700">Scheduled Start Date</label>
                    <input
                      type="date"
                      name="schstartDate"
                      value={editFormData.schstartDate}
                      onChange={handleChange}
                      className="block w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Scheduled End Date</label>
                    <input
                      type="date"
                      name="schendDate"
                      value={editFormData.schendDate}
                      onChange={handleChange}
                      className="block w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Remarks</label>
                    <textarea
                      name="remarks"
                      value={editFormData.remarks}
                      onChange={handleChange}
                      placeholder="Remarks"
                      className="block w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;