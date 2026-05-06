/// &lt;reference types="vite/client" /&gt;
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
const API = `${import.meta.env.VITE_API_BASE_URL}/api`;
type Product = {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
  sizesCsv: string;
  stockQty: number;
};
type CartItem = { product: Product; size: string; quantity: number };
type Auth = { token: string; email: string; admin: boolean } | null;
const AppCtx = createContext<any>(null);
const useApp = () => useContext(AppCtx);
function api(path: string, options: any = {}) {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  return fetch(API + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
    },
  }).then(async (r) => {
    if (!r.ok) throw new Error(await r.text());
    return r.status === 204 ? null : r.json();
  });
}
function Provider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<Auth>(() =>
    JSON.parse(localStorage.getItem("auth") || "null"),
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    JSON.parse(localStorage.getItem("cart") || "[]"),
  );
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(
    () =>
      auth
        ? localStorage.setItem("auth", JSON.stringify(auth))
        : localStorage.removeItem("auth"),
    [auth],
  );
  const value = useMemo(() => ({ auth, setAuth, cart, setCart }), [auth, cart]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
function Nav() {
  const { auth, setAuth, cart } = useApp();
  return (
    <nav>
      <Link to="/">MyStreeT</Link>
      <Link to="/cart">Cart ({cart.length})</Link>
      {auth?.admin && <Link to="/admin/products">Admin</Link>}
      {auth ? (
        <button onClick={() => setAuth(null)}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  useEffect(() => {
    api(
      `/products?${brand ? "brand=" + brand : ""}${size ? "&size=" + size : ""}`,
    ).then(setProducts);
  }, [brand, size]);
  return (
    <main>
      <h1>Sneaker Catalog</h1>
      <div className="filters">
        <input
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <input
          placeholder="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </div>
      <section className="grid">
        {products.map((p) => (
          <article className="card" key={p.id}>
            <img src={p.imageUrl} />
            <h3>{p.name}</h3>
            <p>
              {p.brand} · ${p.price}
            </p>
            <Link to={`/products/${p.id}`}>View</Link>
          </article>
        ))}
      </section>
    </main>
  );
}
function Detail() {
  const id = location.pathname.split("/").pop();
  const [p, setP] = useState<Product>();
  const [size, setSize] = useState("");
  const { cart, setCart } = useApp();
  useEffect(() => {
    api("/products/" + id).then((x: Product) => {
      setP(x);
      setSize(x.sizesCsv.split(",")[0]);
    });
  }, [id]);
  if (!p) return null;
  return (
    <main className="detail">
      <img src={p.imageUrl} />
      <div>
        <h1>{p.name}</h1>
        <p>{p.description}</p>
        <h2>${p.price}</h2>
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          {p.sizesCsv.split(",").map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={() => setCart([...cart, { product: p, size, quantity: 1 }])}
        >
          Add to cart
        </button>
      </div>
    </main>
  );
}
function Cart() {
  const { cart, setCart, auth } = useApp();
  const nav = useNavigate();
  const total = cart.reduce(
    (s: number, i: CartItem) => s + i.product.price * i.quantity,
    0,
  );
  return (
    <main>
      <h1>Cart</h1>
      {!cart.length ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((i: CartItem, idx: number) => (
          <div className="row" key={idx}>
            <span>
              {i.product.name} / Size {i.size}
            </span>
            <input
              type="number"
              min="1"
              value={i.quantity}
              onChange={(e) => {
                const c = [...cart];
                c[idx].quantity = +e.target.value;
                setCart(c);
              }}
            />
            <button
              onClick={() =>
                setCart(cart.filter((_: CartItem, n: number) => n !== idx))
              }
            >
              Remove
            </button>
          </div>
        ))
      )}
      <h2>Total: ${total.toFixed(2)}</h2>
      {!!cart.length && (
        <button onClick={() => (auth ? nav("/checkout") : nav("/login"))}>
          Checkout
        </button>
      )}
    </main>
  );
}
function Login() {
  const [email, setEmail] = useState("admin@mystreet.com");
  const [password, setPassword] = useState("admin123");
  const { setAuth } = useApp();
  const nav = useNavigate();
  const submit = (mode: string) =>
    api("/auth/" + mode, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
      .then((a: Auth) => {
        setAuth(a);
        nav("/");
      })
      .catch((e) => alert(e.message));
  return (
    <main>
      <h1>Login / Register</h1>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => submit("login")}>Login</button>
      <button onClick={() => submit("register")}>Register</button>
    </main>
  );
}
function Checkout() {
  const { cart, setCart } = useApp();
  const [address, setAddress] = useState("Hyderabad, India");
  const nav = useNavigate();
  const place = () =>
    api("/orders", {
      method: "POST",
      body: JSON.stringify({
        shippingAddress: address,
        paymentMode: "MOCK",
        items: cart.map((i: CartItem) => ({
          productId: i.product.id,
          size: i.size,
          quantity: i.quantity,
        })),
      }),
    })
      .then((o: any) => {
        setCart([]);
        nav("/order/" + o.id);
      })
      .catch((e) => alert(e.message));
  return (
    <main>
      <h1>Checkout</h1>
      <textarea value={address} onChange={(e) => setAddress(e.target.value)} />
      <p>
        <input type="radio" checked readOnly /> Mock UPI / Cash on Delivery
      </p>
      <button onClick={place}>Place Order</button>
    </main>
  );
}
function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<any>({
    name: "",
    brand: "",
    description: "",
    price: 100,
    imageUrl: "https://picsum.photos/seed/new/500",
    sizesCsv: "7,8,9",
    stockQty: 10,
  });
  const load = async () => {
    const data = await api("/products");
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);
  const save = () =>
    api("/products", { method: "POST", body: JSON.stringify(form) }).then(
      () => {
        load();
        alert("Product added");
      },
    );
  return (
    <main>
      <h1>Admin Products</h1>
      {Object.keys(form).map((k) => (
        <input
          key={k}
          placeholder={k}
          value={form[k]}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        />
      ))}
      <button onClick={save}>Add Product</button>
      {products.map((p) => (
        <div className="row" key={p.id}>
          <span>{p.name}</span>
          <button
            onClick={() =>
              api("/products/" + p.id, { method: "DELETE" }).then(load)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </main>
  );
}
function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const { auth } = useApp();
  return auth?.admin ? children : <Navigate to="/login" />;
}
function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<Detail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/order/:id"
            element={
              <main>
                <h1>Order Confirmed</h1>
                <p>Your order has been placed successfully.</p>
              </main>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedAdmin>
                <Admin />
              </ProtectedAdmin>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
