#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fetch from 'node-fetch';

// Create server instance
const server = new Server(
  {
    name: "weather",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);
let genpicToolName = "generate-base64"
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: genpicToolName,
        description: "generate previous answer to a picture",
        inputSchema: {
          type: "object",
          properties: {
            answer: {
              type: "string",
              description: "The previous answer",
            }
          },
          required: ["answer"]
        }
      }
    ]
  };
});

async function makeTextToImageRequest(answer, width, height) {
  const response = await fetch('http://localhost:3001/api/text2pic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answer, width, height }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === genpicToolName) {
    const args = request.params.arguments
    const res = await makeTextToImageRequest(args.answer,args.width,args.height);
    // console.error("text2pic res:", res.base64Image)
    return res
  } else {
    throw new Error("Tool not found");
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
