import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  badge?: string;
};

const listings: Listing[] = [
  {
    id: "1",
    title: "Loveless (1991 UK Press)",
    artist: "My Bloody Valentine",
    description: "Original Creation Records sleeve, includes hype sticker.",
    price: "$145",
    condition: "VG+",
    thumb: loveless,
  },
  {
    id: "2",
    title: "In Rainbows (Neon Pink)",
    artist: "Radiohead",
    description: "Limited neon pressing, opened but never spun.",
    price: "$90",
    condition: "Mint",
    thumb: inRainbows,
  },
  {
    id: "3",
    title: "Nada Como Um Dia",
    artist: "Racionais MC's",
    description: "2016 remaster double LP, includes lyric sheet.",
    price: "$35",
    condition: "VG+",
    thumb: nadaComoDia,
  },
  {
    id: "4",
    title: "Com a Corda Toda",
    artist: "Garotos Podres",
    description: "Rare 80s press with original sleeve art.",
    price: "$145",
    condition: "VG+",
    thumb: garotosPodres,
  },
  {
    id: "5",
    title: "Etazhi",
    artist: "Molchat Doma",
    description: "Synth wave cult favorite, import pressing, black vinyl.",
    price: "$60",
    condition: "Mint",
    thumb: etazhi,
  },
  {
    id: "6",
    title: "Famous Monsters",
    artist: "Misfits",
    description: "Roadrunner pressing, includes lyric insert.",
    price: "$80",
    condition: "VG+",
    thumb: misfitsFamous,
  },
  {
    id: "7",
    title: "Collection II",
    artist: "Misfits",
    description: "Compilation of 1980-83 recordings, black vinyl.",
    price: "$75",
    condition: "VG",
    thumb: misfitsCollection,
  },
  {
    id: "8",
    title: "Walk Among Us (Pink)",
    artist: "Misfits",
    description: "Pink cover variant, includes hype sticker.",
    price: "$95",
    condition: "VG+",
    thumb: misfitsWalk,
  },
  {
    id: "9",
    title: "Earth A.D.",
    artist: "Misfits",
    description: "Classic hardcore LP, 1983 pressing.",
    price: "$110",
    condition: "VG",
    thumb: misfitsEarth,
  },
  {
    id: "10",
    title: "American Psycho",
    artist: "Misfits",
    description: "1997 reunion album, includes inner sleeve.",
    price: "$45",
    condition: "VG+",
    thumb: misfitsAmerican,
  },
  {
    id: "11",
    title: "Bullet",
    artist: "Misfits",
    description: "12-inch single reissue, minor ring wear.",
    price: "$30",
    condition: "VG",
    thumb: misfitsBullet,
  },
  {
    id: "12",
    title: "Sétima Efervescência",
    artist: "Júpiter Maçã",
    description: "Brazilian psych rock classic, 1998 repress.",
    price: "$70",
    condition: "VG+",
    thumb: setimaEfervescencia,
  },
  {
    id: "13",
    title: "Cólera LP",
    artist: "Cólera",
    description: "Legendary Brazilian punk LP, minimal pops.",
    price: "$50",
    condition: "VG",
    thumb: colera,
  },
  {
    id: "14",
    title: "Cuts from the Crypt",
    artist: "Misfits",
    description: "Compilation of rare tracks, double LP.",
    price: "$65",
    condition: "Mint",
    thumb: cutsFromTheCrypt,
  },
  {
    id: "15",
    title: "Rare Brazilian Bootleg",
    artist: "Various Artists",
    description: "DIY bootleg with underground 80s bands.",
    price: "$120",
    condition: "VG",
    thumb: deadFish,
  },
  {
    id: "16",
    title: "Indie Sampler",
    artist: "Various",
    description: "Indie jukebox selection, translucent vinyl.",
    price: "$25",
    condition: "VG+",
    thumb: downloadOne,
  },
  {
    id: "17",
    title: "Shoegaze Essentials",
    artist: "Various",
    description: "Modern shoegaze compilation, includes insert.",
    price: "$40",
    condition: "Mint",
    thumb: downloadTwo,
  },
  {
    id: "18",
    title: "Dream Pop Mixtape",
    artist: "Various",
    description: "Bootleg pressing sourced from reel tapes.",
    price: "$22",
    condition: "VG",
    thumb: downloadBase,
  },
  {
    id: "19",
    title: "Orange Range Live",
    artist: "Orange Range",
    description: "Japanese import, still sealed.",
    price: "$88",
    condition: "Mint",
    thumb: orangeRange,
  },
  {
    id: "20",
    title: "Os Cães Ladram",
    artist: "Caetano Veloso",
    description: "1977 classic, plays clean with light wear.",
    price: "$55",
    condition: "VG",
    thumb: caravanas,
  },
  {
    id: "21",
    title: "Sobrevivendo no Inferno",
    artist: "Racionais MC's",
    description: "Limited anniversary edition, poster included.",
    price: "$98",
    condition: "Mint",
    thumb: sobrevivendoInferno,
  },
  {
    id: "22",
    title: "Indie Mystery Box",
    artist: "Community Seller",
    description: "Three hand-picked LPs from verified crates.",
    price: "$65",
    condition: "VG+",
    thumb: usuario,
  },
];

const filters = ["All", "Mint", "VG+", "VG"];

const Marketplace: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<(typeof filters)[number]>("All");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const filteredListings = useMemo(() => {
    if (selectedFilter === "All") return listings;
    return listings.filter((listing) => listing.condition === selectedFilter);
  }, [selectedFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / 6));
  const pageListings = filteredListings.slice((page - 1) * 6, page * 6);

  const handleFilterChange = (filter: (typeof filters)[number]) => {
    setSelectedFilter(filter);
    setPage(1);
  };

  const handlePrev = () => setPage((prev: number) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev: number) => Math.min(totalPages, prev + 1));

  return (
    <div className="min-h-screen bg-[#05060b] text-white sm:pl-32">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Marketplace</p>
          <h1 className="text-4xl font-semibold">Trade crates with trusted collectors</h1>
          <p className="text-white/70 text-base">
            Check out our latest listings and start trading today!
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Filters</p>
              <h2 className="text-2xl font-semibold">Condition</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleFilterChange(filter)}
                  className={`rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white ${
                    selectedFilter === filter ? "border-white/40 text-white" : ""
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4]" />
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Featured drops</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {pageListings.map((listing: Listing) => (
              <article
                key={listing.id}
                className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur transition hover:border-white/30 hover:bg-white/10 cursor-pointer"
                onClick={() => navigate(`/product/${listing.id}`)}
              >
                <img src={listing.thumb} alt={listing.title} className="h-36 w-36 rounded-2xl object-cover object-center" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-base font-semibold">{listing.title}</p>
                      <p className="text-sm text-white/70">{listing.artist}</p>
                    </div>
                    {listing.badge && (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                        {listing.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/70">{listing.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="rounded-full border border-white/15 px-3 py-1 text-white/70">
                      Condition: {listing.condition}
                    </span>
                    <span className="text-lg font-semibold">{listing.price}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm shadow-lg backdrop-blur">
            <button
              type="button"
              onClick={handlePrev}
              disabled={page === 1}
              className="rounded-full border border-white/15 px-4 py-2 text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-30"
            >
              ← Prev
            </button>
            <span className="text-white/70">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={page === totalPages}
              className="rounded-full border border-white/15 px-4 py-2 text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Marketplace;

