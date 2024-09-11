import { Client, GatewayIntentBits } from "discord.js";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
import { configDotenv } from "dotenv";

configDotenv();

const GenerateImage = async (Text) => {
  try {
    const response = await fetch(
      "https://modelslab.com/api/v6/realtime/text2img",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: process.env.API,
          prompt: Text,
          negative_prompt: "bad quality",
          width: "512",
          height: "512",
          safety_checker: false,
          seed: null,
          samples: 1,
          base64: false,
          webhook: null,
          track_id: null,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const data = await response.json();
    if (data.output && Array.isArray(data.output) && data.output.length > 0) {
      const imageUrl = data.output[0];
      return imageUrl;
    } else {
      throw new Error("Image URL not found in API response");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "imagine") {
    const message = interaction.options.getString("prompt");

    if (!message) {
      await interaction.reply("No prompt provided.");
      return;
    }
    await interaction.reply({
      content: "Generating your image, please wait...",
    });

    try {
      const imageUrl = await GenerateImage(message);

      if (imageUrl) {
        await interaction.editReply({
          content: `Here is your image: ${imageUrl}`,
        });
      } else {
        await interaction.editReply("Failed to generate image.");
      }
    } catch (error) {
      console.error(error);
      await interaction.reply("Failed to generate image.");
    }
  }
});

client.login(process.env.TOKEN);
