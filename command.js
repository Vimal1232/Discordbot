import { ApplicationCommandOptionType, REST, Routes } from "discord.js";
import { configDotenv } from "dotenv";

configDotenv();

const commands = [
  {
    name: "imagine",
    description: "Create New Images",
    options: [
      {
        name: "prompt",
        type: ApplicationCommandOptionType.String,
        required: true,
        description: "The message to reply with",
      },
    ],
  },
];
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands("1282952229111730189"), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
