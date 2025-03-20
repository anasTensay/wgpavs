import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  FaTachometerAlt,
  FaUserTie,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaUsers,
  FaClipboardCheck,
  FaTimes,
  FaBuilding,
  FaPlus,
  FaChartLine,
  FaCog,
  FaHardHat,
} from "react-icons/fa";

const Sidebar = ({ showNav, onClose }) => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  const isOwnerAd = currentUser?.isComown;
  const isContractor = currentUser?.isContractor;
  const isOfficer = currentUser?.isOfficer;

  return (
    <aside
      className={`fixed lg:relative z-50 lg:z-auto ${showNav ? "translate-x-0" : "-translate-x-full"
        } transform transition-transform duration-300 ease-in-out bg-indigo-600 text-white min-h-screen w-73 p-4 shadow-lg`}
    >
      {/* Close Button for Small Screens */}
      <button
        className="lg:hidden text-white text-2xl mb-4 focus:outline-none hover:text-indigo-300 transition-colors"
        onClick={onClose}
        aria-label="Close Sidebar"
      >
        <FaTimes />
      </button>

      {/* Logo and System Name */}
      <div className="flex items-center mb-8 gap-2">
        <FaBuilding className="text-2xl" />
        <h2 className="text-xl font-semibold">System</h2>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2">
        {/* Main Menu */}
        {isOwnerAd && (
          <Link
            href="/dashboardOwn"
            className="flex items-center justify-between gap-5 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            <div className="flex">
              <FaTachometerAlt className="mr-3 text-lg" />
              <span>Dashboard Owner</span>
            </div>
            <FaPlus />
          </Link>
        )}
        {isAdmin && (
          <Link
            href="/dashboardAdm"
            className="flex items-center p-2 justify-between gap-5 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            <div className="flex">
              <FaTachometerAlt className="mr-3 text-lg" />
              <span>Dashboard Admin</span>
            </div>
            <FaPlus />
          </Link>
        )}
        {isContractor && (
          <Link
            href="/dashboardCont"
            className="flex items-center p-2 justify-between gap-5 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            <div className="flex">
              <FaTachometerAlt className="mr-3 text-lg" />
              <span>Dashboard Contractor</span>
            </div>
            <FaPlus />
          </Link>
        )}
        {isOfficer && (
          <Link
            href="/dashboardOfficer"
            className="flex items-center p-2 justify-between gap-5 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            <div className="flex">
              <FaTachometerAlt className="mr-3 text-lg" />
              <span>Dashboard Officer</span>
            </div>
            <FaPlus />
          </Link>
        )}

        {isAdmin && (
          <Link
            href="/ComownManagement "
            className="flex items-center justify-between gap-5 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            <div className="flex">
              <FaUserTie className="mr-3 text-lg" />
              <span>Owner Management</span>
            </div>
            <FaPlus />
          </Link>
        )}

        {(isAdmin || isOwnerAd) && (
          <Link
            href="/ContractorManagement"
            className="flex items-center justify-between gap-5 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            <div className="flex">
              <FaUserTie className="mr-3 text-lg" />
              <span>Contractor Management</span>
            </div>
            <FaPlus />
          </Link>
        )}

        {(isAdmin || isOwnerAd || isContractor || isOfficer) && (
          <Link
            href="/projectsPage"
            className="flex items-center justify-between gap-5 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            <div className="flex">
              <FaProjectDiagram className="mr-3 text-lg" />
              <span>Projects</span>
            </div>
            <FaPlus />
          </Link>
        )}

        {(isAdmin || isOwnerAd || isContractor) && (
          <Link
            href="/PaymentsPage"
            className="flex items-center justify-between gap-5 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            <div className="flex">
              <FaMoneyBillWave className="mr-3 text-lg" />
              <span>Payments</span>
            </div>
            <FaPlus />
          </Link>
        )}

        {(isAdmin || isOwnerAd || isContractor) && (
          <Link
            href="/workers"
            className="flex items-center justify-between gap-5 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            <div className="flex">
              <FaUsers className="mr-3 text-lg" />
              <span>Workers</span>
            </div>
            <FaPlus />
          </Link>
        )}

        {(isAdmin || isOwnerAd || isContractor) && (
          <Link
            href="/attendance"
            className="flex items-center justify-between gap-5 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            <div className="flex">
              <FaClipboardCheck className="mr-3 text-lg" />
              <span>Attendance</span>
            </div>
            <FaPlus />
          </Link>
        )}
        {(isAdmin || isContractor) && (
          <Link
            href="/officerSft"
            className="flex items-center justify-between gap-5 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            <div className="flex">
              <FaHardHat className="mr-3 text-lg" />
              <span>Officer Safty</span>
            </div>
            <FaPlus />
          </Link>
        )}
        {(isAdmin || isOwnerAd || isContractor) && (
          <Link
            href="/reports"
            className="flex items-center justify-between gap-5 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            <div className="flex">
              <FaChartLine className="mr-3 text-lg" />
              <span>Report</span>
            </div>
            <FaPlus />
          </Link>
        )}

        {/* إضافة أيقونات جديدة */}
        {(isAdmin || isOwnerAd) && (
          <Link
            href="/settings"
            className="flex items-center justify-between gap-5 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            <div className="flex">
              <FaCog className="mr-3 text-lg" />
              <span>Settings</span>
            </div>
            <FaPlus />
          </Link>
        )}


      </nav>
    </aside>
  );
};

export default Sidebar;