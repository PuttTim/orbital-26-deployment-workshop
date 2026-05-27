const defaultDarkModeScript = `<script>
try {
  if (window.localStorage.getItem("slidev-color-schema") === null) {
    window.localStorage.setItem("slidev-color-schema", "dark");
  }
} catch {}
</script>`;

export default function defaultDarkModePlugin() {
	return {
		name: "nus-hackers-default-dark-mode",
		transformIndexHtml(html: string) {
			return html.replace("<head>", `<head>\n${defaultDarkModeScript}`);
		},
	};
}
