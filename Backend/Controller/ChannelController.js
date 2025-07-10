import Channel from "../Model/ChannelSechema.js";
import User from "../Model/UserSchema.js";
import Video from "../Model/VideoSchema.js";

export async function createChannel(req, res) {
    try {
        const userId = req.body.userId || req.user?.userId; 
        const { channelName, handle } = req.body;

        if (!channelName || !handle || !userId) {
            return res.status(400).json({ message: "Channel name, handle, and userId are required." });
        }

        const channelCount = await Channel.countDocuments();
        const channelId = `channel-${channelCount + 1}`;

        const newChannel = new Channel({
            channelId,
            channelName,
            handle,
            owner: userId,
            subscribers: 0,
            description: ""
        });

        await newChannel.save();

        const updatedUser = await User.findOneAndUpdate(
            { userId },
            { $addToSet: { channels: channelId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(201).json({
            message: "Channel created and added to user successfully",
            channel: newChannel,
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating channel", error: error.message });
    }
}


export async function updateChannel(req, res) {
    try {
        const owner = req.body.userId || req.user?.userId;
        const { bannerImage, profileImage, name, handle, description } = req.body;

        if (!owner) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const existingChannel = await Channel.findOne({ owner });
        const existingUser = await User.findOne({ userId: owner });

        if (!existingChannel || !existingUser) {
            return res.status(404).json({ message: "Channel not found" });
        }

        existingChannel.channelBanner = bannerImage;
        existingChannel.channelName = name;
        existingChannel.handle = handle;
        existingChannel.description = description;
        existingChannel.profileImage = profileImage;
        await existingChannel.save();

        existingUser.username = name;
        existingUser.avatar = profileImage;
        await existingUser.save();

        res.status(200).json({ message: "Channel updated", channel: existingChannel });
    } catch (error) {
        res.status(500).json({ message: "Failed to update channel", error: error.message });
    }
}


export async function getChannelById(req, res) {
    try {
        const { channelId } = req.params;

        const channel = await Channel.findOne({ channelId });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const videos = await Video.find({ channelId });
        res.status(200).json({ channel, videos });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve channel", error: error.message });
    }
}


export async function getChannel(req, res) {
    try {
        const owner = req.user?.userId;
        if (!owner) {
            return res.status(400).json({ message: "User ID is required from token" });
        }

        const channel = await Channel.findOne({ owner });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        res.status(200).json({ channel });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve channel", error: error.message });
    }
}


export async function subscribeToChannel(req, res) {
    try {
        const userId = req.user?.userId;
        const { channelId } = req.params;
        if (!userId || !channelId) {
            return res.status(400).json({ message: "User ID and Channel ID are required." });
        }

        const channel = await Channel.findOne({ channelId });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found." });
        }

        if (channel.owner === userId) {
            return res.status(400).json({ message: "You cannot subscribe to your own channel." });
        }

        const isSubscribed = channel.subscribers.includes(userId);
        if (isSubscribed) {
            // Unsubscribe
            channel.subscribers.pull(userId);
        } else {
            // Subscribe
            channel.subscribers.push(userId);
        }

        await channel.save();
        res.status(200).json({
            message: isSubscribed ? "Unsubscribed" : "Subscribed",
            isSubscribed: !isSubscribed,
            subscriberCount: channel.subscribers.length
        });
    } catch (error) {
        res.status(500).json({ message: "Subscription failed", error: error.message });
    }
}
