# My digital business card

Files
- index.html  page shell and link-preview tags (update the title/description lines at the top)
- config.js   YOUR DETAILS, your brand color and theme. Edit this first.
- style.css   the design (phone to large monitor)
- script.js   the logic: tabs, QR code, share
- contact.vcard and contact.vcf  contact files; Save contact opens contact.vcf on iPhone and other non-Android devices

Make it yours
- Change `accent` in config.js to your brand color. Buttons, badges and highlights follow it.
- Add your photo: put photo.jpg in this folder and set photo: "photo.jpg".
- Rewrite the headline, bio and services in your own words.
- On Android, Save contact requests a prefilled New contact form and opens contact.vcf if the browser cannot launch Contacts. On iPhone, it opens the vCard for the visitor to add in Contacts.
- If you change your name, phone, email, or links, update both contact.vcard and contact.vcf too.
- `theme`: "auto" follows the visitor's phone, or force "light" / "dark".

Publish free
1. Drag this whole folder onto https://app.netlify.com/drop (or use GitHub Pages / Cloudflare Pages).
2. Copy your link. Use a link without "#" for the NFC tag.
3. NFC Tools app > Write > Add a record > URL/URI > paste > Write > hold phone on the card.
4. Test on one iPhone and one Android.

Handy links: add #contact or #services to the end of your link to open that tab first.
