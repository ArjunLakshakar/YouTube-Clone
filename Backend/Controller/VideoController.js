import Channel from "../Model/ChannelSechema.js";
import User from "../Model/UserSchema.js";
import Video from "../Model/VideoSchema.js";

export async function addChannelVideo(req, res) {
    try {
        const owner = req.user?.userId;
        const { title, description, category, isForKids } = req.body;

        const videoFile = req.files?.video?.[0];     
        const thumbnail = req.files?.thumbnail?.[0]; 

        if (!owner || !videoFile || !thumbnail || !title || !category) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const channel = await Channel.findOne({ owner });
        if (!channel) return res.status(404).json({ message: "Channel not found" });

        const videoUrl = `/uploads/${videoFile.filename}`;
        const thumbnailUrl = `/uploads/${thumbnail.filename}`;

        const newVideo = new Video({
            videoId: `video${Date.now()}`,
            videoFile: videoUrl,      
            thumbnail: thumbnailUrl,
            title,
            description,
            category,
            isForKids,
            channelId: channel.channelId,
            uploader: owner,
            views: 0,
            likes: [],
            dislikes: [],
            uploadDate: new Date(),
            comments: [],
        });

        await newVideo.save();
        channel.videos.push(newVideo.videoId);
        await channel.save();
        res.status(200).json({ message: "Video added successfully", video: newVideo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding video" });
    }
}


// Get all videos of a channel
export async function getChannelVideos(req, res) {
    try {
        const owner = req.user?.userId;
        if (!owner) return res.status(400).json({ message: "User ID is required." });

        const channel = await Channel.findOne({ owner });
        if (!channel) return res.status(404).json({ message: "Channel not found." });

        const videos = await Video.find({ channelId: channel.channelId });

        res.status(200).json({
            message: "Videos fetched successfully.",
            channelName: channel.channelName,
            profileImage: channel.profileImage,
            videos
        });
    } catch (error) {
        console.error("Error fetching channel videos:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

// Get all videos
export async function getAllVideos(req, res) {
    try {
        const { category } = req.query;

        const filter = category && category !== 'All' ? { category: category.toLowerCase() } : {};
        const videos = await Video.find(filter).sort({ uploadDate: -1 }).populate('channelId');

        const enrichedVideos = await Promise.all(
            videos.map(async (video) => {
                const channel = await Channel.findOne({ channelId: video.channelId });
                return {
                    ...video.toObject(),
                    channel: {
                        channelName: channel?.channelName || "Unknown",
                        profileImage: channel?.profileImage || "",
                    },
                };
            })
        );

        res.status(200).json({ message: "Videos fetched", videos: enrichedVideos });
    } catch (err) {
        console.error("Fetch error:", err);
        res.status(500).json({ message: "Internal server error." });
    }
}


export async function getVideo(req, res) {
    try {
        const { videoId } = req.params;
        const userId = req.user?.userId; 

        if (!videoId) {
            return res.status(400).json({ message: "Video ID is required." });
        }

        const video = await Video.findOne({ videoId });
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }

        const channel = await Channel.findOne({ channelId: video.channelId });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found." });
        }

        // ✅ Check likes/dislikes
        const hasLiked = video.likes.includes(userId);
        const hasDisliked = video.dislikes.includes(userId);

        // ✅ Check if user is subscribed
        const isSubscribed = channel.subscribers.includes(userId);

        video.views += 1;
        await video.save();

        res.status(200).json({
            message: "Video fetched successfully.",
            video,
            channel: {
                ...channel.toObject(),
                subscriberCount: channel.subscribers.length
            },
            hasLiked,
            hasDisliked,
            isSubscribed,
            userId
        });
    } catch (error) {
        console.error("Error fetching video:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

// Add a comment
export async function addComment(req, res) {
    try {
        const { videoId } = req.params;
        const { comment } = req.body;
        const userId = req.user?.userId;

        if (!videoId || !comment) {
            return res.status(400).json({ message: "Video ID and comment are required." });
        }

        const video = await Video.findOne({ videoId });
        if (!video) return res.status(404).json({ message: "Video not found." });

        const commentId = `comment${Date.now()}`;
        const newComment = {
            commentId,
            userId,
            text: comment,
            date: new Date(),
        };

        video.comments.push(newComment);
        await video.save();

        const user = await User.findOne({ userId });

        const enrichedComment = {
            ...newComment,
            username: user?.username || "Anonymous",
            avatar: user?.avatar || "",
        };

        res.status(200).json({ message: "Comment added successfully.", enrichedComment });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

// Get all comments
export async function getComments(req, res) {
    try {
        const { videoId } = req.params;
        if (!videoId) return res.status(400).json({ message: "Video ID is required." });

        const video = await Video.findOne({ videoId });
        if (!video) return res.status(404).json({ message: "Video not found." });

        const enrichedComments = await Promise.all(
            video.comments.map(async (comment) => {
                const user = await User.findOne({ userId: comment.userId });
                return {
                    ...comment.toObject(),
                    username: user?.username || "Anonymous",
                    avatar: user?.avatar || "",
                };
            })
        );

        res.status(200).json({
            message: "Comments fetched successfully.",
            comments: enrichedComments,
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

// Edit a comment
export async function editComment(req, res) {
    try {
        const { videoId, commentId } = req.params;
        const { text } = req.body;
        const userId = req.user?.userId;

        if (!videoId || !commentId || !text) {
            return res.status(400).json({ message: "Missing fields." });
        }

        const video = await Video.findOne({ videoId });
        if (!video) return res.status(404).json({ message: "Video not found." });

        const comment = video.comments.find(c => c.commentId === commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found." });

        if (comment.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized to edit this comment." });
        }

        comment.text = text;
        await video.save();

        res.status(200).json({ message: "Comment updated successfully.", updatedComment: comment });
    } catch (error) {
        console.error("Error editing comment:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

// Delete a comment
export async function deleteComment(req, res) {
    try {
        const { videoId, commentId } = req.params;
        const userId = req.user?.userId;

        if (!videoId || !commentId) {
            return res.status(400).json({ message: "Missing fields." });
        }

        const video = await Video.findOne({ videoId });
        if (!video) return res.status(404).json({ message: "Video not found." });

        const comment = video.comments.find(c => c.commentId === commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found." });

        if (comment.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this comment." });
        }

        video.comments = video.comments.filter(c => c.commentId !== commentId);
        await video.save();

        res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

// Like video
export async function likeVideo(req, res) {
    try {
        const { videoId } = req.params;
        const userId = req.user.userId;

        const video = await Video.findOne({ videoId });
        if (!video) return res.status(404).json({ message: 'Video not found' });

        // Remove from dislikes if liked
        video.dislikes = video.dislikes.filter(id => id !== userId);

        if (video.likes.includes(userId)) {
            video.likes = video.likes.filter(id => id !== userId);
        } else {
            video.likes.push(userId);
        }

        await video.save();
        res.status(200).json({
            message: 'Like updated',
            likes: video.likes.length,
            dislikes: video.dislikes.length,
            hasLiked: video.likes.includes(userId),
            hasDisliked: video.dislikes.includes(userId),
        });
    } catch (err) {
        res.status(500).json({ message: 'Error liking video', error: err.message });
    }
}

// Dislike video
export async function dislikeVideo(req, res) {
    try {
        const { videoId } = req.params;
        const userId = req.user.userId;

        const video = await Video.findOne({ videoId });
        if (!video) return res.status(404).json({ message: 'Video not found' });

        video.likes = video.likes.filter(id => id !== userId);

        if (video.dislikes.includes(userId)) {
            video.dislikes = video.dislikes.filter(id => id !== userId);
        } else {
            video.dislikes.push(userId);
        }

        await video.save();
        res.status(200).json({
            message: 'Dislike updated',
            likes: video.likes.length,
            dislikes: video.dislikes.length,
            hasLiked: video.likes.includes(userId),
            hasDisliked: video.dislikes.includes(userId),
        });
    } catch (err) {
        res.status(500).json({ message: 'Error disliking video', error: err.message });
    }
}

// Sreach videos
export const searchVideosByTitle = async (req, res) => {
    const { query } = req.query;

    try {
        const videos = await Video.find({
            title: { $regex: query, $options: 'i' }
        });

        const channelIds = videos.map(v => v.channelId);
        const channels = await Channel.find({ channelId: { $in: channelIds } });

        const formatted = videos.map(video => {
            const channel = channels.find(c => c.channelId.toString() === video.channelId?.toString());
            return {
                ...video._doc,
                channel: {
                    channelName: channel?.channelName || "Unknown",
                    profileImage: channel?.profileImage || ""
                }
            };
        });

        res.status(200).json({ videos: formatted });
    } catch (error) {
        console.error('Error searching videos:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


// Edit video
export const editVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { title, description } = req.body;

        const updated = await Video.findOneAndUpdate(
            { videoId },
            { $set: { title, description } },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'Video not found' });
        res.status(200).json({ message: 'Video updated', video: updated });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete video (with cleanup in channel)
export const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        const deleted = await Video.findOneAndDelete({ videoId });
        if (!deleted) return res.status(404).json({ message: 'Video not found' });

        await Channel.updateOne(
            { channelId: deleted.channelId },
            { $pull: { videos: videoId } }
        );

        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
