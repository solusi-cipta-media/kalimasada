import { NextResponse } from "next/server";

export default class MyResponse extends NextResponse {
  constructor(body: any, init?: ResponseInit) {
    super(JSON.stringify(body), init);
  }

  static ok() {
    return super.json({ message: "ok" }, { status: 200, statusText: "OK" });
  }

  static created(body: any, init?: ResponseInit) {
    return new MyResponse(body, {
      status: 201,
      statusText: "Created",
      ...init
    });
  }

  static json200(body: { message?: string; data?: any }) {
    if (!body.message) body.message = "ok";

    return super.json(body, { status: 200, statusText: "OK" });
  }
  static json400(body: { message?: string; data?: any; status?: number }) {
    if (!body.message) body.message = "Bad request";
    if (!body.status) body.status = 400;

    return super.json(body, { status: 400, statusText: "Bad request" });
  }
  static json404(body: { message?: string; data?: any; status?: number }) {
    if (!body.message) body.message = "Not found";
    if (!body.status) body.status = 404;

    return super.json(body, { status: 404, statusText: "Not found" });
  }

  static json403(body?: { message?: string; data?: any; status?: number }) {
    if (!body) body = {};
    if (!body.message) body.message = "Forbidden access";
    if (!body.status) body.status = 403;

    return super.json(body, { status: 403, statusText: "Forbidden access" });
  }
}
