const VOTE_CONFIG = require('../voteConfig.json');

const IS_TEST = true;

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction_orig, user) {
        console.log("Detected message reaction: " + reaction_orig)

        // fetch our message if it isn't cached
        const message = !reaction_orig.message.author
            ? await reaction_orig.message.fetch()
            : reaction_orig.message;
        
        //console.log(message);
        
        if(message.author.id === user.id) {
            // our reaction is coming from the same user that posted the message, no farming!
            console.log("No farming!");
            return;
        }

        if(!IS_TEST && message.attachments.size === 0) {
            // We only want to count reactions to memes, images only!
            console.log("Content was not an image!")
            return;
        }

        if(VOTE_CONFIG.emojiNames.includes(reaction_orig.emoji.name)) {
            // The reaction is one of our configured emojis!
            VOTE_CONFIG.emojiConfigs.forEach(config => {
                if(config.name === reaction_orig.emoji.name) {
                    console.log(`Reacted using ${reaction_orig.emoji.name}! Award this person ${config.points} points!`);
                }
            });
        }
    }
}