import './App.css';
import { LoggedOutRouter } from './routers/logged-out-router';
import { LoggedInRouter } from './routers/logged-in-router';
import { useReactiveVar } from '@apollo/client';
import { isLoggedInVar } from './apollo';

function App() {
  // graphql version origin: 15.5.1 apollo: 14.7.0
//   node_modules/apollo-language-server/node_modules/graphql: 14.7.0
// node_modules/@apollo/client/utilities/graphql 15.5.1
// node_modules/graphql 15.5.1
// start2: apollo.config.ts --isolatedModules
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}

export default App;
