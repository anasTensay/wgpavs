import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AddProject = ({ onAdd }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [contractors, setContractors] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Automatically set contractor_id if the user is a contractor
  const contractor_id = currentUser?.isContractor ? currentUser._id : "";

  const [formData, setFormData] = useState({
    name: "",
    project_number: "",
    start_date: "",
    end_date: "",
    status: "Active",
    location: "",
    assigned_location: "",
    company_id: "",
    contractor_id: contractor_id, // Set contractor_id automatically
    notes: "",
    safetyType: "FAI",
    occurredOn: "",
    description: "",
    statusOfs: "open",
    schstartDate: "",
    schendDate: "",
    remarks: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchContractors();
    fetchCompanies();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/projects/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          safetyType: currentUser.isOfficer ? formData.safetyType : undefined,
          occurredOn: currentUser.isOfficer ? formData.occurredOn : undefined,
          description: currentUser.isOfficer ? formData.description : undefined,
          statusOfs: currentUser.isOfficer ? formData.statusOfs : undefined,
          schstartDate: currentUser.isContractor
            ? formData.schstartDate
            : undefined,
          schendDate: currentUser.isContractor
            ? formData.schendDate
            : undefined,
          remarks: currentUser.isContractor ? formData.remarks : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) onAdd();
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl mb-4">Add New Project</h3>
      <input
        type="text"
        name="project_number"
        value={formData.project_number}
        onChange={handleChange}
        placeholder="Project Number"
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
        required
      />

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Project Name"
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
        required
      />
      <select
        name="location"
        value={formData.location}
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
        value={formData.assigned_location}
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
        value={formData.start_date}
        onChange={handleChange}
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="date"
        name="end_date"
        value={formData.end_date}
        onChange={handleChange}
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
      >
        <option value="Active">Active</option>
        <option value="Expired">Expired</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Company List */}
      <select
        name="company_id"
        value={formData.company_id}
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

      {/* Contractor List - Only show if the user is not a contractor */}
      {!currentUser?.isContractor && (
        <select
          name="contractor_id"
          value={formData.contractor_id}
          onChange={handleChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
          required
        >
          <option value="">Select Contractor</option>
          {contractors.map((contractor) => (
            <option key={contractor._id} value={contractor._id}>
              {contractor.name}
            </option>
          ))}
        </select>
      )}

      {/* Notes Field */}
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Notes (Optional)"
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
      />

      {currentUser?.isOfficer && (
        <>
          <div>
            <label className="block text-gray-700">Safety Type:</label>
            <select
              value={formData.safetyType}
              onChange={(e) =>
                setFormData({ ...formData, safetyType: e.target.value })
              }
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
              value={formData.occurredOn}
              onChange={(e) =>
                setFormData({ ...formData, occurredOn: e.target.value })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Status:</label>
            <select
              value={formData.statusOfs}
              onChange={(e) =>
                setFormData({ ...formData, statusOfs: e.target.value })
              }
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
              value={formData.schstartDate}
              onChange={handleChange}
              className="block w-full p-2 mb-4 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Scheduled End Date</label>
            <input
              type="date"
              name="schendDate"
              value={formData.schendDate}
              onChange={handleChange}
              className="block w-full p-2 mb-4 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Remarks"
              className="block w-full p-2 mb-4 border border-gray-300 rounded"
            />
          </div>
        </>
      )}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add
      </button>
    </form>
  );
};

export default AddProject;