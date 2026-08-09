import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { color, pattern, theme, manufacturer } = body;

  const mcpScriptPath = path.join(process.cwd(), "mcp", "index.js");
  const command = `node ${mcpScriptPath}`;

  return new Promise<Response>((resolve) => {
    exec(
      command,
      {
        env: {
          ...process.env,
          DESIGN_COLOR: color,
          DESIGN_PATTERN: pattern,
          DESIGN_THEME: theme,
          DESIGN_MANUFACTURER: manufacturer,
        },
      },
      (error, stdout) => {
        if (error) {
          resolve(
            NextResponse.json(
              { success: false, error: error.message },
              { status: 500 }
            )
          );
          return;
        }
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