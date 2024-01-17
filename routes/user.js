import express from "express";
import { decryptData } from "../middleware/decrypt.js";
import { encryptData } from "../middleware/encrypt.js";
import {
  register,
  login,
  validUser,
  logout,
  // searchUsers,
  // updateInfo,
  // getUserById,
} from "../controllers/user.js";
import { Auth } from "../middleware/user.js";
const router = express.Router();
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/valid", Auth, validUser);
router.get("/auth/logout", Auth, logout);
// router.get("/api/user?", Auth, searchUsers);
// router.get("/api/users/:id", Auth, getUserById);
// router.patch("/api/users/update/:id", Auth, updateInfo);
router.post("/enc_dec_data", async (req, res) => {
  let { data, encrypt } = req.body;
  let inputData;
  if (!!encrypt) {
    inputData = await encryptData(data);
  } else {
    inputData = await decryptData(data);
  }
  res.send({ data: inputData });
});
export default router;
