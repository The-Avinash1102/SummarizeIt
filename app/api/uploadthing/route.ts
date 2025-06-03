import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "./core";

export const GET = (req: Request) => {
  return createRouteHandler({ router: ourFileRouter })(req);
};

export const POST = (req: Request) => {
  return createRouteHandler({ router: ourFileRouter })(req);
};
