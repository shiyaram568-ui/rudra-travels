const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, 'assets', 'images');

// Create directory if it doesn't exist
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

// NOTE: source.unsplash.com was deprecated in 2024. 
// To ensure reliable, high-quality images, we are using the exact direct 
// Unsplash URLs for the required destinations.
const imagesToDownload = [
  { name: 'hero-road.jpg', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop' },
  { name: 'wagonr.jpg', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop' },
  { name: 'ertiga.jpg', url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format&fit=crop' },
  { name: 'agra.jpg', url: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop' },
  { name: 'jaipur.jpg', url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop' },
  { name: 'rishikesh.jpg', url: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=800&auto=format&fit=crop' },
  { name: 'manali.jpg', url: 'https://images.unsplash.com/photo-1605649487212-4d63b28495a8?q=80&w=800&auto=format&fit=crop' },
  { name: 'shimla.jpg', url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=800&auto=format&fit=crop' },
  { name: 'udaipur.jpg', url: 'https://images.unsplash.com/photo-1615966650071-855b15fba3b2?q=80&w=800&auto=format&fit=crop' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location, dest).then(resolve).catch(reject);
      } else {
        reject(new Error(`Server responded with ${res.statusCode}: ${res.statusMessage}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err)); // Delete the file async. (But we don't check the result)
    });
  });
}

async function downloadAll() {
  console.log('Starting image downloads...');
  for (const image of imagesToDownload) {
    const filePath = path.join(dir, image.name);
    console.log(`Downloading ${image.name}...`);
    try {
      await download(image.url, filePath);
      console.log(`✅ Successfully saved ${image.name}`);
    } catch (error) {
      console.error(`❌ Failed to download ${image.name}:`, error.message);
    }
  }
  console.log('\nAll downloads completed! You can now check the assets/images folder.');
}

downloadAll();
