const { SlashCommandBuilder } = require('@discordjs/builders');
const fetchAll = require('discord-fetch-all');
const calculateMemeScore = require('../util/calculateMemeScore.js');
const userUtil = require('../util/userUtil.js');

var shitposters = {};

async function doCalcScoreByChannel(channel) {
    var allMessages = await fetchAll.messages(channel, {
        userOnly: true
    });

    if(!allMessages) {
        return;
    }
    
    allMessages.filter(msg => msg.attachments.size > 0)
    .foreach(msg => {
        // Get the user that posted the message
        var shitposter = msg.author;
        if(!shitposters[shitposter.id]) {
            shitposters[shitposter.id] = {
                shitposter: shitposter,
                score: 0
            };
        }

        // Fetch the current score for this shitposter
        var score = shitposters[shitposter.id].score;

        calculateMemeScore.calcMemeScore(message, score, shitposter).then(
            scoreCalc => {
                score += scoreCalc;
                shitposters[shitposter.id].score = score;
            }
        );
    });
}

module.exports = {
    isReleased: true,
	data: new SlashCommandBuilder()
		.setName('initcalc')
		.setDescription('Initialize Calculation of scores, or recalculate all scores'),
	async execute(interaction) {
        // Find all users who have memer roles
        var memerRole;
        var allRoles = await interaction.guild.roles.fetch();

        allRoles.forEach((value) => {
            if(value.name === 'Memer') {
                memerRole = value;
            }
        });

        // Create the role if it doesn't exist
        if(!memerRole) {
            memerRole = interaction.guild.roles.create({
                name: 'Memer',
                color: 'BLUE',
                reason: 'Declares you a memer! You have posted at least one image that received points!'
            });
            // await interaction.reply('Created the "Memer" role!');
        }

        // We need to fetch all messages with images
        // Then for each, write a value in an object 
        // With a user id key, score value
        // Then we need to loop through all messages, 
        // counting up the gold, silver, and bromz reacts
        // and then apply our special roles

        // Fetch all messages in a memes channel
        const allChannels = await interaction.guild.channels.fetch();
        var memesChannel, nsfwMemesChannel;

        allChannels.forEach((value) => {
            console.log(value);
            if(value.name.toLowerCase() === 'memes') {
                memesChannel = value;
            } else if(value.name.toLowerCase() === 'nsfw-memes') {
                nsfwMemesChannel = value;
            }
        });

        console.log(memesChannel);

        if(memesChannel) {
            await doCalcScoreByChannel(memesChannel);
        }
        
        if(nsfwMemesChannel) {
            await doCalcScoreByChannel(nsfwMemesChannel);
        }

        // Now that we have our scores calculated, we'll check if our roles are set and update 
        // our shitposter's roles and nicknames
        for(shitposterid in shitposters.keys()) {
            var shitposter = shitposters[shitposterid];
            console.log(shitposter);
            await userUtil.updateNicknameWithScore(shitposter.shitposter, shitposter.score);
            await userUtil.updateUserRolesByScore(shitposter.shitposter, shitposter.score);
        }
        
		await interaction.reply('Did a thing!!');
	},
};