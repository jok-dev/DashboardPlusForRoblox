// chrome.downloads sends the browser's Roblox cookies, so assetdelivery serves edit-only place versions.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.type !== "downloadPlaceVersion") {
		return;
	}

	const { placeId, placeName, version } = message;
	chrome.downloads.download(
		{
			url: `https://assetdelivery.roblox.com/v1/asset/?id=${placeId}&version=${version}`,
			filename: `${placeName}_v${version}.rbxl`,
			conflictAction: "uniquify",
		},
		(downloadId) => {
			sendResponse({ ok: downloadId !== undefined, error: chrome.runtime.lastError?.message });
		},
	);
	return true;
});
