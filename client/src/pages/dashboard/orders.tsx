import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
}

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);

  // Fetch orders
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
    queryFn: async () => {
      // Mock data for testing
      return [
        {
          id: "1",
          orderNumber: "ORD-001",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerPhone: "+233 55 123 4567",
          shippingAddress: {
            street: "123 Main St",
            city: "Accra",
            state: "Greater Accra",
            postalCode: "00233",
            country: "Ghana"
          },
          items: [
            {
              id: "item1",
              productId: "prod1",
              productName: "Raw Shea Butter",
              quantity: 2,
              price: 25.99
            },
            {
              id: "item2",
              productId: "prod2",
              productName: "Shea Body Cream",
              quantity: 1,
              price: 15.50
            }
          ],
          totalAmount: 67.48,
          status: "processing",
          paymentStatus: "paid",
          createdAt: "2023-06-15T10:30:00Z",
          updatedAt: "2023-06-15T10:35:00Z"
        },
        // Add more mock orders as needed
      ];
    }
  });

  // Filter orders based on search and status
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = searchQuery === "" || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle print label
  const handlePrintLabel = () => {
    if (selectedOrder) {
      // Use setTimeout to allow the dialog to render before printing
      setTimeout(() => {
        window.print();
        setPrintDialogOpen(false);
      }, 300);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || undefined)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>GH₵ {order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                        order.status === "processing" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                        order.status === "shipped" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" :
                        order.status === "delivered" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === "paid" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                        order.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog open={printDialogOpen && selectedOrder?.id === order.id} onOpenChange={setPrintDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            Print Label
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md print:shadow-none print:border-none">
                          <DialogHeader>
                            <DialogTitle className="print:hidden">Shipping Label</DialogTitle>
                          </DialogHeader>
                          <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-bold text-lg">Shea Ghana</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Premium Shea Products</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">Order #{order.orderNumber}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex gap-4 mb-4">
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1 text-sm uppercase text-gray-500">Ship To:</h4>
                                <p className="font-bold">{order.customerName}</p>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                                <p className="mt-1">{order.customerPhone}</p>
                              </div>
                              <div className="flex-none">
                                <QRCodeSVG 
                                  value={`ORDER:${order.orderNumber}`} 
                                  size={100}
                                  className="border p-1"
                                />
                              </div>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-3 mt-3">
                              <h4 className="font-semibold mb-2 text-sm uppercase text-gray-500">Order Summary:</h4>
                              <ul className="text-sm space-y-1">
                                {order.items.map((item) => (
                                  <li key={item.id} className="flex justify-between">
                                    <span>{item.quantity}x {item.productName}</span>
                                    <span>GH₵ {(item.price * item.quantity).toFixed(2)}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                                <span>Total:</span>
                                <span>GH₵ {order.totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end mt-4 print:hidden">
                            <Button onClick={handlePrintLabel}>Print Now</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          [role="dialog"],
          [role="dialog"] * {
            visibility: visible;
          }
          [role="dialog"] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;