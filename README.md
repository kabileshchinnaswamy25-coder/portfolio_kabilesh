# Kabilesh C — Portfolio

**Live:** Deploy to Vercel (see instructions below)

---

## Project Structure

```
/
├── index.html                  ← Main HTML (semantic, SEO, accessible)
├── css/
│   ├── style.css               ← Variables, base, all component styles
│   ├── animations.css          ← Scroll reveals, keyframes, transitions
│   └── responsive.css          ← All breakpoints (1280 → 375px)
├── js/
│   ├── theme.js                ← Dark/light toggle + localStorage
│   ├── animations.js           ← Canvas, cursor glow, scroll reveal, magnetic
│   ├── main.js                 ← Nav, tabs, smooth scroll, mobile menu
│   └── contact.js              ← Web3Forms submission + validation
├── resume/
│   └── Kabilesh_C_Resume.pdf   ← ✅ Your actual PDF (already placed)
└── README.md
```

---

## Before Deploying — Required Steps

### 1. Web3Forms Access Key (contact form)
1. Go to https://web3forms.com
2. Enter `kabileshchinnaswamy25@gmail.com`
3. Check your inbox for the free access key
4. Open `index.html`, find this line:
   ```html
   <input type="hidden" name="access_key" value="f7917f6b-54b8-4a0a-92e6-6f892cdddb11" />
   ```
5. Replace `f7917f6b-54b8-4a0a-92e6-6f892cdddb11` with your actual key

> Until this is set, the form falls back to opening your mail client (mailto).

---

## Running Locally

No build step needed — pure HTML/CSS/JS.

**Option A — VS Code Live Server:**
1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

**Option B — Python:**
```bash
cd portfolio
python -m http.server 8080
# Visit http://localhost:8080
```

**Option C — Node (npx serve):**
```bash
npx serve .
```

---

## Deploying to Vercel

1. Push this folder to a GitHub repository
2. Go to https://vercel.com → New Project → Import your repo
3. Vercel detects it as a static site automatically
4. Click Deploy

**Resume will work at:** `yourdomain.vercel.app/resume/Kabilesh_C_Resume.pdf`

> ✅ The resume is a real PDF stored at `/resume/Kabilesh_C_Resume.pdf`
> ✅ No `.txt` files, no broken links

---

## Links to Update

| What | Where in index.html | Current value |
|------|---------------------|---------------|
| Web3Forms key | `<input name="access_key">` | `f7917f6b-54b8-4a0a-92e6-6f892cdddb11` |
| LinkedIn | All `href` attributes | `https://www.linkedin.com/in/kabilesh-c-1935a3262` ✅ |
| GitHub | All `href` attributes | `https://github.com/kabileshchinnaswamy25-coder` ✅ |
| Resume | All `href` for resume | `/resume/Kabilesh_C_Resume.pdf` ✅ |

---

## Features

- ✅ Dark / Light theme toggle (persists across sessions)
- ✅ Animated network canvas background
- ✅ Smooth scroll with nav offset
- ✅ Scroll reveal animations (IntersectionObserver)
- ✅ Cursor glow on desktop
- ✅ Magnetic button effect on desktop
- ✅ Active nav link highlight on scroll
- ✅ Interactive Career Path tabs (6 domains)
- ✅ Project layer view switcher (Embedded / AI/ML / Backend / Frontend)
- ✅ Web3Forms contact with validation + success/error states
- ✅ Mobile hamburger menu with smooth open/close
- ✅ Keyboard navigation on all tab components
- ✅ ARIA roles, labels and semantic HTML
- ✅ prefers-reduced-motion support
- ✅ SEO meta tags + Open Graph
- ✅ No fake statistics, no fabricated links
