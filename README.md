# Dashboard Plus for Roblox

A Chrome extension that adds extra tools to the [Roblox Creator Dashboard](https://create.roblox.com/dashboard/creations).

Not affiliated with or endorsed by Roblox.

## Features

- **Download any place version.** Adds a Download button next to Restore on a place's Version History page. It saves that version as an `.rbxl` (named like `My Place_v42.rbxl`) without restoring it, so nothing changes for anyone else working in the place.

## Install

1. Download the latest zip from [Releases](https://github.com/jok-dev/DashboardPlusForRoblox/releases) and unzip it, or clone this repo.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and pick the folder with `manifest.json` in it.

## Permissions

- `downloads` saves place files.
- `assetdelivery.roblox.com` is where place versions are downloaded from, using your existing Roblox login. The extension never reads or sends your cookies itself.

## Releasing

Bump `version` in `manifest.json`, then push a matching tag (`v1.0.1`). GitHub Actions builds the zip and attaches it to a new release. Every push to `main` also builds the zip as a workflow artifact.
