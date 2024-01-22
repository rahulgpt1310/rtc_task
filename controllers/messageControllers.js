import Message from "../models/messageModel.js";
import user from "../models/userModel.js";
import Chat from "../models/chatModel.js";
import { decryptData } from "../middleware/decrypt.js";
import { encryptData } from "../middleware/encrypt.js";
export const sendMessage = async (req, res) => {
  try {
    let decryptResult = await decryptData(req.body.data);
    const { chatId, message, image } = decryptResult;

    let msg = await Message.create({
      sender: req.rootUserId,
      message,
      chatId,
      image,
    });
    msg = await (
      await msg.populate("sender", "name profilePic email")
    ).populate({
      path: "chatId",
      select: "chatName isGroup users",
      model: "Chat",
      populate: {
        path: "users",
        select: "name email profilePic",
        model: "User",
      },
    });
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: msg,
    });
    let encryptResult = await encryptData({ msg: "message send" });
    res.status(200).send({ status: 200, data: encryptResult });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    let messages = await Message.find({ chatId })
      .populate({
        path: "sender",
        model: "User",
        select: "name profilePic email",
      })
      .populate({
        path: "chatId",
        model: "Chat",
      });

    res.status(200).json(messages);
  } catch (error) {
    res.sendStatus(500).json({ error: error });
    console.log(error);
  }
};
