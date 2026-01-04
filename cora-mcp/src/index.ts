#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { spawn } from 'child_process';
import { resolve } from 'path';

const server = new Server(
  {
    name: 'cora-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'cora_learn',
        description: 'Launch CORA interactive learning session for a specific lesson module',
        inputSchema: {
          type: 'object',
          properties: {
            lesson_id: {
              type: 'string',
              description: 'Lesson identifier (e.g., "0.1", "0.2", "1.0")',
            },
          },
          required: ['lesson_id'],
        },
      },
      {
        name: 'cora_list',
        description: 'List all available CORA lesson modules',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'cora_learn') {
    const lessonId = (args as { lesson_id: string }).lesson_id;

    // Spawn CORA process
    const coraPath = resolve(process.cwd(), 'cora');
    const child = spawn('python3', [coraPath, lessonId], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => (stdout += data.toString()));
    child.stderr.on('data', (data) => (stderr += data.toString()));

    const exitCode = await new Promise<number>((resolve) => {
      child.on('close', (code) => resolve(code || 0));
    });

    if (exitCode !== 0) {
      return {
        content: [
          {
            type: 'text',
            text: `CORA execution failed (exit ${exitCode}):\n\n${stderr}\n\n${stdout}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: stdout,
        },
      ],
    };
  }

  if (name === 'cora_list') {
    // Spawn CORA with --list flag
    const coraPath = resolve(process.cwd(), 'cora');
    const child = spawn('python3', [coraPath, '--list'], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => (stdout += data.toString()));
    child.stderr.on('data', (data) => (stderr += data.toString()));

    const exitCode = await new Promise<number>((resolve) => {
      child.on('close', (code) => resolve(code || 0));
    });

    if (exitCode !== 0) {
      return {
        content: [
          {
            type: 'text',
            text: `CORA list failed:\n${stderr}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: stdout,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('CORA MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
