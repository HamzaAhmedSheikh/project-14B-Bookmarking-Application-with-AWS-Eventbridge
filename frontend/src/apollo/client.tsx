import fetch from 'cross-fetch';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://i47bcybsz5e27cpb63o2a6a2lm.appsync-api.us-east-2.amazonaws.com/graphql',
    headers:{
        "x-api-key": "da2-6bhpn5sjefgs7af7mmouay4esa"
    },
    fetch,
  }),
  cache: new InMemoryCache()
});