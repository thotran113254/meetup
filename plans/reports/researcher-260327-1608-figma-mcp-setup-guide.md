# Figma MCP Server Integration Guide for Claude Code

**Report Date:** 2026-03-27
**Research Focus:** Official Figma MCP setup, configuration, and capabilities

---

## Executive Summary

Figma MCP (Model Context Protocol) is the official standard for connecting AI agents to Figma design files. The **remote MCP server** (`https://mcp.figma.com/mcp`) is the recommended, production-ready solution with the broadest feature set. Setup uses **OAuth authentication** (no API keys required) and integrates into Claude Code via CLI or official plugin installation.

---

## 1. Official Figma MCP Server

### Package Name & Repository
- **Official Source:** Figma's hosted remote MCP server at `https://mcp.figma.com/mcp`
- **GitHub Reference:** [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) (official setup guide)
- **No local package install required** for remote server (recommended approach)
- Community packages exist on npm (e.g., `figma-developer-mcp`, `mcp-figma`) but official remote server is preferred

### Server Types
| Type | Location | Seat Requirements | Best For |
|------|----------|------------------|----------|
| **Remote MCP** (recommended) | https://mcp.figma.com/mcp | All plans | Broadest features, no desktop app needed, web-based |
| **Desktop MCP** | http://127.0.0.1:3845/sse | Dev or Full seat on paid plans | Enterprise/organization, local control |

---

## 2. Installation & Configuration

### Setup Method 1: Official Plugin (Easiest)

```bash
# Claude Code - install official Figma plugin with pre-configured MCP
claude plugin install figma@claude-plugins-official
```

This automatically configures the remote MCP server and includes agent skills.

### Setup Method 2: Manual MCP Registration

```bash
# Add Figma remote MCP to Claude Code
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

Then authenticate when prompted through the `/mcp` command interface.

### Setup Method 3: VS Code / Cursor Configuration

For VS Code's `settings.json` or MCP config:

```json
{
  "servers": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

For Cursor (pre-configured):
```bash
/add-plugin figma
```

### Setup Method 4: Desktop MCP (Via Figma Desktop App)

1. Open **Figma Desktop** → **Preferences**
2. Enable **"Dev Mode MCP Server"** (runs at `http://127.0.0.1:3845/sse`)
3. In Claude Code:
```bash
claude mcp add --transport sse figma-dev-mode-mcp-server http://127.0.0.1:3845/sse
```

---

## 3. Authentication & Credentials

### OAuth Authentication Flow (Remote Server)

**No pre-generated API keys needed.** The remote MCP server uses **Figma's OAuth 2.0 flow**:

1. **During setup**, you authorize Claude Code to access your Figma account
2. Click **"Allow Access"** in the authentication dialog
3. Authentication ties the MCP connection to your Figma account automatically
4. Tokens are managed by Figma's OAuth service (transparent to user)

### No Personal Access Tokens for Remote Server

- **Important:** Figma's remote MCP server **does NOT support Personal Access Tokens (PAT)**
- Use OAuth as described above
- PATs are only for direct REST API calls, not for MCP connections

### Key Differences by Seat Type

| Seat Type | Rate Limit | Features |
|-----------|-----------|----------|
| **Starter / View / Collab** | 6 tool calls/month | Read-only design context |
| **Dev or Full** (paid plans) | Per-minute limits | Read + write-to-canvas |
| **Enterprise** | Custom limits | Full remote + local server support |

---

## 4. Tools & Capabilities

### Core Tools (16 total)

#### **Design-to-Code Tools**
- **`get_design_context`** — Extract styling as React + Tailwind (customizable to Vue, HTML/CSS, iOS, etc.)
- **`get_variable_defs`** — Extract design tokens (colors, spacing, typography)
- **`get_metadata`** — Sparse XML outline with layer info (for large designs)
- **`get_screenshot`** — Capture visual representation of selections

#### **Code-to-Design Tools** (Remote Only)
- **`generate_figma_design`** — Convert live web UI to Figma design layers (from localhost, staging, production)

#### **Component Mapping Tools**
- **`get_code_connect_map`** / **`add_code_connect_map`** — Map Figma components to codebase
- **`get_code_connect_suggestions`** / **`send_code_connect_mappings`** — Auto-detect component mappings
- **`create_design_system_rules`** — Define custom rules for design-to-code translation

#### **Design System Tools**
- **`search_design_system`** — Find components, variables, styles across design libraries
- **`figma_get_design_system_kit`** — Unified tool returning visual specs, screenshots, token values, resolved styles

#### **Creation Tools** (Remote Only)
- **`use_figma`** — General-purpose tool: create, edit, delete, inspect any Figma object (pages, frames, components, variants, variables, styles, text, images)
- **`create_new_file`** — Create blank Design or FigJam file

#### **Diagram Tools**
- **`generate_diagram`** — Convert Mermaid syntax to FigJam diagrams
- **`get_figjam`** — Return FigJam metadata in XML + screenshots

#### **Utility**
- **`whoami`** (remote only) — Return authenticated user identity, email, plans, seat type

---

## 5. Configuration Examples

### Claude Code Complete Setup

```bash
# Step 1: Install official plugin (recommended)
claude plugin install figma@claude-plugins-official

# Step 2: No additional configuration needed - plugin handles everything
# Step 3: Authenticate when prompted
```

### Claude Desktop App Configuration

If using Claude Desktop (not Claude Code), edit `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "figma-remote": {
      "url": "https://mcp.figma.com/mcp",
      "type": "http"
    }
  }
}
```

### VS Code with MCP

Edit `.vscode/settings.json` or use CLI:

```bash
# Open command palette: Ctrl+Shift+P
# Search: "MCP: Add Server"
# Paste this JSON:
{
  "servers": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

### Custom Local MCP Server (Alternative)

If using a community package like `figma-developer-mcp`:

```json
{
  "mcpServers": {
    "figma-custom": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR_FIGMA_ACCESS_TOKEN",
        "--stdio"
      ]
    }
  }
}
```

**Note:** This requires a personal access token from Figma Account Settings → Personal access tokens.

---

## 6. Workflow Examples

### Design-to-Code Flow

```
1. Open Figma file in browser or desktop app
2. Select a frame or component
3. In Claude Code, reference the frame:
   "Convert this Figma design to React: [Figma URL with node ID]"
4. MCP calls get_design_context → Claude generates code
5. Optionally map components with get_code_connect_map
```

### Code-to-Design Flow

```
1. Build UI in localhost:3000 or staging environment
2. In Claude Code, prompt:
   "Generate Figma design from my UI at http://localhost:3000/dashboard"
3. MCP calls generate_figma_design → Creates editable Figma frame
4. Use use_figma tool to refine the generated design
```

### Design System Workflow

```
1. Define design tokens in Figma (colors, typography, spacing)
2. Use search_design_system to find components
3. Create Code Connect mappings with get_code_connect_suggestions
4. Claude uses these mappings to generate consistent code
```

---

## 7. Key Limitations & Constraints

| Limitation | Impact | Workaround |
|-----------|--------|-----------|
| **Starter plan: 6 calls/month** | Limited for production workflows | Upgrade to Dev/Full seat or use local desktop server |
| **No PAT auth for remote** | Cannot use personal access tokens | Use OAuth (automatic) |
| **generate_figma_design needs public URLs** | Cannot access private deployments | Use staging env with public access or localhost tunnels (ngrok) |
| **Write-to-canvas currently free** | Will require payment in future | Plan for potential usage-based billing |
| **Desktop server requires desktop app** | Extra dependency | Use remote server instead (preferred) |
| **Rate limiting on read tools** | May throttle high-volume extractions | Implement caching or batch operations |

---

## 8. Best Practices

### Design Structure
✓ Use **semantic components** with descriptive names
✓ Implement **auto layout** for responsive designs
✓ Define **variables** for design tokens (colors, spacing, typography)
✓ Use **component variants** for different states
✓ Organize pages logically for large files

### Code Generation
✓ Write **clear, specific prompts** — specify framework, styling system, directory structure
✓ Provide **Figma URLs with node IDs** for precise selections
✓ Use **Code Connect** to map Figma components to codebase
✓ Iterate with **get_design_context** + **get_variable_defs** for accuracy

### Authentication & Security
✓ **Use OAuth** (automatic through plugin) — safest approach
✓ If using local packages, store PAT in environment variables (never hardcode)
✓ Rotate personal access tokens periodically
✓ Use seat-based access control for team collaboration

### Performance
✓ Use **get_metadata** for large designs (lightweight XML)
✓ Cache design context between iterations
✓ Batch multiple read operations
✓ Use **create_design_system_rules** to reduce prompt complexity

---

## 9. Community Alternatives & Packages

For users wanting **local control** or **extended features**:

| Package | Source | Auth | Notes |
|---------|--------|------|-------|
| **figma-developer-mcp** | npm | PAT | Framelink MCP, good docs |
| **mcp-figma** | npm | PAT | Global install support |
| **@hapins/figma-mcp** | npm | FIGMA_ACCESS_TOKEN env | Lightweight |
| **figma-mcp-pro** | npm | PAT from Account Settings | Premium features |
| **@yhy2001/figma-mcp-server** | GitHub repo | PAT | Clone + pnpm build required |

**Recommendation:** Use official remote server (`https://mcp.figma.com/mcp`) for production. Community packages useful for:
- Enhanced/custom tooling
- Air-gapped environments
- Advanced customization
- Local-only workflows

---

## 10. Setup Checklist

### Prerequisites
- [ ] Claude Code installed (`npm install -g @anthropic-ai/claude-code` or via Homebrew)
- [ ] Figma account (free or paid)
- [ ] Web browser for OAuth authentication
- [ ] API credentials NOT needed (OAuth is automatic)

### Installation Steps
- [ ] Run: `claude plugin install figma@claude-plugins-official`
- [ ] Authenticate when prompted (click "Allow Access")
- [ ] Verify: `claude mcp list` shows figma server
- [ ] Test: Use `/tools` in Claude Code to see Figma tools available

### Configuration Verification
- [ ] Check seat type in Figma Account Settings (determines rate limits)
- [ ] Test with simple design extraction: `get_design_context` on a frame
- [ ] Verify OAuth token persistence across sessions
- [ ] For desktop server: Enable in Figma Desktop prefs + test at http://127.0.0.1:3845/sse

---

## 11. Troubleshooting

### "Authentication failed"
→ OAuth dialog didn't complete. Run `claude mcp list` and re-authenticate.

### "Rate limit exceeded"
→ Upgrade from Starter to Dev/Full seat, or implement request caching.

### "Design context too large"
→ Use `get_metadata` instead of `get_design_context` for large files.

### "Personal access token not supported"
→ This is expected for remote server. Use OAuth (automatic via plugin).

### Desktop MCP server won't start
→ Enable in Figma Desktop Prefs → Restart Figma → Check http://127.0.0.1:3845/sse

---

## Summary Table: Quick Reference

| Question | Answer |
|----------|--------|
| **Official package?** | Remote MCP at `https://mcp.figma.com/mcp` (no install needed) |
| **How to install?** | `claude plugin install figma@claude-plugins-official` |
| **Authentication?** | OAuth 2.0 (automatic, no manual token setup) |
| **Can use PAT?** | No for remote server; yes for community packages |
| **Main tools?** | get_design_context, use_figma, generate_figma_design, search_design_system |
| **Best for?** | Design-to-code, code-to-design, design system workflows |
| **Rate limits?** | 6/month (Starter), per-minute (Dev/Full seats) |
| **Desktop app needed?** | No for remote server; yes for desktop MCP variant |

---

## Sources

- [Guide to the Figma MCP server – Figma Help Center](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
- [Figma MCP Server Developer Docs](https://developers.figma.com/docs/figma-mcp-server/)
- [Remote Server Installation – Developer Docs](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)
- [Tools and Prompts – Developer Docs](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- [Figma MCP Collection – Help Center](https://help.figma.com/hc/en-us/articles/35281350665623-Figma-MCP-collection-How-to-set-up-the-Figma-remote-MCP-server-preferred)
- [Introducing Figma MCP Server – Blog](https://www.figma.com/blog/introducing-figma-mcp-server/)
- [GitHub: figma/mcp-server-guide](https://github.com/figma/mcp-server-guide)
- [Figma API Authentication](https://developers.figma.com/docs/rest-api/authentication/)
- [Claude Code + Figma MCP – Builder.io Blog](https://www.builder.io/blog/claude-code-figma-mcp-server)
- [How to Convert Figma Design to Code with Claude – Composio](https://composio.dev/content/how-to-use-figma-mcp-with-claude-code-to-build-pixel-perfect-designs)
