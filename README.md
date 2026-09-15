# Jade Philline Monforte — Portfolio

Live: https://jadephillineportfolio.github.io/

Static HTML, CSS, and JavaScript, published by GitHub Pages from `main`.

## Local preview

Run `npm install`, then `npm run dev`. `npm run check` checks JavaScript syntax. The Vite configuration provides a development-only `/__qa` viewport review surface, including enlarged text. No build is needed for GitHub Pages.

## Contact

The form posts the visitor's name, email, and message to FormSubmit, with its native spam check retained. The owner must submit once and confirm FormSubmit's activation email before receiving inquiries. The site does not simulate message delivery. The Gmail alternative retains the entered inquiry in a compose draft. The thank-you page is the provider's post-submission redirect.

## Portfolio assistant

Quick answers use verified portfolio facts in `assistant-data.js`. Visitors may enable optional on-device AI matching: Transformers.js 2.17.2 and a quantized MiniLM language model run in a Web Worker. Questions are processed locally; no secret key, paid API, or account is required. Model files are downloaded from Hugging Face, and the inference library from jsDelivr. Failed or unavailable model loading leaves the quick-answer guide working. The assistant does not invent rates, availability, or commitments.

## Content notes

Homework is an emotional short film: sadness is conveyed through the character's gaze, the song, color grade, and ambiance. Panalangin (Prayer) concerns college puppy love in the late 1990s. my tears ricochet concerns infidelity and is edited to the song. These intentions were confirmed by Jade. KAPA's Writer / Director / Cinematographer / Videographer credits remain distinct from the four other projects' editing credits.

Fonts: Manrope via Google Fonts, with local sans-serif fallbacks. The custom lowercase jp mark is a native SVG, animated with CSS strokes. The four selected thumbnails use Jade's screenshots supplied on September 15, 2026, converted to WebP without changing the pictured content. The previous extracted stills remain available in the assets folder.

## Signature and motion

`motion.js` adds a brief arrival signature, a gradient that shifts with scroll, and image-colored backlighting on video, design, and character cards. The glow uses the actual image as its blurred background, with a sampled highlight tint. Hovering or focusing the Anna Alone poster or a character also crossfades the entire featured section to that image’s color. Keyboard focus receives the same glow; touch screens activate a softer glow as an image enters view. Reduced-motion preferences disable the arrival animation, movement, and motion effects.

Video links open `watch.html?film=<key>` in a new tab using ordinary anchors. `watch.js` draws the signature, then redirects after 1.1 seconds to the film's original YouTube or Drive URL. It accepts only the fixed project list, provides an immediate direct link, skips the delay for reduced motion, and includes no-JavaScript links. It does not embed, rehost, or change access to the videos.
