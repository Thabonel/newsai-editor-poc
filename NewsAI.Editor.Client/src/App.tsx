import Login from './components/Login';
import { useAuthStore } from './stores/authStore';

function App() {
  const { token, setToken } = useAuthStore();

  if (!token) {
    return <Login />;
  }

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl mb-4">Hello World</h1>
      <button className="bg-gray-300 px-4 py-2" onClick={() => setToken(null)}>Logout</button>
    </div>
  );
}

export default App;
