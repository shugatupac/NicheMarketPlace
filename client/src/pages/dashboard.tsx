import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { ProductManagement } from "@/components/dashboard/product-management";

export default function Dashboard() {
  const [location] = useLocation();
  
  // Check if user is authenticated
  // This would typically check your auth context
  const isAuthenticated = true; // Replace with actual auth check
  
  if (!isAuthenticated) {
    // Redirect to login page
    window.location.href = "/sign-in";
    return null;
  }
  
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/dashboard" component={DashboardOverview} />
        <Route path="/dashboard/products" component={ProductManagement} />
        {/* Add more routes for other dashboard sections */}
        <Route>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Page Not Found</h2>
              <p className="mt-2">The dashboard page you're looking for doesn't exist.</p>
            </div>
          </div>
        </Route>
      </Switch>
    </DashboardLayout>
  );
}