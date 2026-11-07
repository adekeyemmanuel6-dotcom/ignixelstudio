// Curated Unsplash photographs (free to use under the Unsplash licence). URLs verified to resolve.
// Swap any of these for your own photography in the admin (service/project/blog image fields).
const U = (id: string) => `https://images.unsplash.com/photo-${id}`;
export const unsplash = (id: string, w = 900, h?: number) => `${U(id)}?auto=format&fit=crop&q=70&w=${w}${h ? `&h=${h}` : ""}`;

export const PHOTO = {
  heroLaptop: "1531297484001-80022131f5a1", whiteboard: "1552664730-d307ca884978", swatches: "1561070791-2526d30994b5", codeDark: "1555949963-ff9fe0c870eb",
  wireframe: "1581291518857-4e27b48ff24e", webdev: "1498050108023-c5249f4df085", ecommerce: "1563013544-824ae1b704d3", ai: "1677442136019-21780ecad995",
  analytics: "1460925895917-afdab827c52f", digital: "1547658719-da2b51169166", office: "1556761175-5973dc0f32e7", conference: "1542744173-8e7e53415bb0", meeting: "1517245386807-bb43f82c33c4",
  healthcare: "1576091160399-112ba8d25d1d", saas: "1517694712202-14dd9538aa97", services: "1454165804606-c3d57bc86b40", realestate: "1560518883-ce09059eeffa",
  retail: "1441986300917-64674bd600d8", logistics: "1565793298595-6a879b1d9492", education: "1503676260728-1c00da094a0b", finance: "1554224155-6726b3ff858f",
  hospitality: "1566073771259-6a8506099945", manufacturing: "1586528116311-ad8dd3c8310d",
} as const;
export const photo = (k: keyof typeof PHOTO, w = 900, h?: number) => unsplash(PHOTO[k], w, h);
