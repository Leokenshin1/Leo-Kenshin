const mega = require("megajs");

const auth = {
  email: "Enter your mega email", // Provide your Mega credentials here
  password: "Enter your mega password",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
};

// Upload function using Mega.js
const upload = (data, name) => {
  return new Promise((resolve, reject) => {
    const storage = new mega.Storage(auth);

    storage.on("ready", () => {
      console.log("Storage is ready. Proceeding with upload.");

      const uploadStream = storage.upload({ name, allowUploadBuffering: true });

      uploadStream.on("complete", (file) => {
        file.link((err, url) => {
          if (err) {
            reject(err);
          } else {
            storage.close();
            resolve(url);
          }
        });
      });

      uploadStream.on("error", (err) => {
        reject(err);
      });

      data.pipe(uploadStream); // Pipe the data to the upload stream
    });

    storage.on("error", (err) => {
      reject(err);
    });
  });
};

module.exports = { upload };
