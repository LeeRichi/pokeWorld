import React from 'react';
import Main from '../components/Main';
import { User } from '@/types/type_User';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

//temp solution
const backend_url =  process.env.NEXT_PUBLIC_MY_BACKEND_API_URL || 'https://pokeworld2.duckdns.org'
// const backend_url =  process.env.BACKEND_URL || 'http://localhost:3006'

console.log(backend_url)

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${backend_url}/graphql`,
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
