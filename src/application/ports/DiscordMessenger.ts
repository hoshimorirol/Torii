export interface DiscordMessenger {
  sendMessage(channelId: string, content: string): Promise<void>;
  sendEmbed(channelId: string, embed: any): Promise<void>;
}
