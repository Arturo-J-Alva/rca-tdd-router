import { AppRouter } from "./app-router";
import { AuthGuard } from './utils/components/authGuard';

function App() {
  return (
    <AuthGuard>
      <AppRouter />
    </AuthGuard>
  );
}

export default App;
