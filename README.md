# Athabasca Landing

Static landing page for the Athabasca video development agent, with a Cloudflare Pages Function for waitlist email capture.

## Local preview

Open `index.html` directly in a browser, or run a static server from this directory:

```sh
python3 -m http.server 8788
```

Then visit `http://localhost:8788`.

The waitlist form posts to `/api/waitlist`, which is implemented for Cloudflare Pages. When previewing as a plain static site, the form falls back to an email draft if the endpoint is unavailable.

## Cloudflare Pages deployment

1. Create a GitHub repo for this folder and push it.
2. In Cloudflare, go to **Workers & Pages** -> **Create application** -> **Pages**.
3. Connect the GitHub repo.
4. Use these build settings:
   - Framework preset: `None`
   - Build command: leave blank
   - Build output directory: `/`
5. Create a KV namespace named `ATHABASCA_WAITLIST`.
6. In the Pages project, open **Settings** -> **Functions** -> **KV namespace bindings**.
7. Add a production binding:
   - Variable name: `WAITLIST`
   - KV namespace: `ATHABASCA_WAITLIST`
8. Deploy the Pages project.
9. Open **Custom domains** and add `wheretoaccess.com`.
10. If Cloudflare already manages DNS for `wheretoaccess.com`, accept the DNS record Cloudflare suggests. If DNS is elsewhere, point the domain to the Cloudflare Pages target shown in the custom-domain setup.
11. Submit a test email on the live page, then confirm it appears in the `ATHABASCA_WAITLIST` KV namespace.

## Notes

- Waitlist records are stored with keys like `athabasca:name@example.com`.
- The form intentionally has a `mailto:` fallback so the draft page still works before the Cloudflare Function is live.
- For stronger production handling later, add Turnstile and either email notifications or a proper CRM/list provider.
