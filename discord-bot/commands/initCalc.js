const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    isReleased: true,
	data: new SlashCommandBuilder()
		.setName('initcalc')
		.setDescription('Initialize Calculation of scores, or recalculate all scores'),
	async execute(interaction) {
        // Find all users who have memer roles
        var memerRole;
        interaction.guild.roles.fetch()
            .then(roles => {
                console.log(roles);
                for(role in roles) {
                    console.log(role);
                    // Determine if we have the role
                    if(role.name === 'Memer') {
                        memerRole = role;
                    }
                }
            });

        // Create the role if it doesn't exist
        if(!memerRole) {
            memerRole = interaction.guild.roles.create({
                name: 'Memer',
                color: 'BLUE',
                reason: 'Declares you a memer! You have posted at least one image that received points!'
            });
            await interaction.reply('Created the "Memer" role!');
        }

        // We need to fetch all messages with images
        // Then for each, write a value in an object 
        // With a user id key, score value
        // Then we need to loop through all messages, 
        // counting up the gold, silver, and bromz reacts
        // and then apply our special roles
        
		await interaction.reply('Did a thing!!');
	},
};