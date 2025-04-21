import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useEffect, useState } from "react";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/product/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductListPage = () => {
  const [location] = useLocation();
  const params = useParams();
  const category = params?.category;
  
  // Extract search query from URL
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get('search') || '';

  const [search, setSearch] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);
  const [sortOption, setSortOption] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [filterVisible, setFilterVisible] = useState(false);
  
  // Categories query
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Prepare query parameters
  const queryParams: Record<string, string | undefined> = {};
  if (selectedCategory) {
    const categoryId = categories?.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === selectedCategory)?.id;
    if (categoryId) {
      queryParams.categoryId = categoryId.toString();
    }
  }
  if (search) {
    queryParams.search = search;
  }
  
  // Products query
  const {
    data: products,
    isLoading: productsLoading,
    error,
    refetch
  } = useQuery<Product[]>({
    queryKey: ['/api/products', queryParams],
  });
  
  // Refetch when category changes
  useEffect(() => {
    setSelectedCategory(category);
    refetch();
  }, [category, refetch]);
  
  // Handle search form submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };
  
  // Apply sorting
  const sortedProducts = products ? [...products] : [];
  if (sortOption === "price-low") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-high") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "newest") {
    sortedProducts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  // Filter by price range
  const filteredProducts = sortedProducts.filter(
    product => product.price >= priceRange[0] && product.price <= priceRange[1]
  );
  
  // Get page title
  const getPageTitle = () => {
    if (search) {
      return `Search Results: "${search}"`;
    }
    
    if (selectedCategory) {
      const categoryName = categories?.find(
        c => c.name.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      )?.name;
      return categoryName || 'Products';
    }
    
    return 'All Products';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="md:flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-4 md:mb-0">
          {getPageTitle()}
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline"
            className="md:hidden flex items-center justify-center"
            onClick={() => setFilterVisible(!filterVisible)}
          >
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
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" 
              />
            </svg>
            Filters
          </Button>
          
          <div className="relative min-w-[180px]">
            <Select
              value={sortOption}
              onValueChange={value => setSortOption(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className={`md:w-1/4 lg:w-1/5 ${filterVisible ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow mb-4">
            <h3 className="font-montserrat font-semibold text-lg mb-4 dark:text-white">Search</h3>
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-primary hover:bg-primary-dark">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </Button>
              </div>
            </form>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow mb-4">
            <h3 className="font-montserrat font-semibold text-lg mb-4 dark:text-white">Categories</h3>
            <div className="space-y-2 dark:text-gray-200">
              <div 
                className={`cursor-pointer py-1 ${!selectedCategory ? 'text-primary font-medium' : 'hover:text-primary'}`}
                onClick={() => setSelectedCategory(undefined)}
              >
                All Products
              </div>
              
              {categoriesLoading ? (
                [...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-6 w-full" />
                ))
              ) : (
                categories?.map(category => (
                  <div 
                    key={category.id}
                    className={`cursor-pointer py-1 ${
                      selectedCategory === category.name.toLowerCase().replace(/\s+/g, '-') ? 
                        'text-primary font-medium' : 
                        'hover:text-primary'
                    }`}
                    onClick={() => setSelectedCategory(category.name.toLowerCase().replace(/\s+/g, '-'))}
                  >
                    {category.name}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <h3 className="font-montserrat font-semibold text-lg mb-4 dark:text-white">Price Range</h3>
            <div className="space-y-4">
              <div className="flex justify-between dark:text-gray-200">
                <div className="font-medium">GH₵ {priceRange[0]}</div>
                <div className="font-medium">GH₵ {priceRange[1]}</div>
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <span className="self-center">to</span>
                <Input
                  type="number"
                  min="0"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
              </div>
              
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => refetch()}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="md:w-3/4 lg:w-4/5">
          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-2/3 mb-1" />
                    <Skeleton className="h-5 w-4/5 mb-2" />
                    <Skeleton className="h-4 w-1/3 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-accent">Failed to load products. Please try again later.</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 mx-auto text-neutral-400 mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h3 className="text-xl font-montserrat font-semibold mb-2">No Products Found</h3>
              <p className="text-neutral-600 mb-6">We couldn't find any products matching your criteria.</p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory(undefined);
                  setPriceRange([0, 1000]);
                  setSortOption('featured');
                  refetch();
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
