
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import AppRouter from './helpers/Router';
import { NotificationProvider } from './Customer/components/Noti/notification';

function App() {
  return (
    <NotificationProvider>
      <AppRouter />
    </NotificationProvider>
  );
}

export default App;
