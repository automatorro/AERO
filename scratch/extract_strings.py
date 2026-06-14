import os
import re
import json

FILES_TO_SCAN = [
    r"c:\Users\LucianCebuc\AERO\app\(auth)\login.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(auth)\register.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(auth)\language.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(passenger)\_layout.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(passenger)\ride.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(passenger)\request.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(passenger)\searching.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(passenger)\active.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(passenger)\rating.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(passenger)\profile.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(passenger)\rides.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(passenger)\passes.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(driver)\_layout.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(driver)\drive.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(driver)\profile.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(driver)\subscription.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(driver)\rides.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(driver)\passes.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(admin)\_layout.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(admin)\dashboard.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(admin)\drivers.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(admin)\alerts.tsx",
    r"c:\Users\LucianCebuc\AERO\app\(admin)\settings.tsx",
    r"c:\Users\LucianCebuc\AERO\app\chat\[rideId].tsx",
    r"c:\Users\LucianCebuc\AERO\components\feature\DriverRequestCard.tsx",
]

# Pattern to match JSX text contents: >Text Content<
jsx_text_pattern = re.compile(r'>\s*([^<{]+?[a-zA-ZăâîșțĂÂÎȘȚ].*?)\s*<')

# Pattern to match string literals inside code: 'string' or "string"
string_literal_pattern = re.compile(r'[\'"]([^\'"]*?[ăâîșțĂÂÎȘȚ][^\'"]*?)[\'"]')

extracted_strings = {}

for filepath in FILES_TO_SCAN:
    if not os.path.exists(filepath):
        print(f"Skipping missing file: {filepath}")
        continue
        
    print(f"Scanning: {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    file_strings = set()
    
    # Extract JSX text
    for match in jsx_text_pattern.finditer(content):
        text = match.group(1).strip()
        if text and not text.startswith('{') and not text.endswith('}'):
            file_strings.add(text)
            
    # Extract string literals
    for match in string_literal_pattern.finditer(content):
        text = match.group(1).strip()
        if text:
            file_strings.add(text)
            
    if file_strings:
        extracted_strings[os.path.basename(filepath)] = sorted(list(file_strings))

output_path = r"c:\Users\LucianCebuc\AERO\scratch\extracted_strings.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(extracted_strings, f, indent=2, ensure_ascii=False)

print(f"Extraction complete! Saved to {output_path}")
