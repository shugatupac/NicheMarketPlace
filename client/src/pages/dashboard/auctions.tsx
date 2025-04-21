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

interface Auction {
  id: string;
  title: string;
  productName: string;
  startingPrice: number;
  currentBid: number;
  bidCount: number;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "ended" | "cancelled";
  imageUrl: string;
}

const AuctionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  // Fetch auctions
  const { data: auctions, isLoading } = useQuery<Auction[]>({
    queryKey: ['/api/admin/auctions'],
    queryFn: async () => {
      // Mock data for testing
      return [
        {
          id: "1",
          title: "Premium Shea Butter Lot",
          description: "10kg of premium unrefined shea butter from Northern Ghana",
          startingPrice: 150.00,
          currentBid: 175.50,
          bidCount: 3,
          startDate: "2023-06-01T10:00:00Z",
          endDate: "2023-06-08T10:00:00Z",
          status: "active",
          imageUrl: "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?q=80&w=200&auto=format&fit=crop",
          createdAt: "2023-05-25T08:30:00Z"
        },
        {
          id: "2",
          title: "Organic Shea Oil Collection",
          description: "Collection of 5 different organic shea oils, cold-pressed",
          startingPrice: 85.00,
          currentBid: 95.00,
          bidCount: 2,
          startDate: "2023-06-03T09:00:00Z",
          endDate: "2023-06-10T09:00:00Z",
          status: "active",
          imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=200&auto=format&fit=crop",
          createdAt: "2023-05-28T14:15:00Z"
        },
        {
          id: "3",
          title: "Vintage Shea Processing Tools",
          description: "Traditional tools used for shea butter processing",
          startingPrice: 120.00,
          currentBid: 120.00,
          bidCount: 0,
          startDate: "2023-05-20T11:00:00Z",
          endDate: "2023-05-27T11:00:00Z",
          status: "ended",
          imageUrl: "https://images.unsplash.com/photo-1516962080544-eac695c93791?q=80&w=200&auto=format&fit=crop",
          createdAt: "2023-05-15T16:45:00Z"
        }
      ];
    }
  });

  // Filter auctions based on search and status
  const filteredAuctions = (auctions as Auction[] || []).filter((auction: Auction) => {
    const matchesSearch = searchQuery === "" || 
      auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.productName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || auction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return `GH₵ ${amount.toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Auctions Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search auctions..."
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
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button>Create Auction</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Auction</TableHead>
                <TableHead>Current Bid</TableHead>
                <TableHead>Bids</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAuctions?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No auctions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAuctions?.map((auction: Auction) => (
                  <TableRow key={auction.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <img 
                            src={auction.imageUrl} 
                            alt={auction.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{auction.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {auction.productName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(auction.currentBid)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Starting: {formatCurrency(auction.startingPrice)}
                      </div>
                    </TableCell>
                    <TableCell>{auction.bidCount}</TableCell>
                    <TableCell>{formatDate(auction.startDate)}</TableCell>
                    <TableCell>{formatDate(auction.endDate)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        auction.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                        auction.status === "upcoming" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                        auction.status === "ended" ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200" :
                        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}>
                        {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AuctionsPage;