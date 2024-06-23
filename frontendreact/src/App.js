import Router from "./route/Index";

import ThemeProvider from "./layout/provider/Theme";
import FullScreenLoader from "./components/fullScreenLoader/FullScreenLoader";

const App = () => {
  return (
    <ThemeProvider>
      <FullScreenLoader />
      <Router />
    </ThemeProvider>
  );
};
export default App;
