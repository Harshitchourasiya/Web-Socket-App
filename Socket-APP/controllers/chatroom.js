"use strict";
const makeValidation = require("@withvoid/make-validation");

// Utilss
const chatroomHelper = require("../utils/chatroom.helper");

/**
 * Initiates a chat room using a user Id.
 * 
 * @returns 
 */
const initiate = async function (req, res) {
  try {
    // Validate the req.body with respective Model schema.
    const validation = makeValidation(types => ({
      payload: req.body,
      checks: {
        userIds: {
          type: types.array,
          options: {
            unique: true,
            empty: false,
            stringOnly: true
          }
        },
        type: {
          type: types.enum,
          options: {
            enum: { // Types of chat room created
              CONSUMER_TO_CONSUMER: "consumer-to-consumer",
              CONSUMER_TO_SUPPORT: "consumer-to-support",
            }
          }
        },
      }
    }));

    if (!validation.success) return res.status(400).json({ ...validation });

    const { userIds, type } = req.body; // chat initiator userId and type of the chatroom initiated
    const chatInitiator = await chatroomHelper.getUserByEmail(req.email); // Retrive chat intiator userId from db
    const allUserIds = [...userIds, chatInitiator];
    const chatRoom = await chatroomHelper.initiateChat(allUserIds, type, chatInitiator);

    return res.status(200).json({ status: true, chatRoom });
  } catch (error) {
    return res.status(500).json({ status: false, error: error })
  }
}

/**
 * Send a message in a chat room.
 * 
 * @returns 
 */
const postMessage = async function (req, res) {
  try {
    const { roomId } = req.params;
    const validation = makeValidation(types => ({
      payload: req.body,
      checks: {
        messageText: { type: types.string },
      }
    }));
    if (!validation.success) return res.status(400).json({ ...validation });

    const messagePayload = { messageText: req.body.messageText };
    const currentLoggedUser = await chatroomHelper.getUserByEmail(req.email); // Retrive chat intiator userId from db
    const post = await chatroomHelper.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);

    // Emits the message to the sockets, One can get the message at front end by just subscribing the sockets.
    global.io.sockets.in(roomId).emit('new message', { message: post }); 
    return res.status(200).json({ status: true, post:post });
  } catch (error) {
    return res.status(500).json({ status: false, error: error })
  }
}

/**
 * Retrives the recent conversation from db using the room ids for the current logging user.
 * 
 * @returns 
 */
const getRecentConversation = async function (req, res) {
  try {
    const currentLoggedUser = await chatroomHelper.getUserByEmail(req.email); // Retrive chat intiator userId from db
    const options = {
      page: parseInt(req.query.page) || 0,
      limit: parseInt(req.query.limit) || 10,
    };
    const rooms = await chatroomHelper.getChatRoomsByUserId(currentLoggedUser);
    const roomIds = rooms.map(room => room._id);
    const recentConversation = await chatroomHelper.getRecentConversation(
      roomIds, options, currentLoggedUser
    );
    return res.status(200).json({ status: true, conversation: recentConversation });
  } catch (error) {
    return res.status(500).json({ status: false, error: error })
  }
}

/**
 * Retrives conversations for a particular room for the logined user.
 * 
 * @returns 
 */
const getConversationByRoomId = async function (req, res) {
  try {
    const { roomId } = req.params;
    const room = await chatroomHelper.getChatRoomByRoomId(roomId)
    if (!room) {
      return res.status(400).json({
        status: false,
        message: 'No room exists for this id',
      })
    }
    const users = await chatroomHelper.getUserByIds(room.userIds);
    const options = {
      page: parseInt(req.query.page) || 0,
      limit: parseInt(req.query.limit) || 10,
    };
    const conversation = await chatroomHelper.getConversationByRoomIdInternal(roomId, options);
    return res.status(200).json({
      status: true,
      conversation,
      users,
    });
  } catch (error) {
    return res.status(500).json({ status: false, error });
  }
}

/**
 * Marks all conversations of the room as read.
 * @returns 
 */
const markConversationReadByRoomId = async function (req, res) {
  try {
    const { roomId } = req.params;
    const room = await chatroomHelper.getChatRoomByRoomId(roomId)
    if (!room) {
      return res.status(400).json({
        success: false,
        message: 'No room exists for this id',
      })
    }

    const currentLoggedUser = await chatroomHelper.getUserByEmail(req.email);
    const result = await chatroomHelper.markMessageRead(roomId, currentLoggedUser);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
}

module.exports = {
  initiate,
  postMessage,
  getRecentConversation,
  getConversationByRoomId,
  markConversationReadByRoomId
}