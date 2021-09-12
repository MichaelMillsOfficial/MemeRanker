module.exports = {
    name: 'interactionCreate',
    execute(interaction) {
        // TODO we should be able to move our command logic in here, but I'm not sure how to inject the discord client
        // into this file. For now, leaving this as something to try to do later
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
    }
}