
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import AppRouter from './helpers/Router';
import { NotificationProvider } from './Customer/components/Noti/notification';
import SecureApp from './component/Security';
function App() {
  return (
    <SecureApp>
      <NotificationProvider>
      <AppRouter />
    </NotificationProvider>
     </SecureApp>
  );
}

export default App;
