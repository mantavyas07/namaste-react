import { useRouteError } from "react-router-dom";

export const Error = () => {
  const err = useRouteError();
  console.error(err);
  return (
    <div>
      <h1>Oops! Something went wrong.</h1>
      <p>We apologize for the inconvenience. Please try again later.</p>
      <p>
        {err.status} {err.statusText}
      </p>
      <p>{err.error.message}</p>
    </div>
  );
};
