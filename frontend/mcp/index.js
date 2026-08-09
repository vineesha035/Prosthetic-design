const { Arcade } = require("@arcadeai/arcadejs");
const Replicate = require("replicate");

const ARCADE_API_KEY = "arc_proj1PK4azS793m179LGHdCQpF5PEreqPJc6vgv8CfEp3KTAS5zb712";
const SENDER_EMAIL = "vineeshaavasarala@gmail.com";
const REPLICATE_API_KEY = "r8_CfuK3ssNvPYf1f9J6T1jepTGnwqRRWV0plUUJ";
const HUGGINGFACE_API_KEY = "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";
const GEMINI_API_KEY = "AQ.Ab8RN6IVCw5R75VuIlHYUdKqf7AafdibkLIc3Z35qCn2RnEf7g";
const MANUFACTURER_EMAILS = {
  Ottobock: "vineeshaavasarala@gmail.com",
  Össur: "vineeshaavasarala@gmail.com",
  Fillauer: "vineeshaavasarala@gmail.com",
  "College Park Industries": "vineeshaavasarala@gmail.com",
};

async function runDesignPipeline(prefs) {
  console.log("🚀 Starting Design Pipeline...");
  console.log("🎨 Preferences received:", prefs);

  const prompt = buildVizcomPrompt(prefs);
  console.log(`📝 Prompt: ${prompt}`);

  // Real AI generation with Replicate
  console.log("🤖 Generating design with Replicate AI...");
  const imageUrl = await generateDesignWithReplicate(prompt);
  console.log(`✅ Design generated: ${imageUrl}`);

  const manufacturerEmail = MANUFACTURER_EMAILS[prefs.manufacturer];
  console.log(`📧 Sending email to ${prefs.manufacturer}...`);
  await sendEmailViaArcade(prefs, imageUrl, manufacturerEmail);
  console.log("✅ Done!");

  return {
    success: true,
    prompt,
    imageUrl,
    message: `Design sent to ${prefs.manufacturer}!`,
  };
}

function buildVizcomPrompt(prefs) {
  return `A prosthetic leg with ${prefs.color} color scheme, ${prefs.pattern} pattern, in a ${prefs.theme} style, product design, high quality 3D render, white background`;
}

async function generateDesignWithReplicate(prompt) {
  console.log(`   Generating image with Pollinations.ai (100% free, no key)...`);

  try {
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`;
    
    console.log(`   Fetching image from: ${imageUrl}`);
    
    // Verify the image is accessible
    const response = await fetch(imageUrl);
    
    if (response.ok) {
      console.log(`   ✅ Image generated successfully!`);
      console.log(`   Image URL: ${imageUrl}`);
      return imageUrl;
    } else {
      console.error(`   ❌ Error: ${response.status}`);
      return "image-generation-failed";
    }
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
    return "image-generation-failed";
  }
}
async function sendEmailViaArcade(prefs, imageUrl, toEmail) {
  const subject = `New Prosthetic Design Request - ${prefs.color} ${prefs.pattern}`;
  const body = `Hello ${prefs.manufacturer} Team,

A new personalized prosthetic leg design has been generated and is ready for production.

Design Specifications:
- Color Scheme: ${prefs.color}
- Pattern: ${prefs.pattern}
- Theme: ${prefs.theme}
- Generated Design: ${imageUrl}

Please review the design at the link above and proceed with manufacturing.

Best regards,
Prosthetic Design Studio`;

  try {
    const client = new Arcade({ apiKey: ARCADE_API_KEY });

    const authResponse = await client.tools.authorize({
      tool_name: "Gmail.SendEmail",
      user_id: SENDER_EMAIL,
    });

    if (authResponse.status !== "completed") {
      console.log("⚠️  Gmail authorization required!");
      console.log(`👉 Open this URL: ${authResponse.url}`);
      return;
    }

    const result = await client.tools.execute({
      tool_name: "Gmail.SendEmail",
      input: {
        recipient: toEmail,
        subject: subject,
        body: body,
      },
      user_id: SENDER_EMAIL,
    });

    console.log("   ✅ Email delivered!");
  } catch (err) {
    console.error("   ❌ Arcade error:", err.message);
  }
}

const prefs = {
  color: process.env.DESIGN_COLOR || "Ocean Blue",
  pattern: process.env.DESIGN_PATTERN || "Geometric Diamond",
  theme: process.env.DESIGN_THEME || "Futuristic",
  manufacturer: process.env.DESIGN_MANUFACTURER || "Ottobock",
};

runDesignPipeline(prefs).then((result) => {
  console.log("\n🎉 Pipeline result:", result);
});