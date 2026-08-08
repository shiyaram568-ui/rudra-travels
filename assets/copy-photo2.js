const fs = require('fs');
const path = require('path');

const source = 'C:\\Users\\hello\\.gemini\\antigravity-ide\\brain\\45e505f2-b56f-4e21-8ffe-7644f6679a89\\sedan_wagonr_fleet_1784889958171.png';
const destination = path.join(__dirname, 'assets', 'images', 'sedan-generated.png');

try {
  fs.copyFileSync(source, destination);
  console.log('✅ Photo successfully copied to assets/images/sedan-generated.png!');
} catch (err) {
  console.error('❌ Error copying photo:', err);
}
