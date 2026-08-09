import { exec } from "child_process";
import path from "path";

export async function POST(req: Request) {
  const body = await req.json();
  const { color, pattern, theme, manufacturer } = body;

  // Build the prompt
  const prompt = `A prosthetic leg with ${color} color scheme, ${pattern} pattern, in a ${theme} style, product design, high quality 3D render, white background`;

  // Generate image with Pollinations (no API key needed)
  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`;

  // Send email via Arcade
  try {
    const { Arcade } = require("@arcadeai/arcadejs");
    const client = new Arcade({ apiKey: process.env.ARCADE_API_KEY });

    const subject = `New Prosthetic Design - ${color} ${pattern}`;
    const body_text = `Hello ${manufacturer} Team,

A new personalized prosthetic leg design is ready for production.

Design Specifications:
- Color Scheme: ${color}
- Pattern: ${pattern}
- Theme: ${theme}
- View AI Design: ${imageUrl}

Best regards,
Prosthetic Design Studio`;

    const authResponse = await client.tools.authorize({
      tool_name: "Gmail.SendEmail",
      user_id: process.env.SENDER_EMAIL,
    });

    if (authResponse.status !== "completed") {
      return Response.json({
        success: false,
        error: "Gmail authorization required",
        authUrl: authResponse.url,
      });
    }

    await client.tools.execute({
      tool_name: "Gmail.SendEmail",
      input: {
        recipient: process.env.SENDER_EMAIL,
        subject,
        body: body_text,
      },
      user_id: process.env.SENDER_EMAIL,
    });

    return Response.json({
      success: true,
      message: `Design sent to ${manufacturer}!`,
      imageUrl,
    });
  } catch (err: any) {
    return Response.json({
      success: false,
      error: err.message,
    }, { status: 500 });
  }
}