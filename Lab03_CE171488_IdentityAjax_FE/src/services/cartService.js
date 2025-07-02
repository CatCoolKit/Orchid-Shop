const CART_STORAGE_KEY = "orchidShop_cart";

const cartService = {
  // Get all cart items
  getCartItems() {
    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch {
      return [];
    }
  },

  // Add item to cart
  addToCart(orchid, quantity = 1) {
    try {
      const cartItems = this.getCartItems();
      const existingItemIndex = cartItems.findIndex(
        (item) => item.orchid.orchidId === orchid.orchidId
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cartItems.push({
          id: Date.now(), // Simple ID generation
          orchid: orchid,
          quantity: quantity,
          addedAt: new Date().toISOString(),
        });
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));

      // Trigger custom event for cart updates in same tab
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      return cartItems;
    } catch {
      throw new Error("Không thể thêm sản phẩm vào giỏ hàng");
    }
  },

  // Update item quantity
  updateQuantity(orchidId, newQuantity) {
    try {
      if (newQuantity <= 0) {
        return this.removeFromCart(orchidId);
      }

      const cartItems = this.getCartItems();
      const itemIndex = cartItems.findIndex(
        (item) => item.orchid.orchidId === orchidId
      );

      if (itemIndex >= 0) {
        cartItems[itemIndex].quantity = newQuantity;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));

        // Trigger custom event for cart updates in same tab
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }

      return cartItems;
    } catch {
      throw new Error("Không thể cập nhật số lượng");
    }
  },

  // Remove item from cart
  removeFromCart(orchidId) {
    try {
      const cartItems = this.getCartItems();
      const filteredItems = cartItems.filter(
        (item) => item.orchid.orchidId !== orchidId
      );
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filteredItems));

      // Trigger custom event for cart updates in same tab
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      return filteredItems;
    } catch {
      throw new Error("Không thể xóa sản phẩm khỏi giỏ hàng");
    }
  },

  // Clear entire cart
  clearCart() {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);

      // Trigger custom event for cart updates in same tab
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      return [];
    } catch {
      throw new Error("Không thể xóa giỏ hàng");
    }
  },

  // Get total items count (sum of all quantities)
  getCartCount() {
    const cartItems = this.getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  },

  // Get unique products count (number of different products)
  getUniqueProductsCount() {
    const cartItems = this.getCartItems();
    return cartItems.length;
  },

  // Get total price
  getCartTotal() {
    const cartItems = this.getCartItems();
    return cartItems.reduce(
      (total, item) => total + item.orchid.price * item.quantity,
      0
    );
  },

  // Check if item is in cart
  isInCart(orchidId) {
    const cartItems = this.getCartItems();
    return cartItems.some((item) => item.orchid.orchidId === orchidId);
  },

  // Get specific item from cart
  getCartItem(orchidId) {
    const cartItems = this.getCartItems();
    return cartItems.find((item) => item.orchid.orchidId === orchidId);
  },
};

export default cartService;
