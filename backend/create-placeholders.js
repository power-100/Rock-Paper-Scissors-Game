const fs = require('fs');
const path = require('path');

// Create simple colored placeholder images as HTML files that display civic issue types
const createPlaceholder = (filename, title, color, emoji) => {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 40px 20px;
      font-family: Arial, sans-serif;
      background: linear-gradient(45deg, ${color}22, ${color}44);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
    }
    .emoji { font-size: 80px; margin-bottom: 20px; }
    .title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
    .demo { font-size: 16px; color: #666; }
  </style>
</head>
<body>
  <div class="emoji">${emoji}</div>
  <div class="title">${title}</div>
  <div class="demo">Demo Image</div>
</body>
</html>`;
  
  const filepath = path.join(__dirname, 'uploads', 'posts', filename);
  fs.writeFileSync(filepath, htmlContent);
  console.log(`Created placeholder: ${filename}`);
};

// Create the uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'posts');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create placeholder images
createPlaceholder('pothole-sample.jpg', 'Pothole Issue', '#ff6b35', '🚧');
createPlaceholder('streetlight-sample.jpg', 'Streetlight Problem', '#f7dc6f', '💡');
createPlaceholder('garbage-sample.jpg', 'Garbage Overflow', '#82e0aa', '🗑️');
createPlaceholder('tree-sample.jpg', 'Fallen Tree', '#85c1e9', '🌳');
createPlaceholder('busstop-sample.jpg', 'Bus Stop Damage', '#bb8fce', '🚍');
createPlaceholder('graffiti-sample.jpg', 'Graffiti Issue', '#f8c471', '🏛️');
createPlaceholder('water-sample.jpg', 'Stagnant Water', '#7fb3d3', '🏥');
createPlaceholder('vendor-sample.jpg', 'Vendor Obstruction', '#f1948a', '📢');

console.log('\n✅ All placeholder images created successfully!');
console.log('These HTML files will serve as demo images for the civic issues.');
