import { type MenuItem, MenuItemCard } from "./menu-item-card"

interface MenuCategoryProps {
  name: string
  items: MenuItem[]
  onAddToCart: (item: MenuItem, quantity: number) => void
}

export function MenuCategory({ name, items, onAddToCart }: MenuCategoryProps) {
  return (
    <section className="py-6">
      <h2 className="mb-4 text-xl font-bold text-foreground">{name}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  )
}
