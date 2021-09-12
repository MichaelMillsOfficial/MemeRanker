const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const testCommands = [];
const prodCommands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	testCommands.push(command.data.toJSON());
	if(command.isReleased) {
		prodCommands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: testCommands },
		);

		console.log('Successfully registered application commands to test server.');
	} catch (error) {
		console.error(error);
	}

	// PROD
	try {
		await rest.put(
			Routes.applicationCommands(clientId),
			{body: prodCommands}
		);

		console.log('Successfully registered PROD application commands.');
	} catch(error) {
		console.error(error);
	}
})();
