import axios from "axios";

const baseURL = 'https://localhost:44328/';

const client = axios.create({
  baseURL: baseURL
});

export default client;
