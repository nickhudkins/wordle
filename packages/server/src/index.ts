import http from "http";
import { handleCheckWord, handleMeta } from "./handlers";

const server = http.createServer(({ url }, res) => {
  const [, path, maybeWord] = (url && url.split("/")) || [];
  if (path === "meta") {
    return handleMeta(res);
  }
  if (path === "check" && !!maybeWord) {
    return handleCheckWord(res, { maybeWord });
  }
  return res.writeHead(404).end();
});

server.listen(8080, () => {
  console.log("🚀");
});
