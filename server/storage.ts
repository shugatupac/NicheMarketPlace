import {
  users, type User, type InsertUser,
  suppliers, type Supplier, type InsertSupplier,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  reviews, type Review, type InsertReview,
  auctions, type Auction, type InsertAuction,
  bids, type Bid, type InsertBid,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  carts, type Cart, type InsertCart,
  cartItems, type CartItem, type InsertCartItem,
  wishlists, type Wishlist, type InsertWishlist,
  wishlistItems, type WishlistItem, type InsertWishlistItem,
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Suppliers
  getSupplier(id: number): Promise<Supplier | undefined>;
  getSupplierByUserId(userId: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  getSuppliers(): Promise<Supplier[]>;
  
  // Categories
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  getCategories(): Promise<Category[]>;
  
  // Products
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getProducts(params?: {
    supplierId?: number;
    categoryId?: number;
    featured?: boolean;
    search?: string;
  }): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  
  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  getProductReviews(productId: number): Promise<Review[]>;
  
  // Auctions
  getAuction(id: number): Promise<Auction | undefined>;
  createAuction(auction: InsertAuction): Promise<Auction>;
  getActiveAuctions(): Promise<Auction[]>;
  updateAuction(id: number, data: Partial<Auction>): Promise<Auction | undefined>;
  
  // Bids
  getBid(id: number): Promise<Bid | undefined>;
  createBid(bid: InsertBid): Promise<Bid>;
  getAuctionBids(auctionId: number): Promise<Bid[]>;
  
  // Orders
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getUserOrders(userId: number): Promise<Order[]>;
  updateOrder(id: number, data: Partial<Order>): Promise<Order | undefined>;
  
  // Order Items
  getOrderItem(id: number): Promise<OrderItem | undefined>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  
  // Carts
  getCart(id: number): Promise<Cart | undefined>;
  getCartByUserId(userId: number): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  
  // Cart Items
  getCartItem(id: number): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  getCartItems(cartId: number): Promise<CartItem[]>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<boolean>;
  
  // Wishlists
  getWishlist(id: number): Promise<Wishlist | undefined>;
  getWishlistByUserId(userId: number): Promise<Wishlist | undefined>;
  createWishlist(wishlist: InsertWishlist): Promise<Wishlist>;
  
  // Wishlist Items
  getWishlistItem(id: number): Promise<WishlistItem | undefined>;
  createWishlistItem(wishlistItem: InsertWishlistItem): Promise<WishlistItem>;
  getWishlistItems(wishlistId: number): Promise<WishlistItem[]>;
  getWishlistProducts(wishlistId: number): Promise<Product[]>;
  deleteWishlistItem(id: number): Promise<boolean>;
  isProductInWishlist(wishlistId: number, productId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private suppliersMap: Map<number, Supplier>;
  private categoriesMap: Map<number, Category>;
  private productsMap: Map<number, Product>;
  private reviewsMap: Map<number, Review>;
  private auctionsMap: Map<number, Auction>;
  private bidsMap: Map<number, Bid>;
  private ordersMap: Map<number, Order>;
  private orderItemsMap: Map<number, OrderItem>;
  private cartsMap: Map<number, Cart>;
  private cartItemsMap: Map<number, CartItem>;
  private wishlistsMap: Map<number, Wishlist>;
  private wishlistItemsMap: Map<number, WishlistItem>;
  
  private userId: number;
  private supplierId: number;
  private categoryId: number;
  private productId: number;
  private reviewId: number;
  private auctionId: number;
  private bidId: number;
  private orderId: number;
  private orderItemId: number;
  private cartId: number;
  private cartItemId: number;
  private wishlistId: number;
  private wishlistItemId: number;

  constructor() {
    this.usersMap = new Map();
    this.suppliersMap = new Map();
    this.categoriesMap = new Map();
    this.productsMap = new Map();
    this.reviewsMap = new Map();
    this.auctionsMap = new Map();
    this.bidsMap = new Map();
    this.ordersMap = new Map();
    this.orderItemsMap = new Map();
    this.cartsMap = new Map();
    this.cartItemsMap = new Map();
    this.wishlistsMap = new Map();
    this.wishlistItemsMap = new Map();
    
    this.userId = 1;
    this.supplierId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.reviewId = 1;
    this.auctionId = 1;
    this.bidId = 1;
    this.orderId = 1;
    this.orderItemId = 1;
    this.cartId = 1;
    this.cartItemId = 1;
    this.wishlistId = 1;
    this.wishlistItemId = 1;
    
    // Initialize with some sample data
    this.seedData();
  }

  private seedData() {
    // Create sample categories
    const sheaButterCategory = this.createCategory({
      name: "Raw Shea Butter",
      description: "Pure, unrefined shea butter directly from Northern Ghana",
      image: "https://images.unsplash.com/photo-1584949514490-73fc1a2faa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    });
    
    const bodyCreamCategory = this.createCategory({
      name: "Body Creams",
      description: "Luxurious shea butter-based body creams",
      image: "https://images.unsplash.com/photo-1601055283742-8b27e81b5553?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    });
    
    const hairProductCategory = this.createCategory({
      name: "Hair Products",
      description: "Natural hair care products made with shea butter",
      image: "https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    });
    
    const soapCategory = this.createCategory({
      name: "Soaps",
      description: "Traditional African black soap and other shea-based soaps",
      image: "https://images.unsplash.com/photo-1638605993669-8ddf12c28f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    });
    
    const giftSetCategory = this.createCategory({
      name: "Gift Sets",
      description: "Curated gift sets of premium shea products",
      image: "https://images.unsplash.com/photo-1594093235950-bcd473259910?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    });
    
    // Create sample users and suppliers
    const aminaUser = this.createUser({
      username: "amina",
      password: "password123",
      email: "amina@sheaghana.com",
      name: "Amina Mahama",
      role: "supplier",
      phone: "+233 20 123 4567",
      address: "Tamale, Northern Region, Ghana"
    });
    
    const aminaSupplier = this.createSupplier({
      userId: aminaUser.id,
      businessName: "Amina's Shea Cooperative",
      location: "Northern Ghana",
      description: "Women-owned cooperative producing premium shea products",
      story: "Founded by Amina Mahama in 2010, our cooperative employs 35 women from rural communities in Northern Ghana. We harvest and process shea nuts using traditional methods passed down through generations. Every purchase supports our community development initiatives, including education for girls and clean water projects.",
      logo: "",
      coverImage: "https://images.unsplash.com/photo-1578386773647-18cb3a4093ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      founded: "2010",
      verified: true
    });
    
    const kumasiUser = this.createUser({
      username: "kumasi",
      password: "password123",
      email: "info@kumasiessentials.com",
      name: "Kwame Boateng",
      role: "supplier",
      phone: "+233 24 987 6543",
      address: "Kumasi, Ashanti Region, Ghana"
    });
    
    const kumasiSupplier = this.createSupplier({
      userId: kumasiUser.id,
      businessName: "Kumasi Essentials",
      location: "Kumasi, Ghana",
      description: "Urban artisans creating modern shea-based beauty products",
      story: "Kumasi Essentials blends traditional Ghanaian ingredients with modern formulations to create effective, luxurious beauty products.",
      logo: "",
      coverImage: "https://images.unsplash.com/photo-1577092378110-d55651af6920?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      founded: "2018",
      verified: true
    });
    
    const accraUser = this.createUser({
      username: "accranaturals",
      password: "password123",
      email: "info@accranaturals.com",
      name: "Esi Mensah",
      role: "supplier",
      phone: "+233 27 345 6789",
      address: "Accra, Greater Accra, Ghana"
    });
    
    const accraSupplier = this.createSupplier({
      userId: accraUser.id,
      businessName: "Accra Naturals",
      location: "Accra, Ghana",
      description: "Premium natural hair care products using traditional ingredients",
      story: "Started by Esi Mensah, a former banker turned entrepreneur, Accra Naturals creates hair products that celebrate African natural beauty.",
      logo: "",
      coverImage: "",
      founded: "2019",
      verified: true
    });
    
    const tamaleUser = this.createUser({
      username: "tamale",
      password: "password123",
      email: "info@tamaletraditions.com",
      name: "Ibrahim Yakubu",
      role: "supplier",
      phone: "+233 26 765 4321",
      address: "Tamale, Northern Region, Ghana"
    });
    
    const tamaleSupplier = this.createSupplier({
      userId: tamaleUser.id,
      businessName: "Tamale Traditions",
      location: "Tamale, Ghana",
      description: "Family-owned business creating traditional soaps and skin remedies",
      story: "A third-generation family business preserving traditional soap-making techniques from Northern Ghana.",
      logo: "",
      coverImage: "",
      founded: "1985",
      verified: true
    });
    
    // Create sample products
    const rawSheaButter = this.createProduct({
      name: "Raw Unrefined Shea Butter",
      description: "Pure, unprocessed Grade A shea butter harvested and processed by women in Northern Ghana. Free from additives and chemicals.",
      price: 35.00,
      discountPrice: 45.00,
      stock: 200,
      images: ["https://images.unsplash.com/photo-1584949514490-73fc1a2faa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
      supplierId: aminaSupplier.id,
      categoryId: sheaButterCategory.id,
      featured: true,
      bestSeller: true,
      isNew: false
    });
    
    const bodyCream = this.createProduct({
      name: "Organic Shea Body Cream",
      description: "Luxurious body cream made with organic shea butter and essential oils to moisturize and nourish your skin.",
      price: 45.00,
      stock: 150,
      images: ["https://images.unsplash.com/photo-1601055283742-8b27e81b5553?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
      supplierId: kumasiSupplier.id,
      categoryId: bodyCreamCategory.id,
      featured: true,
      bestSeller: false,
      isNew: false
    });
    
    const hairMask = this.createProduct({
      name: "Shea Butter Hair Mask with Coconut Oil",
      description: "Deep conditioning hair mask that combines shea butter with coconut oil to repair damaged hair and add shine.",
      price: 55.00,
      stock: 100,
      images: ["https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
      supplierId: accraSupplier.id,
      categoryId: hairProductCategory.id,
      featured: true,
      bestSeller: false,
      isNew: true
    });
    
    const blackSoap = this.createProduct({
      name: "African Black Soap with Shea",
      description: "Traditional African black soap made with shea butter, plantain ash, and cocoa pod. Great for all skin types, especially acne-prone skin.",
      price: 20.00,
      discountPrice: 25.00,
      stock: 300,
      images: ["https://images.unsplash.com/photo-1638605993669-8ddf12c28f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
      supplierId: tamaleSupplier.id,
      categoryId: soapCategory.id,
      featured: true,
      bestSeller: false,
      isNew: false
    });
    
    // Create sample auctions
    const giftSetAuction = this.createAuction({
      productId: this.createProduct({
        name: "Limited Edition Shea Gift Set",
        description: "Handcrafted gift box with premium products from Tamale Traditions",
        price: 120.00,
        stock: 10,
        images: ["https://images.unsplash.com/photo-1594093235950-bcd473259910?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        supplierId: tamaleSupplier.id,
        categoryId: giftSetCategory.id,
        featured: false,
        bestSeller: false,
        isNew: true
      }).id,
      startPrice: 80.00,
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    });
    
    const premiumSheaAuction = this.createAuction({
      productId: this.createProduct({
        name: "Raw Premium Grade A Shea Butter - 5kg",
        description: "Fresh harvest from women-owned cooperative in Bolgatanga",
        price: 350.00,
        stock: 5,
        images: ["https://images.unsplash.com/photo-1583512603866-910c2f3c3b21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        supplierId: aminaSupplier.id,
        categoryId: sheaButterCategory.id,
        featured: false,
        bestSeller: false,
        isNew: false
      }).id,
      startPrice: 200.00,
      startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    });
    
    const soapCollectionAuction = this.createAuction({
      productId: this.createProduct({
        name: "Vintage Handmade Shea Soap Collection",
        description: "Artisanal soap set using century-old recipes from Kumasi",
        price: 85.00,
        stock: 3,
        images: ["https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        supplierId: tamaleSupplier.id,
        categoryId: soapCategory.id,
        featured: false,
        bestSeller: false,
        isNew: false
      }).id,
      startPrice: 50.00,
      startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      endTime: new Date(Date.now() + 50 * 60 * 1000), // 50 minutes from now
    });
    
    // Create sample reviews
    this.createReview({
      userId: this.createUser({
        username: "customer1",
        password: "password123",
        email: "customer1@example.com",
        name: "Kofi Anan",
        role: "buyer"
      }).id,
      productId: rawSheaButter.id,
      rating: 5,
      comment: "Amazing quality! My skin has never felt better."
    });
    
    this.createReview({
      userId: this.createUser({
        username: "customer2",
        password: "password123",
        email: "customer2@example.com",
        name: "Abena Poku",
        role: "buyer"
      }).id,
      productId: rawSheaButter.id,
      rating: 5,
      comment: "Pure and authentic. Will definitely buy again."
    });
    
    this.createReview({
      userId: this.createUser({
        username: "customer3",
        password: "password123",
        email: "customer3@example.com",
        name: "Kwaku Mensah",
        role: "buyer"
      }).id,
      productId: bodyCream.id,
      rating: 4,
      comment: "Love the scent and how it moisturizes my skin."
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.usersMap.set(id, user);
    return user;
  }
  
  // Suppliers
  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliersMap.get(id);
  }
  
  async getSupplierByUserId(userId: number): Promise<Supplier | undefined> {
    return Array.from(this.suppliersMap.values()).find(
      (supplier) => supplier.userId === userId,
    );
  }
  
  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = this.supplierId++;
    const supplier: Supplier = { ...insertSupplier, id };
    this.suppliersMap.set(id, supplier);
    return supplier;
  }
  
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliersMap.values());
  }
  
  // Categories
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categoriesMap.get(id);
  }
  
  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categoriesMap.values()).find(
      (category) => category.name === name,
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id };
    this.categoriesMap.set(id, category);
    return category;
  }
  
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categoriesMap.values());
  }
  
  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    return this.productsMap.get(id);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const now = new Date();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: now,
      updatedAt: now 
    };
    this.productsMap.set(id, product);
    return product;
  }
  
  async getProducts(params?: { 
    supplierId?: number; 
    categoryId?: number;
    featured?: boolean;
    search?: string;
  }): Promise<Product[]> {
    let products = Array.from(this.productsMap.values());
    
    if (params) {
      if (params.supplierId !== undefined) {
        products = products.filter(product => product.supplierId === params.supplierId);
      }
      
      if (params.categoryId !== undefined) {
        products = products.filter(product => product.categoryId === params.categoryId);
      }
      
      if (params.featured !== undefined) {
        products = products.filter(product => product.featured === params.featured);
      }
      
      if (params.search !== undefined && params.search !== '') {
        const searchLower = params.search.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(searchLower) || 
          product.description.toLowerCase().includes(searchLower)
        );
      }
    }
    
    return products;
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return this.getProducts({ featured: true });
  }
  
  // Reviews
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviewsMap.get(id);
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const now = new Date();
    const review: Review = { ...insertReview, id, createdAt: now };
    this.reviewsMap.set(id, review);
    return review;
  }
  
  async getProductReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviewsMap.values()).filter(
      (review) => review.productId === productId,
    );
  }
  
  // Auctions
  async getAuction(id: number): Promise<Auction | undefined> {
    return this.auctionsMap.get(id);
  }
  
  async createAuction(insertAuction: InsertAuction): Promise<Auction> {
    const id = this.auctionId++;
    const auction: Auction = { 
      ...insertAuction,
      id,
      currentPrice: insertAuction.startPrice,
      status: "active",
      bidCount: 0,
      winnerId: null
    };
    this.auctionsMap.set(id, auction);
    return auction;
  }
  
  async getActiveAuctions(): Promise<Auction[]> {
    const now = new Date();
    return Array.from(this.auctionsMap.values()).filter(
      (auction) => auction.status === "active" && auction.endTime > now
    );
  }
  
  async updateAuction(id: number, data: Partial<Auction>): Promise<Auction | undefined> {
    const auction = this.auctionsMap.get(id);
    if (!auction) return undefined;
    
    const updatedAuction: Auction = { ...auction, ...data };
    this.auctionsMap.set(id, updatedAuction);
    return updatedAuction;
  }
  
  // Bids
  async getBid(id: number): Promise<Bid | undefined> {
    return this.bidsMap.get(id);
  }
  
  async createBid(insertBid: InsertBid): Promise<Bid> {
    const id = this.bidId++;
    const now = new Date();
    const bid: Bid = { ...insertBid, id, createdAt: now };
    this.bidsMap.set(id, bid);
    
    // Update auction with new bid info
    const auction = await this.getAuction(insertBid.auctionId);
    if (auction) {
      await this.updateAuction(auction.id, {
        currentPrice: insertBid.amount,
        bidCount: auction.bidCount + 1
      });
    }
    
    return bid;
  }
  
  async getAuctionBids(auctionId: number): Promise<Bid[]> {
    return Array.from(this.bidsMap.values())
      .filter(bid => bid.auctionId === auctionId)
      .sort((a, b) => b.amount - a.amount); // Sort by highest amount
  }
  
  // Orders
  async getOrder(id: number): Promise<Order | undefined> {
    return this.ordersMap.get(id);
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const now = new Date();
    const order: Order = { 
      ...insertOrder, 
      id, 
      status: "pending",
      paymentStatus: "pending",
      createdAt: now,
      updatedAt: now 
    };
    this.ordersMap.set(id, order);
    return order;
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.ordersMap.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by most recent
  }
  
  async updateOrder(id: number, data: Partial<Order>): Promise<Order | undefined> {
    const order = this.ordersMap.get(id);
    if (!order) return undefined;
    
    const now = new Date();
    const updatedOrder: Order = { 
      ...order, 
      ...data,
      updatedAt: now 
    };
    this.ordersMap.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order Items
  async getOrderItem(id: number): Promise<OrderItem | undefined> {
    return this.orderItemsMap.get(id);
  }
  
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemId++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItemsMap.set(id, orderItem);
    return orderItem;
  }
  
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItemsMap.values()).filter(
      (orderItem) => orderItem.orderId === orderId,
    );
  }
  
  // Carts
  async getCart(id: number): Promise<Cart | undefined> {
    return this.cartsMap.get(id);
  }
  
  async getCartByUserId(userId: number): Promise<Cart | undefined> {
    return Array.from(this.cartsMap.values()).find(
      (cart) => cart.userId === userId,
    );
  }
  
  async createCart(insertCart: InsertCart): Promise<Cart> {
    const id = this.cartId++;
    const now = new Date();
    const cart: Cart = { 
      ...insertCart, 
      id, 
      createdAt: now,
      updatedAt: now 
    };
    this.cartsMap.set(id, cart);
    return cart;
  }
  
  // Cart Items
  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItemsMap.get(id);
  }
  
  async createCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemId++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItemsMap.set(id, cartItem);
    return cartItem;
  }
  
  async getCartItems(cartId: number): Promise<CartItem[]> {
    return Array.from(this.cartItemsMap.values()).filter(
      (cartItem) => cartItem.cartId === cartId,
    );
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItemsMap.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem: CartItem = { ...cartItem, quantity };
    this.cartItemsMap.set(id, updatedCartItem);
    return updatedCartItem;
  }
  
  async deleteCartItem(id: number): Promise<boolean> {
    return this.cartItemsMap.delete(id);
  }
  
  // Wishlists
  async getWishlist(id: number): Promise<Wishlist | undefined> {
    return this.wishlistsMap.get(id);
  }
  
  async getWishlistByUserId(userId: number): Promise<Wishlist | undefined> {
    return Array.from(this.wishlistsMap.values()).find(
      (wishlist) => wishlist.userId === userId
    );
  }
  
  async createWishlist(insertWishlist: InsertWishlist): Promise<Wishlist> {
    const id = this.wishlistId++;
    const now = new Date();
    const wishlist: Wishlist = {
      ...insertWishlist,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.wishlistsMap.set(id, wishlist);
    return wishlist;
  }
  
  // Wishlist Items
  async getWishlistItem(id: number): Promise<WishlistItem | undefined> {
    return this.wishlistItemsMap.get(id);
  }
  
  async createWishlistItem(insertWishlistItem: InsertWishlistItem): Promise<WishlistItem> {
    const id = this.wishlistItemId++;
    const now = new Date();
    const wishlistItem: WishlistItem = {
      ...insertWishlistItem,
      id,
      addedAt: now
    };
    
    this.wishlistItemsMap.set(id, wishlistItem);
    return wishlistItem;
  }
  
  async getWishlistItems(wishlistId: number): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItemsMap.values())
      .filter((item) => item.wishlistId === wishlistId);
  }
  
  async getWishlistProducts(wishlistId: number): Promise<Product[]> {
    const wishlistItems = await this.getWishlistItems(wishlistId);
    const products: Product[] = [];
    
    for (const item of wishlistItems) {
      const product = this.productsMap.get(item.productId);
      if (product) {
        products.push(product);
      }
    }
    
    return products;
  }
  
  async deleteWishlistItem(id: number): Promise<boolean> {
    return this.wishlistItemsMap.delete(id);
  }
  
  async isProductInWishlist(wishlistId: number, productId: number): Promise<boolean> {
    const wishlistItems = await this.getWishlistItems(wishlistId);
    return wishlistItems.some(item => item.productId === productId);
  }
}

export const storage = new MemStorage();
