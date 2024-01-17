import crypto from "crypto";
const secret = `${process.env.SECRET}`;
const rounds = 9921;
const keySize = 32;
const algorithm = "aes-256-cbc";
const salt = crypto.createHash("sha1").update(secret).digest("hex");

export const decryptData = async (encData) => {
  try {
    let textParts = encData.split(":");
    let iv = Buffer.from(textParts.shift(), "base64");
    let encryptedData = Buffer.from(textParts.join(":"), "base64");
    let key = crypto.pbkdf2Sync(secret, salt, rounds, keySize, "sha512");
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedData = decipher.update(encryptedData);
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);
    return JSON.parse(decryptedData.toString());
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const decryptMiddleware = async (req, res, next) => {
  try {
    let encData = res.body.data;
    let textParts = encData.split(":");
    let iv = Buffer.from(textParts.shift(), "base64");
    let encryptedData = Buffer.from(textParts.join(":"), "base64");
    let key = crypto.pbkdf2Sync(secret, salt, rounds, keySize, "sha512");
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedData = decipher.update(encryptedData);
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);
    req.body = JSON.parse(decryptedData.toString());
    next();
  } catch (err) {
    console.error(err);
    res.json({ error: "Invalid Response" });
    return false;
  }
};
