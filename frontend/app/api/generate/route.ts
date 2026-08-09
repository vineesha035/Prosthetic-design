import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const { color, pattern, theme, manufacturer } = body;

  console.log("🎨 Received design request:", body);

  const mcpScriptPath = path.join(
    process.cwd(),
    "mcp",
    "index.js"
  );

  const command = `node ${mcpScriptPath}`;

  return new Promise<NextResponse>((resolve) => {
    exec(
      command,
      {
        env: {
          ...process.env,
          DESIGN_COLOR: color,
          DESIGN_PATTERN: pattern,
          DESIGN_THEME: theme,
          DESIGN_MANUFACTURER: manufacturer,
          ARCADE_API_KEY: process.env.ARCADE_API_KEY,
          SENDER_EMAIL: process.env.SENDER_EMAIL,
        },
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Pipeline error:", error);
          resolve(
            NextResponse.json(
              { success: false, error: error.message },
              { status: 500 }
            )
          );
          return;
        }
        console.log("Pipeline output:", stdout);
        resolve(
          NextResponse.json({
            success: true,
            message: `Design sent to ${manufacturer}!`,
            output: stdout,
          })
        );
      }
    );
  });
}