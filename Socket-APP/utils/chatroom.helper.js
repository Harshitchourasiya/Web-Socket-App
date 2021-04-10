"use scripts";
// Models
const chatRoomModel = require("../models/Chatroom");
const chatMessagesModel = require("../models/ChatMessages");
const userModel = require("../models/User");

const getUserByEmail = async function (userEmail) {
    try {
        const userId = await userModel.findOne({ email: userEmail })
        return userId._id;
    } catch (error) {
        console.log('Error while retrive a user from email', error);
        throw error
    }
}

const initiateChat = async function (userIds, type, chatInitiator) {
    try {
        const availableRoom = await chatRoomModel.findOne({
            userIds: {
                $size: userIds.length,
                $all: [...userIds],
            },
            type,
        });
        if (availableRoom) {
            return {
                isNew: false,
                message: 'Retrieving an old chat room',
                chatRoomId: availableRoom._doc._id,
                type: availableRoom._doc.type,
            };
        }

        const newRoom = await chatRoomModel.create({ userIds, type, chatInitiator });
        return {
            isNew: true,
            message: 'Creating a new chatroom',
            chatRoomId: newRoom._doc._id,
            type: newRoom._doc.type,
        };
    } catch (error) {
        console.log('Error on Initiating a chat room', error);
        throw error
    }
}

const createPostInChatRoom = async function (chatRoomId, message, postedByUser) {
    try {
        const post = await chatMessagesModel.create({
            chatRoomId,
            message,
            postedByUser,
            readByRecipients: { readByUserId: postedByUser }
        });
        // Aggregate is like join in mysql.
        const aggregate = await chatMessagesModel.aggregate([
            // get post where _id = post._id
            { $match: { _id: post._id } },
            // $lookup do a join on another table called users, and get me a user whose _id = postedByUser
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedByUser',
                    foreignField: '_id',
                    as: 'postedByUser',
                }
            },
            // Unwind the postedByUser array to object in the response.
            { $unwind: '$postedByUser' },
            // do a join on another table called chatrooms, and get me a chatroom whose _id = chatRoomId
            {
                $lookup: {
                    from: 'chatrooms',
                    localField: 'chatRoomId',
                    foreignField: '_id',
                    as: 'chatRoomInfo',
                }
            },
            { $unwind: '$chatRoomInfo' },
            { $unwind: '$chatRoomInfo.userIds' },
            // do a join on another table called users, and get me a user whose _id = userIds
            {
                $lookup: {
                    from: 'users',
                    localField: 'chatRoomInfo.userIds',
                    foreignField: '_id',
                    as: 'chatRoomInfo.userProfile',
                }
            },
            { $unwind: '$chatRoomInfo.userProfile' },
            // group all the data we aggregated above into the single object.
            {
                $group: {
                    _id: '$chatRoomInfo._id',
                    postId: { $last: '$_id' },
                    chatRoomId: { $last: '$chatRoomInfo._id' },
                    message: { $last: '$message' },
                    type: { $last: '$type' },
                    postedByUser: { $last: '$postedByUser' },
                    readByRecipients: { $last: '$readByRecipients' },
                    chatRoomInfo: { $addToSet: '$chatRoomInfo.userProfile' },
                    createdAt: { $last: '$createdAt' },
                    updatedAt: { $last: '$updatedAt' },
                }
            }
        ]);
        return aggregate[0];
    } catch (error) {
        console.log('Error on create a post in a chat room', error);
        throw error;
    }
}

const getChatRoomByRoomId = async function (roomId) {
    try {
        const room = await chatRoomModel.findOne({ _id: roomId });
        return room;
    } catch (error) {
        throw error;
    }
}

const markMessageRead = async function (chatRoomId, currentUserOnlineId) {
    try {
        return chatMessagesModel.updateMany(
            {
                chatRoomId,
                'readByRecipients.readByUserId': { $ne: currentUserOnlineId }
            },
            {
                $addToSet: {
                    readByRecipients: { readByUserId: currentUserOnlineId }
                }
            },
            {
                multi: true
            }
        );
    } catch (error) {
        throw error;
    }
}

const getRecentConversationInternal = async function (chatRoomIds, options, currentUserOnlineId) {
    try {
        return this.aggregate([
            { $match: { chatRoomId: { $in: chatRoomIds } } },
            {
                $group: {
                    _id: '$chatRoomId',
                    messageId: { $last: '$_id' },
                    chatRoomId: { $last: '$chatRoomId' },
                    message: { $last: '$message' },
                    type: { $last: '$type' },
                    postedByUser: { $last: '$postedByUser' },
                    createdAt: { $last: '$createdAt' },
                    readByRecipients: { $last: '$readByRecipients' },
                }
            },
            { $sort: { createdAt: -1 } },
            // do a join on another table called users, and 
            // get me a user whose _id = postedByUser
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedByUser',
                    foreignField: '_id',
                    as: 'postedByUser',
                }
            },
            { $unwind: "$postedByUser" },
            // do a join on another table called chatrooms, and 
            // get me room details
            {
                $lookup: {
                    from: 'chatrooms',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'roomInfo',
                }
            },
            { $unwind: "$roomInfo" },
            { $unwind: "$roomInfo.userIds" },
            // do a join on another table called users 
            {
                $lookup: {
                    from: 'users',
                    localField: 'roomInfo.userIds',
                    foreignField: '_id',
                    as: 'roomInfo.userProfile',
                }
            },
            { $unwind: "$readByRecipients" },
            // do a join on another table called users 
            {
                $lookup: {
                    from: 'users',
                    localField: 'readByRecipients.readByUserId',
                    foreignField: '_id',
                    as: 'readByRecipients.readByUser',
                }
            },

            {
                $group: {
                    _id: '$roomInfo._id',
                    messageId: { $last: '$messageId' },
                    chatRoomId: { $last: '$chatRoomId' },
                    message: { $last: '$message' },
                    type: { $last: '$type' },
                    postedByUser: { $last: '$postedByUser' },
                    readByRecipients: { $addToSet: '$readByRecipients' },
                    roomInfo: { $addToSet: '$roomInfo.userProfile' },
                    createdAt: { $last: '$createdAt' },
                },
            },
            // apply pagination
            { $skip: options.page * options.limit },
            { $limit: options.limit },
        ]);
    } catch (error) {
        throw error;
    }
}
const getConversationByRoomIdInternal = async function (chatRoomId, options = {}) {
    try {
        return chatMessagesModel.aggregate([
            { $match: { chatRoomId } },
            { $sort: { createdAt: -1 } },
            // do a join on another table called users, and get me a user whose _id = postedByUser
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedByUser',
                    foreignField: '_id',
                    as: 'postedByUser',
                }
            },
            { $unwind: "$postedByUser" },
            // apply pagination
            { $skip: options.page * options.limit },
            { $limit: options.limit },
            { $sort: { createdAt: 1 } },
        ]);
    } catch (error) {
        throw error;
    }
}

const getChatRoomsByUserId = async function () {
    try {
        const rooms = await chatRoomModel.find({ userIds: { $all: [userId] } });
        return rooms;
      } catch (error) {
        throw error;
      }
}

const getUserByIds = async function (ids) {
    try {
        const users = await userModel.find({ _id: { $in: ids } });
        return users;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUserByEmail,
    initiateChat,
    createPostInChatRoom,
    getChatRoomByRoomId,
    markMessageRead,
    getConversationByRoomIdInternal,
    getRecentConversationInternal,
    getUserByIds,
    getChatRoomsByUserId
}