#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { createClient } from './api.js'

const apiKey = process.env.UPTRACK_API_KEY
if (!apiKey) {
  console.error('Error: UPTRACK_API_KEY environment variable is required')
  process.exit(1)
}

const baseUrl = process.env.UPTRACK_API_URL || 'https://api.uptrack.app'
const client = createClient(apiKey, baseUrl)

const server = new McpServer({
  name: 'uptrack',
  version: '0.1.0',
})

// --- Tools ---

server.tool(
  'list_monitors',
  'List all monitors with their status, URL, interval, and uptime',
  {},
  async () => {
    const data = await client.listMonitors()
    const monitors = data.data || data
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(monitors, null, 2),
      }],
    }
  }
)

server.tool(
  'get_monitor',
  'Get details for a specific monitor by ID',
  { id: z.string().describe('Monitor ID') },
  async ({ id }) => {
    const data = await client.getMonitor(id)
    const monitor = data.data || data
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(monitor, null, 2),
      }],
    }
  }
)

server.tool(
  'create_monitor',
  'Create a new uptime monitor',
  {
    url: z.string().url().describe('URL to monitor'),
    name: z.string().optional().describe('Monitor name (auto-generated if omitted)'),
    interval: z.number().optional().describe('Check interval in seconds (default: plan default)'),
    type: z.enum(['http', 'tcp', 'dns', 'ssl', 'heartbeat']).optional().describe('Monitor type (default: http)'),
  },
  async (args) => {
    const body = { url: args.url }
    if (args.name) body.name = args.name
    if (args.interval) body.interval = args.interval
    if (args.type) body.type = args.type

    const data = await client.createMonitor(body)
    const monitor = data.data || data
    return {
      content: [{
        type: 'text',
        text: `Monitor created:\n${JSON.stringify(monitor, null, 2)}`,
      }],
    }
  }
)

server.tool(
  'delete_monitor',
  'Delete a monitor by ID',
  { id: z.string().describe('Monitor ID to delete') },
  async ({ id }) => {
    await client.deleteMonitor(id)
    return {
      content: [{
        type: 'text',
        text: `Monitor ${id} deleted successfully.`,
      }],
    }
  }
)

server.tool(
  'list_incidents',
  'List recent incidents',
  {},
  async () => {
    const data = await client.listIncidents()
    const incidents = data.data || data
    return {
      content: [{
        type: 'text',
        text: incidents.length
          ? JSON.stringify(incidents, null, 2)
          : 'No incidents found.',
      }],
    }
  }
)

server.tool(
  'list_status_pages',
  'List status pages',
  {},
  async () => {
    const data = await client.listStatusPages()
    const pages = data.data || data
    return {
      content: [{
        type: 'text',
        text: pages.length
          ? JSON.stringify(pages, null, 2)
          : 'No status pages found.',
      }],
    }
  }
)

server.tool(
  'get_status',
  'Get a quick overview of monitoring status (total monitors, up/down counts)',
  {},
  async () => {
    const data = await client.listMonitors()
    const monitors = data.data || data
    const up = monitors.filter((m) => m.status === 'active').length
    const down = monitors.filter((m) => m.last_check_status === 'down').length
    const paused = monitors.filter((m) => m.status === 'paused').length

    return {
      content: [{
        type: 'text',
        text: `Monitoring Status:\n  Total: ${monitors.length}\n  Up: ${up}\n  Down: ${down}\n  Paused: ${paused}`,
      }],
    }
  }
)

// --- Start ---

const transport = new StdioServerTransport()
await server.connect(transport)
