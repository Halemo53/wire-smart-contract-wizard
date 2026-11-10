<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Wizard command text lives only in `src/lib/wizard-steps.ts`; components render from it so the verbatim commands have one source of truth.
- The app is dark-only: theme values sit on `:root` in `src/styles.css`, with no light/dark switch.
- Client UI libraries used by the app are listed in `optimizeDeps.include` in `vite.config.ts`, so mid-session dep re-optimization can't load a duplicate React into the open preview.
- Pages: `/` wizard, `/concepts` explainer cards, `/builder` command builder; all share `AppHeader` for tab navigation. Concept content lives in `src/lib/concepts.ts`, builder command templates in `src/lib/command-builder.ts` (pure functions, unit-tested).
- One brand mark only: the header icon and the browser tab icon both derive from the same brand mark artwork, and the tab icon is regenerated from that mark rather than designed separately.
