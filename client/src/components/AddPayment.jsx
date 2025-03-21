import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AddPayment = ({ onAdd }) => {
  const [amount, setAmount] = useState("");
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [paymentDate, setPaymentDate] = useState("");
  const [contractorId, setContractorId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  // Automatically set contractor_id if the user is a contractor
  const contractor_Id = currentUser?.isContractor ? currentUser._id : "";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (projectId) {
      const fetchContractors = async () => {
        try {

          let url = `${apiUrl}/api/payments?project_id=${projectId}`;

          // إذا كان المستخدم من نوع "شركة"، نضيف companyId إلى الـ URL
          if (currentUser.isComown) {
            url = `${apiUrl}/api/payments/${currentUser._id}?project_id=${projectId}`;
          }

          const res = await fetch(url, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) {
            const total = data.reduce((sum, payment) => sum + payment.amount, 0);
            setTotalAmount(total);
          }
        } catch (error) {
          console.error("Error fetching payments:", error);
        };
      }
      fetchContractors()
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjects();
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      let url = `${apiUrl}/api/contractors`;

      // إذا كان المستخدم من نوع "شركة"، نضيف companyId إلى الـ URL
      if (currentUser.isComown) {
        url = `${apiUrl}/api/contractors/${currentUser._id}`;
      }

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setContractors(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching contractors' data:",
        error
      );
    }
  };

  const fetchProjects = async () => {
    try {
      let url = `${apiUrl}/api/projects`;

      // إذا كان المستخدم من نوع "شركة"، نضيف companyId إلى الـ URL
      if (currentUser.isComown) {
        url = `${apiUrl}/api/projects/company/${currentUser._id}`;
      }

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setProjects(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error("An error occurred while fetching projects' data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate data
    if (!amount || !paymentDate || !projectId || !remarks) {
      alert("Please fill in all fields");
      return;
    }

    if (amount > 100) {
      alert("The value must not exceed 100%");
      return;
    }

    // التحقق من أن المجموع لا يتجاوز 100%
    try {
      const res = await fetch(`${apiUrl}/api/payments/${currentUser._id}?project_id=${projectId}`);
      const data = await res.json();
      const totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0);
      if (totalAmount + amount > 100) {
        alert("Total payment amount cannot exceed 100%");
        return;
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      alert("An error occurred while validating the payment amount");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: currentUser?.isComown ? currentUser._id : "",
          amount: parseFloat(amount),
          payment_status: paymentStatus,
          payment_date: paymentDate,
          project_id: projectId,
          contractor_id: currentUser?.isContractor ? contractor_Id : contractorId, // ✅ الحل الصحيح
          remarks,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onAdd(); // Refresh the list after adding
        setAmount("");
        setPaymentStatus("Unpaid");
        setPaymentDate("");
        setProjectId("");
        setRemarks("");
        alert("Payment added successfully!");
      } else {
        alert(data.message || "An error occurred while adding the payment");
      }
    } catch (error) {
      console.error("Error while adding the payment:", error);
      alert("An error occurred. Please try again.");
    }
  };
  // Handle project selection change
  const handleProjectChange = (e) => {
    const selectedProjectId = e.target.value;
    setProjectId(selectedProjectId);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl mb-4">Add New Payment</h3>

      {/* Project selection field */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Project:</label>
        <select
          value={projectId}
          onChange={handleProjectChange}
          className="block w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Contractor field - Only show if the user is not a contractor */}
      {!currentUser?.isContractor && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Contractor:</label>
          <select
            value={contractorId}
            onChange={(e) => setContractorId(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Contractor</option>
            {contractors.map((contractor) => (
              <option key={contractor._id} value={contractor._id}>
                {contractor.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Total Amount:</label>
        <input
          type="text"
          value={`${totalAmount}%`}
          readOnly
          className="block w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Amount field (must not exceed 100%) */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Amount (%):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in percentage"
          className="block w-full p-2 border border-gray-300 rounded"
          min="0"
          max={100 - totalAmount}
          required
        />
      </div>

      {/* Payment status field */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Payment Status:</label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="Paid">Paid</option>
          <option value="Submitted">Submitted</option>
          <option value="Under-approval">Under-approval</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Payment date field */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Payment Date:</label>
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      {/* Remarks field */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Remarks:</label>
        <input
          type="text"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter remarks"
          className="block w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      {/* Add button */}
      <button
        type="submit"
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
      >
        Add Payment
      </button>
    </form>
  );
};

export default AddPayment;