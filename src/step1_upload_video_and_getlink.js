const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

const jsonFilePath = 'H:/.1project/UploadToCloudinaryService/data.json';
const videoFolderPath = 'H:/.1project/UploadToCloudinaryService/trending';

const videoData = [];

fs.readdir(videoFolderPath, (err, files) => {
   if (err) {
      console.error('Lỗi đọc thư mục:', err);
      return;
   }

   // Lặp qua tất cả các tệp video
   files.forEach((file) => {
      const videoPath = path.join(videoFolderPath, file);

      // Tải lên video lên Cloudinary
      cloudinary.uploader.upload(
         videoPath,
         { resource_type: 'video' },
         (error, result) => {
            if (error) {
               console.error(`Lỗi tải lên video "${videoPath}":`, error);
               return;
            }

            const filename = path.basename(videoPath);

            const videoUrl = result.secure_url;
            videoData.push({ filename, videoUrl });
            fs.writeFile(
               jsonFilePath,
               JSON.stringify(videoData, null, 2),
               (error) => {
                  if (error) {
                     console.error('Lỗi ghi tệp JSON:', error);
                     return;
                  }
                  console.log(
                     `Đã lưu thông tin video vào tệp JSON: ${jsonFilePath}`
                  );
               }
            );
         }
      );
   });
});
