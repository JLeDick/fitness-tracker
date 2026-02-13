# React Study Guide

Personal reference for building quality React applications.
Updated as new concepts come up.

---

## React Hooks (Built-in)

### `useState`

Stores a value in a component that persists across re-renders. When you call the setter, React re-renders the component with the new value.

```jsx
const [count, setCount] = useState(0); // number
const [name, setName] = useState(""); // string
const [user, setUser] = useState(null); // object (or null)
const [items, setItems] = useState([]); // array
```

- The argument to `useState` is the **initial value**
- `setCount(5)` replaces the value
- `setItems([...items, newItem])` adds to an array (don't mutate, create a new one)
- Calling the setter triggers a **re-render**

### `useEffect`

Runs a side effect (fetching data, setting up listeners, etc.) after the component renders.

```jsx
useEffect(() => {
  // this runs...
}, [dependencies]);
```

- `[]` — runs **once** on mount
- `[id]` — runs on mount **and** whenever `id` changes
- No array — runs on **every** render (usually a mistake)
- The dependency array is always an array — that's the syntax, not the data type

**Common pattern for fetching data:**

```jsx
useEffect(() => {
  async function fetchData() {
    const data = await getActivity(id);
    setActivity(data);
  }
  fetchData();
}, [id]);
```

Note: You can't make the useEffect callback itself async. Define an async function inside and call it.

### `useContext`

Reads a value from a React Context. Used under the hood by custom hooks like `useAuth`.

```jsx
const value = useContext(MyContext);
```

- Requires a `<Provider>` higher up in the component tree
- When the context value changes, all consumers re-render

---

## React Router Hooks

### `useParams`

Reads dynamic segments from the current URL. Returns an object with string values.

```jsx
// Route: <Route path="/activities/:id" />
// URL: /activities/5
const { id } = useParams(); // id = "5" (always a string!)
```

- The key name (`:id`) in the route path becomes the property name
- Multiple params work: `/users/:userId/posts/:postId`

### `useNavigate`

Programmatic navigation — redirect the user in your code (not from a click).

```jsx
const navigate = useNavigate();

navigate("/"); // go to home
navigate("/login"); // go to login
navigate(-1); // go back (like browser back button)
```

- Use this when you need to redirect **after** something happens (login, delete, etc.)
- For regular links that the user clicks, use `<Link>` instead

---

## React Router Components

### `<Link>`

Navigates to a URL without a full page reload. Replaces `<a href="...">`.

```jsx
<Link to="/">Home</Link>
<Link to={`/activities/${activity.id}`}>{activity.name}</Link>
```

- Use `<Link>` for clickable navigation (navbar, lists, etc.)
- Use `useNavigate` for programmatic redirects (after form submit, delete, etc.)

### `<Routes>` and `<Route>`

Defines which component renders at which URL. Like a switch statement for URLs.

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/users/:id" element={<UserDetail />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

- `path="*"` catches everything that didn't match — your 404 page
- `:id` is a dynamic segment — captured by `useParams`

### `<Route>` as a Layout Route

Wraps child routes with shared UI (like a navbar).

```jsx
<Route element={<Layout />}>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Route>
```

- The layout component uses `<Outlet />` to render the matched child

### `<Outlet>`

Placeholder in a layout component where child routes render.

```jsx
function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
```

### `<BrowserRouter>`

Wraps your entire app. Enables React Router to work. Goes in `main.jsx`.

```jsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

- Uses the browser's History API (`window.history.pushState`)
- All router hooks (`useParams`, `useNavigate`, etc.) require this as an ancestor

---

## Custom Hooks

### `useAuth` (your custom hook)

Reads from `AuthContext`. Provides `token`, `register`, `login`, `logout`.

```jsx
const { token, register, login, logout } = useAuth();
```

- `token` exists = user is logged in
- `token` is null/undefined = user is logged out
- **The token is about the USER, not about any specific activity/resource**

---

## Patterns to Know

### Conditional Rendering

Show something only if a condition is true:

```jsx
{
  token && <button>Delete</button>;
} // show button only when logged in
{
  error && <p role="alert">{error}</p>;
} // show error only when there is one
```

### Loading State

Show a loading message while data is being fetched:

```jsx
const [data, setData] = useState(null);

if (!data) return <p>Loading...</p>;

return <h1>{data.name}</h1>;
```

### Try/Catch with Async

Handle errors from API calls:

```jsx
try {
  await deleteActivity(token, id);
  navigate("/"); // success path
} catch (error) {
  setError(error.message); // error path
}
```

### Props

Passing data or functions from parent to child:

```jsx
// Parent passes down
<ActivityList activities={activities} syncActivities={syncActivities} />

// Child receives
function ActivityList({ activities, syncActivities }) { ... }
```

- Props flow **down** (parent → child)
- Functions as props = giving the child a "remote control" for the parent's state
- Nested functions can access parent scope variables without props (closure)

### API Function Pattern

Keep API calls in a separate file. Throw errors, don't catch them — let the component handle display.

```jsx
// api/activities.js
export async function deleteActivity(token, id) {
  if (!token) throw Error("Must be signed in");

  const response = await fetch(API + `/activities/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}
```

---

## HTTP & Fetch Basics

### Methods

| Method | Purpose     | Body?      | Common Status      |
| ------ | ----------- | ---------- | ------------------ |
| GET    | Read data   | No         | 200 OK             |
| POST   | Create data | Yes (JSON) | 200 or 201 Created |
| DELETE | Remove data | No         | 204 No Content     |

### `response.ok`

- `true` for status 200–299
- `false` for 400, 401, 403, 404, 500, etc.
- `fetch` does NOT throw on error status codes — only on network failure

### Authorization Header

```js
headers: {
  Authorization: "Bearer " + token;
}
```

- Capital B in "Bearer"
- Space between "Bearer" and the token
- Only needed for authenticated endpoints (POST, DELETE, etc.)

### Content-Type Header

```js
headers: { "Content-Type": "application/json" }
```

- Only needed when sending a JSON body (POST, PUT, PATCH)
- Not needed for GET or DELETE

---

## Terminal Commands Worth Knowing

### Git

```bash
git add .                          # stage all changes
git commit -m "message"            # commit
git push                           # push to remote
git push --force                   # overwrite remote (use carefully)
git commit --amend -m "new msg"    # change last commit message
git reset --soft HEAD~1            # undo last commit, keep changes staged
git reset --hard HEAD~1            # undo last commit, DELETE changes
git rm --cached filename           # stop tracking a file without deleting it
```

### Search & Files

```bash
grep -rn "searchTerm" src/         # search all files recursively with line numbers
grep -rl "searchTerm" src/         # just show matching filenames
cat filename                       # view file contents
rm filename                        # delete a file
touch filename                     # create an empty file
```

---

## Things to Study More

- [ ] React Context — build one from scratch to truly understand Provider/Consumer pattern
- [ ] How `fetch` and Promises work under the hood
- [ ] The browser History API (`pushState`, `popstate`) — what React Router wraps
- [ ] REST API design — why GET/POST/DELETE, status codes, resource-based URLs
- [ ] JavaScript closures — why nested functions can access parent scope variables
- [ ] Component lifecycle — mount, update, unmount and how hooks map to each
