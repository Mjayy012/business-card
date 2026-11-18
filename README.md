# My digital business card

Files
- index.html  page shell and link-preview tags (update the title/description lines at the top)
- config.js   YOUR DETAILS, your brand color and theme. Edit this first.
- style.css   the design (phone to large monitor)
- script.js   the logic: tabs, QR code, share
- contact.vcard and contact.vcf  contact files; visitors can download contact.vcf from the Contact tab

Make it yours
- Change `accent` in config.js to your brand color. Buttons, badges and highlights follow it.
- Add your photo: put photo.jpg in this folder and set photo: "photo.jpg".
- Rewrite the headline, bio and services in your own words.
- On Android, Save contact requests a prefilled New contact form where the browser allows it. If the browser blocks this, the Contact tab offers a contact file and copyable details. On iPhone, Save contact opens those options directly; browsers cannot launch a prefilled native New contact form.
- If you change your name, phone, email, or links, update both contact.vcard and contact.vcf too.
- `theme`: "auto" follows the visitor's phone, or force "light" / "dark".

Publish free
1. Drag this whole folder onto https://app.netlify.com/drop (or use GitHub Pages / Cloudflare Pages).
2. Copy your link. Use a link without "#" for the NFC tag.
3. NFC Tools app > Write > Add a record > URL/URI > paste > Write > hold phone on the card.
4. Test on one iPhone and one Android.

Handy links: add #contact or #services to the end of your link to open that tab first.
