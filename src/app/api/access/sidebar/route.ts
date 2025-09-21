import type { NextRequest } from "next/server";

import database from "@/@libs/database";
import AccessRepository from "@/repositories/AccessRepository";
import MyResponse from "@/@core/utils/MyResponse";

export async function GET(req: NextRequest) {
  try {
    const repository = new AccessRepository(database);

    const userId = req.headers.get("userId");

    console.log("Sidebar API called with userId:", userId);

    if (!userId) {
      console.log("No userId provided in headers");

      return MyResponse.json400({
        message: "User ID is required",
        status: 401
      });
    }

    const data = await repository.getSidebarMenu(Number(userId));

    console.log("Sidebar menu data:", JSON.stringify(data, null, 2));

    return MyResponse.json200({
      data
    });
  } catch (error) {
    console.error("Error in sidebar API:", error);

    return MyResponse.json400({
      message: "Failed to fetch sidebar menu",
      status: 500
    });
  }
}
