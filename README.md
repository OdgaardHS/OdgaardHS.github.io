# Portfolio website

A simple website with four sections: Videos, Papers, Images and Contact. It needs no build tools or installs.

## See it on your computer

Double-click `index.html`. It opens in your browser with placeholder content.

## Add your own material

Everything you change is in **`content.js`**. Open it in Notepad or VS Code.

1. Fill in your name, tagline, a short "about" text and your contact links at the top.
2. Copy files into the matching folder:
   - `assets/images/` for photos, renders and screenshots (JPG or PNG; around 2000 px wide is plenty)
   - `assets/papers/` for PDFs
   - `assets/videos/` for short MP4s under about 50 MB
   - `assets/thumbs/` for optional preview pictures for videos
3. In `content.js`, add one entry per file. Copy an example entry and change its text and `file` path, for example `file: "assets/papers/my-thesis.pdf"`.
4. Delete the example entries you don't use, save, and refresh the browser.

### Videos: YouTube/Vimeo or MP4

GitHub refuses files over 100 MB and the site gets slow with big videos. For anything larger than about 50 MB:

1. Upload it to YouTube (it can be "Unlisted" so only people with the link see it) or Vimeo.
2. Paste the normal video link into the `youtube:` or `vimeo:` field of that entry.

Small clips can stay as MP4 files with `file: "assets/videos/clip.mp4"`.

## Put it online for free (GitHub Pages)

1. Create a free account at github.com.
2. Click **New repository**. Name it `yourusername.github.io` (with your real username), make it **Public**, and create it.
3. On the new repository page, click **uploading an existing file**, drag in everything from this folder (including the `assets` folder), then click **Commit changes**.
4. Go to **Settings → Pages**. Under "Branch" choose `main` and `/ (root)`, then **Save**.
5. After a minute or two the site is live at `https://yourusername.github.io`. That's the link you send to employers.

To update it later, upload changed files the same way. They replace the old ones.

A custom domain such as `yourname.com` can be added later under Settings → Pages.
