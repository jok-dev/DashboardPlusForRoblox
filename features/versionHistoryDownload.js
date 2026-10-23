// The dashboard is a single-page app, so rows are re-tagged whenever the table re-renders.
const PAGE_PATTERN = /\/places\/(\d+)\/version-history/;
const MARKER = "data-version-download";

// Breadcrumbs end "... / Places / <place name> / Version History"
function getPlaceName(placeId) {
	const crumbs = [...document.querySelectorAll(".MuiBreadcrumbs-root li")]
		.map((item) => item.innerText.trim())
		.filter((text) => text && text !== "/");
	const name = crumbs[crumbs.length - 2] ?? `place_${placeId}`;
	return name.replace(/[\\/:*?"<>|]/g, "_");
}

function makeButton(template, placeId, version) {
	const button = template ? template.cloneNode(true) : document.createElement("button");
	button.setAttribute(MARKER, "");
	button.type = "button";
	button.style.marginLeft = "8px";
	// Drop the cloned Restore icon, keep its styling
	button.querySelector("svg")?.remove();
	const label = button.querySelector("span") ?? button;
	label.textContent = "Download";
	button.title = `Download version ${version} as .rbxl`;
	button.addEventListener("click", (event) => {
		event.stopPropagation();
		label.textContent = "Downloading...";
		const placeName = getPlaceName(placeId);
		chrome.runtime.sendMessage({ type: "downloadPlaceVersion", placeId, placeName, version }, (response) => {
			label.textContent = response?.ok ? "Download" : "Failed";
			if (!response?.ok) {
				console.warn("Version download failed", response?.error);
			}
		});
	});
	return button;
}

function addButtons() {
	const match = location.pathname.match(PAGE_PATTERN);
	if (!match) {
		return;
	}

	const placeId = match[1];
	const template = [...document.querySelectorAll("tbody tr td button")].find(
		(button) => button.textContent.trim() === "Restore",
	);
	for (const row of document.querySelectorAll("tbody tr")) {
		const version = row.cells[0]?.innerText.trim();
		const lastCell = row.cells[row.cells.length - 1];
		if (!/^\d+$/.test(version ?? "") || !lastCell) {
			continue;
		}

		const existing = lastCell.querySelector(`[${MARKER}]`);
		// Rows are reused across pages, so a stale button is swapped for the row's current version
		if (existing?.dataset.version === version) {
			continue;
		}

		existing?.remove();
		const button = makeButton(template, placeId, version);
		button.dataset.version = version;
		lastCell.appendChild(button);
	}
}

new MutationObserver(addButtons).observe(document.body, { childList: true, subtree: true });
addButtons();
