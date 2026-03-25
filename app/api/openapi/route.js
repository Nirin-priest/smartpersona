import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const openapiPath = path.resolve(process.cwd(), "openapi.yaml");
    const yaml = await fs.promises.readFile(openapiPath, "utf8");
    return new NextResponse(yaml, {
      status: 200,
      headers: {
        "Content-Type": "application/yaml",
      },
    });
  } catch (error) {
    console.error("OpenAPI read error:", error);
    return NextResponse.json(
      { message: "Cannot read OpenAPI spec" },
      { status: 500 },
    );
  }
}
