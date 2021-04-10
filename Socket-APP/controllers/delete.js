const chatRoomModel = require("../models/Chatroom");
const chatMessagesModel = require("../models/ChatMessages");

const deleteRoomById = async function(req,res){
  try {
    const { roomId } = req.params;
    const room = await chatRoomModel.remove({ _id: roomId });
    const messages = await chatMessagesModel.remove({ chatRoomId: roomId })
    return res.status(200).json({ 
      success: true, 
      message: "Operation performed succesfully",
      deletedRoomsCount: room.deletedCount,
      deletedMessagesCount: messages.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}
const deleteMessageById = async function(req,res){
  try {
    const { messageId } = req.params;
    const message = await chatMessagesModel.remove({ _id: messageId });
    return res.status(200).json({ 
      success: true, 
      deletedMessagesCount: message.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}

module.exports = {
  deleteRoomById,
  deleteMessageById
}