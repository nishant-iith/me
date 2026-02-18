"""Test the chat page: send a message, observe streaming, capture console logs."""
from playwright.sync_api import sync_playwright
import json, time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture all console logs
    logs = []
    page.on("console", lambda msg: logs.append(f"[{msg.type}] {msg.text}"))

    # Capture network requests/responses to the worker
    network_events = []
    def on_response(response):
        if "chatbot-api" in response.url:
            network_events.append({
                "url": response.url,
                "status": response.status,
                "headers": dict(response.headers),
            })
    page.on("response", on_response)

    # Go to the chat page
    page.goto("http://localhost:5173/chat", wait_until="networkidle")
    page.wait_for_timeout(1000)
    page.screenshot(path="/tmp/chat_initial.png", full_page=True)
    print("=== Initial page loaded ===")

    # Check if messages are visible
    messages = page.locator("[class*='whitespace-pre-wrap']").all()
    print(f"Messages visible: {len(messages)}")
    for m in messages:
        txt = m.text_content()
        print(f"  Message: {txt[:100]}")

    # Check if input is visible
    input_el = page.locator("input[type='text']")
    print(f"Input visible: {input_el.is_visible()}")
    print(f"Input placeholder: {input_el.get_attribute('placeholder')}")

    # Look for suggested prompts
    suggestions = page.locator("button:has-text('tech stack')").all()
    print(f"Suggestion buttons found: {len(suggestions)}")

    # Click the first suggestion or type a message
    if suggestions:
        print("Clicking suggestion: What's your tech stack?")
        suggestions[0].click()
    else:
        print("Typing message manually")
        input_el.fill("Hi, what do you do?")
        page.locator("button[aria-label='Send']").click()

    # Wait and take screenshots during streaming
    print("\n=== Waiting for response ===")
    page.wait_for_timeout(1000)
    page.screenshot(path="/tmp/chat_1s.png", full_page=True)

    page.wait_for_timeout(2000)
    page.screenshot(path="/tmp/chat_3s.png", full_page=True)

    page.wait_for_timeout(3000)
    page.screenshot(path="/tmp/chat_6s.png", full_page=True)

    page.wait_for_timeout(4000)
    page.screenshot(path="/tmp/chat_10s.png", full_page=True)

    # Check final messages
    messages_final = page.locator("[class*='whitespace-pre-wrap']").all()
    print(f"\nFinal messages visible: {len(messages_final)}")
    for m in messages_final:
        txt = m.text_content()
        print(f"  Message: {txt[:200]}")

    # Check for streaming cursor
    cursors = page.locator("[class*='animate-pulse']").all()
    print(f"\nAnimated pulse elements: {len(cursors)}")

    # Print network events
    print(f"\n=== Network events (chatbot-api) ===")
    for evt in network_events:
        print(f"  {evt['url']} -> {evt['status']}")

    # Print console logs
    print(f"\n=== Console logs ({len(logs)} entries) ===")
    for log in logs[:30]:
        print(f"  {log}")

    browser.close()
