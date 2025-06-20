import request from "./request";
import { getToken } from "../utils";

// mock API from https://jsonplaceholder.typicode.com/
export const fetchData = ({
  email,
  password,
}: {
  email: FormDataEntryValue;
  password: FormDataEntryValue;
}) =>
  request({
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "POST",
    options: {
      body: {
        email,
        password,
      },
    },
  });

export const fetchActiveUsers = () =>
  request({
    url: "https://jsonplaceholder.typicode.com/todos/1",
    options: {
      headers: {
        token: getToken(),
      },
    },
  });

export const fetchDailyStoreSections = () =>
  request({
    url: "https://jsonplaceholder.typicode.com/todos/1",
    options: {
      headers: {
        token: getToken(),
      },
    },
  });
