export default function setupDefaultColorMode() {
	if (typeof window === "undefined") {
		return;
	}

	const colorSchema = window.localStorage.getItem("slidev-color-schema");
	const hasAppliedDefault =
		window.sessionStorage.getItem("nus-hackers-default-dark-mode") === "true";

	if ((colorSchema === null || colorSchema === "auto") && !hasAppliedDefault) {
		window.sessionStorage.setItem("nus-hackers-default-dark-mode", "true");
		window.localStorage.setItem("slidev-color-schema", "dark");
		window.location.reload();
	}
}
