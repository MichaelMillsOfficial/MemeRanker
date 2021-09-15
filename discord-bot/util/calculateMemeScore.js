const VOTE_CONFIG = require('../voteConfig.json');

module.exports = {
    async calcMemeScore(message, score, poster) {
        // Fetch reactions for this message
        var reactions = message.reactions;

        reactions.forEach(reaction => {
            score += await addScore(reaction, score, poster);
        });

        return score;
    },
    async addScore(reaction, score, poster) {
        // Fetch message if it isn't cached
        // TODO could remove this - see if the fetchall call returns noncached, nonfetched messages
        const message = !reaction.message.author
            ? await reaction.message.fetch()
            : reaction.message;
        
        if(message.author.id === poster.id) {
            // NO FARMING
            console.log("No farming fool!");
            return score;
        }

        if(VOTE_CONFIG.emojiNames.includes(reaction.emoji.name)) {
            // Ladies and gentlemen, we got em
            VOTE_CONFIG.emojiConfigs.forEach(config => {
                if(config.name === reaction.emoji.name) {
                    score += config.points;
                }
            })
        }

        return score;
    }
}