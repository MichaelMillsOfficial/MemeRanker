const calcMemeScore = require('../util/calculateMemeScore');
const userUtil = require('../util/userUtil.js');

const IS_TEST = true;

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction_orig, user) {
        console.log("Detected message reaction: " + reaction_orig)

        // fetch our message if it isn't cached
        const message = !reaction_orig.message.author
            ? await reaction_orig.message.fetch()
            : reaction_orig.message;

        if(!IS_TEST && message.attachments.size === 0) {
            // We only want to count reactions to memes, images only!
            console.log("Content was not an image!")
            return;
        }

        // TODO fetch user's current score from nickname - DO THIS IN THE USERUTIL
        // Using a placeholder for now cuz I am le tired
        var currScore = 69;

        var newScore = await calcMemeScore.addScore(reaction_orig, currScore, user);

        if(currScore === newScore) {
            // No points accumulated
            return;
        }

        await userUtil.updateUserRolesByScore(user, newScore);
        await userUtil.updateNicknameWithScore(user, newScore);
    }
}