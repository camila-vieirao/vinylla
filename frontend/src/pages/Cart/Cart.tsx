import { useEffect, useMemo, useState } from "react";
import loveless from "../../assets/products/a1730902089_16.jpg";

type CartItem = {
  id: string;
  title: string;
  artist: string;
  condition: string;
  price: number;
  thumb: string;
};

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cartItems");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const normalized: CartItem[] = parsed.map((item: CartItem) => {
          const numericPrice =
            typeof item.price === "number" ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
          return {
            ...item,
            price: numericPrice,
            thumb: item.thumb || loveless,
          };
        });
        setItems(normalized);
      } catch {
        setItems([]);
      }
    }
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);

  const handleRemove = (index: number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(copy));
      return copy;
    });
  };

  return (
    <div className="min-h-screen bg-[#05060b] text-white sm:pl-32">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Bag</p>
          <h1 className="text-4xl font-semibold">Your crate</h1>
          <p className="text-white/70">Mock summary of the records you’re about to spin.</p>
        </header>

        <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          {items.length === 0 ? (
            <p className="text-center text-white/60">Your bag is empty. Add records from the marketplace.</p>
          ) : (
            items.map((item, index) => (
              <article key={`${item.id}-${index}`} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                <img src={item.thumb || loveless} alt={item.title} className="h-20 w-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="text-sm text-white/70">{item.artist}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Condition: {item.condition}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-base font-semibold">${item.price.toFixed(2)}</p>
                  <button
                    type="button"
                    className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/70 transition hover:bg-white/10"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <p className="mt-2 text-sm text-white/60">Shipping and taxes are calculated at checkout.</p>
          <button
            type="button"
            className="mt-6 w-full rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] px-6 py-3 text-base font-semibold text-white shadow-xl transition hover:opacity-90 disabled:opacity-30"
            disabled={items.length === 0}
          >
            Finalize purchase
          </button>
        </section>
      </div>
    </div>
  );
};

export default Cart;
