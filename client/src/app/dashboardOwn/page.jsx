import AdminDashboard from "@/components/AdminDashboard";
import CompanyDashboard from "@/components/CompanyDashboard";
import ContractorDashboard from "@/components/ContractorDashboard";
import Layout from "@/components/Layout";
import React from "react";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  return (
    <Layout>
      <CompanyDashboard />
      <ContractorDashboard />
    </Layout>
  );
}
