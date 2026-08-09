require("dotenv").config();
const { Mastra } = require("@mastra/core");
const { Agent } = require("@mastra/core/agent");

// Manufacturer email mapping
const MANUFACTURER_EMAILS = {
  Ottobock: "vineeshaavasarala@gmail.com",
  Össur: "vineeshaavasarala@gmail.com",
  Fillauer: "vineeshaavasarala@gmail.com",
  "College Park Industries": "vineeshaavasarala@gmail.com",
};

// Tool 1: Generate AI image using Pollinations
async function generateImage(color, pattern, theme) {
  console.log("🎨 Generating AI image with Pollinations...");
  const prompt = `A prosthetic leg with ${color} color scheme, ${pattern} pattern, in a ${theme} style, product design, high quality 3D render, white background`;
  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`;

  const response = await fetch(imageUrl);
  if (response.ok) {
    console.log("✅ Image generated:", imageUrl);
    return imageUrl;
  }
  throw new Error("Image generation failed");
}

// Tool 2: Send email via Arcade.dev
async function sendEmail(manufacturer, color, pattern, theme, imageUrl) {
  console.log(`📧 Sending email to ${manufacturer}...`);

  const { Arcade } = require("@arcadeai/arcadejs");
  const client = new Arcade({ 
    apiKey: process.env.ARCADE_API_KEY 
  });

  const toEmail = MANUFACTURER_EMAILS[manufacturer];
  const subject = `New Prosthetic Design - ${color} ${pattern}`;
  const body = `Hello ${manufacturer} Team,

A new personalized prosthetic leg design has been generated.

Design Specifications:
- Color Scheme: ${color}
- Pattern: ${pattern}
- Theme: ${theme}
- View Design: ${imageUrl}

Best regards,
Prosthetic Design Studio`;

  const authResponse = await client.tools.authorize({
    tool_name: "Gmail.SendEmail",
    user_id: process.env.SENDER_EMAIL,
  });

  if (authResponse.status !== "completed") {
    console.log("⚠️  Auth needed:", authResponse.url);
    return false;
  }

  await client.tools.execute({
    tool_name: "Gmail.SendEmail",
    input: { recipient: toEmail, subject, body },
    user_id: process.env.SENDER_EMAIL,
  });

  console.log("✅ Email sent!");
  return true;
}

// Main Mastra pipeline
async function runProstheticDesignPipeline(preferences) {
  console.log("🚀 Mastra Pipeline Starting...");
  console.log("📋 Preferences:", preferences);

  const { color, pattern, theme, manufacturer } = preferences;

  // Step 1: Generate image
  const imageUrl = await generateImage(color, pattern, theme);

  // Step 2: Send email
  const emailSent = await sendEmail(
    manufacturer, color, pattern, theme, imageUrl
  );

  const result = {
    success: true,
    imageUrl,
    emailSent,
    message: `Design sent to ${manufacturer}!`,
  };

  console.log("🎉 Pipeline complete:", result);
  return result;
}

// Initialize Mastra
const mastra = new Mastra({
  agents: {},
});

console.log("✅ Mastra initialized!");

// Run with preferences from env or defaults
const preferences = {
  color: process.env.DESIGN_COLOR || "Ocean Blue",
  pattern: process.env.DESIGN_PATTERN || "Geometric Diamond",
  theme: process.env.DESIGN_THEME || "Futuristic",
  manufacturer: process.env.DESIGN_MANUFACTURER || "Ottobock",
};

runProstheticDesignPipeline(preferences);