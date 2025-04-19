import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, Supplier, Order } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const SupplierDashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Query for supplier data
  const { data: supplier, isLoading: supplierLoading } = useQuery<Supplier>({
    queryKey: [`/api/suppliers/user/${user?.id}`],
    enabled: isAuthenticated && user?.role === "supplier",
  });
  
  // Query for supplier products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: [`/api/products?supplierId=${supplier?.id}`],
    enabled: !!supplier?.id,
  });
  
  // For demo purposes, we'll create some mock orders
  const recentOrders = [
    {
      id: 1,
      productName: "Raw Unrefined Shea Butter",
      customer: "Kofi Annan",
      date: "2023-05-15",
      amount: 105.00,
      status: "delivered"
    },
    {
      id: 2,
      productName: "Organic Shea Body Cream",
      customer: "Abena Poku",
      date: "2023-05-12",
      amount: 45.00,
      status: "processing"
    },
    {
      id: 3,
      productName: "African Black Soap with Shea",
      customer: "Kwaku Mensah",
      date: "2023-05-10",
      amount: 40.00,
      status: "pending"
    }
  ];
  
  // If not authenticated or not a supplier
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Supplier Access Required</h2>
        <p className="mb-4">Please sign in with a supplier account to access the dashboard.</p>
        <Button
          onClick={() => window.location.href = "/login"}
        >
          Sign In
        </Button>
      </div>
    );
  }
  
  if (user && user.role !== "supplier") {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Supplier Access Required</h2>
        <p className="mb-4">This dashboard is only available to supplier accounts.</p>
        <Button
          onClick={() => window.location.href = "/"}
        >
          Return to Homepage
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-4 md:mb-0">
          Supplier Dashboard
        </h1>
        
        <div>
          <Button className="bg-secondary hover:bg-secondary-dark">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add New Product
          </Button>
        </div>
      </div>
      
      {supplierLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        </div>
      ) : supplier ? (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4 mb-4 md:mb-0">
              {supplier.businessName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-montserrat font-bold">{supplier.businessName}</h2>
              <p className="text-neutral-600">{supplier.location}</p>
              <div className="mt-1 flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full ${supplier.verified ? 'bg-secondary' : 'bg-neutral-400'} mr-2`}></span>
                <span className="text-sm">{supplier.verified ? 'Verified Supplier' : 'Verification Pending'}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-neutral-100 p-4 rounded-lg">
              <div className="font-montserrat font-semibold">Total Products</div>
              <div className="text-2xl font-poppins font-bold mt-2">{products?.length || 0}</div>
            </div>
            <div className="bg-neutral-100 p-4 rounded-lg">
              <div className="font-montserrat font-semibold">Total Sales</div>
              <div className="text-2xl font-poppins font-bold mt-2">GH₵ 1,245.00</div>
            </div>
            <div className="bg-neutral-100 p-4 rounded-lg">
              <div className="font-montserrat font-semibold">Pending Orders</div>
              <div className="text-2xl font-poppins font-bold mt-2">3</div>
            </div>
          </div>
          
          <p className="text-neutral-600 mb-4">{supplier.description}</p>
          
          {supplier.story && (
            <div className="bg-primary-light p-4 rounded-lg text-neutral-800 mb-4">
              <h3 className="font-medium mb-2">Your Story</h3>
              <p>{supplier.story}</p>
            </div>
          )}
          
          <Button variant="outline">
            Edit Profile
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center">
          <p>Supplier information not available. Please complete your profile.</p>
          <Button className="mt-4">
            Complete Profile
          </Button>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-white">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="auctions">Auctions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-montserrat font-semibold">Recent Orders</h2>
              <Button variant="ghost" className="text-primary">View All</Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 font-medium text-neutral-600">Order ID</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Product</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Customer</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Date</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Amount</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-neutral-200 last:border-0">
                      <td className="py-3">#{order.id}</td>
                      <td className="py-3">{order.productName}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">{order.date}</td>
                      <td className="py-3 font-medium">GH₵ {order.amount.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-montserrat font-semibold">Top Products</h2>
              <Button variant="ghost" className="text-primary">View All</Button>
            </div>
            
            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border border-neutral-200 rounded-lg p-4">
                    <Skeleton className="h-32 w-full mb-3" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.slice(0, 3).map((product) => (
                  <div key={product.id} className="border border-neutral-200 rounded-lg p-4">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-32 object-cover rounded mb-3" 
                    />
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-neutral-600 text-sm mb-2">Stock: {product.stock} units</p>
                    <div className="font-poppins font-semibold">GH₵ {product.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-500 py-4">No products available.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="products">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-montserrat font-semibold">All Products</h2>
              <Button className="bg-secondary hover:bg-secondary-dark">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
                Add New Product
              </Button>
            </div>
            
            {productsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border border-neutral-200 rounded-lg p-4 flex items-center">
                    <Skeleton className="h-16 w-16 rounded mr-4" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border border-neutral-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full sm:w-16 h-32 sm:h-16 object-cover rounded mb-3 sm:mb-0 sm:mr-4" 
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-600">
                        <span className="sm:mr-4">Stock: {product.stock} units</span>
                        <span className="sm:mr-4">Price: GH₵ {product.price.toFixed(2)}</span>
                        {product.featured && (
                          <span className="bg-primary-light text-primary px-2 py-0.5 rounded text-xs">Featured</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 w-full sm:w-auto mt-3 sm:mt-0">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-accent">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 mx-auto text-neutral-400 mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                  />
                </svg>
                <h3 className="text-lg font-medium mb-2">No Products Added Yet</h3>
                <p className="text-neutral-600 mb-4">Start adding products to your store to begin selling.</p>
                <Button className="bg-secondary hover:bg-secondary-dark">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 4v16m8-8H4" 
                    />
                  </svg>
                  Add First Product
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-montserrat font-semibold mb-6">Manage Orders</h2>
            
            <div className="flex mb-6 overflow-x-auto">
              <Button variant="ghost" className="flex-1 border-b-2 border-primary text-primary rounded-none">
                All Orders (7)
              </Button>
              <Button variant="ghost" className="flex-1 border-b-2 border-transparent hover:text-primary rounded-none">
                Pending (2)
              </Button>
              <Button variant="ghost" className="flex-1 border-b-2 border-transparent hover:text-primary rounded-none">
                Processing (1)
              </Button>
              <Button variant="ghost" className="flex-1 border-b-2 border-transparent hover:text-primary rounded-none">
                Shipped (1)
              </Button>
              <Button variant="ghost" className="flex-1 border-b-2 border-transparent hover:text-primary rounded-none">
                Delivered (3)
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 font-medium text-neutral-600">Order ID</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Product</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Customer</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Date</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Amount</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Status</th>
                    <th className="text-left py-3 font-medium text-neutral-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-neutral-200 last:border-0">
                      <td className="py-3">#{order.id}</td>
                      <td className="py-3">{order.productName}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">{order.date}</td>
                      <td className="py-3 font-medium">GH₵ {order.amount.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3">
                        <Button variant="outline" size="sm">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="auctions">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-montserrat font-semibold">Live Auctions</h2>
              <Button className="bg-accent hover:bg-accent-dark">
                Create New Auction
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex flex-col md:flex-row">
                  <img 
                    src="https://images.unsplash.com/photo-1583512603866-910c2f3c3b21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Raw Premium Grade A Shea Butter - 5kg" 
                    className="w-full md:w-32 h-32 object-cover rounded mb-3 md:mb-0 md:mr-4" 
                  />
                  <div className="flex-1">
                    <h3 className="font-montserrat font-semibold text-lg mb-1">Raw Premium Grade A Shea Butter - 5kg</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-accent text-white px-2 py-1 rounded-full text-xs">Active</span>
                      <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full text-xs">15 bids</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600">Current Bid:</span>
                        <span className="font-medium ml-1">GH₵ 350.00</span>
                      </div>
                      <div>
                        <span className="text-neutral-600">Start Price:</span>
                        <span className="font-medium ml-1">GH₵ 200.00</span>
                      </div>
                      <div>
                        <span className="text-neutral-600">Ends:</span>
                        <span className="font-medium ml-1">8 hours left</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-3 md:mt-0 md:ml-4">
                    <Button variant="outline" size="sm">View Bids</Button>
                    <Button variant="outline" size="sm" className="text-accent">End Auction</Button>
                  </div>
                </div>
              </div>
              
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex flex-col md:flex-row">
                  <img 
                    src="https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Vintage Handmade Shea Soap Collection" 
                    className="w-full md:w-32 h-32 object-cover rounded mb-3 md:mb-0 md:mr-4" 
                  />
                  <div className="flex-1">
                    <h3 className="font-montserrat font-semibold text-lg mb-1">Vintage Handmade Shea Soap Collection</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-accent text-white px-2 py-1 rounded-full text-xs">Active</span>
                      <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full text-xs">12 bids</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600">Current Bid:</span>
                        <span className="font-medium ml-1">GH₵ 85.00</span>
                      </div>
                      <div>
                        <span className="text-neutral-600">Start Price:</span>
                        <span className="font-medium ml-1">GH₵ 50.00</span>
                      </div>
                      <div>
                        <span className="text-neutral-600">Ends:</span>
                        <span className="font-medium ml-1">50 minutes left</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-3 md:mt-0 md:ml-4">
                    <Button variant="outline" size="sm">View Bids</Button>
                    <Button variant="outline" size="sm" className="text-accent">End Auction</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-montserrat font-semibold mb-6">Performance Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-neutral-100 p-4 rounded-lg">
                <div className="text-sm text-neutral-600">Total Revenue</div>
                <div className="text-2xl font-poppins font-bold mt-1">GH₵ 1,245.00</div>
                <div className="text-xs text-secondary mt-1">↑ 12% from last month</div>
              </div>
              <div className="bg-neutral-100 p-4 rounded-lg">
                <div className="text-sm text-neutral-600">Total Orders</div>
                <div className="text-2xl font-poppins font-bold mt-1">7</div>
                <div className="text-xs text-secondary mt-1">↑ 3 new this month</div>
              </div>
              <div className="bg-neutral-100 p-4 rounded-lg">
                <div className="text-sm text-neutral-600">Conversion Rate</div>
                <div className="text-2xl font-poppins font-bold mt-1">6.5%</div>
                <div className="text-xs text-accent mt-1">↓ 1.2% from last month</div>
              </div>
            </div>
            
            <div className="border border-neutral-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-4">Sales Overview</h3>
              <div className="h-64 bg-neutral-100 rounded flex items-center justify-center">
                <p className="text-neutral-500">Analytics chart will appear here</p>
              </div>
            </div>
            
            <div className="border border-neutral-200 rounded-lg p-4">
              <h3 className="font-medium mb-4">Top Selling Products</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-2 font-medium text-neutral-600">Product</th>
                    <th className="text-left py-2 font-medium text-neutral-600">Units Sold</th>
                    <th className="text-left py-2 font-medium text-neutral-600">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-200">
                    <td className="py-2">Raw Unrefined Shea Butter</td>
                    <td className="py-2">15</td>
                    <td className="py-2 font-medium">GH₵ 525.00</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="py-2">Organic Shea Body Cream</td>
                    <td className="py-2">9</td>
                    <td className="py-2 font-medium">GH₵ 405.00</td>
                  </tr>
                  <tr>
                    <td className="py-2">African Black Soap with Shea</td>
                    <td className="py-2">16</td>
                    <td className="py-2 font-medium">GH₵ 320.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierDashboardPage;
