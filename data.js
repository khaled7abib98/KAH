/* =========================================================
   KAH — Project data
   Images are served from Behance's CDN.
   thumb  = max_1200_webp   |   full = 1400_webp
   To add a project: copy one block, paste the Behance link,
   and add image file names from the project (right-click an image
   on Behance → Copy image address → keep only the last part).
   ========================================================= */
const CDN = "https://mir-s3-cdn-cf.behance.net/";
const img = (file, size = "max_1200_webp") => `${CDN}project_modules/${size}/${file}`;
const cover = (file) => `${CDN}projects/808/${file}`;

window.PROJECTS = [
  {
    id: "nobilia",
    title: "NOBILIA",
    kind: "Brand Identity Design",
    cats: ["branding"],
    year: "2026",
    accent: "#c9a46a",
    blurb: "A refined identity system built on restraint — a confident mark, a calm palette and a typographic voice that feels premium at every touchpoint.",
    url: "https://www.behance.net/gallery/253628201/NOBILIA-Brand-Identity-Design",
    cover: "bce68c253628201.Y3JvcCwxNDAwLDEwOTUsMCwxMw.jpg",
    images: ["f6bdc8253628201.6a6dd7331cbcd.jpg","3eb0f0253628201.6a6dd7331fcaa.jpg","acce0c253628201.6a6dd7331e7fa.jpg","63de02253628201.6a6dd7331d54a.jpg","1d2c66253628201.6a6dd7331ec63.jpg","bc040c253628201.6a6dd7331f4a8.jpg","5d47df253628201.6a6dd7331f072.jpg","92a2f3253628201.6a6dd7331e2c5.jpg","83e3c2253628201.6a6dd7331f894.jpg","8b221d253628201.6a6dd7331de8e.jpg","5a8bfa253628201.6a6dd7331d9f2.jpg","2d3cd4253628201.6a6dd7331d0af.jpg"]
  },
  {
    id: "ethra",
    title: "Ethra HR",
    kind: "Social Media Campaign",
    cats: ["social", "advertising"],
    year: "2026",
    accent: "#3ee6ff",
    blurb: "A recruitment and HR campaign that turns corporate services into clear, human, scroll-stopping social content in Arabic.",
    url: "https://www.behance.net/gallery/254757481/Ethra-Human-Resources-Social-Media-Campaign",
    cover: "28608f254757481.Y3JvcCw4OTkzLDcwMzQsMCwyNDQ.jpg",
    images: ["4d2dfc254757481.6a8cc4b6358a3.jpg","096f9a254757481.6a8cc4b636843.jpg","dcfa42254757481.6a8cc4b6360ff.jpg","6fae85254757481.6a8cc4b6364a8.jpg","5d79ff254757481.6a8cc4b3ee0f0.jpg","aeb82b254757481.6a8cc4b3ee725.jpg","c9afc0254757481.6a8cc4b3eed55.jpg","6aec9b254757481.6a8cc4b47b9f2.jpg","059dd3254757481.6a8cc4b47bee9.jpg","69b87a254757481.6a8cc4b47c69f.jpg","86196d254757481.6a8cc4b47af4e.jpg","5ceda6254757481.6a8cc4b47b489.jpg","5c6072254757481.6a8cc4b47c36a.jpg","ef6501254757481.6a8cc4b516ff1.jpg","a5c10c254757481.6a8cc4b5176ca.jpg","808b69254757481.6a8cc4b517347.jpg"]
  },
  {
    id: "markethome",
    title: "Market Home",
    kind: "Branding & Visual Identity",
    cats: ["branding"],
    year: "2026",
    accent: "#ff9f5a",
    blurb: "A friendly, recognisable retail identity designed to live everywhere — from storefront signage to bags, uniforms and social.",
    url: "https://www.behance.net/gallery/247259357/Market-Home-Branding-Visual-Identity",
    cover: "c2311e247259357.Y3JvcCwzMTcwLDI0ODAsMTY0LDA.jpg",
    images: ["53360f247259357.69d6b89404951.jpg","b288c5247259357.69d6b89406183.jpg","30197f247259357.69d6b8940759b.jpg","17c2ab247259357.69d6b89406bc4.jpg","d2ebf5247259357.69d6b89404eae.jpg","b838e1247259357.69d6b89405823.jpg","cbd0cf247259357.69d6b8940709b.jpg","135432247259357.69d6b89405cc7.jpg","f38954247259357.69d6b894066bc.jpg","35f1be247259357.69d6b894053a5.jpg"]
  },
  {
    id: "mfa",
    title: "MFA",
    kind: "Social Media Visuals",
    cats: ["social", "advertising"],
    year: "2025",
    accent: "#9be27a",
    blurb: "Fashion social content mixing product, texture and bold Arabic/English typography — a feed that feels like a lookbook.",
    url: "https://www.behance.net/gallery/239136157/MFA-Social-Media-Visuals",
    cover: "e3d4f5239136157.Y3JvcCwzNTc5LDI4MDAsMzEwLDA.jpg",
    images: ["d30dcf239136157.6923409080c97.jpg","1749d1239136157.6923408dc16b1.jpg","4d3821239136157.6923408dc1bcd.jpg","42ffef239136157.6923408e68003.jpg","4cc637239136157.6923408e687a9.jpg","51a0d1239136157.699ef82e2e4bc.jpg","191098239136157.699ef82e2ec53.jpg","d9e2e7239136157.699ef82e2f57c.jpg","bcaa13239136157.699ef82e2dc65.jpg","18b75f239136157.699ef82f1e2f4.jpg","89c51e239136157.699ef82f1ef2e.jpg","07875c239136157.699ef82f1f426.jpg","97ffb2239136157.699ef82f1e92b.jpg","51f10d239136157.699ef830114b6.jpg","86fcc5239136157.699ef83011e1c.jpg","2aef54239136157.699ef830105fd.jpg"]
  },
  {
    id: "vivy",
    title: "VIVY CURVES",
    kind: "Social Media · Iraq Market",
    cats: ["social", "advertising"],
    year: "2025",
    accent: "#ff6fb5",
    blurb: "A soft, trustworthy social series for a women's care brand in the Iraqi market — clarity first, beauty always.",
    url: "https://www.behance.net/gallery/239169067/VIVY-CURVES-Social-Media-Designs-%28Iraq-Market%29",
    cover: "98359e239169067.Y3JvcCwxMzYwLDEwNjQsMjAsMA.jpg",
    images: ["82d5db239169067.692415dcd8e47.jpg","169a1e239169067.69241b46917be.jpg","d842f0239169067.69241b469108e.jpg","1fb555239169067.69241b4691ea6.jpg","a4983e239169067.69241b473de35.jpg","9c4a63239169067.69241b473e50d.jpg","d15585239169067.69241b473ebb5.jpg","4ec901239169067.69241b481380f.jpg","24212b239169067.69241b4812cc6.jpg","626210239169067.69241b4813390.jpg","3a384d239169067.692415dc2dfba.jpg","2f4451239169067.692415db56b48.jpg","bdad74239169067.692415db57358.jpg","fee011239169067.692415db57a5c.jpg"]
  },
  {
    id: "coconuts",
    title: "COCONUTS MEN",
    kind: "Social Media · Men Care",
    cats: ["social", "advertising"],
    year: "2025",
    accent: "#7ad8c4",
    blurb: "Bold yet clean visuals that make men's personal care feel confident, fresh and premium.",
    url: "https://www.behance.net/gallery/235729677/COCONUTS-MEN-Social-Media",
    cover: "7114b4235729677.Y3JvcCwzODM1LDMwMDAsNDQ2LDA.jpg",
    images: ["0614a5235729677.68e2af8d77cc8.jpg","244f1c235729677.68dd2d400ff56.jpg","fa73a8235729677.68dd2d400f9e8.jpg","285cac235729677.68dd2d401077e.jpg","ec16a8235729677.68dd2d410226d.jpg","f15fb6235729677.68dd2d4102a5a.jpg","c1b845235729677.68dd2d41033df.jpg","d17c62235729677.68dd2d41e1924.png","f9f6c2235729677.68dd2d41e1436.jpg","7d2b6d235729677.68dd2d41e0f39.jpg"]
  },
  {
    id: "taw",
    title: "TAW",
    kind: "Banners & Social Media",
    cats: ["advertising", "social"],
    year: "2025",
    accent: "#ffb04a",
    blurb: "Campaign banners and web/social graphics with a direct hierarchy — offer, product, action — built to convert.",
    url: "https://www.behance.net/gallery/231431879/TAW-Banners-Social-Media",
    cover: "a534bf231431879.Y3JvcCw0Nzg1LDM3NDMsMTE0OCww.jpg",
    images: ["d14a48231431879.68da790ec6c40.jpg","4ea0ab231431879.68da79082c09e.jpg","e90df9231431879.68da790ec66bd.jpg","c6b216231431879.68da79082b67f.jpg","07893f231431879.68e0008186990.jpg","404091231431879.68da790dd4055.jpg","0fbd08231431879.68da790dd46fa.jpg","146188231431879.68da790dd392e.jpg","c422fb231431879.688913c543119.jpg","77397a231431879.688913c54299e.jpg","1b6487231431879.688913c54240f.jpg","e9fc14231431879.688913c748036.jpg","2bb508231431879.688913c746b32.jpg","89f202231431879.688913c831576.jpg","9bb5a2231431879.688913c902483.jpg","edbff4231431879.68da7909ce34b.jpg"]
  },
  {
    id: "osool",
    title: "OSOOL",
    kind: "Brand Identity · Real Estate",
    cats: ["branding"],
    year: "2025",
    accent: "#e2a640",
    blurb: "Identity for a real-estate developer in Sadat City — Arabic calligraphic heritage meets a modern, trustworthy system.",
    url: "https://www.behance.net/gallery/218601991/OSOOL-brand-identity",
    cover: "d77d7a218601991.Y3JvcCwzMDE5LDIzNjIsODUyLDA.jpg",
    images: ["d0ea90218601991.67a3eaaa3122d.jpg","f784fb218601991.67a3eaaa33c90.jpg","838f4a218601991.67a3eaaa344a7.jpg","39bcf0218601991.67a3eaaa34c88.jpg","32f88d218601991.67a3eaaa355a0.jpg","67760e218601991.67a3eaaa438d4.jpg","ee23b8218601991.67a3eaaa35e49.jpg","0c0021218601991.67a3eaaa44104.jpg","89a09a218601991.67a3eaaa33338.jpg","34f253218601991.67a3eaaa36432.jpg","11a743218601991.67a3eaaa31cab.jpg","e24db4218601991.67a3eaaa3704d.jpg","199a75218601991.67a3eaaa369ff.jpg","0e2216218601991.67a3eaaa45e72.jpg","a37aa6218601991.67a3eaaa46ef2.jpg","4c89c6218601991.67a3eaaa47e28.jpg"]
  },
  {
    id: "abuelias",
    title: "Abu Elias",
    kind: "Restaurant Visual Identity",
    cats: ["branding"],
    year: "2025",
    accent: "#ff5f4a",
    blurb: "A restaurant identity balancing appetite appeal with instant recognition — from the mark to menus, packaging and social.",
    url: "https://www.behance.net/gallery/217398351/Abu-Elias-Restaurant-Visual-identity",
    cover: "17be7f217398351.Y3JvcCw0Mjk1LDMzNjAsMTgwLDA.jpg",
    images: ["4753bb217398351.678ffa95d4d62.jpg","850cc1217398351.678ffa95d71d4.jpg","143b2e217398351.678ffa95d76ee.jpg","bcfeb9217398351.678ffa95d6531.jpg","39705c217398351.678ffa95d0623.jpg","dc986d217398351.678ffa95cf0d7.jpg","952035217398351.678ffa95d45ad.jpg","8db7fb217398351.678ffa95cd6c9.jpg","6a1804217398351.678ffa95cd06b.jpg","1a4df3217398351.678ffa95d3ec1.jpg","86fe87217398351.678ffa95ce3f4.jpg","9a09ed217398351.678ffa95d7e8e.jpg","d885be217398351.678ffa95cf60c.jpg","3b4f2f217398351.678ffa95d16db.jpg","5bea4b217398351.678ffa95d3767.jpg","c52a4e217398351.678ffa95cdc5e.jpg"]
  },
  {
    id: "logofolio",
    title: "Logofolio",
    kind: "Logo Portfolio 2023–2024",
    cats: ["branding"],
    year: "2024",
    accent: "#ff5a5a",
    blurb: "A collection of marks and brand directions — each one a small story compressed into a single symbol.",
    url: "https://www.behance.net/gallery/164117153/LOGO-PORTFOLIO-2023-2024",
    cover: "c4c424164117153.Y3JvcCwzMTcwLDI0ODAsMzI5LDA.jpg",
    images: ["148c03164117153.65aadc3486c2e.jpg","5c1c25164117153.64bf922c21842.jpg","bc0321164117153.65aadc34853d7.png","8b0b04164117153.64bf922c18e2b.jpg","41bb75164117153.65aacf6a7d384.jpg","3412f6164117153.64bf922c0fecf.jpg","c03d36164117153.64bf922c09e2f.jpg","919e9c164117153.65aacf6a7efe5.jpg","ea1697164117153.64bf922c08fcc.jpg","42f885164117153.64bf922c080e6.jpg","8a3755164117153.64bf922c132cc.jpg","002f78164117153.65aacf6a7e343.jpg","8b40a6164117153.65aacf6a8087e.jpg","6c28df164117153.64bf922c10f65.jpg","979c15164117153.65129f9bf044f.jpg","99a4ca164117153.65aacf6a7fc7b.jpg"]
  },
  {
    id: "portfolio",
    title: "Portfolio 2024",
    kind: "Social · Ads · Logos · Branding",
    cats: ["social", "advertising", "branding"],
    year: "2024",
    accent: "#a78bff",
    blurb: "A curated cross-section of social media, advertising, logo and branding work — the range in one place.",
    url: "https://www.behance.net/gallery/202595209/Portfolio-2024",
    cover: "d3a65d202595209.Y3JvcCwzMTI1LDI0NDQsMCww.jpg",
    images: ["f6c7fa202595209.6688551e69134.jpg","40cc8e202595209.6688551e6e05c.jpg","95276c202595209.6688551e6c9dc.jpg","cf7807202595209.6688551e6ced6.jpg","0f18f9202595209.6688551e6ab1f.jpg","624c46202595209.6688551e6c4d6.jpg","3082e6202595209.6688551e6a50e.jpg","cdfa66202595209.6688551e6dad3.jpg","125729202595209.6688551e67d5b.jpg","209417202595209.6688551e69718.jpg","543d90202595209.6688551e6ba03.jpg","b5e79e202595209.6688551e67042.jpg","d52706202595209.6688551e6d571.jpg","72208f202595209.6688551e69dfc.jpg","aec85b202595209.6688551e6b273.jpg","41b842202595209.6688551e677c8.jpg"]
  },
  {
    id: "pingpong",
    title: "Ping Pong Cafe",
    kind: "Logo Design",
    cats: ["branding"],
    year: "2024",
    accent: "#ffd166",
    blurb: "A playful mark for a ping-pong café — motion, fun and a bounce you can feel in the logo itself.",
    url: "https://www.behance.net/gallery/192060625/Ping-Pong-Cafe-LOGO",
    cover: "038947192060625.Y3JvcCwxNDIxLDExMTEsMTkzLDc0ODA.jpg",
    images: ["4ef051192060625.668b1b3fdcbdf.jpg"]
  }
];

window.KAH_IMG = { img, cover };
