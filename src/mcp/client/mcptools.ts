import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import getClient from './client'

export function buildAnswerToPictureTool(answer:string){
    let name = "generate-base64";
    return new DynamicStructuredTool({
        name: name,
        description: "可以把上一次的回答文字转换成图片的 base64 格式的字符串. Can generate previous answer to a base64 string",
        schema: z.object({
            width: z.number().describe("the width of the output image"),
            height: z.number().describe("the height of the output image"),
        }),
        func: async ({width, height}):Promise<string> => {
            const { ResultSchema } = await import("@modelcontextprotocol/sdk/types.js");

            const GenPicResultSchema = ResultSchema.extend({
                base64Image: z.string(),
            });
            
            const mcpclient = await getClient()
            try {
                const params = { name: name, arguments: { answer, width, height} }
                const res = await mcpclient.request({ method: "tools/call", params }, GenPicResultSchema)
                return res.base64Image
            } catch (error) {
                console.error("err:", error)
            }
            return ""
        },
    });
}


// export async function callTools(llm:BaseChatModel,msg:AIMessageChunk){
//     const messages = [msg]
//     for (const toolCall of msg.tool_calls) {
//         if(toolCall.name === "answerToPicture"){

//         }
//       const selectedTool = toolsByName[toolCall.name];
//       const toolMessage = await selectedTool.invoke(toolCall);
//       messages.push(toolMessage);
//     }
//     return await llm.invoke(messages)
// }

