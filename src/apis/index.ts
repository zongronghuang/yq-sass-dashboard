import request from "./request";

// 'https://jsonplaceholder.typicode.com/todos/1'
export const fetchData = ({
  email,
  password,
}: {
  email: FormDataEntryValue;
  password: FormDataEntryValue;
}) => {
  console.log({ email, password });

  return request({
    url: "https://jsonplaceholder.typicode.com/todos/1",
  });
};
