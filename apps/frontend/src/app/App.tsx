import { AppProviders } from './providers';
import { AppRoutes } from './routes';

const App = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export { App };
export default App;

