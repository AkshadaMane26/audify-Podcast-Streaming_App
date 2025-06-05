/*import { createError } from "../error.js";
import User from "../models/User.js";


export const update = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(403, "You can update only your account!"));
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: "podcasts",
            populate: {
                path: "creator",
                select: "name img",
            }
        }
        ).populate(
            {
                path: "favorits",
                populate: {
                    path: "creator",
                    select: "name img",
                }
            }
        );
        res.status(200).json(user);
    } catch (err) {
        console.log(req.user)
        next(err);
    }
}*/

import { createError } from "../error.js";
import User from "../models/User.js";

// Update user details
export const update = async (req, res, next) => {
    if (req.params.id !== req.user.id) {
        return next(createError(403, "You can update only your account!"));
    }

    try {
        // Optional: Prevent sensitive fields like password/email update here
        // if ('password' in req.body || 'email' in req.body) return next(createError(403, "Sensitive fields can't be updated this way."));

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return next(createError(404, "User not found"));

        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
};

// Get full user profile including podcasts & favorites
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: "podcasts",
                populate: {
                    path: "creator",
                    select: "name img",
                },
            })
            .populate({
                path: "favorits",
                populate: {
                    path: "creator",
                    select: "name img",
                },
            });

        if (!user) return next(createError(404, "User not found"));

        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};
