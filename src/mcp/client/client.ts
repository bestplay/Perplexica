import { cli } from "winston/lib/winston/config";

let client = undefined

// 使用动态 import() 调用 ECMAScript 模块
async function getClient() {
  if(client){
    return client
  }
  const { Client } = await import("@modelcontextprotocol/sdk/client/index.js");
  const { StdioClientTransport } = await import("@modelcontextprotocol/sdk/client/stdio.js");
  const { ListToolsResultSchema, CallToolResultSchema } = await import("@modelcontextprotocol/sdk/types.js");

  const transport = new StdioClientTransport({
    command: "node",
    args: ["./src/mcp/server/index.js"],
  });

  client = new Client(
    {
      name: "example-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  try {
    await client.connect(transport);
  } catch (error) {
    console.log(error)
  }

  // List available tools
  // const res = await client.request(
  //   { method: "tools/list" },
  //   ListToolsResultSchema
  // );
  return client
}
getClient()

export default getClient