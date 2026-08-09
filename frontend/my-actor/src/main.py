import asyncio
import os
import base64
from dotenv import load_dotenv
from playwright.async_api import async_playwright

load_dotenv()

VIZCOM_USER = os.getenv("VIZCOM_USER")
VIZCOM_PASSWORD = os.getenv("VIZCOM_PASSWORD")
LEG_IMAGE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "leg.png"))

async def main():
    print("🚀 Starting Prosthetic Design Actor...")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()

        # Login
        print("🌐 Opening Vizcom...")
        await page.goto("https://app.vizcom.ai")
        await page.wait_for_timeout(2000)
        await page.fill('input[placeholder="Email address"]', VIZCOM_USER)
        await page.wait_for_timeout(500)
        await page.click('text="Continue with email"')
        await page.wait_for_timeout(2000)
        await page.fill('input[placeholder="Password"]', VIZCOM_PASSWORD)
        await page.wait_for_timeout(500)
        await page.click('text="Log in"')
        await page.wait_for_timeout(4000)
        print("✅ Logged in!")

        # Create new file and enter Studio
        await page.click('text="Create new file"')
        await page.wait_for_timeout(3000)
        await page.click('text="Start in Studio"')
        await page.wait_for_timeout(4000)
        print("✅ Inside Studio!")

        # Read the image and convert to base64
        print("📁 Reading leg.png...")
        with open(LEG_IMAGE_PATH, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")
        print("✅ Image loaded!")

        # Simulate drag and drop using JavaScript
        print("🖼️ Dropping leg.png onto canvas...")
        await page.evaluate(f"""
            async () => {{
                const base64 = "{image_data}";
                const byteChars = atob(base64);
                const byteNums = new Array(byteChars.length);
                for (let i = 0; i < byteChars.length; i++) {{
                    byteNums[i] = byteChars.charCodeAt(i);
                }}
                const byteArray = new Uint8Array(byteNums);
                const blob = new Blob([byteArray], {{ type: 'image/png' }});
                const file = new File([blob], 'leg.png', {{ type: 'image/png' }});
                const canvas = document.querySelector('canvas') || document.body;
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                const dropEvent = new DragEvent('drop', {{
                    bubbles: true,
                    cancelable: true,
                    dataTransfer: dataTransfer
                }});
                canvas.dispatchEvent(dropEvent);
            }}
        """)

        await page.wait_for_timeout(3000)
        await page.screenshot(path="after_drop.png")
        print("📸 Saved after_drop.png")

        # Type the style prompt
        print("✍️ Typing style prompt...")
        prompt_box = page.locator('[contenteditable="true"]').first
        await prompt_box.click()
        await page.wait_for_timeout(1000)
        await prompt_box.fill("A prosthetic leg with Ocean Blue color scheme, Geometric Diamond pattern, Futuristic style")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="after_prompt.png")
        print("📸 Saved after_prompt.png")

        # Click Instant Render and wait longer
        print("🎨 Clicking Instant Render...")
        await page.click('text="Instant Render"')
        await page.wait_for_timeout(15000)
        await page.screenshot(path="after_render.png")
        print("📸 Saved after_render.png")

        # Click Results panel to see generated output
        print("📊 Clicking Results panel...")
        try:
            await page.click('text="Results"')
            await page.wait_for_timeout(3000)
        except:
            print("   Results panel not found, trying alternative...")
        await page.screenshot(path="after_results.png")
        print("📸 Saved after_results.png")

        print("⏸️  Staying open 15 seconds...")
        await page.wait_for_timeout(15000)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())