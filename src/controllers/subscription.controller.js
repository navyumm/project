import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    // TODO: toggle subscription
    if (!channelId) throw new ApiError(400, "No such channel");
    const user = req.user;
    const already = await Subscription.findOne({
        subscriber: user._id,
        channel: channelId,
    });
    if (already) {
        const del = await Subscription.deleteOne({
            subscriber: user._id,
            channel: channelId,
        });
        return res
            .status(200)
            .json(new ApiResponse(200, { del }, "Unsubscribed successfully"));
    }
    const subs = await Subscription.create({
        subscriber: user._id,
        channel: channelId,
    });
    return res
        .status(200)
        .json(new ApiResponse(200, { subs }, "Subscribed successfully"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    console.log(req.params);
    if (!subscriberId) throw new ApiError(400, "No such channel");
    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(subscriberId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscribers",
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                usernames: { $push: "$subscribers.username" },
            },
        },
        {
            $project: {
                total: 1,
                usernames: 1,
            },
        },
    ]);
    return res
        .status(200)
        .json(
            new ApiResponse(200, { subscribers }, "Subscribers fetched successfully")
        );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    console.log(req.params);
    if (!channelId) throw new ApiError(400, "No such channel");
    const subscribers = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(channelId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribers",
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                usernames: { $push: "$subscribers.username" },
            },
        },
        {
            $project: {
                total: 1,
                usernames: 1,
            },
        },
    ]);
    return res
        .status(200)
        .json(
            new ApiResponse(200, { subscribers }, "Subscribers fetched successfully")
        );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };