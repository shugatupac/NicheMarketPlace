import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertProductSchema, 
  insertReviewSchema,
  insertBidSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertWishlistSchema,
  insertWishlistItemSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user with this email already exists
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      
      // Check if user with this username already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(409).json({ message: "User with this username already exists" });
      }
      
      const user = await storage.createUser(userData);
      // Don't send the password back
      const { password, ...userWithoutPassword } = user;
      
      // Create cart for new user
      await storage.createCart({ userId: user.id });
      
      // Create wishlist for new user
      await storage.createWishlist({ 
        userId: user.id,
        name: "My Wishlist"
      });
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't send the password back
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to log in" });
    }
  });
  
  // Categories
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // Products
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const { supplierId, categoryId, featured, search } = req.query;
      
      const params = {
        supplierId: supplierId ? parseInt(supplierId as string) : undefined,
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        featured: featured === "true" ? true : undefined,
        search: search as string
      };
      
      const products = await storage.getProducts(params);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  app.get("/api/products/featured", async (_req: Request, res: Response) => {
    try {
      const featuredProducts = await storage.getFeaturedProducts();
      res.status(200).json(featuredProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });
  
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const supplier = await storage.getSupplier(product.supplierId);
      const category = await storage.getCategory(product.categoryId);
      const reviews = await storage.getProductReviews(productId);
      
      // Get user info for each review
      const reviewsWithUser = await Promise.all(
        reviews.map(async (review) => {
          const user = await storage.getUser(review.userId);
          return {
            ...review,
            user: user ? { id: user.id, name: user.name } : null
          };
        })
      );
      
      res.status(200).json({
        ...product,
        supplier,
        category,
        reviews: reviewsWithUser
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product details" });
    }
  });
  
  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  
  // Reviews
  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      
      // Get user info
      const user = await storage.getUser(review.userId);
      
      res.status(201).json({
        ...review,
        user: user ? { id: user.id, name: user.name } : null
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });
  
  // Suppliers
  app.get("/api/suppliers", async (_req: Request, res: Response) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.status(200).json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });
  
  app.get("/api/suppliers/:id", async (req: Request, res: Response) => {
    try {
      const supplierId = parseInt(req.params.id);
      const supplier = await storage.getSupplier(supplierId);
      
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      
      const products = await storage.getProducts({ supplierId });
      const user = await storage.getUser(supplier.userId);
      
      res.status(200).json({
        ...supplier,
        products,
        contactInfo: user ? {
          name: user.name,
          email: user.email,
          phone: user.phone
        } : null
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier details" });
    }
  });
  
  // Auctions
  app.get("/api/auctions", async (_req: Request, res: Response) => {
    try {
      const auctions = await storage.getActiveAuctions();
      
      // Fetch product details for each auction
      const auctionsWithDetails = await Promise.all(
        auctions.map(async (auction) => {
          const product = await storage.getProduct(auction.productId);
          const bids = await storage.getAuctionBids(auction.id);
          return {
            ...auction,
            product,
            bidCount: bids.length
          };
        })
      );
      
      res.status(200).json(auctionsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch auctions" });
    }
  });
  
  app.get("/api/auctions/:id", async (req: Request, res: Response) => {
    try {
      const auctionId = parseInt(req.params.id);
      const auction = await storage.getAuction(auctionId);
      
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }
      
      const product = await storage.getProduct(auction.productId);
      const bids = await storage.getAuctionBids(auctionId);
      
      // Get basic user info for each bid
      const bidsWithUser = await Promise.all(
        bids.map(async (bid) => {
          const user = await storage.getUser(bid.userId);
          return {
            ...bid,
            user: user ? { id: user.id, name: user.name } : null
          };
        })
      );
      
      res.status(200).json({
        ...auction,
        product,
        bids: bidsWithUser
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch auction details" });
    }
  });
  
  app.post("/api/auctions/:id/bids", async (req: Request, res: Response) => {
    try {
      const auctionId = parseInt(req.params.id);
      const auction = await storage.getAuction(auctionId);
      
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }
      
      if (auction.status !== "active") {
        return res.status(400).json({ message: "This auction is no longer active" });
      }
      
      if (auction.endTime < new Date()) {
        return res.status(400).json({ message: "This auction has ended" });
      }
      
      const bidData = insertBidSchema.parse({
        ...req.body,
        auctionId
      });
      
      // Check if bid amount is higher than current price
      if (bidData.amount <= auction.currentPrice) {
        return res.status(400).json({ 
          message: "Bid amount must be higher than the current price",
          currentPrice: auction.currentPrice
        });
      }
      
      const bid = await storage.createBid(bidData);
      
      // Update auction current price
      await storage.updateAuction(auctionId, {
        currentPrice: bidData.amount,
        bidCount: auction.bidCount + 1
      });
      
      // Get user info
      const user = await storage.getUser(bid.userId);
      
      res.status(201).json({
        ...bid,
        user: user ? { id: user.id, name: user.name } : null
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to place bid" });
    }
  });
  
  // Cart
  app.get("/api/cart/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get or create cart
      let cart = await storage.getCartByUserId(userId);
      if (!cart) {
        cart = await storage.createCart({ userId });
      }
      
      const cartItems = await storage.getCartItems(cart.id);
      
      // Get product details for each cart item
      const itemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.status(200).json({
        id: cart.id,
        userId: cart.userId,
        items: itemsWithDetails,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: itemsWithDetails.reduce((sum, item) => {
          const price = item.product?.discountPrice || item.product?.price || 0;
          return sum + (price * item.quantity);
        }, 0)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });
  
  app.post("/api/cart/:userId/items", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const { productId, quantity } = req.body;
      
      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ message: "Product ID and quantity are required" });
      }
      
      // Get or create cart
      let cart = await storage.getCartByUserId(userId);
      if (!cart) {
        cart = await storage.createCart({ userId });
      }
      
      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if product is in stock
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      
      // Check if this product is already in cart
      const cartItems = await storage.getCartItems(cart.id);
      const existingItem = cartItems.find(item => item.productId === productId);
      
      if (existingItem) {
        // Update existing cart item
        const updatedItem = await storage.updateCartItem(existingItem.id, existingItem.quantity + quantity);
        res.status(200).json(updatedItem);
      } else {
        // Add new cart item
        const cartItem = await storage.createCartItem({
          cartId: cart.id,
          productId,
          quantity
        });
        res.status(201).json(cartItem);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });
  
  app.put("/api/cart/:userId/items/:itemId", async (req: Request, res: Response) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const { quantity } = req.body;
      
      if (!quantity || quantity < 0) {
        return res.status(400).json({ message: "Valid quantity is required" });
      }
      
      // If quantity is 0, delete the item
      if (quantity === 0) {
        await storage.deleteCartItem(itemId);
        return res.status(200).json({ message: "Item removed from cart" });
      }
      
      // Otherwise update the quantity
      const updatedItem = await storage.updateCartItem(itemId, quantity);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });
  
  app.delete("/api/cart/:userId/items/:itemId", async (req: Request, res: Response) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const deleted = await storage.deleteCartItem(itemId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });
  
  // Orders
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const cart = await storage.getCartByUserId(orderData.userId);
      
      if (!cart) {
        return res.status(400).json({ message: "Cart not found or empty" });
      }
      
      const cartItems = await storage.getCartItems(cart.id);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Create the order
      const order = await storage.createOrder(orderData);
      
      // Create order items from cart items
      for (const cartItem of cartItems) {
        const product = await storage.getProduct(cartItem.productId);
        
        if (!product) {
          continue; // Skip if product not found
        }
        
        const price = product.discountPrice || product.price;
        
        await storage.createOrderItem({
          orderId: order.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          price
        });
        
        // Clean up cart items
        await storage.deleteCartItem(cartItem.id);
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  
  app.get("/api/orders/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getUserOrders(userId);
      
      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          
          // Get product details for each order item
          const itemsWithDetails = await Promise.all(
            items.map(async (item) => {
              const product = await storage.getProduct(item.productId);
              return {
                ...item,
                product
              };
            })
          );
          
          return {
            ...order,
            items: itemsWithDetails
          };
        })
      );
      
      res.status(200).json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  
  // Wishlists
  app.get("/api/wishlists/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get or create wishlist
      let wishlist = await storage.getWishlistByUserId(userId);
      if (!wishlist) {
        wishlist = await storage.createWishlist({ 
          userId,
          name: "My Wishlist"
        });
      }
      
      const wishlistProducts = await storage.getWishlistProducts(wishlist.id);
      
      res.status(200).json({
        id: wishlist.id,
        userId: wishlist.userId,
        name: wishlist.name,
        products: wishlistProducts,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });
  
  app.post("/api/wishlists/:userId/items", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const { productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      
      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Get or create wishlist
      let wishlist = await storage.getWishlistByUserId(userId);
      if (!wishlist) {
        wishlist = await storage.createWishlist({
          userId,
          name: "My Wishlist"
        });
      }
      
      // Check if product is already in wishlist
      const isInWishlist = await storage.isProductInWishlist(wishlist.id, productId);
      if (isInWishlist) {
        return res.status(409).json({ message: "Product already in wishlist" });
      }
      
      // Add product to wishlist
      const wishlistItem = await storage.createWishlistItem({
        wishlistId: wishlist.id,
        productId
      });
      
      res.status(201).json({
        id: wishlistItem.id,
        product,
        addedAt: wishlistItem.addedAt
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to add product to wishlist" });
    }
  });
  
  app.delete("/api/wishlists/:userId/items/:productId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const productId = parseInt(req.params.productId);
      
      // Get wishlist
      const wishlist = await storage.getWishlistByUserId(userId);
      if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
      }
      
      // Get wishlist items
      const wishlistItems = await storage.getWishlistItems(wishlist.id);
      const itemToRemove = wishlistItems.find(item => item.productId === productId);
      
      if (!itemToRemove) {
        return res.status(404).json({ message: "Product not found in wishlist" });
      }
      
      // Remove product from wishlist
      await storage.deleteWishlistItem(itemToRemove.id);
      
      res.status(200).json({ message: "Product removed from wishlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove product from wishlist" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
