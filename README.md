# My digital business card

Files
- index.html  page shell and link-preview tags (update the title/description lines at the top)
- config.js   YOUR DETAILS, your brand color and theme. Edit this first.
- style.css   the design (phone to large monitor)
- script.js   the logic: tabs, QR code, share
- contact.vcard and contact.vcf  optional contact files kept for compatibility

Make it yours
- Change `accent` in config.js to your brand color. Buttons, badges and highlights follow it.
- Add your photo: put photo.jpg in this folder and set photo: "photo.jpg".
- Rewrite the headline, bio and services in your own words.
- On Android, Save contact opens the Phone app with your number; visitors then choose Create contact. On iPhone, it shows copyable details for adding a contact without a download.
- If you change your name, phone, email, or links, update both contact.vcard and contact.vcf too.
- `theme`: "auto" follows the visitor's phone, or force "light" / "dark".

Publish free
1. Drag this whole folder onto https://app.netlify.com/drop (or use GitHub Pages / Cloudflare Pages).
2. Copy your link. Use a link without "#" for the NFC tag.
3. NFC Tools app > Write > Add a record > URL/URI > paste > Write > hold phone on the card.
4. Test on one iPhone and one Android.

Handy links: add #contact or #services to the end of your link to open that tab first.
