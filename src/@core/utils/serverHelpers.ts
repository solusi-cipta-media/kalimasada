import "server-only";

// Next Imports
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Type Imports
import type { Settings } from "@core/contexts/settingsContext";
import type { DemoName, SystemMode } from "@core/types";

// Config Imports
import themeConfig from "@configs/themeConfig";
import demoConfigs from "@configs/demoConfigs";
import { ResponseError } from "@/types/errors";

export const getDemoName = (): DemoName => {
  const headersList = headers();

  return headersList.get("X-server-header") as DemoName | null;
};

export const getSettingsFromCookie = (): Settings => {
  const cookieStore = cookies();

  const demoName = getDemoName();

  const cookieName = demoName
    ? themeConfig.settingsCookieName.replace("demo-1", demoName)
    : themeConfig.settingsCookieName;

  return JSON.parse(cookieStore.get(cookieName)?.value || "{}");
};

export const getMode = () => {
  const settingsCookie = getSettingsFromCookie();

  const demoName = getDemoName();

  // Get mode from cookie or fallback to theme config
  const _mode = settingsCookie.mode || (demoName && demoConfigs[demoName].mode) || themeConfig.mode;

  return _mode;
};

export const getSystemMode = (): SystemMode => {
  const cookieStore = cookies();
  const mode = getMode();

  const colorPrefCookie = (cookieStore.get("colorPref")?.value || "light") as SystemMode;

  return (mode === "system" ? colorPrefCookie : mode) || "light";
};

export const getServerMode = () => {
  const mode = getMode();
  const systemMode = getSystemMode();

  return mode === "system" ? systemMode : mode;
};

export const getSkin = () => {
  const settingsCookie = getSettingsFromCookie();

  return settingsCookie.skin || "default";
};

export const validateJsonBody = async (req: NextRequest) => {
  try {
    const json = await req.json();

    return json;
  } catch (error) {
    throw new ResponseError("Invalid request body", 400);
  }
};

export const validateImageType = async (mimeType: string) => {
  const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/gif"];

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(mimeType)) {
    throw new ResponseError("Invalid file type. Only images are allowed.", 400);
  }
};

export const responseError = (error: ResponseError) => {
  return NextResponse.json(
    {
      message: error.message
    },
    {
      status: error.statusCode,
      statusText: error.message
    }
  );
};

export const throwIfMissing = (data: any, message: string = "Bad request", statusCode: number = 400) => {
  if (!data) {
    throw new ResponseError(message, statusCode);
  }
};

type DatatableOrder = "asc" | "desc";

export const DatatableParams = (
  req: NextRequest,
  defaultOrder?: {
    [key: string]: DatatableOrder;
  }[]
) => {
  const { searchParams } = req.nextUrl;
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const skip = parseInt(searchParams.get("skip") ?? "0");
  const search = searchParams.get("search") ?? undefined;

  const orderBy: {
    [key: string]: DatatableOrder;
  }[] = [];

  for (const [key, value] of searchParams.entries()) {
    const match = key.match(/^orderBy\[(\d+)\]\[(\w+)\]$/);

    if (match) {
      const index = parseInt(match[1], 10);
      const field = match[2];

      if (!orderBy[index]) {
        orderBy[index] = {};
      }

      orderBy[index][field] = value as DatatableOrder;
    }
  }

  if (orderBy.length === 0 && defaultOrder) {
    orderBy.push(...defaultOrder);
  }

  return {
    limit,
    skip,
    search,
    orderby: orderBy
  };
};

export const AutocompleteParams = (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") ?? "";
  const limit = parseInt(searchParams.get("limit") ?? "20");

  return {
    search,
    limit
  };
};

export class ConvertParam {
  static toIntOrUndefined(value: string | null) {
    if (value === null) {
      return undefined;
    }

    const val = parseInt(value);

    if (isNaN(val)) {
      return undefined;
    }

    return val;
  }

  static toIntOrNull(value: string | null) {
    if (value === null) {
      return null;
    }

    const val = parseInt(value);

    if (isNaN(val)) {
      return null;
    }

    return val;
  }

  static toBooleanOrUndefined(value: string | null) {
    if (value === null) {
      return undefined;
    }

    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }

    return undefined;
  }

  static toBooleanOrNull(value: string | null) {
    if (value === null) {
      return null;
    }

    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }

    return null;
  }
}
