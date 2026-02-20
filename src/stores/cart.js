import { reactive } from 'vue'

export const cartStore = reactive({
  items: JSON.parse(localStorage.getItem('cart')) || [],

  addItem(product, quantity = 1) {
    const existing = this.items.find(i => i.productId === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      this.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity
      })
    }
    this.save()
  },

  removeItem(productId) {
    this.items = this.items.filter(i => i.productId !== productId)
    this.save()
  },

  updateQuantity(productId, quantity) {
    const item = this.items.find(i => i.productId === productId)
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) this.removeItem(productId)
    }
    this.save()
  },

  clear() {
    this.items = []
    this.save()
  },

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items))
  },

  get total() {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
  },

  get count() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0)
  }
})