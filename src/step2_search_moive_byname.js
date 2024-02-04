const jsonFilePath = 'H:/.1project/UploadToCloudinaryService/data.json';
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
   if (err) {
      console.error('Error:', err);
      return;
   }

   const jsonData = JSON.parse(data);

   crawl(jsonData);
});

async function crawl(jsonData) {
   for (const item of jsonData) {
      const filename = item.filename.replace('.mp4', '');
      const res = await searchMovies(filename);
      if (res?.length > 0) {
         const first = res[0];
         item.crawl = first;
      }
      const data = { ...item };
      fs.appendFile(jsonFilePath, JSON.stringify(data, null, 2), (error) => {
         if (error) {
            console.error('Lỗi ghi tệp JSON:', error);
            return;
         }
         console.log(
            `Đã lưu thông tin video vào cuối tệp JSON: ${jsonFilePath}`
         );
      });
   }
}

async function searchMovies(movieName) {
   const url = 'https://api.themoviedb.org/3/search/movie';
   const query = movieName;
   const includeAdult = false;
   const language = 'vi-VN';
   const page = 1;

   const headers = {
      Authorization: process.env.TOKEN_THEMOVIEDB,
      accept: 'application/json',
   };

   try {
      const response = await axios.get(url, {
         params: {
            query,
            include_adult: includeAdult,
            language,
            page,
         },
         headers,
      });

      const { results } = response.data;
      console.log(results);
      return results;
   } catch (error) {
      console.error('Error:', error.message);
   }
}
