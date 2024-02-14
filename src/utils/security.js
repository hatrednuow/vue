import crypto from "crypto";

const key = "1234567890123456";
const iv = "6543210987654321";

/**
 * AEC CBC encryptstring.
 * @param {String} str The first number.
 * @return {String} The sum of the two numbers.
 */
const encryptstring = function (str) {
  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(str, "utf-8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

/**
 * AEC CBC decryptstring.
 * @param {String} str The first number.
 * @return {String} The sum of the two numbers.
 */
const decryptstring = function (str) {
  const cipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(str, "base64");
  encrypted += cipher.final();
  return encrypted;
};

const authUtil = {
  encryptstring,
  decryptstring,
};

export default authUtil;
