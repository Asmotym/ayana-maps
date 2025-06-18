import { Handler, HandlerContext, HandlerEvent, HandlerResponse } from "@netlify/functions";
import { discordHandler } from "../core/discord/discord-handler.core";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  return await discordHandler(event, context);
} 