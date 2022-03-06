const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-cache",
};

export const ok = <T>(resp: T) => ({
  statusCode: 200,
  headers,
  body: JSON.stringify(resp),
});

export const notFound = () => ({
  statusCode: 404,
  headers,
  body: JSON.stringify({}),
});

const buildErrorResponse = <T extends Error>(
  statusCode: number,
  { name, message }: T
) => ({
  statusCode,
  headers,
  body: JSON.stringify({
    error: true,
    name,
    message,
  }),
});

export const errorResponse = <T extends Error>({ name, message }: T) => {
  switch (name) {
    case "ExpiredGameError":
      return buildErrorResponse(410, { error: true, name, message });
    case "ValidationError":
      return buildErrorResponse(400, { error: true, name, message });
  }
  return buildErrorResponse(500, { name, message });
};
