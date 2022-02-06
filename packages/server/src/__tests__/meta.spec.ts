// Pre-fill process.env such that
import { handler } from "../index";

test("handler: GET /meta", async () => {
  const metaResp = await handler({
    routeKey: "GET /meta",
    headers: {},
  });
  expect(metaResp.statusCode).toBe(200);
  expect(() => JSON.parse(metaResp.body!)).not.toThrow();

  const metaResp2 = await handler({
    routeKey: "GET /meta",
    headers: {},
  });
  expect(metaResp2.statusCode).toBe(200);
  expect(() => JSON.parse(metaResp2.body!)).not.toThrow();
});
