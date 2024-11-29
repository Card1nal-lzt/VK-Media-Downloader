VK Media Downloader 🎥📥
A Node.js script to download media attachments (photos and GIFs) from posts of a specified VK group.

✨ Features - 📄 Fetches wall posts from a VK group using the VK API. - 🖼️ Downloads high-resolution photos and GIFs from posts. - 🗂️ Automatically organizes downloaded files into a specified directory.

🚀 Setup

Clone the repository: 🛠️ - git clone https://github.com/yourusername/vk-media-downloader.git - cd vk-media-downloader

Install dependencies: 📦 - npm install

Set up your configuration: ⚙️ - 🔑 Obtain a VK API token here. - ✏️ Update the following variables in the script:

      const ACCESS_TOKEN = 'your_vk_api_token';
      const GROUP_ID = -12345678; // Replace with your group ID
      const SAVE_DIR = './vk_media'; // Folder to save files

Run the script: ▶️ - node index.js

Requirements 📋 - ✅ Node.js (>=14.x) - ✅ axios and fs modules.

How It Works 📖 - 🌐 Fetches posts from the group's wall via VK API. - 🔍 Filters and processes posts with attachments (photos and GIFs). - 💾 Downloads and saves media files to the specified directory.

Notes ⚠️ - 🔐 Ensure you have permission to access the group's data and download its content. - 🎯 Only media attachments owned by the group (matching the group ID) are downloaded.

License 📜 - This project is licensed under the MIT License.
