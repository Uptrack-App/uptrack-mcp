# @uptrack-app/mcp

[MCP](https://modelcontextprotocol.io) server for [Uptrack](https://uptrack.app) uptime monitoring. Use with Claude, ChatGPT, Cursor, or any MCP-compatible AI assistant.

## Setup

### Claude Code

```bash
claude mcp add uptrack -- env UPTRACK_API_KEY=your_key npx -y @uptrack-app/mcp
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "uptrack": {
      "command": "npx",
      "args": ["-y", "@uptrack-app/mcp"],
      "env": {
        "UPTRACK_API_KEY": "your_api_key"
      }
    }
  }
}
```

### Cursor

Add to MCP settings with the same config as Claude Desktop.

## Available Tools

| Tool | Description |
|------|-------------|
| `list_monitors` | List all monitors with status, URL, interval, uptime |
| `get_monitor` | Get details for a specific monitor |
| `create_monitor` | Create a new monitor (HTTP, TCP, DNS, SSL, heartbeat) |
| `delete_monitor` | Delete a monitor |
| `list_incidents` | List recent incidents |
| `list_status_pages` | List status pages |
| `get_status` | Quick overview — total monitors, up/down/paused counts |

## Example Usage

Once connected, ask your AI assistant:

- "List my monitors"
- "Create a monitor for https://example.com"
- "Are any of my services down?"
- "Show me recent incidents"

## Authentication

Get your API key at [uptrack.app/dashboard/settings](https://uptrack.app/dashboard/settings). API access is available on all plans including free.

## Links

- [Uptrack](https://uptrack.app)
- [API Docs](https://api.uptrack.app/api/openapi)
- [MCP Protocol](https://modelcontextprotocol.io)
