import React from 'react';
import Main from '../components/Main';
import { User } from '@/types/type_User';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

console.log('heeeello: ', process.env.BACKEND_URL)

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3006/graphql',
    // uri: `${process.env.BACKEND_URL}/graphql`,
  }),
  cache: new InMemoryCache(),
});

interface HomeProps {
  user: User | null;
	setUser: (user: User | null) => void;
}

const Home: React.FC<HomeProps> = ({ user, setUser }) =>
{
  return (
    <ApolloProvider client={client}>
      <div>
        <Main user={user} setUser={setUser}/>
      </div>
    </ApolloProvider>
  );
};

export default Home;
