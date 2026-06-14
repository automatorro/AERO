const fs = require('fs');
const path = require('path');

const FILES_TO_SCAN = [
    "c:\\Users\\LucianCebuc\\AERO\\app\\(auth)\\login.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(auth)\\register.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(auth)\\language.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(passenger)\\_layout.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(passenger)\\ride.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(passenger)\\request.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(passenger)\\searching.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(passenger)\\active.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(passenger)\\rating.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(passenger)\\profile.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(passenger)\\rides.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(passenger)\\passes.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(driver)\\_layout.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(driver)\\drive.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(driver)\\profile.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(driver)\\subscription.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(driver)\\rides.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(driver)\\passes.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(admin)\\_layout.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(admin)\\alerts.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(admin)\\dashboard.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(admin)\\drivers.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\(admin)\\settings.tsx",
    "c:\\Users\\LucianCebuc\\AERO\\app\\chat\\[rideId].tsx",
    "c:\\Users\\LucianCebuc\\AERO\\components\\feature\\DriverRequestCard.tsx",
];

const romChars = /[ășțâîĂȘȚÂÎ]/;

const extracted_strings = {};

for (const filepath of FILES_TO_SCAN) {
    if (!fs.existsSync(filepath)) {
        console.log(`Skipping missing file: ${filepath}`);
        continue;
    }
    
    console.log(`Scanning: ${filepath}`);
    const content = fs.readFileSync(filepath, 'utf8');
    
    const file_strings = new Set();
    
    // Pattern to match JSX text: >Text Content<
    // We match any > text < where text contains letters and doesn't start with { or <
    const jsxRegex = />\s*([^<{]+?[a-zA-ZăâîșțĂÂÎȘȚ].*?)\s*</g;
    let match;
    while ((match = jsxRegex.exec(content)) !== null) {
        const text = match[1].trim();
        if (text && !text.startsWith('{') && !text.endsWith('}')) {
            file_strings.add(text);
        }
    }
    
    // Pattern to match single or double quoted strings
    const strRegex = /['"]([^'"]*?[ăâîșțĂÂÎȘȚ][^'"]*?)['"]/g;
    while ((match = strRegex.exec(content)) !== null) {
        const text = match[1].trim();
        if (text) {
            file_strings.add(text);
        }
    }
    
    // Also capture template literals containing Romanian characters
    const tempRegex = /`([^`]*?[ăâîșțĂÂÎȘȚ][^`]*?)`/g;
    while ((match = tempRegex.exec(content)) !== null) {
        const text = match[1].trim();
        if (text) {
            file_strings.add(text);
        }
    }
    
    if (file_strings.size > 0) {
        extracted_strings[path.basename(filepath)] = Array.from(file_strings).sort();
    }
}

const outputPath = "c:\\Users\\LucianCebuc\\AERO\\scratch\\extracted_strings.json";
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(extracted_strings, null, 2), 'utf8');
console.log(`Extraction complete! Saved to ${outputPath}`);
