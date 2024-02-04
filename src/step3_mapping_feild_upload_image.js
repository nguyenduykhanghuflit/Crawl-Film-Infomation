const fs = require('fs');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});
const jsonFilePath = 'H:/.1project/UploadToCloudinaryService/data.json';
async function uploadImageFromURL(url) {
   try {
      // Tải ảnh từ URL
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const imageData = Buffer.from(response.data, 'binary');

      // Upload ảnh lên Cloudinary và trả về URL
      const uploadResult = await new Promise((resolve, reject) => {
         cloudinary.uploader
            .upload_stream({ resource_type: 'image' }, (error, result) => {
               if (error) {
                  reject(error);
               } else {
                  resolve(result);
               }
            })
            .end(imageData);
      });

      return uploadResult.secure_url; // Trả về URL của ảnh đã upload
   } catch (error) {
      throw error;
   }
}

const g2 = [
   {
      _id: '65926f1fb53779e6e8892f9a',
      name: 'Hành Động',
      idMoviedb: 28,
   },
   {
      _id: '65926f1fb53779e6e8892f9e',
      name: 'Phiêu Lưu',
      idMoviedb: 12,
   },
   {
      _id: '65926f1fb53779e6e8892f9c',
      name: 'Viễn Tưởng',
      idMoviedb: 878,
   },
   {
      _id: '65926f1fb53779e6e8892fa4',
      name: 'Tình Cảm',
      idMoviedb: null,
   },
   {
      _id: '65926f1fb53779e6e8892fa6',
      name: 'Tâm Lý',
      idMoviedb: null,
   },
   {
      _id: '65926f1fb53779e6e8892fa8',
      name: 'Kinh Dị',
      idMoviedb: 27,
   },
   {
      _id: '65926f1fb53779e6e8892faa',
      name: 'Gia Đình',
      idMoviedb: 10751,
   },
   {
      _id: '65926f1fb53779e6e8892fac',
      name: 'Hình Sự',
      idMoviedb: 80,
   },
   {
      _id: '65926f1fb53779e6e8892fae',
      name: 'Bí ẩn',
      idMoviedb: 9648,
   },
   {
      _id: '65926f1fb53779e6e8892fb0',
      name: 'Chính kịch',
      idMoviedb: 18,
   },
   {
      _id: '65926f1fb53779e6e8892fa2',
      name: 'Võ Thuật',
      idMoviedb: null,
   },
   {
      _id: '65926f1fb53779e6e8892fa0',
      name: 'Khoa Học',
      idMoviedb: 878,
   },
   {
      _id: '65bf46a33d094a76e4ed5cc9',
      name: 'Hoạt Hình',
      idMoviedb: 16,
   },
   {
      _id: '65bf46913d094a76e4ed5cc7',
      name: 'Phim Hài',
      idMoviedb: 35,
   },

   {
      _id: '65bf46703d094a76e4ed5cc3',
      name: 'Phim Tài Liệu',
      idMoviedb: 99,
   },

   { _id: '65bf46553d094a76e4ed5cc1', name: 'Phim Giả Tượng', idMoviedb: 14 },
   {
      _id: '65bf45723d094a76e4ed5cad',
      name: 'Phim Lịch Sử',
      idMoviedb: 36,
   },
   { _id: '65bf463e3d094a76e4ed5cbf', name: 'Phim Nhạc', idMoviedb: 10402 },

   {
      _id: '65bf46273d094a76e4ed5cbd',
      name: 'Phim Lãng Mạn',
      idMoviedb: 10749,
   },

   {
      _id: '65bf46133d094a76e4ed5cba',
      name: 'Chương Trình Truyền Hình',
      idMoviedb: 10770,
   },
   {
      _id: '65bf45d63d094a76e4ed5cb2',
      name: 'Phim Gây Cấn',
      idMoviedb: 53,
   },
   {
      _id: '65bf45a03d094a76e4ed5cb0',
      name: 'Phim Chiến Tranh',
      idMoviedb: 10752,
   },
   { _id: '65bf45f33d094a76e4ed5cb6', name: 'Phim Miền Tây', idMoviedb: 37 },
];

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
   if (err) {
      console.error('Error:', err);
      return;
   }

   const jsonData = JSON.parse(data);
   const result = [];
   jsonData.map(async (el) => {
      const { filename, videoUrl, crawl } = el;
      const {
         genre_ids,
         backdrop_path,
         original_language,
         original_title,
         overview,
         popularity,
         poster_path,
         release_date,
         title,
         vote_average,
         vote_count,
      } = crawl;

      const resGenre = [];
      genre_ids.forEach((element) => {
         const f = g2.find((i) => i.idMoviedb == element);
         resGenre.push(f._id);
      });

      const data = {
         title: original_title,
         movieName: title,
         description: overview,
         actors: [], //chưa có
         director: [], //chưa có
         releaseDate: release_date,
         categories: '657f134cda6c093843651e2d',
         genres: resGenre,
         mainGenres: resGenre[0],
         rating: vote_average,
         reviews: vote_count,
         productionYear: release_date.slice(0, 4),
         country: original_language,
         isPublished: true,
         movieUrls: [
            {
               url: videoUrl,
               server: '1',
            },
         ],
         imageUrls: [
            {
               url: await uploadImageFromURL(
                  'https://image.tmdb.org/t/p/w440_and_h660_face' +
                     backdrop_path
               ),
               type: 'backdrop',
            },
            {
               url: await uploadImageFromURL(
                  'https://image.tmdb.org/t/p/w440_and_h660_face' + poster_path
               ),
               type: 'poster',
            },
         ],
      };

      result.push(data);
   });

   setTimeout(() => {
      const writePath = 'H:/.1project/UploadToCloudinaryService/result.json';
      fs.writeFile(writePath, JSON.stringify(result, null, 2), (error) => {});
      console.log('đã ghi xong');
   }, 10000);
});
