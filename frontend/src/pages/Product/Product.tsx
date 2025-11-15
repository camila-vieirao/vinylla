import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { toast } from "react-toastify";
import loveless from "../../assets/products/a1730902089_16.jpg";
import setimaEfervescencia from "../../assets/products/Capa_Sétima_Efervescência.jpg";
import colera from "../../assets/products/colera-lpfoto.jpg";
import cutsFromTheCrypt from "../../assets/products/cutsfromthecrypt.jpg";
import deadFish from "../../assets/products/D_NQ_NP_756824-MLB46911415154_072021-O.webp";
import downloadOne from "../../assets/products/download (1).jpeg";
import downloadTwo from "../../assets/products/download (2).jpeg";
import downloadBase from "../../assets/products/download.jpeg";
import garotosPodres from "../../assets/products/garotospodres.jpg";
import inRainbows from "../../assets/products/inrainbows.jpeg";
import misfitsAmerican from "../../assets/products/Misfits_-_American_Psycho_cover.jpg";
import misfitsBullet from "../../assets/products/Misfits_-_Bullet_cover.jpg";
import misfitsCollection from "../../assets/products/Misfits_-_Collection_II_cover.jpg";
import misfitsFamous from "../../assets/products/Misfits_-_Famous_Monsters_cover.jpg";
import misfitsWalk from "../../assets/products/Misfits_-_Walk_Among_Us_(pink_cover).jpg";
import misfitsEarth from "../../assets/products/Misfits-Earth-AD-album-cover-820.jpg";
import etazhi from "../../assets/products/Molchat_Doma_-_Etazhi.png";
import nadaComoDia from "../../assets/products/Nada_Como_um_Dia_Após_o_Outro_Dia.jpg";
import orangeRange from "../../assets/products/orangerange.jpg";
import caravanas from "../../assets/products/oscaesladrammasacaravananaopara.jpg";
import sobrevivendoInferno from "../../assets/products/Sobrevivendo_no_Inferno.jpg";
import usuario from "../../assets/products/usuario.jpg";

type Listing = {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: string;
  condition: "Mint" | "VG+" | "VG";
  thumb: string;
};

const allListings: Listing[] = [
  { id: "1", title: "Loveless (1991 UK Press)", artist: "My Bloody Valentine", description: "Original Creation Records sleeve, includes hype sticker.", price: "$145", condition: "VG+", thumb: loveless },
  { id: "2", title: "In Rainbows (Neon Pink)", artist: "Radiohead", description: "Limited neon pressing, opened but never spun.", price: "$90", condition: "Mint", thumb: inRainbows },
  { id: "3", title: "Nada Como Um Dia", artist: "Racionais MC's", description: "2016 remaster double LP, includes lyric sheet.", price: "$35", condition: "VG+", thumb: nadaComoDia },
  { id: "4", title: "Com a Corda Toda", artist: "Garotos Podres", description: "Rare 80s press with original sleeve art.", price: "$145", condition: "VG+", thumb: garotosPodres },
  { id: "5", title: "Etazhi", artist: "Molchat Doma", description: "Synth wave cult favorite, import pressing, black vinyl.", price: "$60", condition: "Mint", thumb: etazhi },
  { id: "6", title: "Famous Monsters", artist: "Misfits", description: "Roadrunner pressing, includes lyric insert.", price: "$80", condition: "VG+", thumb: misfitsFamous },
  { id: "7", title: "Collection II", artist: "Misfits", description: "Compilation of 1980-83 recordings, black vinyl.", price: "$75", condition: "VG", thumb: misfitsCollection },
  { id: "8", title: "Walk Among Us (Pink)", artist: "Misfits", description: "Pink cover variant, includes hype sticker.", price: "$95", condition: "VG+", thumb: misfitsWalk },
  { id: "9", title: "Earth A.D.", artist: "Misfits", description: "Classic hardcore LP, 1983 pressing.", price: "$110", condition: "VG", thumb: misfitsEarth },
  { id: "10", title: "American Psycho", artist: "Misfits", description: "1997 reunion album, includes inner sleeve.", price: "$45", condition: "VG+", thumb: misfitsAmerican },
  { id: "11", title: "Bullet", artist: "Misfits", description: "12-inch single reissue, minor ring wear.", price: "$30", condition: "VG", thumb: misfitsBullet },
  { id: "12", title: "Sétima Efervescência", artist: "Júpiter Maçã", description: "Brazilian psych rock classic, 1998 repress.", price: "$70", condition: "VG+", thumb: setimaEfervescencia },
  { id: "13", title: "Cólera LP", artist: "Cólera", description: "Legendary Brazilian punk LP, minimal pops.", price: "$50", condition: "VG", thumb: colera },
  { id: "14", title: "Cuts from the Crypt", artist: "Misfits", description: "Compilation of rare tracks, double LP.", price: "$65", condition: "Mint", thumb: cutsFromTheCrypt },
  { id: "15", title: "Rare Brazilian Bootleg", artist: "Various Artists", description: "DIY bootleg with underground 80s bands.", price: "$120", condition: "VG", thumb: deadFish },
  { id: "16", title: "Indie Sampler", artist: "Various", description: "Indie jukebox selection, translucent vinyl.", price: "$25", condition: "VG+", thumb: downloadOne },
  { id: "17", title: "Shoegaze Essentials", artist: "Various", description: "Modern shoegaze compilation, includes insert.", price: "$40", condition: "Mint", thumb: downloadTwo },
  { id: "18", title: "Dream Pop Mixtape", artist: "Various", description: "Bootleg pressing sourced from reel tapes.", price: "$22", condition: "VG", thumb: downloadBase },
  { id: "19", title: "Orange Range Live", artist: "Orange Range", description: "Japanese import, still sealed.", price: "$88", condition: "Mint", thumb: orangeRange },
  { id: "20", title: "Os Cães Ladram", artist: "Caetano Veloso", description: "1977 classic, plays clean with light wear.", price: "$55", condition: "VG", thumb: caravanas },
  { id: "21", title: "Sobrevivendo no Inferno", artist: "Racionais MC's", description: "Limited anniversary edition, poster included.", price: "$98", condition: "Mint", thumb: sobrevivendoInferno },
  { id: "22", title: "Indie Mystery Box", artist: "Community Seller", description: "Three hand-picked LPs from verified crates.", price: "$65", condition: "VG+", thumb: usuario },
];

export const Product: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const listing = useMemo(() => allListings.find((item) => item.id === productId), [productId]);

  const handleAddToBag = () => {
    if (!listing) return;
    const stored = localStorage.getItem("cartItems");
    const parsed = stored ? JSON.parse(stored) : [];
    const priceNumber = parseFloat(listing.price.replace(/[^0-9.]/g, "")) || 0;
    parsed.push({
      id: listing.id,
      title: listing.title,
      artist: listing.artist,
      condition: listing.condition,
      thumb: listing.thumb,
      price: priceNumber,
    });
    localStorage.setItem("cartItems", JSON.stringify(parsed));
    toast.success("Added to bag");
  };

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#05060b] text-white sm:pl-32">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Marketplace</p>
          <h1 className="text-3xl font-semibold">Product not found</h1>
          <button
            type="button"
            className="mt-6 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10"
            onClick={() => navigate(-1)}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060b] text-white sm:pl-32">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
        <button
          type="button"
          className="text-sm uppercase tracking-[0.4em] text-white/60 transition hover:text-white"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <div className="mx-auto h-80 w-80">
              <img src={listing.thumb} alt={listing.title} className="h-full w-full rounded-2xl object-cover object-center" />
            </div>
          </div>
          <div className="flex-1 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Vinyl</p>
              <h1 className="text-3xl font-semibold">{listing.title}</h1>
              <p className="text-sm text-white/70">{listing.artist}</p>
            </div>
            <p className="text-white/70">{listing.description}</p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/15 px-3 py-1 text-white/70">
                Condition: {listing.condition}
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-white/70">Ships in 2-4 days</span>
            </div>
            <div className="flex items-center justify-between text-2xl font-semibold">
              <span>{listing.price}</span>
              <button
                type="button"
                className="rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] px-6 py-2 text-base font-semibold text-white shadow-xl transition hover:opacity-90"
                onClick={handleAddToBag}
              >
                Add to bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
