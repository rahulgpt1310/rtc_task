import crypto from "crypto";
const secret = `${process.env.SECRET}`;
const rounds = 9921;
const keySize = 32;
const algorithm = "aes-256-cbc";
const salt = crypto.createHash("sha1").update(secret).digest("hex");

export const encryptData = async (data) => {
  try {
    let iv = crypto.randomBytes(16);
    let key = crypto.pbkdf2Sync(secret, salt, rounds, keySize, "sha512");
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encryptedData = Buffer.concat([
      cipher.update(JSON.stringify(data)),
      cipher.final(),
    ]);
    return iv.toString("base64") + ":" + encryptedData.toString("base64");
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const encryptMiddleware = async (req, res, next) => {
  try {
    let data = res.body;
    let iv = crypto.randomBytes(16);
    let key = crypto.pbkdf2Sync(secret, salt, rounds, keySize, "sha512");
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encryptedData = Buffer.concat([
      cipher.update(JSON.stringify(data)),
      cipher.final(),
    ]);
    iv.toString("base64") + ":" + encryptedData.toString("base64");
  } catch (err) {
    console.error(err);
    return false;
  }
};
