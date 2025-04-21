import { useState } from "react";
import { Route, Switch, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import OrdersPage from "./orders";
import ProductsPage from "./products";
import CustomersPage from "./customers";
import CategoriesPage from "./categories";
import AuctionsPage from "./auctions";
import SettingsPage from "./settings";

const Dashboard = () => {
  const [location] = useLocation();
  const [, params] = useRoute('/dashboard/:path*');
  
  const isActive = (path: string) => {
    if (path === "" && location === "/dashboard") return true;
    return location === `/dashboard/${path}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold dark:text-white">Admin Dashboard</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Button 
                variant={isActive("") ? "default" : "ghost"} 
                className="w-full justify-start"
                asChild
              >
                <a href="/dashboard">Overview</a>
              </Button>
            </li>
            <li>
              <Button 
                variant={isActive("orders") ? "default" : "ghost"} 
                className="w-full justify-start"
                asChild
              >
                <a href="/dashboard/orders">Orders</a>
              </Button>
            </li>
            <li>
              <Button 
                variant={isActive("products") ? "default" : "ghost"} 
                className="w-full justify-start"
                asChild
              >
                <a href="/dashboard/products">Products</a>
              </Button>
            </li>
            <li>
              <Button 
                variant={isActive("categories") ? "default" : "ghost"} 
                className="w-full justify-start"
                asChild
              >
                <a href="/dashboard/categories">Categories</a>
              </Button>
            </li>
            <li>
              <Button 
                variant={isActive("customers") ? "default" : "ghost"} 
                className="w-full justify-start"
                asChild
              >
                <a href="/dashboard/customers">Customers</a>
              </Button>
            </li>
            <li>
              <Button 
                variant={isActive("auctions") ? "default" : "ghost"} 
                className="w-full justify-start"
                asChild
              >
                <a href="/dashboard/auctions">Auctions</a>
              </Button>
            </li>
            <li>
              <Button 
                variant={isActive("settings") ? "default" : "ghost"} 
                className="w-full justify-start"
                asChild
              >
                <a href="/dashboard/settings">Settings</a>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Switch>
          // Update the dashboard overview content
          <Route path="/dashboard">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                      <h3 className="text-2xl font-bold mt-1">GH₵ 24,580.50</h3>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        12.5% from last month
                      </p>
                    </div>
                    <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
                      <h3 className="text-2xl font-bold mt-1">156</h3>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        8.2% from last month
                      </p>
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Auctions</p>
                      <h3 className="text-2xl font-bold mt-1">12</h3>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        3.5% from last month
                      </p>
                    </div>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</p>
                      <h3 className="text-2xl font-bold mt-1">1,245</h3>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        15.3% from last month
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Charts and Tables Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Sales Overview Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Sales Overview</h3>
                    <select className="text-sm border rounded p-1 dark:bg-slate-700 dark:border-slate-600">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Last 90 Days</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-center justify-center border-b pb-4 mb-4">
                    {/* Placeholder for chart */}
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p>Sales chart will be displayed here</p>
                      <p className="text-xs mt-1">Install a chart library like Chart.js or Recharts</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
                      <p className="font-semibold">GH₵ 12,450</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Average Order</p>
                      <p className="font-semibold">GH₵ 157.50</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
                      <p className="font-semibold">3.2%</p>
                    </div>
                  </div>
                </div>
                
                {/* Top Products */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                  <h3 className="font-semibold mb-4">Top Selling Products</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden mr-3">
                        <img 
                          src="/images/products/shea-butter.jpg" 
                          alt="Raw Shea Butter"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Raw Shea Butter</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">250 units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">GH₵ 6,250</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden mr-3">
                        <img 
                          src="/images/products/body-cream.jpg" 
                          alt="Shea Body Cream"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Shea Body Cream</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">180 units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">GH₵ 2,790</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden mr-3">
                        <img 
                          src="/images/products/shea-oil.jpg" 
                          alt="Shea Oil"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Shea Oil</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">120 units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">GH₵ 1,800</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden mr-3">
                        <img 
                          src="/images/products/shea-soap.jpg" 
                          alt="Shea Soap"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Shea Soap</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">95 units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">GH₵ 950</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="outline" className="w-full">View All Products</Button>
                  </div>
                </div>
              </div>
              
              {/* Recent Orders and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Recent Orders</h3>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="/dashboard/orders">View All</a>
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-700">
                      <div className="flex-1">
                        <p className="font-medium">#ORD-2458</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">John Doe • 2 hours ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">GH₵ 125.00</p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Pending
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-700">
                      <div className="flex-1">
                        <p className="font-medium">#ORD-2457</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Jane Smith • 5 hours ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">GH₵ 89.50</p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Processing
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-700">
                      <div className="flex-1">
                        <p className="font-medium">#ORD-2456</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Michael Johnson • 8 hours ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">GH₵ 210.75</p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          Shipped
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-700">
                      <div className="flex-1">
                        <p className="font-medium">#ORD-2455</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sarah Williams • 1 day ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">GH₵ 75.25</p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Delivered
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="flex-none mr-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">New order received</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Order #ORD-2458 from John Doe</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-none mr-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Order completed</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Order #ORD-2455 has been delivered</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">4 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-none mr-4">
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">New auction started</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Premium Shea Butter Auction is now live</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">6 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-none mr-4">
                        <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Low stock alert</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Raw Shea Butter is running low (5 units left)</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">12 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Route>
          <Route path="/dashboard/orders">
            <OrdersPage />
          </Route>
          <Route path="/dashboard/products">
            <ProductsPage />
          </Route>
          <Route path="/dashboard/categories">
            <CategoriesPage />
          </Route>
          <Route path="/dashboard/customers">
            <CustomersPage />
          </Route>
          <Route path="/dashboard/auctions">
            <AuctionsPage />
          </Route>
          <Route path="/dashboard/settings">
            <SettingsPage />
          </Route>
          <Route>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Page Not Found</h1>
              <p>The dashboard page you're looking for doesn't exist.</p>
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Dashboard;