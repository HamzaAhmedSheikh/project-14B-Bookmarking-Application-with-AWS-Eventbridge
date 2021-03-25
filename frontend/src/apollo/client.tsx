import fetch from 'cross-fetch';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://4tcegfzhczc6rdsr3dyzma75hu.appsync-api.us-east-2.amazonaws.com/graphql',
    headers:{
        "x-api-key": "da2-ktvebptttnbchpz7s46ixl6dry"
    },
    fetch,
  }),
  cache: new InMemoryCache()
});