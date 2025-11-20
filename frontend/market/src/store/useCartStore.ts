import { create } from 'zustand'

interface CartItem {
  id: number
  source_id: number
  product_name: string
  unit_price: number
  quantity: number
  main_image: string
  selected: boolean
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  toggleSelect: (id: number) => void
  toggleSelectAll: () => void
  clearCart: () => void
  getSelectedItems: () => CartItem[]
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.source_id === item.source_id)
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.source_id === item.source_id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        }
      }
      return { items: [...state.items, item] }
    })
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }))
  },

  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }))
  },

  toggleSelect: (id) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      ),
    }))
  },

  toggleSelectAll: () => {
    set((state) => {
      const allSelected = state.items.every((item) => item.selected)
      return {
        items: state.items.map((item) => ({ ...item, selected: !allSelected })),
      }
    })
  },

  clearCart: () => set({ items: [] }),

  getSelectedItems: () => get().items.filter((item) => item.selected),

  getTotalPrice: () =>
    get()
      .items.filter((item) => item.selected)
      .reduce((total, item) => total + item.unit_price * item.quantity, 0),
}))
