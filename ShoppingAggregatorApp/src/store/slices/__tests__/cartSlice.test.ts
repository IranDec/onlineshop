import cartReducer, {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
  CartState,
  CartItem
} from '../cartSlice';

describe('cartSlice reducers', () => {
  const initialState: CartState = { items: [] };

  const product1: CartItem = {
    id: '1',
    name: 'Test Product 1',
    price: '10.00',
    quantity: 1,
    brandName: 'BrandA',
    imageUrl: 'url1',
    sku: 'sku1'
  };
  const product2: CartItem = {
    id: '2',
    name: 'Test Product 2',
    price: '20.50',
    quantity: 2,
    brandName: 'BrandB',
    imageUrl: 'url2',
    sku: 'sku2'
  };

  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual({ items: [] });
  });

  // addItemToCart tests
  describe('addItemToCart', () => {
    it('should add a new item to an empty cart', () => {
      const actual = cartReducer(initialState, addItemToCart(product1));
      expect(actual.items.length).toBe(1);
      expect(actual.items[0]).toEqual(product1);
    });

    it('should add a new item to a non-empty cart', () => {
      const stateWithProduct1: CartState = { items: [product1] };
      const actual = cartReducer(stateWithProduct1, addItemToCart(product2));
      expect(actual.items.length).toBe(2);
      expect(actual.items).toContainEqual(product1);
      expect(actual.items).toContainEqual(product2);
    });

    it('should increment quantity for an existing item', () => {
      const stateWithProduct1: CartState = { items: [{ ...product1, quantity: 1 }] };
      // Adding the same product (product1) again, but its quantity in payload is 1
      // The reducer logic should add the payload's quantity to the existing one.
      const actual = cartReducer(stateWithProduct1, addItemToCart({ ...product1, quantity: 1 }));
      expect(actual.items.length).toBe(1);
      expect(actual.items[0].quantity).toBe(2);
    });

     it('should increment quantity for an existing item by payload quantity', () => {
      const stateWithProduct1: CartState = { items: [{ ...product1, quantity: 1 }] };
      const actual = cartReducer(stateWithProduct1, addItemToCart({ ...product1, quantity: 3 }));
      expect(actual.items.length).toBe(1);
      expect(actual.items[0].quantity).toBe(4);
    });
  });

  // removeItemFromCart tests
  describe('removeItemFromCart', () => {
    const stateWithTwoItems: CartState = { items: [product1, product2] };
    it('should remove an item from a cart with multiple items', () => {
      const actual = cartReducer(stateWithTwoItems, removeItemFromCart(product1.id));
      expect(actual.items.length).toBe(1);
      expect(actual.items).not.toContainEqual(product1);
      expect(actual.items).toContainEqual(product2);
    });

    it('should remove the only item in the cart', () => {
      const stateWithOneItem: CartState = { items: [product1] };
      const actual = cartReducer(stateWithOneItem, removeItemFromCart(product1.id));
      expect(actual.items.length).toBe(0);
    });

    it('should not change state if removing a non-existent item', () => {
      const actual = cartReducer(stateWithTwoItems, removeItemFromCart('nonexistent-id'));
      expect(actual.items.length).toBe(2);
      expect(actual.items).toEqual(stateWithTwoItems.items);
    });
  });

  // updateItemQuantity tests
  describe('updateItemQuantity', () => {
    const stateWithProduct1Qty2: CartState = { items: [{ ...product1, quantity: 2 }] };
    it('should increase the quantity of an item', () => {
      const actual = cartReducer(stateWithProduct1Qty2, updateItemQuantity({ id: product1.id, quantity: 5 }));
      expect(actual.items.length).toBe(1);
      expect(actual.items[0].quantity).toBe(5);
    });

    it('should decrease the quantity of an item', () => {
      const actual = cartReducer(stateWithProduct1Qty2, updateItemQuantity({ id: product1.id, quantity: 1 }));
      expect(actual.items.length).toBe(1);
      expect(actual.items[0].quantity).toBe(1);
    });

    it('should remove the item if quantity is updated to 0', () => {
      const actual = cartReducer(stateWithProduct1Qty2, updateItemQuantity({ id: product1.id, quantity: 0 }));
      expect(actual.items.length).toBe(0);
    });

    it('should remove the item if quantity is updated to less than 0', () => {
      const actual = cartReducer(stateWithProduct1Qty2, updateItemQuantity({ id: product1.id, quantity: -1 }));
      expect(actual.items.length).toBe(0);
    });

    it('should not change state if updating quantity for a non-existent item', () => {
      const actual = cartReducer(stateWithProduct1Qty2, updateItemQuantity({ id: 'nonexistent-id', quantity: 5 }));
      expect(actual.items).toEqual(stateWithProduct1Qty2.items);
    });
  });

  // clearCart tests
  describe('clearCart', () => {
    it('should clear a non-empty cart', () => {
      const stateWithItems: CartState = { items: [product1, product2] };
      const actual = cartReducer(stateWithItems, clearCart());
      expect(actual.items.length).toBe(0);
    });

    it('should not change state if clearing an already empty cart', () => {
      const actual = cartReducer(initialState, clearCart());
      expect(actual.items.length).toBe(0);
      expect(actual.items).toEqual(initialState.items);
    });
  });
});
