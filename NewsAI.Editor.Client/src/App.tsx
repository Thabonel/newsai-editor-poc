import Login from './components/Login';
import EditorLayout from './components/EditorLayout';
import { useAuthStore } from './stores/authStore';

function App() {
  const { token, setToken } = useAuthStore();

  if (!token) {
    return <Login />;
  }

  return <EditorLayout onLogout={() => setToken(null)} />;
}

export default App;
