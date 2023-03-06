const { Schema, model } = require('mongoose');
const { format_date } = require('../utils/helpers');

const reactionSchema = new Schema(
    {
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => format_date(timestamp)
        },
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
)

const thoughtSchema = new Schema(
    {

        thoughtText: {
            type: String,
            required: true,
            maxlength: 280,
            minlength: 1,
        },
        username: {
            type: String,
            required: true,
        },

        reactions: [
            reactionSchema
        ],

        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => format_date(timestamp)
        },
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;